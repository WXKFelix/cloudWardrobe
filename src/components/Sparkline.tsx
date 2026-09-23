import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/constants/theme';

type Props = {
  values: number[];
  label: string;
};

export function Sparkline({ values, label }: Props) {
  const max = Math.max(...values, 1);
  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        {values.map((v, i) => (
          <View key={i} style={styles.col}>
            <View style={[styles.bar, { height: Math.max(4, (v / max) * 56) }]} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing.md,
  },
  label: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 64,
    gap: 6,
  },
  col: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    minHeight: 4,
    backgroundColor: colors.primaryMuted,
    borderRadius: 4,
  },
});
