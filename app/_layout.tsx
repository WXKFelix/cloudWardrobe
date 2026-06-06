import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '@/constants/theme';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="welcome" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="onboarding/user-type" />
        <Stack.Screen name="onboarding/guide" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="clothing/[id]" options={{ presentation: 'modal' }} />
      </Stack>
    </>
  );
}
