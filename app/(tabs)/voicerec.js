// ③ VoiceRec 錄音
// 流程：選客戶 → 取得錄音同意（consent 頁）→ 錄音＋即時逐字稿 → 結束後跳到 AI 摘要
// 目前是「模擬錄音」：計時器會跑、逐字稿是假資料。之後再接麥克風與 Whisper
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import Chip from '../../src/components/Chip';
import ScreenHeader from '../../src/components/ScreenHeader';
import Tag from '../../src/components/Tag';
import { useCustomers } from '../../src/context/CustomerContext';
import { detectedKeywords, transcript } from '../../src/data/mockData';
import { colors, radius } from '../../src/theme';

const LOW_CONFIDENCE = 0.8; // 辨識信心低於 80% 的句子要提醒業務員確認

function formatTime(totalSeconds) {
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const s = String(totalSeconds % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

// ---------- 錄音前：選客戶 ----------
function BeforeRecording() {
  const params = useLocalSearchParams(); // 從客戶詳情頁進來會帶 customerId
  const { customers } = useCustomers();
  const [selected, setSelected] = useState(params.customerId || customers[0]?.id);

  // 從不同客戶的詳情頁點「開始錄音」進來時，自動選好那位客戶
  useEffect(() => {
    if (params.customerId) setSelected(params.customerId);
  }, [params.customerId]);

  return (
    <>
      <Text style={styles.sectionTitle}>這次接待的客戶</Text>
      <View style={styles.chipWrap}>
        {customers.map((c) => (
          <View key={c.id} style={{ marginBottom: 8 }}>
            <Chip label={c.name} selected={selected === c.id} onPress={() => setSelected(c.id)} />
          </View>
        ))}
        <View style={{ marginBottom: 8 }}>
          <Chip label="＋ 新客戶" onPress={() => router.push('/add-customer')} />
        </View>
      </View>

      <View style={styles.noticeBox}>
        <Text style={styles.noticeTitle}>🔒 錄音前需取得客戶同意</Text>
        <Text style={styles.noticeText}>
          按下開始後會先顯示同意說明，請唸給客戶聽並確認。客戶同意後才會開始錄音，同意紀錄會自動保存。
        </Text>
      </View>

      <Pressable
        style={styles.bigMic}
        onPress={() => router.push({ pathname: '/consent', params: { customerId: selected } })}
      >
        <Text style={{ fontSize: 40 }}>🎙️</Text>
      </Pressable>
      <Text style={styles.bigMicText}>開始錄音</Text>
    </>
  );
}

// ---------- 錄音中 ----------
function Recording() {
  const { activeSession, getCustomer, endSession, vocabulary } = useCustomers();
  const customer = getCustomer(activeSession.customerId);
  const [isRecording, setIsRecording] = useState(true);
  const [seconds, setSeconds] = useState(0);
  const [lines, setLines] = useState(transcript); // 逐字稿（可被業務員修正）
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState('');

  useEffect(() => {
    if (!isRecording) return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, [isRecording]);

  // 平均辨識信心、已修正句數 → 之後可統計「語音辨識準確率」
  const avg = Math.round((lines.reduce((sum, l) => sum + l.confidence, 0) / lines.length) * 100);
  const corrected = lines.filter((l) => l.corrected).length;

  function startEdit(line) {
    setEditingId(line.id);
    setDraft(line.text);
  }
  function saveEdit() {
    setLines((prev) =>
      prev.map((l) => (l.id === editingId ? { ...l, text: draft, confidence: 1, corrected: true } : l))
    );
    setEditingId(null);
  }

  function handleFinish() {
    const id = activeSession.customerId;
    endSession();
    router.push({ pathname: '/summary', params: { id } });
  }

  return (
    <>
      <View style={styles.recCard}>
        <Pressable style={styles.micCircle} onPress={() => setIsRecording(!isRecording)}>
          <View style={styles.waveRow}>
            {[10, 18, 26, 18, 10].map((h, i) => (
              <View key={i} style={[styles.waveBar, { height: isRecording ? h : 6 }]} />
            ))}
          </View>
        </Pressable>
        <Text style={styles.recTitle}>{customer ? customer.name : '客戶'} · 展間接待中</Text>
        <Text style={styles.recTime}>
          {formatTime(seconds)} · {isRecording ? '即時轉錄中' : '已暫停（點圓圈繼續）'}
        </Text>
        <Text style={styles.consentBadge}>🔒 已取得錄音同意 · {activeSession.consentTime}</Text>
      </View>

      {/* 辨識品質 */}
      <View style={styles.asrRow}>
        <Text style={styles.asrText}>辨識信心 {avg}%</Text>
        <Text style={styles.asrText}>已修正 {corrected} 句</Text>
        <Text style={styles.asrText}>詞庫 {vocabulary.length} 個詞</Text>
      </View>

      <Text style={styles.sectionTitle}>即時逐字稿（信心偏低的句子點一下可修正）</Text>
      {lines.map((line) => {
        const isSales = line.speaker === 'sales';
        const low = line.confidence < LOW_CONFIDENCE;
        if (editingId === line.id) {
          return (
            <View key={line.id} style={[styles.bubble, styles.editBubble]}>
              <TextInput style={styles.editInput} value={draft} onChangeText={setDraft} multiline />
              <Pressable style={styles.saveBtn} onPress={saveEdit}>
                <Text style={styles.saveText}>儲存修正</Text>
              </Pressable>
            </View>
          );
        }
        return (
          <Pressable
            key={line.id}
            onPress={() => startEdit(line)}
            style={[styles.bubble, isSales ? styles.salesBubble : styles.customerBubble, low && styles.lowBubble]}
          >
            <Text style={[styles.bubbleText, !isSales && { color: colors.pink }]}>
              {isSales ? '業務：' : '客戶：'}
              {line.text}
            </Text>
            {low && <Text style={styles.lowHint}>⚠️ 辨識信心 {Math.round(line.confidence * 100)}%，可能有誤，點一下修正</Text>}
            {line.corrected && <Text style={styles.fixedHint}>✎ 已人工修正</Text>}
          </Pressable>
        );
      })}

      <View style={styles.detectBox}>
        <Text style={styles.detectTitle}>✦ 即時偵測到</Text>
        <View style={styles.keywordWrap}>
          {detectedKeywords.map((k) => (
            <View key={k} style={styles.keyword}>
              <Text style={styles.keywordText}>{k}</Text>
            </View>
          ))}
        </View>
      </View>

      <Pressable style={styles.finishBtn} onPress={handleFinish}>
        <Text style={styles.finishText}>結束錄音並開始 AI 分析</Text>
      </Pressable>
    </>
  );
}

export default function VoiceRecScreen() {
  const { activeSession } = useCustomers();
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <ScreenHeader
          title="VoiceRec"
          right={<Tag label={activeSession ? '● 錄音中' : '○ 待命'} tone={activeSession ? 'green' : 'purple'} />}
        />
        {activeSession ? <Recording /> : <BeforeRecording />}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: 20 },
  sectionTitle: { fontSize: 13, color: colors.subText, marginBottom: 8 },
  chipWrap: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 },
  noticeBox: { backgroundColor: colors.primaryLight, borderRadius: radius.md, padding: 14 },
  noticeTitle: { color: colors.primary, fontSize: 14, fontWeight: '600', marginBottom: 4 },
  noticeText: { color: colors.text, fontSize: 13, lineHeight: 20 },
  bigMic: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colors.pink,
    backgroundColor: colors.pinkLight,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 32,
  },
  bigMicText: { textAlign: 'center', fontSize: 15, color: colors.text, marginTop: 10 },
  recCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 12,
  },
  micCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 2,
    borderColor: colors.pink,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  waveRow: { flexDirection: 'row', alignItems: 'center' },
  waveBar: { width: 4, borderRadius: 2, backgroundColor: colors.pink, marginHorizontal: 2 },
  recTitle: { fontSize: 15, color: colors.text, marginTop: 14 },
  recTime: { fontSize: 12, color: colors.subText, marginTop: 4 },
  consentBadge: { fontSize: 11, color: colors.green, marginTop: 8 },
  asrRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: radius.sm,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  asrText: { fontSize: 12, color: colors.subText },
  bubble: { borderRadius: radius.md, padding: 12, marginBottom: 8 },
  salesBubble: { backgroundColor: colors.card },
  customerBubble: { backgroundColor: colors.pinkLight },
  lowBubble: { borderWidth: 1, borderColor: colors.orange },
  editBubble: { backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.primary },
  bubbleText: { fontSize: 13, lineHeight: 20, color: colors.subText },
  lowHint: { fontSize: 11, color: colors.orange, marginTop: 6 },
  fixedHint: { fontSize: 11, color: colors.green, marginTop: 6 },
  editInput: { fontSize: 13, lineHeight: 20, color: colors.text, minHeight: 40 },
  saveBtn: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: 6,
  },
  saveText: { color: '#fff', fontSize: 12 },
  detectBox: { backgroundColor: colors.primaryLight, borderRadius: radius.md, padding: 12, marginTop: 4 },
  detectTitle: { color: colors.primary, fontSize: 13, marginBottom: 8 },
  keywordWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  keyword: {
    backgroundColor: '#fff',
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 6,
    marginBottom: 6,
  },
  keywordText: { fontSize: 12, color: colors.text },
  finishBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 16,
  },
  finishText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});
