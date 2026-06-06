import { StyleSheet, View, ViewStyle } from 'react-native';
import Svg, { Defs, G, LinearGradient, Path, Stop } from 'react-native-svg';
import { colors } from '@/constants/theme';

interface CloudWardrobeLogoProps {
  /** 图标边长，推荐 56–72（欢迎页），勿超过 88 */
  size?: number;
  style?: ViewStyle;
}

/** 云衣柜品牌标识 — 图形在 viewBox 内几何居中 */
export function CloudWardrobeLogo({ size = 64, style }: CloudWardrobeLogoProps) {
  return (
    <View style={[styles.wrap, { width: size, height: size }, style]}>
      <Svg
        width={size}
        height={size}
        viewBox="0 0 96 96"
        fill="none"
        style={styles.svg}
      >
        <Defs>
          <LinearGradient id="cwMark" x1="24" y1="18" x2="72" y2="78">
            <Stop offset="0%" stopColor={colors.primaryLight} />
            <Stop offset="100%" stopColor={colors.primary} />
          </LinearGradient>
        </Defs>

        <G stroke="url(#cwMark)" strokeLinecap="round" strokeLinejoin="round">
          {/* 衣架 — 以 x=48 为轴对称 */}
          <Path
            d="M48 18 C48 12 54 12 54 18 L54 22"
            strokeWidth="2.6"
            fill="none"
          />
          <Path d="M36 30 H60" strokeWidth="2.6" />

          {/* 云朵 — 左右对称 */}
          <Path
            d="M26 58
               C26 44 38 34 48 34
               C58 34 70 44 70 58
               C78 58 82 66 78 74
               C74 82 62 86 48 86
               C34 86 22 82 18 74
               C14 66 18 58 26 58 Z"
            strokeWidth="2.5"
            fill={colors.ecoMuted}
            fillOpacity={0.55}
          />

          {/* T 恤 — 居中 */}
          <Path
            d="M48 38 L56 42 L60 40 L64 56 L56 58 L56 72 H40 L40 58 L32 56 L36 40 L40 42 Z"
            strokeWidth="2.3"
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
    alignSelf: 'center',
  },
  svg: {
    display: 'flex',
  },
});
