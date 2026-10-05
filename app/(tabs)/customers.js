// ② 客戶總覽
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import ScreenHeader from '../../src/components/ScreenHeader';
import Tag from '../../src/components/Tag';
import { useCustomers } from '../../src/context/CustomerContext';
import { stats } from '../../src/data/mockData';
import { colors, radius } from '../../src/theme';

// 熱溫冷 → 中文字 + 標籤顏色
const tempLabel = { hot: '熱', warm: '溫', cold: '冷' };
// 頭像底色也跟著熱溫冷變化
const avatarBg = { hot: colors.blueLight, warm: colors.greenLight, cold: colors.primaryLight };

// 數據卡片（本月客戶 / 待跟進 / 本週成交）
function StatCard({ number, label, color }) {
  return (
    <View style={styles.statCard}>
      <Text style={[styles.statNumber, { color }]}>{number}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

// 客戶列表的一列
function CustomerRow({ customer }) {
  return (
    <Pressable
      style={styles.row}
      // 點客戶 → 看他的 AI 摘要，並把客戶 id 帶過去
      onPress={() => router.push({ pathname: '/summary', params: { id: customer.id } })}
    >
      <View style={[styles.avatar, { backgroundColor: avatarBg[customer.temperature] }]}>
        <Text style={styles.avatarText}>{customer.name[0]}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{customer.name}</Text>
        <Text style={styles.note}>{customer.note}</Text>
      </View>
      <Tag label={tempLabel[customer.temperature]} tone={customer.temperature} />
    </Pressable>
  );
}

export default function CustomersScreen() {
  const { customers } = useCustomers();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <ScreenHeader
          title="我的客戶"
          right={
            <View style={styles.headerRight}>
              <Text style={styles.synced}>已同步</Text>
              <Pressable onPress={() => router.push('/add-customer')} hitSlop={10}>
                <Text style={styles.plus}>＋</Text>
              </Pressable>
            </View>
          }
        />

        <View style={styles.statRow}>
          <StatCard number={stats.customersThisMonth} label="本月客戶" color={colors.text} />
          <StatCard number={stats.pending} label="待跟進" color={colors.orange} />
          <StatCard number={stats.dealsThisWeek} label="本週成交" color={colors.green} />
        </View>

        {customers.map((c) => (
          <CustomerRow key={c.id} customer={c} />
        ))}

        <View style={styles.syncBar}>
          <Text style={styles.syncText}>☁ Firebase 雲端同步 · 剛才更新</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: 20 },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  synced: { color: colors.green, fontSize: 13, marginRight: 12 },
  plus: { fontSize: 22, color: colors.text },
  statRow: { flexDirection: 'row', marginBottom: 12 },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 3,
  },
  statNumber: { fontSize: 20, fontWeight: '500' },
  statLabel: { fontSize: 12, color: colors.subText, marginTop: 2 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 14,
    marginTop: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: { fontSize: 16, color: colors.text },
  name: { fontSize: 16, fontWeight: '600', color: colors.text },
  note: { fontSize: 12, color: colors.subText, marginTop: 2 },
  syncBar: { backgroundColor: colors.card, borderRadius: radius.sm, padding: 10, marginTop: 14 },
  syncText: { fontSize: 12, color: colors.subText },
});
