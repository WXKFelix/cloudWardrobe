import { useMemo, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { SliderField } from '@/components/SliderField';
import { AlignmentRing } from '@/components/AlignmentRing';
import { Sparkline } from '@/components/Sparkline';
import { useAppData } from '@/context/AppDataContext';
import { upsertCheckin } from '@/lib/db';
import { colors, spacing } from '@/constants/theme';

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export default function TodayScreen() {
  const router = useRouter();
  const { profile, checkins, refresh } = useAppData();
  const today = checkins.find((c) => c.date === todayKey());

  const [energy, setEnergy] = useState(today?.energy ?? 6);
  const [alignment, setAlignment] = useState(today?.alignment ?? 6);
  const [mood, setMood] = useState(today?.mood ?? 6);

  const alignmentScore = useMemo(() => {
    const recent = checkins.length ? checkins : [{ alignment: 6 } as { alignment: number }];
    const avg =
      recent.reduce((s, c) => s + ('alignment' in c ? c.alignment : 6), 0) / recent.length;
    return Math.round((avg / 10) * 100);
  }, [checkins]);

  const sparkValues = useMemo(() => {
    const ordered = [...checkins].reverse();
    if (ordered.length === 0) {
      return [0, 0, 0, 0, 0, 0, 0];
    }
    while (ordered.length < 7) {
      ordered.unshift(ordered[0]);
    }
    return ordered.slice(-7).map((c) => c.alignment);
  }, [checkins]);

  const subtitle =
    alignmentScore >= 70
      ? '近期与主线较为一致，保持节奏。'
      : alignmentScore >= 45
        ? '主线投入有波动，留意时间与精力分配。'
        : '对齐度偏低，今晚留 10 分钟复盘本周。';

  const saveCheckin = async () => {
    await upsertCheckin(todayKey(), energy, alignment, mood);
    await refresh();
  };

  return (
    <Screen>
      <Text style={styles.greet}>你好，今日也向前走一点</Text>
      {profile ? (
        <Text style={styles.chip}>
          {profile.currentStage} · 主线：{profile.northStar}
        </Text>
      ) : null}

      <Card>
        <AlignmentRing value={alignmentScore} subtitle={subtitle} />
      </Card>

      <Text style={styles.section}>30 秒签到</Text>
      <Card>
        <SliderField label="精力" value={energy} onChange={setEnergy} />
        <SliderField label="主线投入" value={alignment} onChange={setAlignment} />
        <SliderField label="情绪" value={mood} onChange={setMood} />
        <Button label="保存今日" onPress={saveCheckin} />
      </Card>

      <Sparkline values={sparkValues} label="近 7 日主线投入趋势" />

      <Button
        style={{ marginTop: spacing.lg }}
        variant="secondary"
        label="面临 Offer 选择？"
        onPress={() => router.push('/decision/job-offer')}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  greet: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  chip: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  section: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
});
