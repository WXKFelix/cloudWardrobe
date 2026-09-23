import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/constants/theme';
import type { LifeStage } from '@/lib/db';
import { Card } from '@/components/Card';

type Props = {
  stage: LifeStage;
  isFirst?: boolean;
};

export function TimelineNode({ stage, isFirst }: Props) {
  return (
    <View style={styles.row}>
      <View style={styles.rail}>
        <View style={[styles.dot, isFirst && styles.dotAccent]} />
        <View style={styles.line} />
      </View>
      <View style={styles.content}>
        <Card>
          <Text style={styles.title}>{stage.title}</Text>
          {stage.location ? <Text style={styles.loc}>{stage.location}</Text> : null}
          <Text style={styles.date}>{stage.startedAt.slice(0, 10)}</Text>
          {stage.narrative ? <Text style={styles.narr}>{stage.narrative}</Text> : null}
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  rail: {
    width: 24,
    alignItems: 'center',
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primaryMuted,
    marginTop: 18,
  },
  dotAccent: {
    backgroundColor: colors.accent,
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: colors.border,
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  loc: {
    fontSize: 14,
    color: colors.accent,
    marginTop: 2,
  },
  date: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  narr: {
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textSecondary,
  },
});
