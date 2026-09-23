import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/constants/theme';

type Props = {
  label: string;
  hint?: string;
  value: number;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
};

export function SliderField({ label, hint, value, onChange, min = 1, max = 10 }: Props) {
  const steps = Array.from({ length: max - min + 1 }, (_, i) => i + min);

  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
      </View>
      {hint ? <Text style={styles.hint}>{hint}</Text> : null}
      <View style={styles.row}>
        {steps.map((step) => {
          const active = step <= value;
          return (
            <Text
              key={step}
              accessibilityRole="adjustable"
              accessibilityLabel={`${label} ${step}`}
              onPress={() => onChange(step)}
              style={[styles.dot, active ? styles.dotActive : styles.dotIdle]}
            >
              {step}
            </Text>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
    fontVariant: ['tabular-nums'],
  },
  hint: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  dot: {
    width: 28,
    height: 28,
    lineHeight: 28,
    textAlign: 'center',
    borderRadius: 14,
    overflow: 'hidden',
    fontSize: 12,
    fontWeight: '600',
  },
  dotActive: {
    backgroundColor: colors.primary,
    color: '#FFF',
  },
  dotIdle: {
    backgroundColor: colors.border,
    color: colors.textSecondary,
  },
});
