import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, typography } from '@/constants/theme';

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
}

export function ScreenHeader({ title, onBack }: ScreenHeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <Pressable onPress={onBack ?? (() => router.back())} style={styles.backBtn} hitSlop={8}>
        <Text style={styles.backText}>← 返回</Text>
      </Pressable>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: spacing.lg, marginTop: spacing.sm },
  backBtn: { alignSelf: 'flex-start', marginBottom: spacing.sm },
  backText: { ...typography.body, color: colors.primary },
  title: { ...typography.title, color: colors.text },
});
