import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../theme';

const { height } = Dimensions.get('window');

type SheetPhase = 'idle' | 'processing' | 'success' | 'failed';

interface Props {
  visible: boolean;
  amount: number;
  currency?: string;
  merchantName?: string;
  cardLast4?: string;
  onConfirm: () => Promise<void>;
  onDismiss: () => void;
}

export function ApplePaySheet({
  visible,
  amount,
  currency = 'USD',
  merchantName = 'travl',
  cardLast4 = '•••• 1234',
  onConfirm,
  onDismiss,
}: Props) {
  const [phase, setPhase] = useState<SheetPhase>('idle');
  const slideAnim = useRef(new Animated.Value(height)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const spinnerAnim = useRef(new Animated.Value(0)).current;

  // Reset phase when modal becomes visible
  useEffect(() => {
    if (visible) {
      setPhase('idle');
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          damping: 20,
          stiffness: 200,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          damping: 20,
          stiffness: 200,
        }),
      ]).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  // Spinner animation while processing
  useEffect(() => {
    if (phase === 'processing') {
      const loop = Animated.loop(
        Animated.timing(spinnerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      );
      loop.start();
      return () => loop.stop();
    }
    spinnerAnim.setValue(0);
  }, [phase]);

  const handlePay = async () => {
    setPhase('processing');
    try {
      await onConfirm();
      setPhase('success');
      // Auto-dismiss after showing success
      setTimeout(() => {
        onDismiss();
      }, 1200);
    } catch {
      setPhase('failed');
    }
  };

  const handleDismiss = () => {
    if (phase === 'processing') return; // Don't dismiss during processing
    onDismiss();
  };

  const spinnerRotate = spinnerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const currencySymbol = currency === 'EUR' ? '€' : currency === 'GBP' ? '£' : '$';

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent
      presentationStyle="overFullScreen"
      onRequestClose={handleDismiss}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleDismiss}
        />
        <Animated.View
          style={[
            styles.sheet,
            ({
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim },
              ],
            } as any),
          ]}
        >
          {/* Handle */}
          <View style={styles.handle} />

          {phase === 'idle' && (
            <>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.title}>Confirm Payment</Text>
                <TouchableOpacity onPress={handleDismiss} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* Card preview */}
              <View style={styles.cardPreview}>
                <View style={styles.cardImage}>
                  <View style={styles.cardChip}>
                    <View style={styles.chipLine} />
                    <View style={styles.chipLineShort} />
                  </View>
                  <Text style={styles.cardNumber}>{cardLast4}</Text>
                </View>
              </View>

              {/* Amount */}
              <View style={styles.amountSection}>
                <Text style={styles.amount}>
                  {currencySymbol}{amount.toFixed(2)}
                </Text>
                <Text style={styles.merchantName}>{merchantName}</Text>
              </View>

              {/* Pay button */}
              <View style={styles.buttonSection}>
                <TouchableOpacity
                  style={styles.payButton}
                  activeOpacity={0.8}
                  onPress={handlePay}
                >
                  <Text style={styles.payButtonText}>
                    Pay {currencySymbol}{amount.toFixed(2)}
                  </Text>
                </TouchableOpacity>
                <Text style={styles.hint}>Confirm with Side Button</Text>
              </View>
            </>
          )}

          {phase === 'processing' && (
            <View style={styles.phaseContent}>
              <Animated.View style={[styles.spinner, { transform: [{ rotate: spinnerRotate }] }]}>
                <View style={styles.spinnerCircle} />
              </Animated.View>
              <Text style={styles.phaseTitle}>Processing Payment</Text>
              <Text style={styles.phaseSubtitle}>Please wait…</Text>
            </View>
          )}

          {phase === 'success' && (
            <View style={styles.phaseContent}>
              <View style={styles.successCheckmark}>
                <Text style={styles.checkmarkIcon}>✓</Text>
              </View>
              <Text style={styles.phaseTitle}>Payment Complete</Text>
              <Text style={styles.phaseSubtitle}>
                {currencySymbol}{amount.toFixed(2)} paid to {merchantName}
              </Text>
            </View>
          )}

          {phase === 'failed' && (
            <View style={styles.phaseContent}>
              <View style={styles.failedIcon}>
                <Text style={styles.failedCross}>✕</Text>
              </View>
              <Text style={styles.phaseTitle}>Payment Failed</Text>
              <Text style={styles.phaseSubtitle}>Please try again</Text>
              <TouchableOpacity style={styles.retryButton} onPress={handlePay}>
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: Colors.overlay,
  },
  sheet: {
    backgroundColor: Colors.card,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingBottom: Platform.OS === 'ios' ? 44 : 24,
    ...Shadow.lg,
  },
  handle: {
    width: 36,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.systemGray3,
    alignSelf: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.md,
  },
  title: {
    ...Typography.title3,
    color: Colors.textPrimary,
  },
  closeButton: {
    ...Typography.title2,
    color: Colors.textTertiary,
  },
  cardPreview: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  cardImage: {
    width: 280,
    height: 172,
    borderRadius: 12,
    backgroundColor: Colors.navyLight,
    justifyContent: 'flex-end',
    padding: Spacing.xl,
    ...Shadow.md,
  },
  cardChip: {
    position: 'absolute',
    top: 28,
    left: 24,
  },
  chipLine: {
    width: 40,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.goldLight,
    marginBottom: 4,
  },
  chipLineShort: {
    width: 24,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.goldLight,
  },
  cardNumber: {
    color: Colors.white,
    ...Typography.title3,
    letterSpacing: 2,
  },
  amountSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  amount: {
    ...Typography.largeTitle,
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  merchantName: {
    ...Typography.callout,
    color: Colors.textTertiary,
    marginTop: Spacing.xs,
  },
  buttonSection: {
    paddingHorizontal: Spacing.xxl,
    alignItems: 'center',
    paddingTop: Spacing.lg,
  },
  payButton: {
    backgroundColor: Colors.navy,
    paddingVertical: Spacing.lg + 2,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    width: '100%',
    ...Shadow.md,
  },
  payButtonText: {
    ...Typography.button,
    color: Colors.white,
    fontSize: 18,
  },
  hint: {
    ...Typography.footnote,
    color: Colors.textTertiary,
    marginTop: Spacing.lg,
  },
  // Phase: processing / success / failed
  phaseContent: {
    paddingVertical: Spacing.xxxxl,
    alignItems: 'center',
    minHeight: 260,
    justifyContent: 'center',
  },
  spinner: {
    width: 56,
    height: 56,
    borderWidth: 3,
    borderColor: Colors.systemGray5,
    borderTopColor: Colors.gold,
    borderRadius: 28,
    marginBottom: Spacing.xxl,
  },
  spinnerCircle: {
    width: 56,
    height: 56,
  },
  phaseTitle: {
    ...Typography.title3,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  phaseSubtitle: {
    ...Typography.callout,
    color: Colors.textTertiary,
    textAlign: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  successCheckmark: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xxl,
  },
  checkmarkIcon: {
    fontSize: 32,
    color: Colors.white,
    fontWeight: '700',
  },
  failedIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xxl,
  },
  failedCross: {
    fontSize: 32,
    color: Colors.white,
    fontWeight: '700',
  },
  retryButton: {
    marginTop: Spacing.xxl,
    backgroundColor: Colors.navy,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xxxl,
    borderRadius: BorderRadius.md,
  },
  retryButtonText: {
    ...Typography.button,
    color: Colors.white,
  },
});
