import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
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
          <View style={styles.backContent}>
            <View style={styles.backIconWrap}>
              <Ionicons name="chevron-back" size={16} color={colors.primary} style={styles.backIcon} />
            </View>
            <Text style={styles.backText}>返回</Text>
          </View>
        </Pressable>
      ) : null}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const BACK_BTN_HEIGHT = 40;

const styles = StyleSheet.create({
  header: { marginBottom: spacing.lg, marginTop: spacing.sm },
  backBtn: {
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
    height: BACK_BTN_HEIGHT,
    paddingHorizontal: 12,
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.techBorder,
    justifyContent: 'center',
    ...shadows.card,
  },
  backBtnPressed: { opacity: 0.88, transform: [{ scale: 0.97 }] },
  backContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: BACK_BTN_HEIGHT,
  },
  backIconWrap: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.ecoMuted,
    borderRadius: 10,
  },
  backIcon: {
    // chevron 字形左侧留白较多，微调使视觉居中
    marginLeft: Platform.OS === 'ios' ? -2 : -1,
  },
  backText: {
    marginLeft: 6,
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 20,
    color: colors.primary,
    ...(Platform.OS === 'android' ? { includeFontPadding: false, textAlignVertical: 'center' } : {}),
  },
  title: { ...typography.title, color: colors.text },
});
