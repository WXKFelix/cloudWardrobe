import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useRouter } from 'expo-router';
import { CloudWardrobeLogo } from '@/components/CloudWardrobeLogo';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Button } from '@/components/ui/Button';
import { brand } from '@/constants/brand';
import { colors, radius, spacing, typography } from '@/constants/theme';

export default function WelcomeScreen() {
  const router = useRouter();
  const { height } = useWindowDimensions();
  const iconSize = height < 700 ? 52 : 60;

  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.hero}>
        <View style={[styles.iconHalo, { width: iconSize + 28, height: iconSize + 28 }]}>
          <CloudWardrobeLogo size={iconSize} />
        </View>

        <Text style={styles.brand}>{brand.name}</Text>
        <Text style={styles.brandEn}>{brand.nameEn}</Text>

        <View style={styles.tagRow}>
          <Text style={styles.ecoTag}>{brand.ecoTagline}</Text>
        </View>

        <Text style={styles.slogan}>{brand.slogan}</Text>
        <Text style={styles.sloganSub}>{brand.sloganSub}</Text>
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
    paddingTop: spacing.sm,
    gap: spacing.lg,
  },
  hero: {
    alignItems: 'center',
    gap: 6,
    paddingTop: spacing.xs,
  },
  iconHalo: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.sm,
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  brand: {
    fontSize: 30,
    fontWeight: '700',
    lineHeight: 38,
    color: colors.text,
    letterSpacing: 1,
  },
  brandEn: {
    ...typography.caption,
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: 2.5,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  tagRow: {
    marginTop: spacing.sm,
    marginBottom: spacing.xs,
  },
  ecoTag: {
    ...typography.caption,
    color: colors.primary,
    backgroundColor: colors.ecoMuted,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: radius.full,
    overflow: 'hidden',
    fontWeight: '600',
    fontSize: 12,
  },
  slogan: {
    ...typography.subtitle,
    color: colors.text,
    textAlign: 'center',
    marginTop: spacing.xs,
  },
  sloganSub: {
    ...typography.body,
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  features: { gap: spacing.sm },
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
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.ecoMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureEmoji: { fontSize: 20 },
  featureTextWrap: { flex: 1 },
  featureTitle: { ...typography.label, color: colors.text, fontSize: 15 },
  featureText: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  actions: { gap: spacing.md },
});
