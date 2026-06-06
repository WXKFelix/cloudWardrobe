import { Pressable, StyleSheet, Text, ViewStyle, TextStyle } from 'react-native';
import { colors, radius, shadows, typography } from '@/constants/theme';

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'eco';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: Variant;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        pressed && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.text, styles[`${variant}Text` as const], textStyle]}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: colors.primary,
    borderWidth: 1,
    borderColor: colors.techBorder,
    ...shadows.glow,
  },
  secondary: {
    backgroundColor: colors.tech,
  },
  eco: {
    backgroundColor: colors.eco,
  },
  ghost: { backgroundColor: 'transparent' },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  pressed: { opacity: 0.88, transform: [{ scale: 0.98 }] },
  disabled: { opacity: 0.5 },
  text: { ...typography.label },
  primaryText: { color: '#FFF' },
  secondaryText: { color: colors.primaryDark, fontWeight: '700' },
  ecoText: { color: '#FFF' },
  ghostText: { color: colors.primary },
  outlineText: { color: colors.primary },
});
