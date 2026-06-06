import { StyleSheet, View, ViewStyle } from 'react-native';
import Svg, {
  Defs,
  G,
  LinearGradient,
  Path,
  Stop,
} from 'react-native-svg';
import { colors } from '@/constants/theme';

interface CloudWardrobeLogoProps {
  size?: number;
  style?: ViewStyle;
}

/**
 * 云衣柜品牌标识 — 还原原版构图：云轮廓 + 顶部衣架钩 + 内嵌 T 恤
 */
export function CloudWardrobeLogo({ size = 64, style }: CloudWardrobeLogoProps) {
  return (
    <View style={[styles.wrap, { width: size, height: size }, style]}>
      <Svg
        width={size}
        height={size}
        viewBox="28 14 144 136"
        fill="none"
        style={styles.svg}
      >
        <Defs>
          <LinearGradient id="cwLogoGrad" x1="18%" y1="8%" x2="82%" y2="92%">
            <Stop offset="0%" stopColor={colors.tech} />
            <Stop offset="45%" stopColor={colors.primaryLight} />
            <Stop offset="100%" stopColor={colors.primary} />
          </LinearGradient>
          <LinearGradient id="cwCloudFill" x1="50%" y1="18%" x2="50%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.92" />
            <Stop offset="55%" stopColor={colors.techSoft} stopOpacity="0.28" />
            <Stop offset="100%" stopColor={colors.primary} stopOpacity="0.1" />
          </LinearGradient>
        </Defs>

        <G strokeLinecap="round" strokeLinejoin="round">
          {/* 衣架挂钩 + 横杆 */}
          <Path
            d="M100 34 C100 26 106 22 110 26 C114 30 110 36 106 37 L106 44"
            stroke="url(#cwLogoGrad)"
            strokeWidth="4"
            fill="none"
          />
          <Path
            d="M74 48 H126"
            stroke="url(#cwLogoGrad)"
            strokeWidth="4"
          />

          {/* 云朵外轮廓 — 原版蓬松比例 */}
          <Path
            d="M56 104
               C56 84 72 70 92 70
               C96 56 114 50 130 58
               C148 52 166 66 168 84
               C182 88 188 100 184 114
               C180 130 164 142 146 142
               H66
               C50 142 38 128 40 112
               C42 100 48 104 56 104 Z"
            stroke="url(#cwLogoGrad)"
            strokeWidth="5"
            fill="url(#cwCloudFill)"
          />

          {/* T 恤剪影 */}
          <Path
            d="M100 82
               L116 90 L122 86 L128 108
               L120 112 L120 138 H80 L80 112 L72 108 L78 86 L84 90 Z"
            stroke="url(#cwLogoGrad)"
            strokeWidth="4.2"
            fill={colors.surface}
            fillOpacity={0.95}
          />
          <Path
            d="M92 90 L100 96 L108 90"
            stroke={colors.primaryLight}
            strokeWidth="2"
            fill="none"
            opacity={0.5}
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
