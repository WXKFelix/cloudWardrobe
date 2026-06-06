import { Image, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { CloudWardrobeLogo } from '@/components/CloudWardrobeLogo';
import { brand } from '@/constants/brand';
import { colors, radius, spacing, typography } from '@/constants/theme';

export type BrandMarkVariant = 'image' | 'lockup' | 'icon';

interface BrandMarkProps {
  /**
   * image — 位图 Logo（推荐，最接近设计稿）
   * lockup — 纯文字标识（无图形，最稳）
   * icon   — SVG 矢量（备用）
   */
  variant?: BrandMarkVariant;
  size?: number;
  showFrame?: boolean;
  style?: ViewStyle;
}

export function BrandMark({
  variant = 'image',
  size = 72,
  showFrame = false,
  style,
}: BrandMarkProps) {
  if (variant === 'lockup') {
    return (
      <View style={[styles.lockup, style]}>
        <View style={styles.lockupRule}>
          <View style={styles.lockupLine} />
          <View style={styles.lockupDot} />
          <View style={styles.lockupLine} />
        </View>
        <Text style={styles.lockupName}>
          <Text style={styles.lockupAccent}>云</Text>
          <Text style={styles.lockupRest}>衣柜</Text>
        </Text>
        <Text style={styles.lockupEn}>{brand.nameEn}</Text>
      </View>
    );
  }

  const mark =
    variant === 'image' ? (
      <Image
        source={require('@/assets/logo-mark.png')}
        style={[styles.logoImage, { width: size, height: size }]}
        resizeMode="contain"
        accessibilityLabel="云衣柜"
      />
    ) : (
      <CloudWardrobeLogo size={size * 0.85} />
    );

  if (!showFrame) {
    return <View style={[styles.plain, style]}>{mark}</View>;
  }

  return (
    <View style={[styles.frame, { width: size + 24, height: size + 24 }, style]}>
      {mark}
    </View>
  );
}

const styles = StyleSheet.create({
  plain: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  logoImage: {
    backgroundColor: 'transparent',
  },
  frame: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: radius.xl,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    marginBottom: spacing.xs,
  },
  lockup: {
    alignItems: 'center',
    alignSelf: 'center',
    gap: 6,
    paddingVertical: spacing.sm,
  },
  lockupRule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: 100,
    marginBottom: 4,
  },
  lockupLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.techBorder,
    opacity: 0.6,
  },
  lockupDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.tech,
  },
  lockupName: {
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 44,
    letterSpacing: 2,
  },
  lockupAccent: {
    color: colors.primary,
  },
  lockupRest: {
    color: colors.text,
  },
  lockupEn: {
    ...typography.caption,
    fontSize: 11,
    letterSpacing: 3,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
});
