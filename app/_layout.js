// 最外層的版面：決定 App 有哪些「頁面堆疊」
// index = 登入頁、(tabs) = 下方有分頁列的主畫面、add-customer = 新增客戶
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CustomerProvider } from '../src/context/CustomerContext';

export default function RootLayout() {
  return (
    <CustomerProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="add-customer" options={{ presentation: 'modal' }} />
      </Stack>
    </CustomerProvider>
  );
}
