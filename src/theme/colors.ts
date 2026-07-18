/**
 * travl Design System — Colors
 *
 * Premium palette inspired by luxury travel and Apple design.
 * Deep navy primary, airline gold accent, iOS-style grays.
 */

export const Colors = {
  // Primary
  navy: '#0A1628',
  navyLight: '#152238',
  navyDark: '#060F1E',

  // Accent
  gold: '#F5A623',
  goldLight: '#F7C15E',
  goldDark: '#D4941A',

  // Neutrals
  white: '#FFFFFF',
  background: '#F5F5F7',
  card: '#FFFFFF',
  border: '#E5E5EA',
  separator: '#E5E5EA',
  overlay: 'rgba(10, 22, 40, 0.7)',

  // Text
  textPrimary: '#0A1628',
  textSecondary: '#3C3C43',
  textTertiary: '#8E8E93',
  textInverse: '#FFFFFF',
  textLink: '#007AFF',

  // Semantic
  success: '#34C759',
  warning: '#FF9500',
  error: '#FF3B30',
  info: '#007AFF',

  // iOS System
  systemGray: '#8E8E93',
  systemGray2: '#AEAEB2',
  systemGray3: '#C7C7CC',
  systemGray4: '#D1D1D6',
  systemGray5: '#E5E5EA',
  systemGray6: '#F2F2F7',

  // Tab bar
  tabBarBackground: 'rgba(255, 255, 255, 0.92)',
  tabBarBorder: 'rgba(0, 0, 0, 0.08)',
} as const;

export type ColorKey = keyof typeof Colors;
