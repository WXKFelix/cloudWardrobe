/**
 * 云衣柜 · Eco-Tech 设计系统
 * 环保可持续 × 智能云端科技
 */
export const colors = {
  // 环保主色 — 森林青绿
  primary: '#1A6B58',
  primaryLight: '#28A085',
  primaryDark: '#0D3D32',

  // 高科技点缀 — 极光薄荷
  tech: '#00D9B5',
  techSoft: '#7EECD9',
  techGlow: 'rgba(0, 217, 181, 0.18)',
  techBorder: 'rgba(0, 217, 181, 0.4)',

  // 环保语义色
  eco: '#52B788',
  ecoLight: '#D8F3DC',
  ecoMuted: '#E8F5E9',

  // 大地循环色 — 捐赠 / 折旧
  earth: '#A68A64',
  earthLight: '#F5EDE3',

  accent: '#00D9B5',
  accentLight: '#B8FFF0',

  // 背景 — 晨雾绿 + 科技冷白
  background: '#EFF6F3',
  backgroundDeep: '#E0EBE7',
  surface: '#FFFFFF',
  surfaceMuted: '#F4FAF7',
  surfaceGlass: 'rgba(255, 255, 255, 0.9)',

  text: '#0C1F1A',
  textSecondary: '#3D5C54',
  textMuted: '#7A9A92',

  border: '#C8DDD6',
  borderLight: '#E2EEEA',

  success: '#2EAF7D',
  warning: '#E6A817',
  warningBg: '#FFF8ED',
  error: '#D95555',
  overlay: 'rgba(12, 31, 26, 0.52)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const typography = {
  hero: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40 },
  title: { fontSize: 24, fontWeight: '700' as const, lineHeight: 32 },
  subtitle: { fontSize: 18, fontWeight: '600' as const, lineHeight: 26 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  caption: { fontSize: 13, fontWeight: '400' as const, lineHeight: 18 },
  label: { fontSize: 14, fontWeight: '600' as const, lineHeight: 20 },
};

export const shadows = {
  card: {
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  glow: {
    shadowColor: colors.tech,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 4,
  },
};
