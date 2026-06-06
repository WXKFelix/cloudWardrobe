import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useRouter } from 'expo-router';
import { BrandMark } from '@/components/BrandMark';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionHeader } from '@/components/SectionHeader';
import { Button } from '@/components/ui/Button';
import { brand } from '@/constants/brand';
import { colors, radius, shadows, spacing, typography } from '@/constants/theme';

const LOGO_VARIANT: 'image' | 'lockup' | 'icon' = 'image';

export default function WelcomeScreen() {
  const router = useRouter();
  const { height } = useWindowDimensions();
  const logoSize = height < 700 ? 80 : 92;

  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.heroCard}>
        <View style={styles.heroAccent} />
        <BrandMark variant={LOGO_VARIANT} size={logoSize} showFrame={false} />

        {LOGO_VARIANT !== 'lockup' ? (
          <>
            <Text style={styles.brand}>{brand.name}</Text>
            <Text style={styles.brandEn}>{brand.nameEn}</Text>
          </>
        ) : null}

        <View style={styles.tagPill}>
          <Text style={styles.tagText}>{brand.ecoTagline}</Text>
        </View>

        <View style={styles.sloganBlock}>
          <Text style={styles.slogan}>{brand.slogan}</Text>
          <Text style={styles.sloganSub}>{brand.sloganSub}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader
          eyebrow="亮点"
          title="为什么选择云衣柜"
          subtitle="智能穿搭 × 绿色生活 × 云端管理"
        />
        <View style={styles.featureList}>
          {brand.values.map((f, index) => (
            <View key={f.title} style={styles.featureRow}>
              <View
                style={[
                  styles.featureAccent,
                  { backgroundColor: index % 2 === 0 ? colors.primary : colors.tech },
                ]}
              />
              <View style={styles.featureIconWrap}>
                <Text style={styles.featureEmoji}>{f.icon}</Text>
              </View>
              <View style={styles.featureTextWrap}>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <Text style={styles.featureText}>{f.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.ctaBlock}>
        <Button title="注册新账号" onPress={() => router.push('/register')} />
        <Button title="已有账号，登录" onPress={() => router.push('/login')} variant="outline" />
        <Text style={styles.ctaHint}>体验账号 demo · 密码 demo1234</Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.sm,
    gap: spacing.lg,
  },
  heroCard: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    overflow: 'hidden',
    ...shadows.card,
  },
  heroAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: colors.tech,
    opacity: 0.55,
  },
  brand: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
    color: colors.text,
    letterSpacing: 2,
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  brandEn: {
    ...typography.caption,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 3,
    color: colors.textMuted,
    textTransform: 'uppercase',
    textAlign: 'center',
    marginTop: 2,
  },
  tagPill: {
    marginTop: spacing.md,
    backgroundColor: colors.ecoMuted,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  tagText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '600',
    fontSize: 12,
  },
  sloganBlock: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    width: '100%',
    alignItems: 'center',
    gap: 4,
  },
  slogan: {
    ...typography.subtitle,
    fontSize: 17,
    color: colors.text,
    textAlign: 'center',
  },
  sloganSub: {
    ...typography.body,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 21,
  },
  section: {
    width: '100%',
  },
  featureList: { gap: spacing.sm },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceGlass,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.card,
  },
  featureAccent: {
    width: 4,
    alignSelf: 'stretch',
  },
  featureIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.ecoMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
    marginVertical: spacing.sm,
  },
  featureEmoji: { fontSize: 20 },
  featureTextWrap: {
    flex: 1,
    paddingRight: spacing.md,
    paddingVertical: spacing.sm,
  },
  featureTitle: { ...typography.label, color: colors.text, fontSize: 15 },
  featureText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 3,
    lineHeight: 18,
  },
  ctaBlock: {
    gap: spacing.md,
    paddingTop: spacing.xs,
  },
  ctaHint: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: -4,
  },
});
