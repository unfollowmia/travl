import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../../src/theme';
import { useReservationStore } from '../../src/store/useReservationStore';

export default function ResultScreen() {
  const reservation = useReservationStore();

  const pnr = reservation.pnr || '—';
  const status = reservation.status === 'completed' ? 'Confirmed' : 'Pending';

  const handleDone = () => {
    router.dismissAll();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.content}>
        {/* Success icon */}
        <View style={styles.successBadge}>
          <Text style={styles.checkmark}>✓</Text>
        </View>

        <Text style={styles.statusText}>
          Reservation {status === 'Confirmed' ? 'Confirmed' : 'Pending'}
        </Text>

        {/* PNR Display */}
        <View style={styles.pnrCard}>
          <Text style={styles.pnrLabel}>Booking Reference (PNR)</Text>
          <Text style={styles.pnrCode}>{pnr}</Text>
          <Text style={styles.pnrHint}>
            You'll receive this reservation confirmation by email shortly.
          </Text>
        </View>

        {/* Reservation summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Airline</Text>
            <Text style={styles.summaryValue}>
              {reservation.airlineName || '—'}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Flight</Text>
            <Text style={styles.summaryValue}>
              {reservation.flightNumber || '—'}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Status</Text>
            <View style={styles.statusPill}>
              <Text style={styles.statusPillText}>{status}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.comingSoon}>
          Full boarding pass design coming soon ✨
        </Text>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.doneButton}
          activeOpacity={0.85}
          onPress={handleDone}
        >
          <Text style={styles.doneButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.xxxxl,
  },
  successBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    ...Shadow.md,
  },
  checkmark: {
    fontSize: 36,
    color: Colors.white,
    fontWeight: '700',
  },
  statusText: {
    ...Typography.title2,
    color: Colors.navy,
    marginBottom: Spacing.xxxl,
  },

  // PNR Card
  pnrCard: {
    backgroundColor: Colors.navy,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xxl,
    alignItems: 'center',
    width: '100%',
    marginBottom: Spacing.lg,
    ...Shadow.md,
  },
  pnrLabel: {
    ...Typography.footnote,
    color: Colors.systemGray2,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  pnrCode: {
    ...Typography.pnr,
    color: Colors.gold,
    marginBottom: Spacing.md,
  },
  pnrHint: {
    ...Typography.footnote,
    color: Colors.systemGray3,
    textAlign: 'center',
    lineHeight: 18,
  },

  // Summary card
  summaryCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    width: '100%',
    ...Shadow.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  summaryLabel: {
    ...Typography.callout,
    color: Colors.textTertiary,
  },
  summaryValue: {
    ...Typography.calloutSemibold,
    color: Colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.systemGray5,
    marginVertical: Spacing.xs,
  },
  statusPill: {
    backgroundColor: `${Colors.success}20`,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  statusPillText: {
    ...Typography.footnoteSemibold,
    color: Colors.success,
  },
  comingSoon: {
    ...Typography.footnote,
    color: Colors.textTertiary,
    marginTop: Spacing.xxxl,
  },

  // Footer
  footer: {
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Platform.OS === 'ios' ? Spacing.lg : Spacing.xxl,
  },
  doneButton: {
    backgroundColor: Colors.navy,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Shadow.md,
  },
  doneButtonText: {
    ...Typography.button,
    color: Colors.white,
  },
});
