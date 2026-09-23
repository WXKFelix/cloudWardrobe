import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Screen } from '@/components/Screen';
import { PathCard } from '@/components/PathCard';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { listDecisions, markDecisionReviewed } from '@/lib/db';
import type { JobOfferResult } from '@/engine/job-offer';
import { colors, spacing } from '@/constants/theme';

export default function JobOfferResultScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [result, setResult] = useState<JobOfferResult | null>(null);
  const [reviewed, setReviewed] = useState(false);

  useEffect(() => {
    (async () => {
      if (!id) return;
      const all = await listDecisions();
      const row = all.find((d) => d.id === id);
      if (row) {
        setResult(JSON.parse(row.resultJson) as JobOfferResult);
        setReviewed(row.reviewed);
      }
    })();
  }, [id]);

  if (!result) {
    return (
      <Screen>
        <Text>加载中…</Text>
      </Screen>
    );
  }

  return (
    <Screen>
      <Card style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          本页为思考框架与粗算结果，不构成职业、财务或法律建议。请结合你的具体情况判断。
        </Text>
      </Card>

      {result.paths.map((p, i) => (
        <PathCard key={p.kind} path={p} rank={i + 1} />
      ))}

      <Text style={styles.section}>假设清单</Text>
      <Card>
        {result.assumptions.map((a) => (
          <Text key={a} style={styles.bullet}>
            · {a}
          </Text>
        ))}
      </Card>

      <Text style={styles.review}>建议复盘日：{result.reviewAt}</Text>

      {id && !reviewed ? (
        <Button
          label="标记本次复盘已完成"
          onPress={async () => {
            await markDecisionReviewed(id);
            setReviewed(true);
          }}
        />
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  disclaimer: {
    backgroundColor: colors.background,
  },
  disclaimerText: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.textSecondary,
  },
  section: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.sm,
    color: colors.text,
  },
  bullet: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.text,
    marginBottom: 4,
  },
  review: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
});
