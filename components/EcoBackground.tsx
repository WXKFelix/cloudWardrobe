import { StyleSheet, View } from 'react-native';
import { colors } from '@/constants/theme';

/** 环保 × 高科技氛围背景装饰 */
export function EcoBackground() {
  return (
    <View style={styles.container} pointerEvents="none">
      <View style={styles.glowTopRight} />
      <View style={styles.glowMidLeft} />
      <View style={styles.glowBottom} />
      <View style={styles.techLine} />
      <View style={styles.techLine2} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  glowTopRight: {
    position: 'absolute',
    top: -80,
    right: -60,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: colors.techGlow,
  },
  glowMidLeft: {
    position: 'absolute',
    top: '35%',
    left: -100,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(82, 183, 136, 0.12)',
  },
  glowBottom: {
    position: 'absolute',
    bottom: -60,
    right: '20%',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(26, 107, 88, 0.08)',
  },
  techLine: {
    position: 'absolute',
    top: 120,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.techBorder,
    opacity: 0.3,
  },
  techLine2: {
    position: 'absolute',
    top: 124,
    left: '15%',
    width: '40%',
    height: 1,
    backgroundColor: colors.tech,
    opacity: 0.25,
  },
});
