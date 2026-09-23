import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/constants/theme';

type Props = {
  step: number;
  total: number;
  title: string;
};

export function StepIndicator({ step, total, title }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.meta}>
        步骤 {step}/{total}
      </Text>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.bar}>
        {Array.from({ length: total }).map((_, i) => (
          <View
            key={i}
            style={[styles.segment, i < step ? styles.segmentActive : styles.segmentIdle]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.xl,
  },
  meta: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  bar: {
    flexDirection: 'row',
    gap: 6,
  },
  segment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  segmentActive: {
    backgroundColor: colors.primary,
  },
  segmentIdle: {
    backgroundColor: colors.border,
  },
});
