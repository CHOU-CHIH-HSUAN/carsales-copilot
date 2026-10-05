// 下方分頁列（Tab Bar）：VoiceRec / 客戶 / AI摘要 / 回訪 / 我的
import { Tabs } from 'expo-router';
import { Text } from 'react-native';
import { colors } from '../../src/theme';

// 用 emoji 當圖示，不用另外裝圖示套件
function TabIcon({ emoji }) {
  return <Text style={{ fontSize: 18 }}>{emoji}</Text>;
}

export default function TabsLayout() {
  return (
    <Tabs
      initialRouteName="customers" // 登入後先看到「客戶總覽」
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.subText,
        tabBarLabelStyle: { fontSize: 11 },
      }}
    >
      <Tabs.Screen
        name="voicerec"
        options={{ title: 'VoiceRec', tabBarIcon: () => <TabIcon emoji="🎙️" /> }}
      />
      <Tabs.Screen
        name="customers"
        options={{ title: '客戶', tabBarIcon: () => <TabIcon emoji="👥" /> }}
      />
      <Tabs.Screen
        name="summary"
        options={{ title: 'AI摘要', tabBarIcon: () => <TabIcon emoji="🧠" /> }}
      />
      <Tabs.Screen
        name="revisit"
        options={{ title: '回訪', tabBarIcon: () => <TabIcon emoji="💡" /> }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: '我的', tabBarIcon: () => <TabIcon emoji="👤" /> }}
      />
    </Tabs>
  );
}
