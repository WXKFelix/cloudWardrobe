import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing, typography } from '@/constants/theme';
import { Button } from './Button';

interface ModalSheetProps {
  visible: boolean;
  title: string;
  message?: string;
  primaryAction?: { label: string; onPress: () => void };
  secondaryAction?: { label: string; onPress: () => void };
  onClose?: () => void;
  children?: React.ReactNode;
}

export function ModalSheet({
  visible,
  title,
  message,
  primaryAction,
  secondaryAction,
  onClose,
  children,
}: ModalSheetProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>{title}</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}
          {children}
          <View style={styles.actions}>
            {primaryAction ? (
              <Button title={primaryAction.label} onPress={primaryAction.onPress} style={styles.btn} />
            ) : null}
            {secondaryAction ? (
              <Button
                title={secondaryAction.label}
                onPress={secondaryAction.onPress}
                variant="ghost"
                style={styles.btn}
              />
            ) : null}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 360,
    gap: spacing.md,
  },
  title: { ...typography.title, textAlign: 'center', color: colors.text },
  message: { ...typography.body, textAlign: 'center', color: colors.textSecondary },
  actions: { gap: spacing.sm, marginTop: spacing.sm },
  btn: { width: '100%' },
});
