import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ModalSheet } from '@/components/ui/ModalSheet';
import { cloudPlans } from '@/constants/mockData';
import { colors, radius, spacing, typography } from '@/constants/theme';
import { getWardrobeOverview, useAppStore } from '@/store/useAppStore';

export default function CloudStorageScreen() {
  const router = useRouter();
  const { cloudUsed, cloudQuota, membershipLevel, expandCloudQuota, clothing } = useAppStore();
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const quotaPercent = Math.min(100, Math.round((cloudUsed / cloudQuota) * 100));
  const stats = getWardrobeOverview(clothing);
  const currentPlan = cloudPlans.find((p) => p.quota === cloudQuota) ?? cloudPlans[0];

  const handleUpgrade = (planId: string) => {
    const plan = cloudPlans.find((p) => p.id === planId);
    if (!plan || plan.quota <= cloudQuota) return;
    setSelectedPlan(planId);
    expandCloudQuota(plan.quota, plan.id as 'free' | 'standard' | 'premium');
    setShowSuccess(true);
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="云空间管理" onBack={() => router.back()} />

      <Card style={styles.usageCard}>
        <Text style={styles.usageTitle}>当前用量</Text>
        <Text style={styles.usageCount}>
          {cloudUsed} <Text style={styles.usageTotal}>/ {cloudQuota} 件</Text>
        </Text>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${quotaPercent}%` }]} />
        </View>
        <Text style={styles.hint}>
          {quotaPercent >= 80 ? '空间即将用完，建议扩容' : `当前方案：${currentPlan.name}`}
        </Text>
      </Card>

      <Text style={styles.sectionTitle}>分类占用</Text>
      <View style={styles.categoryGrid}>
        {stats.categories.map((cat) => (
          <View key={cat.key} style={styles.categoryItem}>
            <Text style={styles.catCount}>{cat.count}</Text>
            <Text style={styles.catLabel}>{cat.label}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>扩容方案</Text>
      {cloudPlans.map((plan) => {
        const isCurrent = plan.quota === cloudQuota;
        const isUpgrade = plan.quota > cloudQuota;
        return (
          <Card key={plan.id} style={[styles.planCard, isCurrent && styles.planCurrent]}>
            <View style={styles.planHeader}>
              <Text style={styles.planName}>{plan.name}</Text>
              {isCurrent ? <Text style={styles.currentBadge}>当前</Text> : null}
            </View>
            <Text style={styles.planQuota}>{plan.quota} 件衣物</Text>
            <Text style={styles.planDesc}>{plan.desc}</Text>
            {isUpgrade ? (
              <Button
                title={plan.price === 0 ? '免费' : `升级 ¥${plan.price}/月`}
                onPress={() => handleUpgrade(plan.id)}
                style={{ marginTop: spacing.sm }}
              />
            ) : null}
          </Card>
        );
      })}

      <ModalSheet
        visible={showSuccess}
        title="✅ 扩容成功"
        message={`已升级至 ${cloudPlans.find((p) => p.id === selectedPlan)?.name}，云空间提升至 ${cloudQuota} 件。`}
        primaryAction={{ label: '完成', onPress: () => setShowSuccess(false) }}
        onClose={() => setShowSuccess(false)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  usageCard: { marginBottom: spacing.lg },
  usageTitle: { ...typography.label, color: colors.textSecondary },
  usageCount: { ...typography.hero, color: colors.primary, marginVertical: spacing.sm },
  usageTotal: { ...typography.subtitle, color: colors.textMuted },
  progressBg: {
    height: 10,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: colors.primary },
  hint: { ...typography.caption, color: colors.textSecondary, marginTop: spacing.sm },
  sectionTitle: { ...typography.label, color: colors.text, marginBottom: spacing.sm },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.lg },
  categoryItem: {
    width: '22%',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  catCount: { ...typography.subtitle, color: colors.primary },
  catLabel: { ...typography.caption, color: colors.textSecondary },
  planCard: { marginBottom: spacing.sm },
  planCurrent: { borderColor: colors.primary, borderWidth: 2 },
  planHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  planName: { ...typography.subtitle, color: colors.text },
  currentBadge: {
    ...typography.caption,
    color: colors.primary,
    backgroundColor: '#E8F4F4',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: radius.full,
  },
  planQuota: { ...typography.body, color: colors.text, marginTop: 4 },
  planDesc: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
});
