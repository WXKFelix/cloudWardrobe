import { useEffect, useState } from 'react';
import { Alert, Platform, Share, StyleSheet, Text } from 'react-native';
import * as Sharing from 'expo-sharing';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { SliderField } from '@/components/SliderField';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useAppData } from '@/context/AppDataContext';
import { exportAllTables, upsertProfile } from '@/lib/db';
import { colors, spacing } from '@/constants/theme';

export default function SettingsScreen() {
  const { profile, refresh } = useAppData();
  const [northStar, setNorthStar] = useState('');
  const [anchor, setAnchor] = useState('');
  const [stage, setStage] = useState('');
  const [growth, setGrowth] = useState(7);
  const [stability, setStability] = useState(6);
  const [risk, setRisk] = useState(5);

  useEffect(() => {
    if (profile) {
      setNorthStar(profile.northStar);
      setAnchor(profile.anchorLabel);
      setStage(profile.currentStage);
      setGrowth(profile.valueGrowth);
      setStability(profile.valueStability);
      setRisk(profile.valueRisk);
    }
  }, [profile]);

  const save = async () => {
    if (!profile) return;
    await upsertProfile({
      northStar: northStar.trim(),
      anchorLabel: anchor.trim(),
      currentStage: stage.trim(),
      valueGrowth: growth,
      valueStability: stability,
      valueRisk: risk,
    });
    await refresh();
    Alert.alert('已保存');
  };

  const exportData = async () => {
    const json = await exportAllTables();
    if (Platform.OS === 'web') {
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `quantified-life-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
      return;
    }
    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Share.share({ message: json });
    } else {
      Alert.alert('导出', '请使用支持分享的设备');
    }
  };

  return (
    <Screen>
      <TextField label="人生主线" value={northStar} onChangeText={setNorthStar} />
      <TextField label="锚点 A" value={anchor} onChangeText={setAnchor} />
      <TextField label="当前站" value={stage} onChangeText={setStage} />
      <SliderField label="成长权重" value={growth} onChange={setGrowth} />
      <SliderField label="稳定权重" value={stability} onChange={setStability} />
      <SliderField label="风险承受" value={risk} onChange={setRisk} />
      <Button label="保存资料" onPress={save} />

      <Button variant="secondary" label="导出全部 JSON" onPress={exportData} />

      <Card style={{ marginTop: spacing.lg }}>
        <Text style={styles.principleTitle}>产品原则</Text>
        <Text style={styles.principle}>· 不做人生总分与排名</Text>
        <Text style={styles.principle}>· 指标可关闭，决策展示 trade-off</Text>
        <Text style={styles.principle}>· 不构成法律/财务/职业建议</Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  principleTitle: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: spacing.xs,
    color: colors.text,
  },
  principle: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
});
