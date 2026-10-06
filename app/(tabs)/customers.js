// ② 客戶總覽（首頁）：數據卡片、今日回訪提醒、智慧待辦、客戶列表（可搜尋、篩選、依成交機率排序）
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Chip from '../../src/components/Chip';
import ProbabilityBar from '../../src/components/ProbabilityBar';
import ScreenHeader from '../../src/components/ScreenHeader';
import SectionTitle from '../../src/components/SectionTitle';
import Tag from '../../src/components/Tag';
import TodoItem from '../../src/components/TodoItem';
import { useCustomers } from '../../src/context/CustomerContext';
import { followUps } from '../../src/data/mockData';
import { colors, radius } from '../../src/theme';

const tempLabel = { hot: '熱', warm: '溫', cold: '冷' };
const avatarBg = { hot: colors.redLight, warm: colors.orangeLight, cold: colors.blueLight };
const filters = [
  { key: 'all', label: '全部' },
  { key: 'hot', label: '熱' },
  { key: 'warm', label: '溫' },
  { key: 'cold', label: '冷' },
];

function StatCard({ number, label, color }) {
  return (
    <View style={styles.statCard}>
      <Text style={[styles.statNumber, { color }]}>{number}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function CustomerRow({ customer }) {
  return (
    <Pressable style={styles.row} onPress={() => router.push(`/customer/${customer.id}`)}>
      <View style={[styles.avatar, { backgroundColor: avatarBg[customer.temperature] }]}>
        <Text style={styles.avatarText}>{customer.name[0]}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>{customer.name}</Text>
          <Text style={styles.stage}>{customer.stage}</Text>
        </View>
        <Text style={styles.note}>{customer.note}</Text>
        <View style={{ marginTop: 6 }}>
          <ProbabilityBar value={customer.closeProbability} />
        </View>
      </View>
      <Tag label={tempLabel[customer.temperature]} tone={customer.temperature} style={{ marginLeft: 10 }} />
    </Pressable>
  );
}

export default function CustomersScreen() {
  const { customers, todos, toggleTodo, getCustomer } = useCustomers();
  const [filter, setFilter] = useState('all');
  const [keyword, setKeyword] = useState('');
  const [showAllTodos, setShowAllTodos] = useState(false);

  // 數據卡片：從資料即時計算（對應後端 getDashboard 的 stats）
  const pendingTodos = todos.filter((t) => !t.done);
  const highChance = customers.filter((c) => c.closeProbability >= 70).length;

  // 待辦：未完成排前面
  const sortedTodos = [...todos].sort((a, b) => a.done - b.done);
  const visibleTodos = showAllTodos ? sortedTodos : sortedTodos.slice(0, 3);

  // 客戶列表：篩選 → 搜尋 → 依成交機率由高到低
  const list = customers
    .filter((c) => filter === 'all' || c.temperature === filter)
    .filter((c) => !keyword || c.name.includes(keyword) || (c.note || '').includes(keyword))
    .sort((a, b) => b.closeProbability - a.closeProbability);

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
          <StatCard number={customers.length} label="客戶數" color={colors.text} />
          <StatCard number={pendingTodos.length} label="待辦事項" color={colors.orange} />
          <StatCard number={highChance} label="高成交機率" color={colors.green} />
        </View>

        {/* 自動回訪提醒 */}
        <SectionTitle title="🔔 回訪提醒" />
        {followUps.map((f) => {
          const c = getCustomer(f.customerId);
          if (!c) return null;
          return (
            <Pressable
              key={f.id}
              style={styles.followCard}
              onPress={() => router.push({ pathname: '/revisit', params: { id: f.customerId } })}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.followTitle}>
                  {f.when} · {c.name}
                </Text>
                <Text style={styles.followReason}>{f.reason}</Text>
              </View>
              <Text style={styles.followLink}>看話術 ›</Text>
            </Pressable>
          );
        })}

        {/* 智慧待辦 */}
        <SectionTitle
          title={`✅ 智慧待辦（${pendingTodos.length}）`}
          actionText={showAllTodos ? '收合' : '查看全部'}
          onAction={() => setShowAllTodos(!showAllTodos)}
        />
        {visibleTodos.map((t) => (
          <TodoItem
            key={t.id}
            todo={t}
            customerName={getCustomer(t.customerId)?.name}
            onToggle={() => toggleTodo(t.id)}
          />
        ))}

        {/* 客戶列表 */}
        <SectionTitle title="👥 客戶列表（依成交機率排序）" />
        <TextInput
          style={styles.search}
          placeholder="🔍 搜尋姓名或備註"
          placeholderTextColor={colors.placeholder}
          value={keyword}
          onChangeText={setKeyword}
        />
        <View style={styles.filterRow}>
          {filters.map((f) => (
            <Chip key={f.key} label={f.label} selected={filter === f.key} onPress={() => setFilter(f.key)} />
          ))}
        </View>
        {list.map((c) => (
          <CustomerRow key={c.id} customer={c} />
        ))}
        {list.length === 0 && <Text style={styles.empty}>找不到符合的客戶</Text>}

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
  statRow: { flexDirection: 'row' },
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
  followCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight,
    borderRadius: radius.md,
    padding: 12,
    marginBottom: 8,
  },
  followTitle: { fontSize: 14, fontWeight: '600', color: colors.primary },
  followReason: { fontSize: 12, color: colors.text, marginTop: 2 },
  followLink: { fontSize: 13, color: colors.primary, marginLeft: 8 },
  search: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
  },
  filterRow: { flexDirection: 'row', marginTop: 10, marginBottom: 2 },
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
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  name: { fontSize: 16, fontWeight: '600', color: colors.text },
  stage: { fontSize: 11, color: colors.primary, marginLeft: 8 },
  note: { fontSize: 12, color: colors.subText, marginTop: 2 },
  empty: { color: colors.subText, textAlign: 'center', marginTop: 16 },
  syncBar: { backgroundColor: colors.card, borderRadius: radius.sm, padding: 10, marginTop: 14 },
  syncText: { fontSize: 12, color: colors.subText },
});
