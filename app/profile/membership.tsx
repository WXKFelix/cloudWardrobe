import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ModalSheet } from '@/components/ui/ModalSheet';
import { membershipBenefits } from '@/constants/mockData';
import { colors, radius, spacing, typography } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

const levelLabels = { free: '免费版', standard: '标准版', premium: '尊享版' };

export default function MembershipScreen() {
  const router = useRouter();
  const { membershipLevel, points, redeemPoints } = useAppStore();
  const [showRedeem, setShowRedeem] = useState(false);
  const [redeemMsg, setRedeemMsg] = useState('');

  const nextLevelPoints = 1000;
  const progress = Math.min(100, Math.round((points / nextLevelPoints) * 100));

  const handleRedeem = (cost: number, reward: string) => {
    if (redeemPoints(cost)) {
      setRedeemMsg(`已成功兑换：${reward}`);
      setShowRedeem(true);
    } else {
      setRedeemMsg('积分不足，继续打卡穿搭可获取积分');
      setShowRedeem(true);
    }
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="会员中心" onBack={() => router.back()} />

      <Card style={styles.levelCard}>
        <Text style={styles.levelBadge}>{levelLabels[membershipLevel]}</Text>
        <Text style={styles.points}>{points} 积分</Text>
        <Text style={styles.pointsHint}>距离升级还需 {Math.max(0, nextLevelPoints - points)} 积分</Text>
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
      </Card>

      <Text style={styles.sectionTitle}>会员权益</Text>
      {membershipBenefits.map((b) => (
        <View key={b.title} style={styles.benefitRow}>
          <Text style={styles.benefitIcon}>{b.icon}</Text>
          <View style={styles.benefitText}>
            <Text style={styles.benefitTitle}>{b.title}</Text>
            <Text style={styles.benefitDesc}>{b.desc}</Text>
          </View>
        </View>
      ))}

      <Text style={[styles.sectionTitle, { marginTop: spacing.lg }]}>积分兑换</Text>
      <Card style={styles.redeemCard}>
        <Text style={styles.redeemTitle}>云空间 +10 件</Text>
        <Text style={styles.redeemCost}>200 积分</Text>
        <Button title="立即兑换" onPress={() => handleRedeem(200, '云空间 +10 件')} variant="outline" />
      </Card>
      <Card style={styles.redeemCard}>
        <Text style={styles.redeemTitle}>免费取衣 1 次</Text>
        <Text style={styles.redeemCost}>500 积分</Text>
        <Button title="立即兑换" onPress={() => handleRedeem(500, '免费取衣 1 次')} variant="outline" />
      </Card>

      <ModalSheet
        visible={showRedeem}
        title={redeemMsg.includes('成功') ? '✅ 兑换成功' : '提示'}
        message={redeemMsg}
        primaryAction={{ label: '知道了', onPress: () => setShowRedeem(false) }}
        onClose={() => setShowRedeem(false)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  levelCard: { alignItems: 'center', marginBottom: spacing.lg },
  levelBadge: {
    ...typography.caption,
    color: colors.accent,
    backgroundColor: colors.accentLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radius.full,
    marginBottom: spacing.sm,
  },
  points: { ...typography.hero, color: colors.primary },
  pointsHint: { ...typography.caption, color: colors.textSecondary, marginTop: 4 },
  progressBg: {
    width: '100%',
    height: 8,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.full,
    marginTop: spacing.md,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: colors.accent },
  sectionTitle: { ...typography.label, color: colors.text, marginBottom: spacing.sm },
  benefitRow: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  benefitIcon: { fontSize: 24 },
  benefitText: { flex: 1 },
  benefitTitle: { ...typography.label, color: colors.text },
  benefitDesc: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  redeemCard: { marginBottom: spacing.sm, gap: spacing.sm },
  redeemTitle: { ...typography.label, color: colors.text },
  redeemCost: { ...typography.caption, color: colors.primary },
});
