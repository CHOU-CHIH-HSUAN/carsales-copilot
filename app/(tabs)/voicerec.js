// ③ VoiceRec 錄音
// 目前是「模擬錄音」：計時器會跑、逐字稿是假資料。之後再接麥克風與 Whisper
import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import ScreenHeader from '../../src/components/ScreenHeader';
import Tag from '../../src/components/Tag';
import { detectedKeywords, transcript } from '../../src/data/mockData';
import { colors, radius } from '../../src/theme';

// 把秒數變成 00:04:23 的格式
function formatTime(totalSeconds) {
  const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
  const s = String(totalSeconds % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
}

export default function VoiceRecScreen() {
  const [isRecording, setIsRecording] = useState(true);
  const [seconds, setSeconds] = useState(263); // 從 00:04:23 開始，跟設計圖一樣

  // 錄音中時，每 1 秒把 seconds + 1
  useEffect(() => {
    if (!isRecording) return;
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer); // 停止或離開頁面時清掉計時器
  }, [isRecording]);

  // 結束錄音 → 自動觸發 AI 分析（這裡先直接跳到 AI 摘要頁）
  function handleFinish() {
    setIsRecording(false);
    router.push({ pathname: '/summary', params: { id: 'c1' } });
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <ScreenHeader
          title="VoiceRec"
          right={<Tag label={isRecording ? '● 錄音中' : '■ 已暫停'} tone={isRecording ? 'green' : 'purple'} />}
        />

        {/* 錄音卡片：按中間的圓圈可以暫停／繼續 */}
        <View style={styles.recCard}>
          <Pressable style={styles.micCircle} onPress={() => setIsRecording(!isRecording)}>
            <View style={styles.waveRow}>
              {[10, 18, 26, 18, 10].map((h, i) => (
                <View key={i} style={[styles.waveBar, { height: isRecording ? h : 6 }]} />
              ))}
            </View>
          </Pressable>
          <Text style={styles.recTitle}>陳志豪 · 展間接待中</Text>
          <Text style={styles.recTime}>
            {formatTime(seconds)} · {isRecording ? '即時轉錄中' : '已暫停'}
          </Text>
        </View>

        {/* 即時逐字稿：業務灰底、客戶粉底 */}
        <Text style={styles.sectionTitle}>即時逐字稿</Text>
        {transcript.map((line) => {
          const isSales = line.speaker === 'sales';
          return (
            <View key={line.id} style={[styles.bubble, isSales ? styles.salesBubble : styles.customerBubble]}>
              <Text style={[styles.bubbleText, !isSales && { color: colors.pink }]}>
                {isSales ? '業務：' : '客戶：'}
                {line.text}
              </Text>
            </View>
          );
        })}

        {/* AI 即時偵測到的關鍵字 */}
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
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: 20 },
  recCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    paddingVertical: 24,
    alignItems: 'center',
    marginBottom: 20,
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
  sectionTitle: { fontSize: 13, color: colors.subText, marginBottom: 8 },
  bubble: { borderRadius: radius.md, padding: 12, marginBottom: 8 },
  salesBubble: { backgroundColor: colors.card },
  customerBubble: { backgroundColor: colors.pinkLight },
  bubbleText: { fontSize: 13, lineHeight: 20, color: colors.subText },
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
