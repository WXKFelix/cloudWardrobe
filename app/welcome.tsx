import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { CloudWardrobeLogo } from '@/components/CloudWardrobeLogo';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Button } from '@/components/ui/Button';
import { brand } from '@/constants/brand';
import { colors, radius, spacing, typography } from '@/constants/theme';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ScreenContainer scroll={false} style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.logoStage}>
          <View style={styles.logoCornerTL} />
          <View style={styles.logoCornerBR} />
          <CloudWardrobeLogo size={188} />
        </View>

        <Text style={styles.ecoTag}>{brand.ecoTagline}</Text>
        <Text style={styles.brand}>{brand.name}</Text>
        <Text style={styles.slogan}>{brand.slogan}</Text>
        <Text style={styles.sloganSub}>{brand.sloganSub}</Text>
        <Text style={styles.mission}>{brand.mission}</Text>
      </View>

      <View style={styles.features}>
        {brand.values.map((f) => (
          <View key={f.title} style={styles.featureRow}>
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

      <View style={styles.actions}>
        <Button title="注册新账号" onPress={() => router.push('/register')} />
        <Button title="已有账号，登录" onPress={() => router.push('/login')} variant="outline" />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  hero: { alignItems: 'center', gap: spacing.xs },
  logoStage: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    backgroundColor: 'rgba(255, 255, 255, 0.72)',
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(0, 217, 181, 0.28)',
    overflow: 'hidden',
    minWidth: 260,
  },
  logoCornerTL: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 18,
    height: 18,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: colors.tech,
    opacity: 0.35,
    borderTopLeftRadius: 4,
  },
  logoCornerBR: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 18,
    height: 18,
    borderBottomWidth: 2,
    borderRightWidth: 2,
    borderColor: colors.tech,
    opacity: 0.35,
    borderBottomRightRadius: 4,
  },
  ecoTag: {
    ...typography.caption,
    color: colors.tech,
    backgroundColor: colors.techGlow,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: radius.full,
    overflow: 'hidden',
    fontWeight: '600',
    letterSpacing: 1,
    marginTop: spacing.xs,
  },
  brand: { ...typography.hero, color: colors.primary, marginTop: spacing.sm },
  slogan: { ...typography.subtitle, color: colors.text, marginTop: spacing.xs },
  sloganSub: { ...typography.body, color: colors.tech, fontWeight: '600' },
  mission: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.sm,
    paddingHorizontal: spacing.lg,
    lineHeight: 20,
  },
  features: { gap: spacing.sm, marginVertical: spacing.md },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surfaceGlass,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  featureIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.ecoMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureEmoji: { fontSize: 22 },
  featureTextWrap: { flex: 1 },
  featureTitle: { ...typography.label, color: colors.text },
  featureText: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  actions: { gap: spacing.md },
});
