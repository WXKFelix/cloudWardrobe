import { StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Button } from '@/components/ui/Button';
import { colors, spacing, typography } from '@/constants/theme';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <ScreenContainer scroll={false} style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoEmoji}>☁️👗</Text>
        </View>
        <Text style={styles.brand}>云衣柜</Text>
        <Text style={styles.slogan}>让穿衣不再困难</Text>
        <Text style={styles.sloganSub}>随时随地，想穿就穿</Text>
      </View>

      <View style={styles.features}>
        {[
          { emoji: '📸', text: '拍照录入，衣物一键上云' },
          { emoji: '☀️', text: '天气联动，每日穿搭推荐' },
          { emoji: '✈️', text: '异地取还，轻装出行' },
        ].map((f) => (
          <View key={f.text} style={styles.featureRow}>
            <Text style={styles.featureEmoji}>{f.emoji}</Text>
            <Text style={styles.featureText}>{f.text}</Text>
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
    paddingTop: spacing.xxl,
    paddingBottom: spacing.xl,
  },
  hero: { alignItems: 'center', gap: spacing.sm },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E8F4F4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  logoEmoji: { fontSize: 48 },
  brand: { ...typography.hero, color: colors.primary },
  slogan: { ...typography.subtitle, color: colors.text, marginTop: spacing.sm },
  sloganSub: { ...typography.body, color: colors.textSecondary },
  features: { gap: spacing.md, marginVertical: spacing.xl },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  featureEmoji: { fontSize: 24 },
  featureText: { ...typography.body, color: colors.text, flex: 1 },
  actions: { gap: spacing.md },
});
