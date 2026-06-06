import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ModalSheet } from '@/components/ui/ModalSheet';
import { Order, OrderType, orderStatusLabels, orderTypeLabels } from '@/constants/mockData';
import { colors, radius, spacing, typography } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

const filters: Array<{ key: OrderType | 'all'; label: string }> = [
  { key: 'all', label: '全部' },
  { key: 'storage', label: '仓储' },
  { key: 'pickup', label: '取衣' },
  { key: 'care', label: '保养' },
];

const statusColors: Record<string, string> = {
  pending: colors.warning,
  processing: colors.primary,
  shipping: colors.primaryLight,
  completed: colors.success,
  cancelled: colors.textMuted,
};

export default function OrdersScreen() {
  const router = useRouter();
  const { orders, cancelOrder } = useAppStore();
  const [filter, setFilter] = useState<OrderType | 'all'>('all');
  const [selected, setSelected] = useState<Order | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showCancel, setShowCancel] = useState(false);

  const filtered = useMemo(
    () => (filter === 'all' ? orders : orders.filter((o) => o.type === filter)),
    [orders, filter]
  );

  const openDetail = (order: Order) => {
    setSelected(order);
    setShowDetail(true);
  };

  const handleCancel = () => {
    if (selected) cancelOrder(selected.id);
    setShowCancel(false);
    setShowDetail(false);
    setSelected(null);
  };

  return (
    <ScreenContainer>
      <ScreenHeader title="我的订单" onBack={() => router.back()} />

      <View style={styles.filters}>
        {filters.map((f) => (
          <Pressable
            key={f.key}
            onPress={() => setFilter(f.key)}
            style={[styles.chip, filter === f.key && styles.chipActive]}
          >
            <Text style={[styles.chipText, filter === f.key && styles.chipTextActive]}>{f.label}</Text>
          </Pressable>
        ))}
      </View>

      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>📦</Text>
          <Text style={styles.emptyText}>暂无相关订单</Text>
        </View>
      ) : (
        filtered.map((order) => (
          <Pressable key={order.id} onPress={() => openDetail(order)}>
            <Card style={styles.orderCard}>
              <View style={styles.orderHeader}>
                <Text style={styles.orderType}>{orderTypeLabels[order.type]}</Text>
                <Text style={[styles.orderStatus, { color: statusColors[order.status] }]}>
                  {orderStatusLabels[order.status]}
                </Text>
              </View>
              <Text style={styles.orderTitle}>{order.title}</Text>
              <Text style={styles.orderMeta}>
                {order.date} · ¥{order.amount}
              </Text>
              <Text style={styles.orderItems} numberOfLines={1}>
                {order.items.join('、')}
              </Text>
            </Card>
          </Pressable>
        ))
      )}

      <ModalSheet
        visible={showDetail && !!selected}
        title={selected?.title ?? ''}
        onClose={() => setShowDetail(false)}
        primaryAction={{ label: '关闭', onPress: () => setShowDetail(false) }}
      >
        {selected ? (
          <View style={styles.detail}>
            <DetailRow label="订单号" value={selected.id} />
            <DetailRow label="类型" value={orderTypeLabels[selected.type]} />
            <DetailRow label="状态" value={orderStatusLabels[selected.status]} />
            <DetailRow label="金额" value={`¥${selected.amount}`} />
            <DetailRow label="日期" value={selected.date} />
            <DetailRow label="衣物" value={selected.items.join('、')} />
            {selected.trackingNo ? (
              <DetailRow label="物流单号" value={selected.trackingNo} />
            ) : null}
            {(selected.status === 'pending' || selected.status === 'processing') && (
              <Button
                title="取消订单"
                variant="outline"
                onPress={() => setShowCancel(true)}
                style={{ marginTop: spacing.sm }}
              />
            )}
          </View>
        ) : null}
      </ModalSheet>

      <ModalSheet
        visible={showCancel}
        title="确认取消订单？"
        message="取消后不可恢复，是否继续？"
        primaryAction={{ label: '确认取消', onPress: handleCancel }}
        secondaryAction={{ label: '再想想', onPress: () => setShowCancel(false) }}
        onClose={() => setShowCancel(false)}
      />
    </ScreenContainer>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  filters: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md, flexWrap: 'wrap' },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { ...typography.caption, color: colors.textSecondary },
  chipTextActive: { color: '#FFF', fontWeight: '600' },
  orderCard: { marginBottom: spacing.sm },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  orderType: { ...typography.caption, color: colors.primary },
  orderStatus: { ...typography.caption, fontWeight: '600' },
  orderTitle: { ...typography.label, color: colors.text },
  orderMeta: { ...typography.caption, color: colors.textSecondary, marginTop: 4 },
  orderItems: { ...typography.caption, color: colors.textMuted, marginTop: 4 },
  empty: { alignItems: 'center', paddingVertical: spacing.xxl },
  emptyEmoji: { fontSize: 48 },
  emptyText: { ...typography.body, color: colors.textSecondary, marginTop: spacing.sm },
  detail: { gap: spacing.sm },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between' },
  detailLabel: { ...typography.body, color: colors.textSecondary },
  detailValue: { ...typography.label, color: colors.text, flex: 1, textAlign: 'right' },
});
