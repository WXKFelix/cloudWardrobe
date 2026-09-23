import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/theme';

type Props = {
  value: number;
  subtitle: string;
};

export function AlignmentRing({ value, subtitle }: Props) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <View style={styles.wrap}>
      <View style={styles.ring}>
        <Text style={styles.number}>{clamped}</Text>
        <Text style={styles.unit}>对齐度</Text>
      </View>
      <Text style={styles.sub}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    marginVertical: 8,
  },
  ring: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 10,
    borderColor: colors.accent,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    fontSize: 40,
    fontWeight: '700',
    color: colors.primary,
    fontVariant: ['tabular-nums'],
  },
  unit: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  sub: {
    marginTop: 12,
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
});
