// ④ AI 智慧摘要
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import ScreenHeader from '../../src/components/ScreenHeader';
import Tag from '../../src/components/Tag';
import { useCustomers } from '../../src/context/CustomerContext';
import { analysis } from '../../src/data/mockData';
import { colors, radius } from '../../src/theme';

// 一個 Agent 的結果區塊（標題 + 多列「標籤：內容」）
function AgentSection({ title, items, tone }) {
  return (
    <View>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.card}>
        {items.map((item, index) => (
          <View
            key={item.label}
            style={[styles.itemRow, index < items.length - 1 && styles.divider]}
          >
            <Tag label={item.label} tone={tone} style={{ width: 44, alignItems: 'center' }} />
            <Text style={styles.itemValue}>{item.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function SummaryScreen() {
  // 從客戶列表點進來時會帶 id；直接點分頁就預設看 c1（陳志豪）
  const { id = 'c1' } = useLocalSearchParams();
  const { customers } = useCustomers();
  const customer = customers.find((c) => c.id === id);
  const data = analysis[id];

  // 上方切換：hard = 購車需求、emotion = 情緒價值
  const [tab, setTab] = useState('hard');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <ScreenHeader
          title={`${customer ? customer.name : '客戶'} · ${data ? '分析完成' : '尚未分析'}`}
          right={<Tag label="AI 摘要" tone="purple" />}
        />

        {!data ? (
          <Text style={styles.empty}>這位客戶還沒有錄音紀錄，先到 VoiceRec 錄一段對話吧！</Text>
        ) : (
          <>
            {/* 分段切換按鈕 */}
            <View style={styles.segment}>
              <Pressable style={[styles.segBtn, tab === 'hard' && styles.segActive]} onPress={() => setTab('hard')}>
                <Text style={[styles.segText, tab === 'hard' && styles.segTextActive]}>購車需求</Text>
              </Pressable>
              <Pressable style={[styles.segBtn, tab === 'emotion' && styles.segActive]} onPress={() => setTab('emotion')}>
                <Text style={[styles.segText, tab === 'emotion' && styles.segTextActive]}>情緒價值</Text>
              </Pressable>
            </View>

            {tab === 'hard' ? (
              <AgentSection title="硬需求 AGENT" items={data.hard} tone="green" />
            ) : (
              <AgentSection title="情緒價值 AGENT" items={data.emotion} tone="pink" />
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: 20 },
  empty: { color: colors.subText, fontSize: 14, marginTop: 20 },
  segment: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    padding: 3,
    marginBottom: 16,
  },
  segBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 6 },
  segActive: { backgroundColor: colors.blueLight },
  segText: { fontSize: 14, color: colors.subText },
  segTextActive: { color: colors.text, fontWeight: '600' },
  sectionTitle: { fontSize: 12, color: colors.subText, letterSpacing: 1, marginBottom: 8 },
  card: { backgroundColor: colors.card, borderRadius: radius.md, paddingHorizontal: 12 },
  itemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 11 },
  divider: { borderBottomWidth: 1, borderBottomColor: colors.border },
  itemValue: { fontSize: 14, color: colors.text, marginLeft: 12, flex: 1 },
});
