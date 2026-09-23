import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { Button } from '@/components/Button';
import { colors, spacing } from '@/constants/theme';

export default function OnboardingNorthStar() {
  const router = useRouter();
  const params = useLocalSearchParams<{ growth: string; stability: string; risk: string }>();
  const [northStar, setNorthStar] = useState('');

  return (
    <Screen>
      <Text style={styles.lead}>有的放矢：先定一条当前最想推进的主线（可随时在设置中修改）。</Text>
      <TextField
        label="人生主线"
        value={northStar}
        onChangeText={setNorthStar}
        placeholder="例如：成为能独立负责产品的人"
      />
      <Button
        label="下一步：锚点与当前站"
        disabled={northStar.trim().length < 2}
        onPress={() =>
          router.push({
            pathname: '/onboarding/anchor',
            params: { ...params, northStar: northStar.trim() },
          })
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  lead: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
});
