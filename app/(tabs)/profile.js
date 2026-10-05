// ⑦ 個人資料
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import ScreenHeader from '../../src/components/ScreenHeader';
import Tag from '../../src/components/Tag';
import { salesperson } from '../../src/data/mockData';
import { colors, radius } from '../../src/theme';

// 帳號資訊的一列（圖示 + 小標 + 內容）
function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.icon}>{icon}</Text>
      <View>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

// 設定的一列（可點，右邊有 ›）
function SettingRow({ icon, label, onPress }) {
  return (
    <Pressable style={styles.settingRow} onPress={onPress}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.settingLabel}>{label}</Text>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

export default function ProfileScreen() {
  function handleLogout() {
    router.replace('/'); // 回到登入頁
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.container}>
        <ScreenHeader title="個人資料" right={<Text style={styles.edit}>編輯</Text>} />

        {/* 1. 業務員個人資訊 */}
        <View style={styles.profileBox}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{salesperson.name[0]}</Text>
          </View>
          <Text style={styles.name}>{salesperson.name}</Text>
          <Text style={styles.title}>{salesperson.title}</Text>
          <Tag label={`本月成交 ${salesperson.dealsThisMonth} 輛`} tone="green" style={{ alignSelf: 'center', marginTop: 8 }} />
        </View>

        {/* 2. 帳號設定管理 */}
        <Text style={styles.sectionTitle}>帳號資訊</Text>
        <InfoRow icon="✉️" label="Email" value={salesperson.email} />
        <InfoRow icon="📱" label="手機" value={salesperson.phone} />

        <Text style={styles.sectionTitle}>設定</Text>
        <SettingRow icon="🔔" label="通知設定" />
        <SettingRow icon="🔒" label="修改密碼" />
        <SettingRow icon="☁️" label="雲端同步設定" />

        <Pressable style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>登出</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.bg },
  container: { padding: 20 },
  edit: { color: colors.primary, fontSize: 14 },
  profileBox: {
    alignItems: 'center',
    paddingBottom: 16,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 24, color: colors.primary },
  name: { fontSize: 18, fontWeight: '600', marginTop: 10, color: colors.text },
  title: { fontSize: 13, color: colors.subText, marginTop: 2 },
  sectionTitle: { fontSize: 12, color: colors.subText, marginTop: 8, marginBottom: 8 },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 12,
    marginBottom: 8,
  },
  icon: { fontSize: 16, marginRight: 12 },
  infoLabel: { fontSize: 11, color: colors.subText },
  infoValue: { fontSize: 14, color: colors.text },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: radius.md,
    padding: 14,
    marginBottom: 8,
  },
  settingLabel: { flex: 1, fontSize: 14, color: colors.text },
  chevron: { fontSize: 18, color: colors.placeholder },
  logoutBtn: {
    backgroundColor: colors.redLight,
    borderRadius: radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  logoutText: { color: colors.red, fontSize: 15 },
});
