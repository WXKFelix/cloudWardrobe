import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { SliderField } from '@/components/SliderField';
import { Button } from '@/components/Button';
import { colors, spacing } from '@/constants/theme';

export default function OnboardingValues() {
  const router = useRouter();
  const [growth, setGrowth] = useState(7);
  const [stability, setStability] = useState(6);
  const [risk, setRisk] = useState(5);

  return (
    <Screen>
      <Text style={styles.lead}>
        数据帮你看见轨迹；在岔路口，我们会用这些倾向做权衡，而不是单一标准答案。
      </Text>
      <SliderField
        label="成长"
        hint="你愿意为长期能力投入多少不确定性？"
        value={growth}
        onChange={setGrowth}
      />
      <SliderField
        label="稳定"
        hint="家庭、健康、可预期性对你有多重要？"
        value={stability}
        onChange={setStability}
      />
      <SliderField
        label="风险承受"
        hint="面对新环境时，你的心理缓冲有多大？"
        value={risk}
        onChange={setRisk}
      />
      <Button
        label="下一步：设定主线"
        onPress={() =>
          router.push({
            pathname: '/onboarding/north-star',
            params: {
              growth: String(growth),
              stability: String(stability),
              risk: String(risk),
            },
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
    marginBottom: spacing.xl,
  },
});
