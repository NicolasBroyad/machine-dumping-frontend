// Sistema de Diseño - Machine Dumping App

export const Colors = {
  // Colores principales
  primary: '#6C63FF',      // Púrpura vibrante
  primaryDark: '#5548E0',
  primaryLight: '#8B85FF',
  
  secondary: '#FF6584',    // Rosa coral
  secondaryDark: '#E84A6D',
  secondaryLight: '#FF8BA0',
  
  accent: '#00D9C0',       // Turquesa
  accentDark: '#00C0AA',
  
  // Backgrounds
  background: '#0F0F1E',   // Azul oscuro muy oscuro
  backgroundLight: '#1A1A2E', // Azul oscuro
  backgroundCard: '#252541', // Azul oscuro medio
  
  // Superficies
  surface: '#2A2A42',
  surfaceLight: '#353552',
  
  // Textos
  textPrimary: '#FFFFFF',
  textSecondary: '#B8B8D1',
  textTertiary: '#8B8BA7',
  
  // Estados
  success: '#00E676',
  successDark: '#00C853',
  error: '#FF5252',
  errorDark: '#D32F2F',
  warning: '#FFB800',
  info: '#00B8D4',
  
  // Neutros
  white: '#FFFFFF',
  black: '#000000',
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  
  // Gradientes
  gradients: {
    primary: ['#6C63FF', '#5548E0'],
    secondary: ['#FF6584', '#E84A6D'],
    accent: ['#00D9C0', '#00C0AA'],
    purple: ['#A855F7', '#6C63FF'],
    sunset: ['#FF6584', '#FFB800'],
    ocean: ['#00D9C0', '#6C63FF'],
    dark: ['#1A1A2E', '#0F0F1E'],
  }
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const Typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyBold: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: {
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
};
