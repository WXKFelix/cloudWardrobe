import { Image, StyleSheet, Text, View } from 'react-native';
import { ClothingItem } from '@/constants/mockData';
import { colors, radius, spacing, typography } from '@/constants/theme';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface OutfitCardProps {
  title: string;
  description: string;
  items: ClothingItem[];
  canRefresh: boolean;
  onPreview?: () => void;
  onAdd: () => void;
  confirmed?: boolean;
  onConfirm: () => void;
  onRefresh: () => void;
}

export function OutfitCard({
  title,
  description,
  items,
  canRefresh,
  onPreview,
  onAdd,
  confirmed,
  onConfirm,
  onRefresh,
}: OutfitCardProps) {
  return (
    <Card glow style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {items.length ? (
        <View style={styles.emojiRow}>
          {items.map((item) => (
            <View key={item.id} style={styles.emojiBox}>
              {item.imageUri ? (
                <Image source={{ uri: item.imageUri }} style={styles.photo} resizeMode="contain" />
              ) : (
                <Text style={styles.emoji}>{item.emoji}</Text>
              )}
              <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
            </View>
          ))}
        </View>
      ) : null}
      <Text style={styles.desc}>{description}</Text>
      {items.length ? (
        <>
          <View style={styles.actions}>
            <Button
              title={confirmed ? '已打卡 ✓' : '穿上这套'}
              onPress={onConfirm}
              disabled={confirmed}
              style={styles.confirmBtn}
            />
            <Button title="换一套 ↻" onPress={onRefresh} disabled={!canRefresh} variant="outline" style={styles.refreshBtn} />
          </View>
          {onPreview ? (
            <Button title="上身预览 · 单件上衣" onPress={onPreview} variant="outline" />
          ) : (
            <Text style={styles.itemName}>搭配中有带照片的上衣时可预览上身效果。</Text>
          )}
        </>
      ) : (
        <Button title="录入衣物" onPress={onAdd} />
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: spacing.md, paddingVertical: spacing.lg },
  title: { ...typography.subtitle, color: colors.text, fontSize: 20 },
  emojiRow: { flexDirection: 'row', gap: spacing.sm },
  emojiBox: {
    flex: 1,
    backgroundColor: colors.surfaceMuted,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  emoji: { fontSize: 32 },
  photo: { width: '100%', height: 48 },
  itemName: { ...typography.caption, color: colors.textSecondary, textAlign: 'center' },
  desc: { ...typography.body, color: colors.textSecondary },
  actions: { flexDirection: 'row', gap: spacing.sm },
  confirmBtn: { flex: 1.2 },
  refreshBtn: { flex: 1 },
});
