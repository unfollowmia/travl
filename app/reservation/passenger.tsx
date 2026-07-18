import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
  ScrollView,
  Platform,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../../src/theme';
import { useReservationStore } from '../../src/store/useReservationStore';
import { usePassengerStore } from '../../src/store/usePassengerStore';
import { ProgressIndicator } from '../../src/components/ProgressIndicator';

const STEP_LABELS = ['Airports', 'Travel Details', 'Passenger'];

const NATIONALITIES = [
  'Afghan', 'Albanian', 'Algerian', 'American', 'Argentine', 'Australian',
  'Austrian', 'Bangladeshi', 'Belgian', 'Brazilian', 'British', 'Bulgarian',
  'Cambodian', 'Canadian', 'Chilean', 'Chinese', 'Colombian', 'Croatian',
  'Cuban', 'Cypriot', 'Czech', 'Danish', 'Dutch', 'Egyptian', 'Emirati',
  'Estonian', 'Ethiopian', 'Filipino', 'Finnish', 'French', 'German',
  'Ghanaian', 'Greek', 'Hungarian', 'Icelandic', 'Indian', 'Indonesian',
  'Iranian', 'Iraqi', 'Irish', 'Israeli', 'Italian', 'Jamaican',
  'Japanese', 'Jordanian', 'Kenyan', 'Kuwaiti', 'Latvian', 'Lebanese',
  'Libyan', 'Lithuanian', 'Luxembourgish', 'Malaysian', 'Maltese',
  'Mexican', 'Moroccan', 'Nepalese', 'New Zealander', 'Nigerian',
  'Norwegian', 'Pakistani', 'Peruvian', 'Polish', 'Portuguese',
  'Qatari', 'Romanian', 'Russian', 'Saudi', 'Serbian', 'Singaporean',
  'Slovak', 'Slovenian', 'South African', 'South Korean', 'Spanish',
  'Sri Lankan', 'Swedish', 'Swiss', 'Taiwanese', 'Thai', 'Tunisian',
  'Turkish', 'Ukrainian', 'Uruguayan', 'Venezuelan', 'Vietnamese',
];

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

export default function PassengerScreen() {
  const passenger = useReservationStore((s) => s.passenger);
  const setPassengerField = useReservationStore((s) => s.setPassengerField);
  const addPassenger = usePassengerStore((s) => s.addPassenger);
  const setField = useReservationStore((s) => s.setField);

  const [saveForFuture, setSaveForFuture] = useState(false);
  const [nationalityModal, setNationalityModal] = useState(false);
  const [nationalitySearch, setNationalitySearch] = useState('');
  const [dobModal, setDobModal] = useState(false);
  const [pickerYear, setPickerYear] = useState(() => new Date().getFullYear() - 30);
  const [pickerMonth, setPickerMonth] = useState(0);

  const canContinue =
    passenger.name.trim().length > 0 &&
    passenger.passportNumber.trim().length > 0 &&
    passenger.nationality.length > 0 &&
    passenger.dateOfBirth.length > 0;

  const filteredNationalities = nationalitySearch
    ? NATIONALITIES.filter((n) =>
        n.toLowerCase().includes(nationalitySearch.toLowerCase()),
      )
    : NATIONALITIES;

  const handleContinue = () => {
    if (saveForFuture) {
      addPassenger({
        name: passenger.name,
        passportNumber: passenger.passportNumber,
        nationality: passenger.nationality,
        dateOfBirth: passenger.dateOfBirth,
      });
    }
    setField('status', 'reviewing');
    router.push('/reservation/review');
  };

  const handleSelectDOB = (day: number) => {
    const selected = new Date(pickerYear, pickerMonth, day);
    setPassengerField('dateOfBirth', formatDateISO(selected));
    setDobModal(false);
  };

  const renderDOBCalendar = () => {
    const daysInMonth = new Date(pickerYear, pickerMonth + 1, 0).getDate();
    const firstDay = new Date(pickerYear, pickerMonth, 1).getDay();
    const days: (number | null)[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(d);
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return (
      <View style={styles.calendar}>
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

        <View style={styles.weekdayRow}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <Text key={d} style={styles.weekdayLabel}>
              {d}
            </Text>
          ))}
        </View>

        <View style={styles.daysGrid}>
          {days.map((day, i) => {
            if (day === null) {
              return <View key={`empty-${i}`} style={styles.dayCell} />;
            }

            const thisDate = new Date(pickerYear, pickerMonth, day);
            const isFuture = thisDate > today;

            return (
              <TouchableOpacity
                key={day}
                style={[styles.dayCell, isFuture && styles.dayDisabled]}
                disabled={isFuture}
                onPress={() => handleSelectDOB(day)}
                activeOpacity={0.6}
              >
                <Text
                  style={[
                    styles.dayText,
                    isFuture && styles.dayTextDisabled,
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

  const dobLabel = passenger.dateOfBirth
    ? formatDate(new Date(passenger.dateOfBirth + 'T00:00:00'))
    : 'Select date of birth';

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ProgressIndicator
          currentStep={2}
          totalSteps={3}
          labels={STEP_LABELS}
        />

        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Full Name */}
          <Text style={styles.fieldLabel}>Full Name (as on passport)</Text>
          <View style={styles.inputCard}>
            <TextInput
              style={styles.input}
              placeholder="e.g. John Smith"
              placeholderTextColor={Colors.textTertiary}
              value={passenger.name}
              onChangeText={(v) => setPassengerField('name', v)}
              autoCapitalize="words"
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>

          {/* Passport Number */}
          <Text style={styles.fieldLabel}>Passport Number</Text>
          <View style={styles.inputCard}>
            <TextInput
              style={styles.input}
              placeholder="e.g. A12345678"
              placeholderTextColor={Colors.textTertiary}
              value={passenger.passportNumber}
              onChangeText={(v) => setPassengerField('passportNumber', v)}
              autoCapitalize="characters"
              autoCorrect={false}
              returnKeyType="next"
            />
          </View>

          {/* Nationality */}
          <Text style={styles.fieldLabel}>Nationality</Text>
          <TouchableOpacity
            style={styles.selectCard}
            activeOpacity={0.7}
            onPress={() => setNationalityModal(true)}
          >
            <Text
              style={[
                styles.selectText,
                !passenger.nationality && styles.selectPlaceholder,
              ]}
            >
              {passenger.nationality || 'Select nationality'}
            </Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          {/* Date of Birth */}
          <Text style={styles.fieldLabel}>Date of Birth</Text>
          <TouchableOpacity
            style={styles.selectCard}
            activeOpacity={0.7}
            onPress={() => setDobModal(true)}
          >
            <Text
              style={[
                styles.selectText,
                !passenger.dateOfBirth && styles.selectPlaceholder,
              ]}
            >
              {dobLabel}
            </Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>

          {/* Save for future */}
          <View style={styles.toggleRow}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleLabel}>Save passenger for future use</Text>
              <Text style={styles.toggleHint}>
                Securely stored on your device
              </Text>
            </View>
            <Switch
              value={saveForFuture}
              onValueChange={setSaveForFuture}
              trackColor={{
                false: Colors.systemGray4,
                true: Colors.gold,
              }}
              thumbColor={Colors.white}
              ios_backgroundColor={Colors.systemGray4}
            />
          </View>
        </ScrollView>

        {/* Continue Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              !canContinue && styles.continueButtonDisabled,
            ]}
            activeOpacity={0.85}
            disabled={!canContinue}
            onPress={handleContinue}
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
      </KeyboardAvoidingView>

      {/* Nationality Picker Modal */}
      <Modal
        visible={nationalityModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer} edges={['top']}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Nationality</Text>
            <TouchableOpacity
              onPress={() => {
                setNationalityModal(false);
                setNationalitySearch('');
              }}
            >
              <Text style={styles.modalClose}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search nationalities..."
              placeholderTextColor={Colors.textTertiary}
              value={nationalitySearch}
              onChangeText={setNationalitySearch}
              autoFocus
              clearButtonMode="while-editing"
              autoCorrect={false}
            />
          </View>

          <ScrollView keyboardShouldPersistTaps="handled">
            {filteredNationalities.map((n) => (
              <TouchableOpacity
                key={n}
                style={[
                  styles.nationalityItem,
                  passenger.nationality === n && styles.nationalityItemActive,
                ]}
                onPress={() => {
                  setPassengerField('nationality', n);
                  setNationalityModal(false);
                  setNationalitySearch('');
                }}
                activeOpacity={0.6}
              >
                <Text
                  style={[
                    styles.nationalityText,
                    passenger.nationality === n && styles.nationalityTextActive,
                  ]}
                >
                  {n}
                </Text>
                {passenger.nationality === n && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* DOB Picker Modal */}
      <Modal
        visible={dobModal}
        animationType="slide"
        presentationStyle="pageSheet"
        transparent
      >
        <View style={styles.dobOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Date of Birth</Text>
              <TouchableOpacity onPress={() => setDobModal(false)}>
                <Text style={styles.modalClose}>Cancel</Text>
              </TouchableOpacity>
            </View>
            {renderDOBCalendar()}
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
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  fieldLabel: {
    ...Typography.footnoteSemibold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
    marginTop: Spacing.xl,
  },
  inputCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    ...Shadow.md,
  },
  input: {
    ...Typography.body,
    color: Colors.textPrimary,
    height: 44,
  },
  selectCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Shadow.md,
    minHeight: 44,
  },
  selectText: {
    ...Typography.body,
    color: Colors.textPrimary,
    flex: 1,
  },
  selectPlaceholder: {
    color: Colors.textTertiary,
  },
  chevron: {
    ...Typography.title2,
    color: Colors.systemGray3,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.xxl,
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    ...Shadow.md,
  },
  toggleInfo: {
    flex: 1,
    marginRight: Spacing.lg,
  },
  toggleLabel: {
    ...Typography.calloutSemibold,
    color: Colors.textPrimary,
  },
  toggleHint: {
    ...Typography.footnote,
    color: Colors.textTertiary,
    marginTop: 2,
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
  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: Colors.background,
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.systemGray6,
    borderRadius: BorderRadius.md,
    marginHorizontal: Spacing.xxl,
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    height: 44,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...Typography.body,
    color: Colors.textPrimary,
  },
  nationalityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.lg,
    minHeight: 44,
  },
  nationalityItemActive: {
    backgroundColor: Colors.systemGray6,
  },
  nationalityText: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  nationalityTextActive: {
    ...Typography.bodySemibold,
    color: Colors.navy,
  },
  checkmark: {
    ...Typography.body,
    color: Colors.gold,
  },
  // DOB Calendar Modal
  dobOverlay: {
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
