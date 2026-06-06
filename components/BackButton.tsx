import { Platform, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, radius, shadows } from '@/constants/theme';

interface BackButtonProps {
  onPress?: () => void;
  style?: ViewStyle;
}

const BACK_BTN_HEIGHT = 40;

export function BackButton({ onPress, style }: BackButtonProps) {
  const router = useRouter();

  return (
    <Pressable
      onPress={onPress ?? (() => router.back())}
      style={({ pressed }) => [styles.backBtn, pressed && styles.backBtnPressed, style]}
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
  );
}

const styles = StyleSheet.create({
  backBtn: {
    alignSelf: 'flex-start',
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
});
