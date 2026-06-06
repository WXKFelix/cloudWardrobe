export const colors = {
  primary: '#2D6A6A',
  primaryLight: '#3D8A8A',
  primaryDark: '#1F4F4F',
  accent: '#E8A87C',
  accentLight: '#F5D0B5',
  background: '#F7F5F2',
  surface: '#FFFFFF',
  surfaceMuted: '#F0EDE8',
  text: '#1A1A1A',
  textSecondary: '#6B6B6B',
  textMuted: '#9A9A9A',
  border: '#E5E0DA',
  success: '#4CAF7D',
  warning: '#E8B44C',
  error: '#E05A5A',
  overlay: 'rgba(0,0,0,0.45)',
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
