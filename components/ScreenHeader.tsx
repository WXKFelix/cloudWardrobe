import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, radius, shadows, spacing, typography } from '@/constants/theme';

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  showBack?: boolean;
}

export function ScreenHeader({ title, onBack, showBack = true }: ScreenHeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      {showBack ? (
        <Pressable
          onPress={onBack ?? (() => router.back())}
          style={({ pressed }) => [styles.backBtn, pressed && styles.backBtnPressed]}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="返回"
        >
          <View style={styles.backIconWrap}>
            <Ionicons name="chevron-back" size={18} color={colors.primary} />
          </View>
          <Text style={styles.backText}>返回</Text>
        </Pressable>
      ) : null}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: spacing.lg, marginTop: spacing.sm },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    marginBottom: spacing.md,
    paddingVertical: 6,
    paddingRight: 14,
    paddingLeft: 6,
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.techBorder,
    ...shadows.card,
  },
  backBtnPressed: { opacity: 0.88, transform: [{ scale: 0.97 }] },
  backIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.ecoMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: { ...typography.label, color: colors.primary, fontSize: 15 },
  title: { ...typography.title, color: colors.text },
});
