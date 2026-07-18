/**
 * travl Design System — Typography
 *
 * Uses SF Pro via the system font (iOS default).
 * Sizes follow Apple's Human Interface Guidelines typographic scale.
 */

import { TextStyle } from 'react-native';

const font = {
  regular: { fontFamily: undefined as string | undefined, fontWeight: '400' as TextStyle['fontWeight'] },
  medium: { fontFamily: undefined as string | undefined, fontWeight: '500' as TextStyle['fontWeight'] },
  semibold: { fontFamily: undefined as string | undefined, fontWeight: '600' as TextStyle['fontWeight'] },
  bold: { fontFamily: undefined as string | undefined, fontWeight: '700' as TextStyle['fontWeight'] },
  heavy: { fontFamily: undefined as string | undefined, fontWeight: '800' as TextStyle['fontWeight'] },
};

export const Typography = {
  // Display
  largeTitle: {
    fontSize: 34,
    lineHeight: 41,
    letterSpacing: 0.37,
    ...font.bold,
  },
  title1: {
    fontSize: 28,
    lineHeight: 34,
    letterSpacing: 0.36,
    ...font.bold,
  },
  title2: {
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: 0.35,
    ...font.semibold,
  },
  title3: {
    fontSize: 20,
    lineHeight: 25,
    letterSpacing: 0.38,
    ...font.semibold,
  },

  // Body
  body: {
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    ...font.regular,
  },
  bodySemibold: {
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    ...font.semibold,
  },
  callout: {
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: -0.32,
    ...font.regular,
  },
  calloutSemibold: {
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: -0.32,
    ...font.semibold,
  },

  // Captions
  subhead: {
    fontSize: 15,
    lineHeight: 20,
    letterSpacing: -0.24,
    ...font.regular,
  },
  footnote: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    ...font.regular,
  },
  footnoteSemibold: {
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: -0.08,
    ...font.semibold,
  },
  caption1: {
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0,
    ...font.regular,
  },
  caption2: {
    fontSize: 11,
    lineHeight: 13,
    letterSpacing: 0.07,
    ...font.regular,
  },

  // Special
  button: {
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.41,
    ...font.semibold,
  },
  pnr: {
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: 4,
    ...font.heavy,
  },
} as const;

export type TypographyKey = keyof typeof Typography;
