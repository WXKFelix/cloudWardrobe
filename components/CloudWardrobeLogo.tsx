import { StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Defs, G, LinearGradient, Path, Stop } from 'react-native-svg';
import { colors } from '@/constants/theme';

interface CloudWardrobeLogoProps {
  /** 图标边长，推荐 56–72（欢迎页），勿超过 88 */
  size?: number;
  style?: ViewStyle;
}

/**
 * 云衣柜品牌标识 — 极简图形标（对标主流 App 欢迎页 icon mark）
 * 云 + 衣架 + T 恤，单一线条体系，无多余装饰
 */
export function CloudWardrobeLogo({ size = 64, style }: CloudWardrobeLogoProps) {
  return (
    <View style={[styles.wrap, { width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 96 96" fill="none">
        <Defs>
          <LinearGradient id="cwMark" x1="20" y1="16" x2="76" y2="80">
            <Stop offset="0%" stopColor={colors.primaryLight} />
            <Stop offset="100%" stopColor={colors.primary} />
          </LinearGradient>
        </Defs>

        <G stroke="url(#cwMark)" strokeLinecap="round" strokeLinejoin="round">
          {/* 衣架 */}
          <Path
            d="M48 22c0-4 3-6 6-4 2 1 3 3 2 5l-1 4"
            strokeWidth="2.8"
            fill="none"
          />
          <Path d="M34 34h28" strokeWidth="2.8" />

          {/* 云朵 */}
          <Path
            d="M30 54c0-10 8-18 18-18 2-8 12-12 20-8 10-2 18 6 18 16 8 2 12 10 10 18-2 10-12 16-22 16H36c-10 0-18-8-16-18 1-4 4-6 10-6z"
            strokeWidth="2.6"
            fill={colors.ecoMuted}
            fillOpacity={0.55}
          />

          {/* T 恤 */}
          <Path
            d="M48 40l10 6 4-3 4 14-6 2v16H40V59l-6-2 4-14 4 3 6-6z"
            strokeWidth="2.4"
            fill={colors.surface}
          />
        </G>
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
