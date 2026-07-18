import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../../src/theme';

export default function HomeScreen() {
  const handleGetReservation = () => {
    // Placeholder: navigate to reservation flow
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.brand}>travl</Text>
      </View>

      <View style={styles.hero}>
        <Text style={styles.tagline}>
          Proof of onward travel.{'\n'}In under 60 seconds.
        </Text>
        <Text style={styles.subtitle}>
          Generate a verifiable flight reservation with a real PNR — no full-price
          ticket needed.
        </Text>
      </View>

      <View style={styles.action}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.85}
          onPress={handleGetReservation}
        >
          <Text style={styles.buttonText}>Get Reservation</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.navy,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  brand: {
    ...Typography.title2,
    color: Colors.gold,
    letterSpacing: 2,
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  tagline: {
    ...Typography.largeTitle,
    color: Colors.white,
    marginBottom: Spacing.lg,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.systemGray2,
    lineHeight: 24,
  },
  action: {
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Spacing.xxxxl,
  },
  button: {
    backgroundColor: Colors.gold,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    ...Shadow.md,
  },
  buttonText: {
    ...Typography.button,
    color: Colors.navy,
  },
});
