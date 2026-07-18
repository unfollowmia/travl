import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../../src/theme';
import { useReservationStore, type TripType } from '../../src/store/useReservationStore';
import { ProgressIndicator } from '../../src/components/ProgressIndicator';

const STEP_LABELS = ['Airports', 'Travel Details', 'Passenger'];

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function formatDate(date: Date): string {
  const day = date.getDate();
  const month = MONTHS[date.getMonth()];
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
}

function formatDateISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function parseDate(str: string): Date | null {
  if (!str) return null;
  const d = new Date(str + 'T00:00:00');
  return isNaN(d.getTime()) ? null : d;
}

export default function DetailsScreen() {
  const tripType = useReservationStore((s) => s.tripType);
  const travelDate = useReservationStore((s) => s.travelDate);
  const returnDate = useReservationStore((s) => s.returnDate);
  const setField = useReservationStore((s) => s.setField);

  const [datePickerMode, setDatePickerMode] = useState<'departure' | 'return' | null>(null);
  const [pickerYear, setPickerYear] = useState(() => new Date().getFullYear());
  const [pickerMonth, setPickerMonth] = useState(() => new Date().getMonth());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const canContinue =
    travelDate.length > 0 &&
    (tripType === 'one-way' || returnDate.length > 0);

  const handleTripTypeChange = (type: TripType) => {
    setField('tripType', type);
    if (type === 'one-way') {
      setField('returnDate', '');
    }
  };

  const handleSelectDay = (day: number) => {
    const selected = new Date(pickerYear, pickerMonth, day);
    const iso = formatDateISO(selected);

    if (datePickerMode === 'departure') {
      setField('travelDate', iso);
      // If return date is before new departure, clear it
      if (returnDate) {
        const ret = parseDate(returnDate);
        if (ret && ret < selected) {
          setField('returnDate', '');
        }
      }
    } else if (datePickerMode === 'return') {
      setField('returnDate', iso);
    }
    setDatePickerMode(null);
  };

  const renderCalendar = () => {
    const daysInMonth = new Date(pickerYear, pickerMonth + 1, 0).getDate();
    const firstDay = new Date(pickerYear, pickerMonth, 1).getDay();
    const days: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(d);
    }

    const minDate = datePickerMode === 'return' && travelDate
      ? parseDate(travelDate)
      : null;

    return (
      <View style={styles.calendar}>
        {/* Month nav */}
        <View style={styles.calendarHeader}>
          <TouchableOpacity
            onPress={() => {
              if (pickerMonth === 0) {
                setPickerMonth(11);
                setPickerYear(pickerYear - 1);
              } else {
                setPickerMonth(pickerMonth - 1);
              }
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.calendarNav}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.calendarMonth}>
            {MONTHS[pickerMonth]} {pickerYear}
          </Text>
          <TouchableOpacity
            onPress={() => {
              if (pickerMonth === 11) {
                setPickerMonth(0);
                setPickerYear(pickerYear + 1);
              } else {
                setPickerMonth(pickerMonth + 1);
              }
            }}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.calendarNav}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Day labels */}
        <View style={styles.weekdayRow}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <Text key={d} style={styles.weekdayLabel}>
              {d}
            </Text>
          ))}
        </View>

        {/* Days grid */}
        <View style={styles.daysGrid}>
          {days.map((day, i) => {
            if (day === null) {
              return <View key={`empty-${i}`} style={styles.dayCell} />;
            }

            const thisDate = new Date(pickerYear, pickerMonth, day);
            const isPast = thisDate < today;
            const isBeforeMin =
              minDate && thisDate <= minDate;
            const isDisabled = isPast || !!isBeforeMin;

            return (
              <TouchableOpacity
                key={day}
                style={[
                  styles.dayCell,
                  isDisabled && styles.dayDisabled,
                ]}
                disabled={isDisabled}
                onPress={() => handleSelectDay(day)}
                activeOpacity={0.6}
              >
                <Text
                  style={[
                    styles.dayText,
                    isDisabled && styles.dayTextDisabled,
                  ]}
                >
                  {day}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const departureLabel = travelDate
    ? formatDate(parseDate(travelDate)!)
    : 'Select date';
  const returnLabel =
    returnDate && tripType === 'return'
      ? formatDate(parseDate(returnDate)!)
      : 'Select date';

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ProgressIndicator
        currentStep={1}
        totalSteps={3}
        labels={STEP_LABELS}
      />

      <View style={styles.content}>
        {/* Trip Type */}
        <Text style={styles.fieldLabel}>Trip Type</Text>
        <View style={styles.segmentedControl}>
          <TouchableOpacity
            style={[
              styles.segment,
              tripType === 'one-way' && styles.segmentActive,
            ]}
            onPress={() => handleTripTypeChange('one-way')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.segmentText,
                tripType === 'one-way' && styles.segmentTextActive,
              ]}
            >
              One-way
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.segment,
              tripType === 'return' && styles.segmentActive,
            ]}
            onPress={() => handleTripTypeChange('return')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.segmentText,
                tripType === 'return' && styles.segmentTextActive,
              ]}
            >
              Return
            </Text>
          </TouchableOpacity>
        </View>

        {/* Departure Date */}
        <Text style={[styles.fieldLabel, { marginTop: Spacing.xxl }]}>
          Departure Date
        </Text>
        <TouchableOpacity
          style={styles.dateCard}
          activeOpacity={0.7}
          onPress={() => {
            setPickerMonth(travelDate ? parseDate(travelDate)!.getMonth() : today.getMonth());
            setPickerYear(travelDate ? parseDate(travelDate)!.getFullYear() : today.getFullYear());
            setDatePickerMode('departure');
          }}
        >
          <Text style={styles.dateIcon}>📅</Text>
          <View style={styles.dateInfo}>
            <Text
              style={[
                styles.dateText,
                !travelDate && styles.datePlaceholder,
              ]}
            >
              {departureLabel}
            </Text>
          </View>
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>

        {/* Return Date */}
        {tripType === 'return' && (
          <>
            <Text style={[styles.fieldLabel, { marginTop: Spacing.xl }]}>
              Return Date
            </Text>
            <TouchableOpacity
              style={styles.dateCard}
              activeOpacity={0.7}
              onPress={() => {
                const base = returnDate
                  ? parseDate(returnDate)!
                  : travelDate
                  ? parseDate(travelDate)!
                  : today;
                setPickerMonth(base.getMonth());
                setPickerYear(base.getFullYear());
                setDatePickerMode('return');
              }}
            >
              <Text style={styles.dateIcon}>📅</Text>
              <View style={styles.dateInfo}>
                <Text
                  style={[
                    styles.dateText,
                    !returnDate && styles.datePlaceholder,
                  ]}
                >
                  {returnLabel}
                </Text>
              </View>
              <Text style={styles.chevron}>›</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !canContinue && styles.continueButtonDisabled,
          ]}
          activeOpacity={0.85}
          disabled={!canContinue}
          onPress={() => router.push('/reservation/passenger')}
        >
          <Text
            style={[
              styles.continueButtonText,
              !canContinue && styles.continueButtonTextDisabled,
            ]}
          >
            Continue
          </Text>
        </TouchableOpacity>
      </View>

      {/* Date Picker Modal */}
      <Modal
        visible={datePickerMode !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        transparent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {datePickerMode === 'departure'
                  ? 'Departure Date'
                  : 'Return Date'}
              </Text>
              <TouchableOpacity onPress={() => setDatePickerMode(null)}>
                <Text style={styles.modalClose}>Cancel</Text>
              </TouchableOpacity>
            </View>
            {renderCalendar()}
          </View>
        </View>
      </Modal>
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
  fieldLabel: {
    ...Typography.footnoteSemibold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  // Segmented Control
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: Colors.systemGray5,
    borderRadius: BorderRadius.md,
    padding: 3,
  },
  segment: {
    flex: 1,
    paddingVertical: Spacing.sm + 2,
    alignItems: 'center',
    borderRadius: BorderRadius.md - 2,
  },
  segmentActive: {
    backgroundColor: Colors.card,
    ...Shadow.sm,
  },
  segmentText: {
    ...Typography.calloutSemibold,
    color: Colors.textTertiary,
  },
  segmentTextActive: {
    color: Colors.navy,
  },
  // Date Card
  dateCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    ...Shadow.md,
    minHeight: 72,
  },
  dateIcon: {
    fontSize: 24,
  },
  dateInfo: {
    flex: 1,
  },
  dateText: {
    ...Typography.callout,
    color: Colors.textPrimary,
  },
  datePlaceholder: {
    color: Colors.textTertiary,
  },
  chevron: {
    ...Typography.title2,
    color: Colors.systemGray3,
  },
  // Footer
  footer: {
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Spacing.xxl,
  },
  continueButton: {
    backgroundColor: Colors.navy,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Shadow.md,
  },
  continueButtonDisabled: {
    backgroundColor: Colors.systemGray4,
    ...Shadow.sm,
  },
  continueButtonText: {
    ...Typography.button,
    color: Colors.white,
  },
  continueButtonTextDisabled: {
    color: Colors.textTertiary,
  },
  // Modal / Calendar
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    ...Shadow.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.lg,
  },
  modalTitle: {
    ...Typography.title3,
    color: Colors.navy,
  },
  modalClose: {
    ...Typography.body,
    color: Colors.textLink,
  },
  calendar: {
    paddingHorizontal: Spacing.lg,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  calendarNav: {
    ...Typography.title1,
    color: Colors.gold,
  },
  calendarMonth: {
    ...Typography.title3,
    color: Colors.textPrimary,
  },
  weekdayRow: {
    flexDirection: 'row',
    paddingVertical: Spacing.sm,
  },
  weekdayLabel: {
    flex: 1,
    textAlign: 'center',
    ...Typography.footnoteSemibold,
    color: Colors.textTertiary,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    ...Typography.callout,
    color: Colors.textPrimary,
  },
  dayDisabled: {
    opacity: 0.25,
  },
  dayTextDisabled: {
    color: Colors.textTertiary,
  },
});
