import { ScrollView, StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EcoBackground } from '@/components/EcoBackground';
import { colors, spacing } from '@/constants/theme';

interface ScreenContainerProps {
  children: React.ReactNode;
  scroll?: boolean;
  style?: ViewStyle;
  padded?: boolean;
}

export function ScreenContainer({
  children,
  scroll = true,
  style,
  padded = true,
}: ScreenContainerProps) {
  const content = (
    <View style={[padded && styles.padded, style]}>{children}</View>
  );

  const body = scroll ? (
    <ScrollView
      contentContainerStyle={[styles.scroll, padded && styles.padded, style]}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    content
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <EcoBackground />
      {body}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, paddingBottom: spacing.xxl },
  padded: { paddingHorizontal: spacing.md },
});
