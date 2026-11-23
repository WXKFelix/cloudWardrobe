import { useState } from 'react';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenContainer } from '@/components/ScreenContainer';
import { SectionHeader } from '@/components/SectionHeader';
import { ClothingTryOn, type TryOnGarment } from '@/components/ClothingTryOn';
import { OutfitCard } from '@/components/OutfitCard';
import { Card } from '@/components/ui/Card';
import { mockFashionTips } from '@/constants/mockData';
import { colors, radius, shadows, spacing, typography } from '@/constants/theme';
import {
  daysSinceWorn,
  getWardrobeOverview,
  localDateKey,
  getOutfitRecommendation,
  useAppStore,
} from '@/store/useAppStore';

/** 衣橱分类图标 — 与中文标签语义一致 */
const categoryEmojis: Record<string, string> = {
  top: '👔',
  bottom: '👖',
  shoes: '👟',
  outerwear: '🧥',
  accessory: '👜',
};

export default function HomeScreen() {
  const router = useRouter();
  const [openPreviewKey, setOpenPreviewKey] = useState<string>();
  const clothing = useAppStore((s) => s.clothing);
  const todayOutfitIndex = useAppStore((s) => s.todayOutfitIndex);
  const outfitDays = useAppStore((s) => s.outfitDays);
  const refreshOutfit = useAppStore((s) => s.refreshOutfit);
  const confirmOutfit = useAppStore((s) => s.confirmOutfit);
  const username = useAppStore((s) => s.username);

  const today = new Date();
  const stats = getWardrobeOverview(clothing, outfitDays, today);
  const reminders = clothing.flatMap<{ id: string; text: string; icon: 'water-outline' | 'archive-outline' }>((item) => {
    if (item.status === 'washing') return [{ id: item.id, text: `${item.name}待清洗`, icon: 'water-outline' as const }];
    const days = daysSinceWorn(item.lastWornAt, today);
    return days >= 30 ? [{ id: item.id, text: `${item.name}已有 ${days} 天未穿`, icon: 'archive-outline' as const }] : [];
  });
  const outfit = getOutfitRecommendation(clothing, todayOutfitIndex);
  const previewGarments = outfit.items.flatMap<TryOnGarment>((item) => {
    const image = item.tryOnImageUri ?? item.imageUri;
    return image && item.category !== 'accessory' ? [{ category: item.category, image }] : [];
  });
  const previewKey = outfit.items.map(({ id }) => id).join(':');

  const hour = today.getHours();
  const greeting = hour < 12 ? '早上好' : hour < 18 ? '下午好' : '晚上好';

  return (
    <ScreenContainer>
      <View style={styles.topBar}>
        <View style={styles.greetingBlock}>
          <Text style={styles.greeting}>
            {greeting}，{username || '用户'}
          </Text>
        </View>
        <View style={styles.bell}>
          <Ionicons name="notifications-outline" size={20} color={colors.primary} />
        </View>
      </View>

      <OutfitCard
        title="今日穿搭"
        description={outfit.items.length
          ? outfit.count > 1 ? '从你的衣橱搭配' : '录入更多衣物即可尝试其他搭配。'
          : '录入可穿的上衣、裤子或鞋子，开始搭配。'}
        items={outfit.items}
        confirmed={outfitDays.includes(localDateKey(today))}
        onConfirm={confirmOutfit}
        canRefresh={outfit.count > 1}
        onRefresh={() => {
          setOpenPreviewKey(undefined);
          refreshOutfit();
        }}
        onAdd={() => router.push('/(tabs)/add')}
        previewCount={previewGarments.length}
        onPreview={previewGarments.length ? () => {
          setOpenPreviewKey(openPreviewKey === previewKey ? undefined : previewKey);
        } : undefined}
      />
      {previewGarments.length > 0 && openPreviewKey === previewKey ? (
        <ClothingTryOn key={previewKey} garments={previewGarments} outfit />
      ) : null}

      <View style={styles.section}>
        <SectionHeader
          eyebrow="衣橱"
          title="衣橱概览"
          subtitle={`共 ${stats.total} 件 · 本周穿搭 ${stats.weeklyOutfits} 次`}
        />
        <View style={styles.statRow}>
          {stats.categories.map((cat) => (
            <View key={cat.key} style={styles.statCard}>
              <View style={styles.statIconWrap}>
                <Text style={styles.statEmoji}>{categoryEmojis[cat.key] ?? '👕'}</Text>
              </View>
              <Text style={styles.statCount}>{cat.count}</Text>
              <Text style={styles.statLabel}>{cat.label}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader eyebrow="环保" title="绿色提醒" subtitle={reminders.length === 0 ? '暂无提醒' : undefined} />
        <View style={styles.reminderList}>
          {reminders.map((r) => (
            <View key={r.id} style={styles.reminder}>
              <View style={styles.reminderIcon}>
                <Ionicons
                  name={r.icon}
                  size={16}
                  color={colors.primary}
                />
              </View>
              <Text style={styles.reminderText}>{r.text}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader eyebrow="灵感" title="时尚灵感" />
        <View style={styles.tipList}>
          {mockFashionTips.map((tip) => (
            <Card key={tip.id} style={styles.tipCard}>
              <Text style={styles.tipTitle}>{tip.title}</Text>
              <Text style={styles.tipDesc}>{tip.desc}</Text>
            </Card>
          ))}
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: spacing.xs,
    marginBottom: spacing.md,
  },
  greetingBlock: { flex: 1, gap: 8 },
  greeting: {
    ...typography.title,
    fontSize: 22,
    color: colors.text,
    lineHeight: 30,
  },
  bell: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.card,
  },
  section: { marginTop: spacing.lg },
  statRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  statCard: {
    flexBasis: '29%',
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.card,
  },
  statIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.ecoMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statEmoji: { fontSize: 17, lineHeight: 20 },
  statCount: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    lineHeight: 26,
  },
  statLabel: { ...typography.caption, color: colors.textSecondary, fontSize: 12 },
  reminderList: { gap: spacing.sm },
  reminder: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.warningBg,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: 'rgba(82, 183, 136, 0.25)',
  },
  reminderIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reminderText: {
    ...typography.body,
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  tipList: { gap: spacing.sm },
  tipCard: {
    paddingVertical: spacing.md,
  },
  tipTitle: { ...typography.label, color: colors.text },
  tipDesc: { ...typography.caption, color: colors.textSecondary, marginTop: 4, lineHeight: 18 },
});
