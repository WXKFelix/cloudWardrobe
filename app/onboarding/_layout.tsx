import { Stack } from 'expo-router';
import { colors } from '@/constants/theme';

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.primary,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="index" options={{ title: '量化人生' }} />
      <Stack.Screen name="north-star" options={{ title: '主线' }} />
      <Stack.Screen name="anchor" options={{ title: '锚点与当前站' }} />
    </Stack>
  );
}
