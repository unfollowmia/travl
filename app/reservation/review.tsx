import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../../src/theme';
import { useReservationStore } from '../../src/store/useReservationStore';
import { getAirportByCode } from '../../src/data/airports';
import { paymentService } from '../../src/services/payment';
import { ApplePaySheet } from '../../src/components/ApplePaySheet';
import { LoadingOverlay } from '../../src/components/LoadingOverlay';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

function formatDateDisplay(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d.getTime())) return iso;
  const dayName = DAYS[d.getDay()];
  const day = d.getDate();
  const month = MONTHS_SHORT[d.getMonth()];
  const year = d.getFullYear();
  return `${dayName}, ${day} ${month} ${year}`;
}

function maskPassport(num: string): string {
  if (!num) return '';
  if (num.length <= 4) return '••••' + num;
  return '•••• ' + num.slice(-4);
}

const RESERVATION_FEE = 19.0;

export default function ReviewScreen() {
  const reservation = useReservationStore();
  const submitReservation = useReservationStore((s) => s.submitReservation);

  const [applePayVisible, setApplePayVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const depAirport = getAirportByCode(reservation.departureAirport);
  const destAirport = getAirportByCode(reservation.destinationAirport);

  const handlePay = useCallback(async () => {
    // Call the payment service (mock Apple Pay)
    await paymentService.requestPayment(RESERVATION_FEE, 'USD');
    // Payment succeeded — sheet auto-dismisses via ApplePaySheet's timeout
  }, []);

  const handlePaymentDismiss = useCallback(async () => {
    setApplePayVisible(false);

    // If payment was confirmed (sheet dismissed after success),
    // trigger the reservation submission
    if (reservation.status === 'reviewing' || reservation.status === 'idle') {
      setIsSubmitting(true);

      try {
        await submitReservation();
        // Navigate to result
        router.replace('/reservation/result');
      } catch {
        // Stay on review for now
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [reservation.status, submitReservation]);

  const navigateToEdit = (step: string) => {
    // Navigate back to the corresponding form step
    if (step === 'airports') {
      router.push('/reservation/airports');
    } else if (step === 'details') {
      router.push('/reservation/details');
    } else if (step === 'passenger') {
      router.push('/reservation/passenger');
    }
  };

  const depCode = reservation.departureAirport || '???';
  const destCode = reservation.destinationAirport || '???';

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <LoadingOverlay visible={isSubmitting} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={styles.title}>Review Reservation</Text>

        {/* Route Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.sectionLabel}>Route</Text>
            <TouchableOpacity
              onPress={() => navigateToEdit('airports')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.routeRow}>
            {/* Departure */}
            <View style={styles.airportBlock}>
              <Text style={styles.airportCode}>{depCode}</Text>
              <Text style={styles.airportCity}>{depAirport?.city ?? ''}</Text>
            </View>

            {/* Connector */}
            <View style={styles.routeConnector}>
              <View style={styles.connectorLine} />
              <Text style={styles.airplaneIcon}>✈</Text>
              <View style={styles.connectorLine} />
            </View>

            {/* Destination */}
            <View style={styles.airportBlock}>
              <Text style={styles.airportCode}>{destCode}</Text>
              <Text style={styles.airportCity}>{destAirport?.city ?? ''}</Text>
            </View>
          </View>
        </View>

        {/* Travel Details Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.sectionLabel}>Travel Details</Text>
            <TouchableOpacity
              onPress={() => navigateToEdit('details')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Text style={styles.detailEmoji}>
                {reservation.tripType === 'one-way' ? '→' : '⇄'}
              </Text>
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Trip Type</Text>
              <Text style={styles.detailValue}>
                {reservation.tripType === 'one-way' ? 'One-way' : 'Return'}
              </Text>
            </View>
          </View>

          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Text style={styles.detailEmoji}>📅</Text>
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Departure</Text>
              <Text style={styles.detailValue}>
                {formatDateDisplay(reservation.travelDate)}
              </Text>
            </View>
          </View>

          {reservation.tripType === 'return' && reservation.returnDate ? (
            <>
              <View style={styles.detailDivider} />
              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Text style={styles.detailEmoji}>📅</Text>
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Return</Text>
                  <Text style={styles.detailValue}>
                    {formatDateDisplay(reservation.returnDate)}
                  </Text>
                </View>
              </View>
            </>
          ) : null}
        </View>

        {/* Passenger Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.sectionLabel}>Passenger</Text>
            <TouchableOpacity
              onPress={() => navigateToEdit('passenger')}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.editButton}>Edit</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <View style={styles.personAvatar}>
                <Text style={styles.personInitial}>
                  {(reservation.passenger.name || '?')[0].toUpperCase()}
                </Text>
              </View>
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Full Name</Text>
              <Text style={styles.detailValue}>
                {reservation.passenger.name || '—'}
              </Text>
            </View>
          </View>

          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Text style={styles.detailEmoji}>🛂</Text>
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Passport Number</Text>
              <Text style={styles.detailValue}>
                {maskPassport(reservation.passenger.passportNumber) || '—'}
              </Text>
            </View>
          </View>

          <View style={styles.detailDivider} />

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Text style={styles.detailEmoji}>🌍</Text>
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Nationality</Text>
              <Text style={styles.detailValue}>
                {reservation.passenger.nationality || '—'}
              </Text>
            </View>
          </View>
        </View>

        {/* Price Summary Card */}
        <View style={styles.priceCard}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Reservation Fee</Text>
            <Text style={styles.priceValue}>${RESERVATION_FEE.toFixed(2)}</Text>
          </View>
          <Text style={styles.priceNote}>
            One-time fee. No hidden charges.
          </Text>
        </View>

        {/* Fine Print */}
        <Text style={styles.finePrint}>
          You will receive a genuine flight reservation with a valid PNR. No
          ticket purchase required. This is a reservation only, valid for visa
          applications and proof of onward travel.
        </Text>
      </ScrollView>

      {/* Footer with Apple Pay Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.applePayButton}
          activeOpacity={0.8}
          onPress={() => setApplePayVisible(true)}
        >
          <Text style={styles.applePayIcon}></Text>
          <Text style={styles.applePayText}>Pay</Text>
        </TouchableOpacity>
      </View>

      {/* Apple Pay Bottom Sheet */}
      <ApplePaySheet
        visible={applePayVisible}
        amount={RESERVATION_FEE}
        currency="USD"
        merchantName="travl"
        onConfirm={handlePay}
        onDismiss={handlePaymentDismiss}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  title: {
    ...Typography.title2,
    color: Colors.navy,
    marginBottom: Spacing.xxl,
  },

  // Cards
  card: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    ...Shadow.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  sectionLabel: {
    ...Typography.footnoteSemibold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  editButton: {
    ...Typography.calloutSemibold,
    color: Colors.textLink,
  },

  // Route
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
  },
  airportBlock: {
    alignItems: 'center',
    flex: 1,
  },
  airportCode: {
    ...Typography.largeTitle,
    color: Colors.navy,
    letterSpacing: 2,
  },
  airportCity: {
    ...Typography.footnote,
    color: Colors.textTertiary,
    marginTop: Spacing.xs,
  },
  routeConnector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
  },
  connectorLine: {
    width: 24,
    height: 1.5,
    backgroundColor: Colors.systemGray3,
  },
  airplaneIcon: {
    fontSize: 20,
    marginHorizontal: Spacing.sm,
    color: Colors.gold,
  },

  // Detail rows
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
  },
  detailIcon: {
    width: 40,
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  detailEmoji: {
    fontSize: 18,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    ...Typography.footnote,
    color: Colors.textTertiary,
    marginBottom: 2,
  },
  detailValue: {
    ...Typography.calloutSemibold,
    color: Colors.textPrimary,
  },
  detailDivider: {
    height: 1,
    backgroundColor: Colors.systemGray5,
    marginVertical: Spacing.sm,
    marginLeft: 40 + Spacing.md,
  },

  // Person avatar
  personAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.navyLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  personInitial: {
    ...Typography.calloutSemibold,
    color: Colors.white,
    fontSize: 15,
  },

  // Price
  priceCard: {
    backgroundColor: Colors.navy,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
    ...Shadow.md,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  priceLabel: {
    ...Typography.body,
    color: Colors.systemGray2,
  },
  priceValue: {
    ...Typography.title2,
    color: Colors.gold,
    letterSpacing: 0.5,
  },
  priceNote: {
    ...Typography.footnote,
    color: Colors.systemGray3,
  },

  // Fine print
  finePrint: {
    ...Typography.footnote,
    color: Colors.textTertiary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: Spacing.md,
  },

  // Footer
  footer: {
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Platform.OS === 'ios' ? Spacing.lg : Spacing.xxl,
    paddingTop: Spacing.md,
  },
  applePayButton: {
    backgroundColor: Colors.navy,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    gap: 6,
    ...Shadow.md,
  },
  applePayIcon: {
    fontSize: 22,
    color: Colors.white,
    lineHeight: 26,
  },
  applePayText: {
    ...Typography.button,
    color: Colors.white,
    fontSize: 18,
    letterSpacing: 0.5,
  },
});
