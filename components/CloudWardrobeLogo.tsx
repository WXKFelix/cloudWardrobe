import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Stop,
} from 'react-native-svg';
import { colors, typography } from '@/constants/theme';

interface CloudWardrobeLogoProps {
  size?: number;
  style?: ViewStyle;
  showWordmark?: boolean;
}

const ICON_VIEW = 200;

/** 云衣柜品牌 Logo — 云 + 衣架 + T 恤，Eco-Tech 精致版 */
export function CloudWardrobeLogo({
  size = 180,
  style,
  showWordmark = true,
}: CloudWardrobeLogoProps) {
  const iconSize = size * 0.78;
  const gradId = 'cwLogoGrad';
  const fillId = 'cwCloudFill';
  const glowId = 'cwAmbient';

  return (
    <View style={[styles.wrap, style]}>
      <Svg width={iconSize} height={iconSize} viewBox={`0 0 ${ICON_VIEW} ${ICON_VIEW}`}>
        <Defs>
          <LinearGradient id={gradId} x1="18%" y1="8%" x2="82%" y2="92%">
            <Stop offset="0%" stopColor={colors.tech} />
            <Stop offset="45%" stopColor={colors.primaryLight} />
            <Stop offset="100%" stopColor={colors.primaryDark} />
          </LinearGradient>
          <LinearGradient id={fillId} x1="50%" y1="18%" x2="50%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
            <Stop offset="55%" stopColor={colors.techSoft} stopOpacity="0.35" />
            <Stop offset="100%" stopColor={colors.primary} stopOpacity="0.08" />
          </LinearGradient>
          <RadialGradient id={glowId} cx="50%" cy="42%" r="52%">
            <Stop offset="0%" stopColor={colors.tech} stopOpacity="0.22" />
            <Stop offset="70%" stopColor={colors.tech} stopOpacity="0.04" />
            <Stop offset="100%" stopColor={colors.tech} stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* 环境光晕 */}
        <Circle cx="100" cy="92" r="78" fill={`url(#${glowId})`} />

        {/* 外环 — 轻科技轨道 */}
        <Circle
          cx="100"
          cy="92"
          r="72"
          stroke={colors.tech}
          strokeWidth="1"
          strokeOpacity="0.18"
          strokeDasharray="3 9"
          fill="none"
        />
        <Circle
          cx="100"
          cy="92"
          r="66"
          stroke={colors.primaryLight}
          strokeWidth="0.8"
          strokeOpacity="0.12"
          fill="none"
        />

        <G>
          {/* 衣架挂钩 */}
          <Path
            d="M100 34 C100 26 106 22 110 26 C114 30 110 36 106 37 L106 44"
            stroke={`url(#${gradId})`}
            strokeWidth="3.8"
            strokeLinecap="round"
            fill="none"
          />
          <Path
            d="M74 48 H126"
            stroke={`url(#${gradId})`}
            strokeWidth="3.8"
            strokeLinecap="round"
          />

          {/* 云朵主体 */}
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
            stroke={`url(#${gradId})`}
            strokeWidth="4.8"
            strokeLinejoin="round"
            fill={`url(#${fillId})`}
          />

          {/* 云内柔光 */}
          <Path
            d="M72 118 C84 108 100 104 118 110 C130 100 148 104 156 118"
            stroke="#FFFFFF"
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity={0.55}
            fill="none"
          />

          {/* T 恤 — 更匀称的轮廓 */}
          <Path
            d="M100 82
               L116 90 L122 86 L128 108
               L120 112 L120 138 H80 L80 112 L72 108 L78 86 L84 90 Z"
            stroke={`url(#${gradId})`}
            strokeWidth="4.2"
            strokeLinejoin="round"
            fill="#FFFFFF"
            fillOpacity={0.92}
          />
          {/* 领口 */}
          <Path
            d="M92 90 L100 96 L108 90"
            stroke={colors.primaryLight}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity={0.55}
          />
          {/* 中线微褶 */}
          <Path
            d="M100 98 V136"
            stroke={colors.ecoMuted}
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity={0.5}
          />

          {/* 节点点缀 */}
          <Circle cx="100" cy="24" r="2.8" fill={colors.tech} opacity={0.75} />
          <Circle cx="164" cy="92" r="2.2" fill={colors.techSoft} opacity={0.6} />
          <Circle cx="36" cy="92" r="2.2" fill={colors.eco} opacity={0.55} />
        </G>
      </Svg>

      {showWordmark ? (
        <View style={styles.wordmark}>
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <View style={styles.dividerDot} />
            <View style={styles.dividerLine} />
          </View>
          <Text style={[styles.cloudText, { fontSize: size * 0.13 }]}>CLOUD</Text>
          <Text style={[styles.wardrobeText, { fontSize: size * 0.058 }]}>WARDROBE</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  wordmark: {
    alignItems: 'center',
    marginTop: 6,
    gap: 3,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
    width: 120,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.techBorder,
    opacity: 0.55,
  },
  dividerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.tech,
    opacity: 0.7,
  },
  cloudText: {
    fontWeight: '800',
    letterSpacing: 5,
    color: colors.primaryDark,
  },
  wardrobeText: {
    ...typography.caption,
    fontWeight: '600',
    letterSpacing: 6,
    color: colors.textMuted,
    textTransform: 'uppercase',
    marginTop: 1,
  },
});
