import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '@/constants/theme';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface OutfitCardProps {
  title: string;
  description: string;
  emojis: string[];
  items: string[];
  confirmed?: boolean;
  onConfirm: () => void;
  onRefresh: () => void;
}

export function OutfitCard({
  title,
  description,
  emojis,
  items,
  confirmed,
  onConfirm,
  onRefresh,
}: OutfitCardProps) {
  return (
    <Card glow style={styles.card}>
      <Text style={styles.badge}>✨ AI 今日穿搭</Text>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.emojiRow}>
        {emojis.map((emoji, i) => (
          <View key={`${items[i]}-${emoji}`} style={styles.emojiBox}>
            <Text style={styles.emoji}>{emoji}</Text>
            <Text style={styles.itemName} numberOfLines={1}>
              {items[i]}
            </Text>
          </View>
        ))}
      </View>
      <Text style={styles.desc}>{description}</Text>
      <View style={styles.actions}>
        <Button
          title={confirmed ? '已打卡 ✓' : '穿上这套'}
          onPress={onConfirm}
          disabled={confirmed}
          style={styles.confirmBtn}
        />
        <Button title="换一套 ↻" onPress={onRefresh} variant="outline" style={styles.refreshBtn} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md },
  badge: {
    ...typography.caption,
    color: colors.primaryDark,
    backgroundColor: colors.techGlow,
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: radius.full,
    overflow: 'hidden',
  },
  title: { ...typography.subtitle, color: colors.text },
  emojiRow: { flexDirection: 'row', gap: spacing.sm },
  emojiBox: {
    flex: 1,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    padding: spacing.sm,
    alignItems: 'center',
    gap: 4,
  },
  emoji: { fontSize: 32 },
  itemName: { ...typography.caption, color: colors.textSecondary, textAlign: 'center' },
  desc: { ...typography.body, color: colors.textSecondary },
  actions: { flexDirection: 'row', gap: spacing.sm },
  confirmBtn: { flex: 1.2 },
  refreshBtn: { flex: 1 },
});
