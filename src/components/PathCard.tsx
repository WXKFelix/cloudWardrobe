import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/constants/theme';
import type { DecisionPath, PathKind } from '@/engine/job-offer';
import { Card } from '@/components/Card';

const kindColor: Record<PathKind, string> = {
  accept: colors.pathAccept,
  stay: colors.pathStay,
  negotiate: colors.pathNegotiate,
};

type Props = {
  path: DecisionPath;
  rank: number;
};

function ScoreBar({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.scoreRow}>
      <Text style={styles.scoreLabel}>{label}</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${value}%` }]} />
      </View>
      <Text style={styles.scoreNum}>{value}</Text>
    </View>
  );
}

export function PathCard({ path, rank }: Props) {
  return (
    <Card
      style={{
        ...styles.card,
        borderLeftColor: kindColor[path.kind],
        borderLeftWidth: 4,
      }}
    >
      <View style={styles.head}>
        <Text style={styles.rank}>#{rank}</Text>
        <Text style={styles.title}>{path.title}</Text>
      </View>
      <Text style={styles.headline}>{path.headline}</Text>
      <View style={styles.tags}>
        {path.tags.map((t) => (
          <Text key={t} style={styles.tag}>
            {t}
          </Text>
        ))}
      </View>
      <ScoreBar label="财务" value={path.scores.financial} />
      <ScoreBar label="时间" value={path.scores.time} />
      <ScoreBar label="成长" value={path.scores.growth} />
      <ScoreBar label="稳定" value={path.scores.stability} />
      <Text style={styles.overall}>综合参考 {path.scores.overall}</Text>
      <Text style={styles.summary}>{path.summary}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.md,
  },
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  rank: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.accent,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  headline: {
    fontSize: 15,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: spacing.sm,
  },
  tag: {
    fontSize: 12,
    color: colors.primaryMuted,
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  scoreLabel: {
    width: 36,
    fontSize: 12,
    color: colors.textSecondary,
  },
  track: {
    flex: 1,
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.primaryMuted,
  },
  scoreNum: {
    width: 28,
    fontSize: 12,
    textAlign: 'right',
    fontVariant: ['tabular-nums'],
    color: colors.text,
  },
  overall: {
    marginTop: 4,
    fontWeight: '600',
    color: colors.primary,
  },
  summary: {
    marginTop: 6,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
