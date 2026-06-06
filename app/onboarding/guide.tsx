import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';
import { colors, radius, spacing, typography } from '@/constants/theme';

const steps = [
  { emoji: '📸', title: '录入衣物', desc: '拍照或手动添加，建立你的云端衣橱' },
  { emoji: '✨', title: '获取推荐', desc: '结合天气和场合，每日智能穿搭建议' },
  { emoji: '✅', title: '穿搭打卡', desc: '记录每日穿着，发现衣橱使用规律' },
];

export default function GuideScreen() {
  const router = useRouter();
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
      return;
    }
    completeOnboarding();
    router.replace('/(tabs)/add');
  };

  const current = steps[step];

  return (
    <ScreenContainer scroll={false} style={styles.container}>
      <Text style={styles.step}>步骤 2 / 2 · 新手引导 {step + 1}/{steps.length}</Text>
      <View style={styles.card}>
        <Text style={styles.emoji}>{current.emoji}</Text>
        <Text style={styles.title}>{current.title}</Text>
        <Text style={styles.desc}>{current.desc}</Text>
      </View>

      <View style={styles.dots}>
        {steps.map((_, i) => (
          <View key={i} style={[styles.dot, i === step && styles.dotActive]} />
        ))}
      </View>

      <View style={styles.actions}>
        <Button
          title={step < steps.length - 1 ? '下一步' : '开始录入第一件衣物'}
          onPress={handleNext}
        />
        {step < steps.length - 1 ? (
          <Button
            title="跳过引导"
            variant="ghost"
            onPress={() => {
              completeOnboarding();
              router.replace('/(tabs)');
            }}
          />
        ) : null}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', gap: spacing.xl },
  step: { ...typography.caption, color: colors.primary },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emoji: { fontSize: 72 },
  title: { ...typography.title, color: colors.text },
  desc: { ...typography.body, color: colors.textSecondary, textAlign: 'center' },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.border },
  dotActive: { width: 24, backgroundColor: colors.primary },
  actions: { gap: spacing.sm },
});
