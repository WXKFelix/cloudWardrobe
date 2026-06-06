import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { colors, spacing, typography } from '@/constants/theme';

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  style?: ViewStyle;
}

export function SectionHeader({ eyebrow, title, subtitle, style }: SectionHeaderProps) {
  return (
    <View style={[styles.wrap, style]}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 4, marginBottom: spacing.sm },
  eyebrow: {
    ...typography.caption,
    color: colors.tech,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    fontSize: 11,
  },
  title: { ...typography.subtitle, color: colors.text, fontSize: 17 },
  subtitle: { ...typography.caption, color: colors.textSecondary, lineHeight: 20 },
});
