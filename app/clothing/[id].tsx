import { Image, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ClothingTryOn } from '@/components/ClothingTryOn';
import { ScreenContainer } from '@/components/ScreenContainer';
import { ScreenHeader } from '@/components/ScreenHeader';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { categoryLabels } from '@/constants/mockData';
import { colors, radius, spacing, typography } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

export default function ClothingDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const item = useAppStore((s) => s.clothing.find((c) => c.id === id));

  if (!item) {
    return (
      <ScreenContainer>
        <Text>衣物不存在</Text>
        <Button title="返回" onPress={() => router.back()} />
      </ScreenContainer>
    );
  }

  const rows = [
    { label: '类别', value: categoryLabels[item.category] },
    { label: '颜色', value: item.color },
    { label: '季节', value: item.season },
    { label: '场合', value: item.occasion },
    { label: '穿着次数', value: `${item.wearCount} 次` },
    {
      label: '上次穿着',
      value:
        item.lastWornDaysAgo < 0
          ? '尚未穿着'
          : item.lastWornDaysAgo === 0
            ? '今天'
            : `${item.lastWornDaysAgo} 天前`,
    },
  ];

  return (
    <ScreenContainer>
      <ScreenHeader title="衣物详情" onBack={() => router.back()} />

      <View style={[styles.hero, item.imageUri && styles.photoHero, { backgroundColor: item.colorHex + '33' }]}>
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
      <Text style={styles.name}>{item.name}</Text>

      <Card style={styles.infoCard}>
        {rows.map((row) => (
          <View key={row.label} style={styles.row}>
            <Text style={styles.rowLabel}>{row.label}</Text>
            <Text style={styles.rowValue}>{row.value}</Text>
          </View>
        ))}
      </Card>

      {item.category === 'top' && item.imageUri ? (
        <ClothingTryOn key={item.id} garments={[{ category: 'top', image: item.tryOnImageUri ?? item.imageUri }]} />
      ) : null}

      <View style={styles.actions}>
        <Button title="标记待清洗" onPress={() => {}} variant="outline" />
        <Button title="存入云仓库" onPress={() => {}} variant="secondary" />
        <Button title="发起捐赠" onPress={() => {}} variant="ghost" />
      </View>

      <Text style={styles.hint}>仓储 / 捐赠功能将在 Phase 2 实现（当前为 UI 原型）</Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: {
    height: 200,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  photoHero: { height: 280 },
  photo: { width: '100%', height: '100%', borderRadius: radius.xl },
  emoji: { fontSize: 80 },
  name: { ...typography.subtitle, color: colors.text, marginBottom: spacing.md },
  infoCard: { gap: spacing.sm, marginBottom: spacing.lg },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  rowLabel: { ...typography.body, color: colors.textSecondary },
  rowValue: { ...typography.label, color: colors.text },
  actions: { gap: spacing.sm },
  hint: { ...typography.caption, color: colors.textMuted, textAlign: 'center', marginTop: spacing.lg },
});
