export const colors = {
  // Base Palette
  brandNavy: '#0A1931',
  brandGold: '#FFB800',
  
  // Backgrounds & Surfaces
  background: '#FFFFFF',
  surfaceLight: '#F7F9FC',
  
  // The Glassy UI Overlay
  glassTint: 'rgba(10, 25, 49, 0.04)',
  glassOutline: 'rgba(10, 25, 49, 0.1)',
  
  // Status Indicators
  status: {
    active: { bg: '#E4F7EC', text: '#1E9E5A', dot: '#10B981' },
    lost: { bg: '#FDECEA', text: '#D32F2F', dot: '#EF4444' },
    unlinked: { bg: '#EEF1F6', text: '#8A94A6', dot: '#A0B3D6' },
    dnd: { bg: '#FDF3DC', text: '#B8860B', dot: '#F59E0B' },
  },
  
  // Typography
  textPrimary: '#0A1931',
  textSecondary: '#8A94A6',
};

export const typography = {
  h1: {
    fontSize: 26,
    fontWeight: 'bold',
    letterSpacing: -0.5,
    color: colors.textPrimary,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  body: {
    fontSize: 14,
    color: colors.textSecondary,
  }
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
};

export const shadows = {
  floatingCard: {
    shadowColor: colors.brandNavy,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 14,
    elevation: 4,
  },
  subtle: {
    shadowColor: colors.brandNavy,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  }
};



// Derives an rgba() string from any hex color at a given opacity — use this
// instead of hardcoding rgba(10, 25, 49, 0.x) style magic numbers whenever a
// screen needs a translucent version of a brand color (e.g. camera overlay
// scrims, glass effects).
export function hexToRgba(hex, alpha) {
  const parsed = hex.replace('#', '');
  const bigint = parseInt(parsed, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
 

