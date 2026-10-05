// ⑤ 回訪軍師
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ScreenHeader from '../../src/components/ScreenHeader';
import { revisit } from '../../src/data/mockData';
import { colors, radius } from '../../src/theme';

const circled = ['①', '②', '③'];

export default function RevisitScreen() {
  const data = revisit.c1; // 先固定顯示陳志豪；之後改成「到店的客戶」

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <ScreenHeader title="回訪軍師" right={<Text style={styles.arrived}>陳志豪 到店了</Text>} />

        {/* 1. 客戶到店前即時調出記憶 */}
        <View style={styles.memoryBox}>
          <Text style={styles.memoryTitle}>✦ 你上次見他是 {data.daysSinceLast} 天前</Text>
          <Text style={styles.memoryText}>{data.summary}</Text>
        </View>

        {/* 2. 三段式專屬話術 */}
        <Text style={styles.sectionTitle}>建議開場話題</Text>
        {data.openers.map((o, i) => (
          <View key={o.title} style={styles.openerCard}>
            <Text style={styles.openerTitle}>
              {circled[i]} {o.title}
            </Text>
            <Text style={styles.openerText}>「{o.text}」</Text>
          </View>
        ))}

        {/* 3. 避免重提清單 */}
        <Text style={styles.sectionTitle}>避免重提（已溝通過）</Text>
        <View style={styles.avoidWrap}>
          {data.avoid.map((a) => (
            <View key={a} style={styles.avoidChip}>
              <Text style={styles.avoidText}>{a} ✓</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: 20 },
  arrived: { color: colors.primary, fontSize: 14 },
  memoryBox: { backgroundColor: colors.primaryLight, borderRadius: radius.md, padding: 14, marginBottom: 18 },
  memoryTitle: { color: colors.primary, fontSize: 14, marginBottom: 4 },
  memoryText: { color: colors.text, fontSize: 13, lineHeight: 20 },
  sectionTitle: { fontSize: 13, color: colors.subText, marginBottom: 8, marginTop: 4 },
  openerCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 12,
    marginBottom: 10,
  },
  openerTitle: { color: colors.primary, fontSize: 13, marginBottom: 4 },
  openerText: { color: colors.text, fontSize: 13, lineHeight: 20 },
  avoidWrap: { flexDirection: 'row', flexWrap: 'wrap' },
  avoidChip: {
    backgroundColor: colors.primaryLight,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 6,
    marginBottom: 6,
  },
  avoidText: { fontSize: 12, color: colors.primary },
});
