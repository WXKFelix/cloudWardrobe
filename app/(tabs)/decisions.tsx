import { StyleSheet, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '@/components/Screen';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useAppData } from '@/context/AppDataContext';
import { colors, spacing } from '@/constants/theme';
import type { JobOfferResult } from '@/engine/job-offer';

export default function DecisionsScreen() {
  const router = useRouter();
  const { decisions, refresh } = useAppData();

  return (
    <Screen>
      <Text style={styles.lead}>关键节点：看清 trade-off，而不是唯一标准答案。</Text>
      <Button label="开始：换工作 / Offer" onPress={() => router.push('/decision/job-offer')} />

      <Text style={styles.section}>决策日志</Text>
      {decisions.length === 0 ? (
        <Text style={styles.empty}>暂无记录。完成一次向导后会出现在这里。</Text>
      ) : (
        decisions.map((d) => {
          const result = JSON.parse(d.resultJson) as JobOfferResult;
          const top = result.paths[0]?.title ?? '决策';
          return (
            <Pressable
              key={d.id}
              onPress={() =>
                router.push({
                  pathname: '/decision/job-offer/result',
                  params: { id: d.id },
                })
              }
            >
              <Card>
                <Text style={styles.itemTitle}>{top}</Text>
                <Text style={styles.meta}>
                  {d.createdAt.slice(0, 10)} · 复盘日 {d.reviewAt}
                  {d.reviewed ? ' · 已复盘' : ''}
                </Text>
              </Card>
            </Pressable>
          );
        })
      )}
      <Button variant="secondary" label="刷新列表" onPress={() => refresh()} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  lead: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  section: {
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  empty: {
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  meta: {
    marginTop: 4,
    fontSize: 13,
    color: colors.textSecondary,
  },
});
