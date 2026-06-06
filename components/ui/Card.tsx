import { StyleSheet, View, ViewProps } from 'react-native';
import { colors, radius, shadows, spacing } from '@/constants/theme';

interface CardProps extends ViewProps {
  glow?: boolean;
}

export function Card({ style, children, glow, ...props }: CardProps) {
  return (
    <View style={[styles.card, glow && styles.cardGlow, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceGlass,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.card,
  },
  cardGlow: {
    borderColor: colors.techBorder,
    ...shadows.glow,
  },
});
