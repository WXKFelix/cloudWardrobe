import { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { Button } from '@/components/Button';
import { addStage, upsertProfile } from '@/lib/db';
import { setOnboardingComplete } from '@/lib/onboarding';
import { colors, spacing } from '@/constants/theme';

export default function OnboardingAnchor() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    growth: string;
    stability: string;
    risk: string;
    northStar: string;
  }>();
  const [anchor, setAnchor] = useState('');
  const [stage, setStage] = useState('');
  const [saving, setSaving] = useState(false);

  const finish = async () => {
    setSaving(true);
    try {
      const currentStage = stage.trim() || '当前阶段';
      await upsertProfile({
        northStar: params.northStar ?? '',
        valueGrowth: Number(params.growth ?? 7),
        valueStability: Number(params.stability ?? 6),
        valueRisk: Number(params.risk ?? 5),
        anchorLabel: anchor.trim() || '锚点 A',
        currentStage,
      });
      await addStage({
        title: currentStage,
        location: null,
        narrative: '从 onboarding 开始的当前站。',
        startedAt: new Date().toISOString().slice(0, 10),
        endedAt: null,
      });
      await setOnboardingComplete();
      router.replace('/(tabs)');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen>
      <Text style={styles.lead}>
        你出生在地球上的某个 A 点；之后经过 B、C…… 我们记录轨迹，不评判半径大小。
      </Text>
      <TextField
        label="锚点 A（可选）"
        value={anchor}
        onChangeText={setAnchor}
        placeholder="例如：家乡·成都"
      />
      <TextField
        label="当前站 B"
        value={stage}
        onChangeText={setStage}
        placeholder="例如：在上海·第一份产品工作"
      />
      <Button label={saving ? '保存中…' : '开始记录人生'} disabled={saving} onPress={finish} />
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
