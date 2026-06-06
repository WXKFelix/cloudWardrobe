import { StyleSheet, Text, View } from 'react-native';
import { ScreenContainer } from '@/components/ScreenContainer';
import { Card } from '@/components/ui/Card';
import { colors, spacing, typography } from '@/constants/theme';
import { useAppStore } from '@/store/useAppStore';

export default function RecordsScreen() {
  const outfitDays = useAppStore((s) => s.outfitDays);
  const clothing = useAppStore((s) => s.clothing);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const topWorn = [...clothing].sort((a, b) => b.wearCount - a.wearCount).slice(0, 3);
  const idle = clothing.filter((c) => c.lastWornDaysAgo >= 30);

  return (
    <ScreenContainer>
      <Text style={styles.title}>穿搭记录</Text>
      <Text style={styles.subtitle}>
        {year} 年 {month + 1} 月
      </Text>

      <Card style={styles.calendar}>
        <View style={styles.weekRow}>
          {['日', '一', '二', '三', '四', '五', '六'].map((d) => (
            <Text key={d} style={styles.weekDay}>
              {d}
            </Text>
          ))}
        </View>
        <View style={styles.daysGrid}>
          {Array.from({ length: firstDay }).map((_, i) => (
            <View key={`empty-${i}`} style={styles.dayCell} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const checked = outfitDays.includes(day);
            const isToday = day === today.getDate();
            return (
              <View
                key={day}
                style={[styles.dayCell, isToday && styles.todayCell, checked && styles.checkedCell]}
              >
                <Text style={[styles.dayText, checked && styles.checkedText]}>{day}</Text>
                {checked ? <Text style={styles.checkMark}>✓</Text> : null}
              </View>
            );
          })}
        </View>
      </Card>

      <View style={styles.statsRow}>
        <Card style={styles.statBox}>
          <Text style={styles.statNum}>{outfitDays.length}</Text>
          <Text style={styles.statLabel}>本月穿搭</Text>
        </Card>
        <Card style={styles.statBox}>
          <Text style={styles.statNum}>{clothing.length}</Text>
          <Text style={styles.statLabel}>衣橱总数</Text>
        </Card>
      </View>

      <Text style={styles.sectionTitle}>最常穿 TOP 3</Text>
      {topWorn.map((item, i) => (
        <View key={item.id} style={styles.rankRow}>
          <Text style={styles.rank}>{i + 1}</Text>
          <Text style={styles.rankEmoji}>{item.emoji}</Text>
          <Text style={styles.rankName}>{item.name}</Text>
          <Text style={styles.rankCount}>{item.wearCount} 次</Text>
        </View>
      ))}

      {idle.length > 0 ? (
        <>
          <Text style={[styles.sectionTitle, { marginTop: spacing.lg }]}>闲置提醒</Text>
          {idle.map((item) => (
            <View key={item.id} style={styles.idleRow}>
              <Text style={styles.idleText}>
                {item.emoji} {item.name} — {item.lastWornDaysAgo} 天未穿
              </Text>
            </View>
          ))}
        </>
      ) : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: { ...typography.title, color: colors.text, marginTop: spacing.sm },
  subtitle: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.lg },
  calendar: { marginBottom: spacing.md },
  weekRow: { flexDirection: 'row', marginBottom: spacing.sm },
  weekDay: { flex: 1, textAlign: 'center', ...typography.caption, color: colors.textMuted },
  daysGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  todayCell: { backgroundColor: colors.ecoMuted, borderRadius: 8 },
  checkedCell: {},
  dayText: { ...typography.caption, color: colors.text },
  checkedText: { color: colors.primary, fontWeight: '700' },
  checkMark: { position: 'absolute', bottom: 2, fontSize: 8, color: colors.success },
  statsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.lg },
  statBox: { flex: 1, alignItems: 'center' },
  statNum: { ...typography.title, color: colors.primary },
  statLabel: { ...typography.caption, color: colors.textSecondary },
  sectionTitle: { ...typography.label, color: colors.text, marginBottom: spacing.sm },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  rank: { ...typography.label, color: colors.primary, width: 20 },
  rankEmoji: { fontSize: 20 },
  rankName: { ...typography.body, color: colors.text, flex: 1 },
  rankCount: { ...typography.caption, color: colors.textSecondary },
  idleRow: {
    backgroundColor: colors.warningBg,
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.sm,
  },
  idleText: { ...typography.body, color: colors.text },
});
