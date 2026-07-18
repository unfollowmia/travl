import { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../../src/theme';
import { useReservationStore } from '../../src/store/useReservationStore';
import { searchAirports, type Airport } from '../../src/data/airports';
import { ProgressIndicator } from '../../src/components/ProgressIndicator';

const STEP_LABELS = ['Airports', 'Travel Details', 'Passenger'];

export default function AirportsScreen() {
  const departureAirport = useReservationStore((s) => s.departureAirport);
  const destinationAirport = useReservationStore((s) => s.destinationAirport);
  const setField = useReservationStore((s) => s.setField);

  const [searchModal, setSearchModal] = useState<'departure' | 'destination' | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const departureAirportObj = departureAirport
    ? searchAirports(departureAirport)[0]
    : undefined;
  const destinationAirportObj = destinationAirport
    ? searchAirports(destinationAirport)[0]
    : undefined;

  const results = searchAirports(searchQuery);

  const handleSelectAirport = useCallback(
    (airport: Airport) => {
      if (searchModal === 'departure') {
        setField('departureAirport', airport.code);
      } else if (searchModal === 'destination') {
        setField('destinationAirport', airport.code);
      }
      setSearchModal(null);
      setSearchQuery('');
    },
    [searchModal, setField],
  );

  const handleSwap = () => {
    const dep = departureAirport;
    const dest = destinationAirport;
    setField('departureAirport', dest);
    setField('destinationAirport', dep);
  };

  const canContinue = departureAirport.length > 0 && destinationAirport.length > 0;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <ProgressIndicator
          currentStep={0}
          totalSteps={3}
          labels={STEP_LABELS}
        />

        <View style={styles.content}>
          {/* Departure */}
          <Text style={styles.fieldLabel}>Departure</Text>
          <TouchableOpacity
            style={styles.airportCard}
            activeOpacity={0.7}
            onPress={() => setSearchModal('departure')}
          >
            <Text style={styles.airplaneIcon}>✈</Text>
            <View style={styles.airportInfo}>
              {departureAirportObj ? (
                <>
                  <Text style={styles.airportCode}>{departureAirportObj.code}</Text>
                  <Text style={styles.airportName}>
                    {departureAirportObj.city}, {departureAirportObj.country}
                  </Text>
                </>
              ) : (
                <Text style={styles.placeholder}>Select departure airport</Text>
              )}
            </View>
          </TouchableOpacity>

          {/* Swap Button */}
          <View style={styles.swapContainer}>
            <View style={styles.swapLine} />
            <TouchableOpacity
              style={styles.swapButton}
              onPress={handleSwap}
              activeOpacity={0.6}
            >
              <Text style={styles.swapIcon}>⇅</Text>
            </TouchableOpacity>
            <View style={styles.swapLine} />
          </View>

          {/* Destination */}
          <Text style={styles.fieldLabel}>Destination</Text>
          <TouchableOpacity
            style={styles.airportCard}
            activeOpacity={0.7}
            onPress={() => setSearchModal('destination')}
          >
            <Text style={styles.airplaneIcon}>✈</Text>
            <View style={styles.airportInfo}>
              {destinationAirportObj ? (
                <>
                  <Text style={styles.airportCode}>{destinationAirportObj.code}</Text>
                  <Text style={styles.airportName}>
                    {destinationAirportObj.city},{' '}
                    {destinationAirportObj.country}
                  </Text>
                </>
              ) : (
                <Text style={styles.placeholder}>Select destination airport</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Continue Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.continueButton, !canContinue && styles.continueButtonDisabled]}
            activeOpacity={0.85}
            disabled={!canContinue}
            onPress={() => router.push('/reservation/details')}
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

      {/* Airport Search Modal */}
      <Modal
        visible={searchModal !== null}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer} edges={['top']}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {searchModal === 'departure'
                ? 'Departure Airport'
                : 'Destination Airport'}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setSearchModal(null);
                setSearchQuery('');
              }}
            >
              <Text style={styles.modalClose}>Cancel</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search airports..."
              placeholderTextColor={Colors.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
              clearButtonMode="while-editing"
              autoCorrect={false}
            />
          </View>

          <FlatList
            data={results}
            keyExtractor={(item) => item.code}
            keyboardShouldPersistTaps="handled"
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => handleSelectAirport(item)}
                activeOpacity={0.6}
              >
                <View style={styles.resultCode}>
                  <Text style={styles.resultCodeText}>{item.code}</Text>
                </View>
                <View style={styles.resultInfo}>
                  <Text style={styles.resultCity}>
                    {item.city}, {item.country}
                  </Text>
                  <Text style={styles.resultName}>{item.name}</Text>
                </View>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={
              <View style={styles.emptyResults}>
                <Text style={styles.emptyText}>
                  {searchQuery.length > 0
                    ? 'No airports found'
                    : 'Start typing to search'}
                </Text>
              </View>
            }
          />
        </SafeAreaView>
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
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xxl,
    justifyContent: 'center',
  },
  fieldLabel: {
    ...Typography.footnoteSemibold,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.sm,
    marginLeft: Spacing.xs,
  },
  airportCard: {
    backgroundColor: Colors.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    ...Shadow.md,
    minHeight: 72,
  },
  airplaneIcon: {
    fontSize: 24,
  },
  airportInfo: {
    flex: 1,
  },
  airportCode: {
    ...Typography.title2,
    color: Colors.navy,
    letterSpacing: 2,
  },
  airportName: {
    ...Typography.callout,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  placeholder: {
    ...Typography.callout,
    color: Colors.textTertiary,
  },
  swapContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.lg,
  },
  swapLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.systemGray4,
  },
  swapButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: Spacing.lg,
    ...Shadow.sm,
  },
  swapIcon: {
    fontSize: 22,
    color: Colors.gold,
  },
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
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
    paddingVertical: Spacing.lg,
    minHeight: 44,
  },
  resultCode: {
    width: 56,
    backgroundColor: Colors.navy,
    borderRadius: BorderRadius.sm,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    alignItems: 'center',
    marginRight: Spacing.lg,
  },
  resultCodeText: {
    ...Typography.footnoteSemibold,
    color: Colors.white,
    letterSpacing: 1,
  },
  resultInfo: {
    flex: 1,
  },
  resultCity: {
    ...Typography.calloutSemibold,
    color: Colors.textPrimary,
  },
  resultName: {
    ...Typography.footnote,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.systemGray5,
    marginLeft: Spacing.xxl + 56 + Spacing.lg,
  },
  emptyResults: {
    paddingVertical: Spacing.xxxxl,
    alignItems: 'center',
  },
  emptyText: {
    ...Typography.callout,
    color: Colors.textTertiary,
  },
});
