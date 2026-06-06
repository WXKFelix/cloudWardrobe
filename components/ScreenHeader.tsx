import { StyleSheet, Text, View } from 'react-native';
import { BackButton } from '@/components/BackButton';
import { colors, spacing, typography } from '@/constants/theme';

interface ScreenHeaderProps {
  title: string;
  onBack?: () => void;
  showBack?: boolean;
}

export function ScreenHeader({ title, onBack, showBack = true }: ScreenHeaderProps) {
  return (
    <View style={styles.header}>
      {showBack ? <BackButton onPress={onBack} style={styles.backBtnSpacing} /> : null}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { marginBottom: spacing.lg, marginTop: spacing.sm },
  backBtnSpacing: { marginBottom: spacing.md },
  title: { ...typography.title, color: colors.text },
});
