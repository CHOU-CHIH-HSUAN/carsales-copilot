// 最外層的版面：決定 App 有哪些「頁面堆疊」
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CustomerProvider } from '../src/context/CustomerContext';

export default function RootLayout() {
  return (
    <CustomerProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="customer/[id]" />
        <Stack.Screen name="add-customer" options={{ presentation: 'modal' }} />
        <Stack.Screen name="consent" options={{ presentation: 'modal' }} />
        <Stack.Screen name="privacy" />
        <Stack.Screen name="vocabulary" />
        <Stack.Screen name="crm" />
      </Stack>
    </CustomerProvider>
  );
}
