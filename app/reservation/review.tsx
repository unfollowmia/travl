import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../../src/theme';
import { useReservationStore } from '../../src/store/useReservationStore';
import { getAirportByCode } from '../../src/data/airports';

export default function ReviewScreen() {
  const reservation = useReservationStore();

  const depAirport = getAirportByCode(reservation.departureAirport);
  const destAirport = getAirportByCode(reservation.destinationAirport);

  const handleConfirm = () => {
    setField('status', 'processing');
    // Placeholder: will integrate with payment flow
    router.back();
    router.back();
    router.back();
  };

  const setField = useReservationStore((s) => s.setField);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.content}>
        <Text style={styles.title}>Review Reservation</Text>

        {/* Route */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Route</Text>
          <View style={styles.routeRow}>
            <View style={styles.airportBlock}>
              <Text style={styles.code}>{reservation.departureAirport || '???'}</Text>
              <Text style={styles.city}>{depAirport?.city ?? ''}</Text>
            </View>
            <Text style={styles.arrow}>→</Text>
            <View style={styles.airportBlock}>
              <Text style={styles.code}>{reservation.destinationAirport || '???'}</Text>
              <Text style={styles.city}>{destAirport?.city ?? ''}</Text>
            </View>
          </View>
        </View>

        {/* Travel Details */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Travel Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Trip Type</Text>
            <Text style={styles.detailValue}>
              {reservation.tripType === 'one-way' ? 'One-way' : 'Return'}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Departure</Text>
            <Text style={styles.detailValue}>{reservation.travelDate}</Text>
          </View>
          {reservation.tripType === 'return' && reservation.returnDate ? (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Return</Text>
              <Text style={styles.detailValue}>{reservation.returnDate}</Text>
            </View>
          ) : null}
        </View>

        {/* Passenger */}
        <View style={styles.card}>
          <Text style={styles.sectionLabel}>Passenger</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Name</Text>
            <Text style={styles.detailValue}>{reservation.passenger.name}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Passport</Text>
            <Text style={styles.detailValue}>
              {reservation.passenger.passportNumber}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Nationality</Text>
            <Text style={styles.detailValue}>
              {reservation.passenger.nationality}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date of Birth</Text>
            <Text style={styles.detailValue}>
              {reservation.passenger.dateOfBirth}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.confirmButton}
          activeOpacity={0.85}
          onPress={handleConfirm}
        >
          <Text style={styles.confirmButtonText}>Confirm & Pay</Text>
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
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.xl,
  },
  title: {
    ...Typography.title2,
    color: Colors.navy,
    marginBottom: Spacing.xxl,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    ...Shadow.md,
  },
  sectionLabel: {
    ...Typography.footnoteSemibold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.lg,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xl,
  },
  airportBlock: {
    alignItems: 'center',
  },
  code: {
    ...Typography.largeTitle,
    color: Colors.navy,
    letterSpacing: 2,
  },
  city: {
    ...Typography.footnote,
    color: Colors.textTertiary,
    marginTop: Spacing.xs,
  },
  arrow: {
    ...Typography.title1,
    color: Colors.gold,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  detailLabel: {
    ...Typography.callout,
    color: Colors.textTertiary,
  },
  detailValue: {
    ...Typography.calloutSemibold,
    color: Colors.textPrimary,
    textAlign: 'right',
    flex: 1,
    marginLeft: Spacing.lg,
  },
  footer: {
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Spacing.xxl,
  },
  confirmButton: {
    backgroundColor: Colors.gold,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Shadow.md,
  },
  confirmButtonText: {
    ...Typography.button,
    color: Colors.navy,
  },
});
