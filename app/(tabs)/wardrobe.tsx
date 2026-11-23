import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ClothingListItem } from '@/components/ClothingListItem';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ClothingCategory, categoryLabels } from '@/constants/mockData';
import { colors, radius, spacing, typography } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

const filters: Array<{ key: ClothingCategory | 'all'; label: string }> = [
  { key: 'all', label: '全部' },
  { key: 'top', label: '上衣' },
  { key: 'bottom', label: '裤子' },
  { key: 'shoes', label: '鞋子' },
  { key: 'outerwear', label: '外套' },
  { key: 'accessory', label: '配饰' },
];

export default function WardrobeScreen() {
  const router = useRouter();
  const clothing = useAppStore((s) => s.clothing);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<ClothingCategory | 'all'>('all');

  const filtered = useMemo(() => {
    return clothing.filter((item) => {
      const matchFilter = filter === 'all' || item.category === filter;
      const matchSearch =
        !search.trim() ||
        item.name.includes(search.trim()) ||
        categoryLabels[item.category].includes(search.trim());
      return matchFilter && matchSearch;
    });
  }, [clothing, filter, search]);

  return (
    <ScreenContainer>
      <Text style={styles.title}>我的衣橱</Text>
      <Text style={styles.subtitle}>共 {clothing.length} 件衣物</Text>

      <Input
        placeholder="🔍 搜索衣物..."
        value={search}
        onChangeText={setSearch}
        style={{ marginBottom: spacing.md }}
      />

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

      <View style={styles.list}>
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>👗</Text>
            <Text style={styles.emptyTitle}>{clothing.length === 0 ? '还没有衣物' : '没有符合条件的衣物'}</Text>
            {clothing.length === 0 ? (
              <Button title="录入第一件衣物" onPress={() => router.push('/(tabs)/add')} />
            ) : (
              <Button title="清除筛选" variant="outline" onPress={() => { setSearch(''); setFilter('all'); }} />
            )}
          </View>
        ) : (
          filtered.map((item) => (
            <ClothingListItem
              key={item.id}
              item={item}
              onPress={() => router.push(`/clothing/${item.id}`)}
            />
          ))
        )}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.title, color: colors.text, marginTop: spacing.sm },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.lg },
  filters: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, marginBottom: spacing.md },
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
  list: { gap: spacing.sm },
  empty: { alignItems: 'center', paddingVertical: spacing.xxl, gap: spacing.sm },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { ...typography.subtitle, color: colors.text },
});
