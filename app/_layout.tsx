import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { SettingsProvider } from '@/contexts/SettingsContext';

export default function RootLayout() {
  return (
    <SettingsProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="settings" />
        <Stack.Screen name="v2/index" />
        <Stack.Screen name="v3/index" />
        <Stack.Screen name="v4/index" />
        <Stack.Screen name="v5/index" />
        <Stack.Screen name="v6/index" />
        <Stack.Screen name="v7/index" />
        <Stack.Screen name="v9/index" />
      </Stack>
      <StatusBar style="light" />
    </SettingsProvider>
  );
}
