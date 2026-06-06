import { StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '@/components/ScreenContainer';
import { OutfitCard } from '@/components/OutfitCard';
import { Card } from '@/components/ui/Card';
import { mockFashionTips, mockReminders } from '@/constants/mockData';
import { colors, radius, spacing, typography } from '@/constants/theme';
import { getWardrobeOverview, outfitPresets, useAppStore } from '@/store/useAppStore';

export default function HomeScreen() {
  const clothing = useAppStore((s) => s.clothing);
  const todayOutfitIndex = useAppStore((s) => s.todayOutfitIndex);
  const todayOutfitConfirmed = useAppStore((s) => s.todayOutfitConfirmed);
  const refreshOutfit = useAppStore((s) => s.refreshOutfit);
  const confirmOutfit = useAppStore((s) => s.confirmOutfit);
  const username = useAppStore((s) => s.username);

  const stats = getWardrobeOverview(clothing);
  const outfit = outfitPresets[todayOutfitIndex];

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>你好，{username || '用户'}</Text>
          <Text style={styles.weather}>☀️ 北京 22°C 晴</Text>
        </View>
        <View style={styles.bell}>
          <Text>🔔</Text>
        </View>
      </View>

      <OutfitCard
        title={outfit.title}
        description={outfit.desc}
        emojis={outfit.emojis}
        items={outfit.items}
        confirmed={todayOutfitConfirmed}
        onConfirm={confirmOutfit}
        onRefresh={refreshOutfit}
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          衣橱概览 · {stats.total} 件 · 本周穿搭 {stats.weeklyOutfits} 次
        </Text>
        <View style={styles.statGrid}>
          {stats.categories.map((cat) => (
            <Card key={cat.key} style={styles.statCard}>
              <Text style={styles.statCount}>{cat.count}</Text>
              <Text style={styles.statLabel}>{cat.label}</Text>
            </Card>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚠️ 提醒</Text>
        {mockReminders.map((r) => (
          <View key={r.id} style={styles.reminder}>
            <Text style={styles.reminderText}>· {r.text}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>💡 时尚灵感</Text>
        {mockFashionTips.map((tip) => (
          <Card key={tip.id} style={styles.tipCard}>
            <Text style={styles.tipTitle}>{tip.title}</Text>
            <Text style={styles.tipDesc}>{tip.desc}</Text>
          </Card>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
    marginTop: spacing.sm,
  },
  greeting: { ...typography.subtitle, color: colors.text },
  weather: { ...typography.caption, color: colors.textSecondary, marginTop: 4 },
  bell: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  section: { marginTop: spacing.lg, gap: spacing.sm },
  sectionTitle: { ...typography.label, color: colors.text },
  statGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  statCard: {
    width: '47%',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  statCount: { ...typography.title, color: colors.primary },
  statLabel: { ...typography.caption, color: colors.textSecondary },
  reminder: {
    backgroundColor: '#FFF8E8',
    padding: spacing.md,
    borderRadius: radius.md,
  },
  reminderText: { ...typography.body, color: colors.text },
  tipCard: { marginBottom: spacing.sm },
  tipTitle: { ...typography.label, color: colors.text },
  tipDesc: { ...typography.caption, color: colors.textSecondary, marginTop: 4 },
});
