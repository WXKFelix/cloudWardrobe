import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import Svg, {
  Circle,
  Defs,
  G,
  LinearGradient,
  Path,
  Stop,
} from 'react-native-svg';
import { colors, shadows, typography } from '@/constants/theme';

interface CloudWardrobeLogoProps {
  size?: number;
  style?: ViewStyle;
  showWordmark?: boolean;
}

/** 云衣柜品牌 Logo — 云 + 衣架 + T 恤，Eco-Tech 渐变与科技光晕 */
export function CloudWardrobeLogo({
  size = 168,
  style,
  showWordmark = true,
}: CloudWardrobeLogoProps) {
  const iconSize = size * 0.72;

  return (
    <View style={[styles.wrap, style]}>
      <View style={[styles.glow, { width: iconSize, height: iconSize * 0.85 }]} />
      <View
        style={[
          styles.ring,
          {
            width: iconSize * 1.08,
            height: iconSize * 1.08,
            borderRadius: iconSize * 0.54,
          },
        ]}
      />

      <Svg width={iconSize} height={iconSize} viewBox="0 0 200 200">
        <Defs>
          <LinearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={colors.tech} />
            <Stop offset="50%" stopColor={colors.primaryLight} />
            <Stop offset="100%" stopColor={colors.primary} />
          </LinearGradient>
          <LinearGradient id="cloudFill" x1="50%" y1="0%" x2="50%" y2="100%">
            <Stop offset="0%" stopColor={colors.techSoft} stopOpacity="0.45" />
            <Stop offset="100%" stopColor={colors.primary} stopOpacity="0.12" />
          </LinearGradient>
        </Defs>

        <Circle
          cx="100"
          cy="96"
          r="82"
          stroke={colors.tech}
          strokeWidth="1.2"
          strokeOpacity="0.28"
          strokeDasharray="5 7"
          fill="none"
        />
        <Circle cx="100" cy="14" r="3.5" fill={colors.tech} opacity={0.85} />
        <Circle cx="182" cy="96" r="3" fill={colors.techSoft} opacity={0.75} />
        <Circle cx="100" cy="178" r="3" fill={colors.primaryLight} opacity={0.65} />
        <Circle cx="18" cy="96" r="3" fill={colors.eco} opacity={0.65} />

        <G>
          <Path
            d="M100 30 C100 20 109 15 114 22 C118 28 111 34 105 36 L105 44"
            stroke="url(#logoGrad)"
            strokeWidth="4.5"
            strokeLinecap="round"
            fill="none"
          />
          <Path
            d="M70 50 H130"
            stroke="url(#logoGrad)"
            strokeWidth="4.5"
            strokeLinecap="round"
          />

          <Path
            d="M48 100 C48 78 66 62 88 62 C94 46 114 40 132 50 C154 44 174 60 176 82 C192 86 200 102 196 120 C192 138 174 150 154 150 H54 C36 150 22 134 24 116 C26 102 34 96 48 100 Z"
            stroke="url(#logoGrad)"
            strokeWidth="5.5"
            strokeLinejoin="round"
            fill="url(#cloudFill)"
          />

          <Path
            d="M64 122 C76 110 92 106 110 112 C122 100 144 104 154 120"
            stroke={colors.techSoft}
            strokeWidth="2"
            strokeLinecap="round"
            opacity={0.6}
            fill="none"
          />

          <Path
            d="M100 80 L120 92 L128 87 L134 114 L125 118 L125 146 H75 L75 118 L66 114 L72 87 L80 92 Z"
            stroke="url(#logoGrad)"
            strokeWidth="5"
            strokeLinejoin="round"
            fill={colors.surface}
            fillOpacity={0.9}
          />
          <Path
            d="M100 92 V146"
            stroke={colors.primaryLight}
            strokeWidth="2"
            strokeLinecap="round"
            opacity={0.4}
          />

          <Circle cx="54" cy="122" r="2.5" fill={colors.tech} />
          <Circle cx="146" cy="122" r="2.5" fill={colors.tech} />
          <Circle cx="100" cy="150" r="2.5" fill={colors.tech} />
        </G>
      </Svg>

      {showWordmark ? (
        <View style={styles.wordmark}>
          <Text style={[styles.cloudText, { fontSize: size * 0.14 }]}>CLOUD</Text>
          <Text style={[styles.wardrobeText, { fontSize: size * 0.065 }]}>WARDROBE</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    top: 0,
    borderRadius: 999,
    backgroundColor: colors.techGlow,
  },
  ring: {
    position: 'absolute',
    top: -4,
    borderWidth: 1.5,
    borderColor: colors.techBorder,
    opacity: 0.5,
    ...shadows.glow,
  },
  wordmark: {
    alignItems: 'center',
    marginTop: 4,
    gap: 2,
  },
  cloudText: {
    fontWeight: '800',
    letterSpacing: 6,
    color: colors.primary,
    textShadowColor: colors.techGlow,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  wardrobeText: {
    ...typography.caption,
    fontWeight: '500',
    letterSpacing: 8,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
});
