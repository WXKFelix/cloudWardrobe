import { daysSinceWorn } from '@/store/useAppStore';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { ClothingItem, categoryLabels } from '@/constants/mockData';
import { colors, radius, spacing, typography } from '@/constants/theme';

interface ClothingListItemProps {
  item: ClothingItem;
  onPress: () => void;
}

const statusLabels = {
  normal: null,
  washing: '待清洗',
  in_storage: '在库',
};

export function ClothingListItem({ item, onPress }: ClothingListItemProps) {
  const daysSinceLastWear = daysSinceWorn(item.lastWornAt);
  const status = statusLabels[item.status];

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={[styles.thumb, { backgroundColor: item.colorHex + '33' }]}>
        {item.imageUri ? (
          <Image
            source={{ uri: item.imageUri }}
            style={styles.photo}
            resizeMode="contain"
            accessibilityLabel={item.name}
          />
        ) : (
          <Text style={styles.emoji}>{item.emoji}</Text>
        )}
      </View>
      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text style={styles.name}>{item.name}</Text>
          {status ? <Text style={styles.statusBadge}>{status}</Text> : null}
        </View>
        <Text style={styles.meta}>
          {categoryLabels[item.category]} · {item.color} · 穿了 {item.wearCount} 次
        </Text>
        <Text style={styles.lastWorn}>
          {daysSinceLastWear < 0
            ? '尚未穿着'
            : daysSinceLastWear === 0
              ? '今天穿过'
              : `${daysSinceLastWear} 天前穿过`}
        </Text>
      </View>
      <View style={[styles.colorDot, { backgroundColor: item.colorHex }]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.md,
  },
  pressed: { opacity: 0.9 },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  photo: { width: '100%', height: '100%', borderRadius: radius.md },
  emoji: { fontSize: 28 },
  info: { flex: 1, gap: 2 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { ...typography.label, color: colors.text },
  statusBadge: {
    ...typography.caption,
    color: colors.warning,
    backgroundColor: colors.warningBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  meta: { ...typography.caption, color: colors.textSecondary },
  lastWorn: { ...typography.caption, color: colors.textMuted },
  colorDot: { width: 12, height: 12, borderRadius: 6 },
});
