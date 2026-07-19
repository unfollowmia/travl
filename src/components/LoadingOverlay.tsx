import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Platform } from 'react-native';
import { Colors, Typography, Spacing } from '../theme';

interface Props {
  visible: boolean;
}

/**
 * Full-screen loading overlay shown while the reservation is being generated.
 * Navy background with animated airplane and pulsing dots.
 */
export function LoadingOverlay({ visible }: Props) {
  const airplaneAnim = useRef(new Animated.Value(0)).current;
  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Airplane subtle float animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(airplaneAnim, {
            toValue: 1,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(airplaneAnim, {
            toValue: 0,
            duration: 1200,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ).start();

      // Progress dots
      const dotPulse = (anim: Animated.Value, delay: number) =>
        Animated.loop(
          Animated.sequence([
            Animated.delay(delay),
            Animated.timing(anim, {
              toValue: 1,
              duration: 600,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: 600,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
        );

      const loop1 = dotPulse(dot1Anim, 0);
      const loop2 = dotPulse(dot2Anim, 200);
      const loop3 = dotPulse(dot3Anim, 400);
      loop1.start();
      loop2.start();
      loop3.start();

      return () => {
        loop1.stop();
        loop2.stop();
        loop3.stop();
      };
    }
    airplaneAnim.setValue(0);
    dot1Anim.setValue(0);
    dot2Anim.setValue(0);
    dot3Anim.setValue(0);
  }, [visible]);

  if (!visible) return null;

  const airplaneTranslateY = airplaneAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -16],
  });

  const dotOpacity = (anim: Animated.Value) =>
    anim.interpolate({
      inputRange: [0, 0.5, 1],
      outputRange: [0.3, 1, 0.3],
    });

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Airplane icon */}
        <Animated.Text
          style={[styles.airplane, { transform: [{ translateY: airplaneTranslateY }] }]}
        >
          ✈
        </Animated.Text>

        {/* Title */}
        <Text style={styles.title}>Generating your reservation…</Text>

        {/* Progress dots */}
        <View style={styles.dotsRow}>
          <Animated.View style={[styles.dot, { opacity: dotOpacity(dot1Anim) }]} />
          <Animated.View style={[styles.dot, { opacity: dotOpacity(dot2Anim) }]} />
          <Animated.View style={[styles.dot, { opacity: dotOpacity(dot3Anim) }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    backgroundColor: Colors.navy,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 100,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: Spacing.xxxxl,
  },
  airplane: {
    fontSize: 56,
    marginBottom: Spacing.xxxl,
  },
  title: {
    ...Typography.title2,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.gold,
  },
});
