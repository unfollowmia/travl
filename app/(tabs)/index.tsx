import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Colors, Typography, Spacing, BorderRadius, Shadow } from '../../src/theme';
import { useReservationStore } from '../../src/store/useReservationStore';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const resetReservation = useReservationStore((s) => s.resetReservation);

  const handleGetReservation = () => {
    resetReservation();
    router.push('/reservation/airports');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Background decorative element */}
      <View style={styles.bgGlow} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.brand}>travl</Text>
      </View>

      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.tagline}>
          Proof of onward{'\n'}travel in 60{'\n'}seconds.
        </Text>
        <Text style={styles.subtitle}>
          Generate a verifiable flight reservation with a real PNR — no
          full-price ticket needed.
        </Text>
      </View>

      {/* Features */}
      <View style={styles.features}>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>🛡️</Text>
          <Text style={styles.featureText}>Real PNR code</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>⚡</Text>
          <Text style={styles.featureText}>Under 60 seconds</Text>
        </View>
        <View style={styles.featureItem}>
          <Text style={styles.featureIcon}>🍎</Text>
          <Text style={styles.featureText}>Apple Pay</Text>
        </View>
      </View>

      {/* Action */}
      <View style={styles.action}>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.85}
          onPress={handleGetReservation}
        >
          <Text style={styles.buttonText}>Get Reservation</Text>
        </TouchableOpacity>
        <Text style={styles.footnote}>
          No subscription · Pay per reservation
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.navy,
  },
  bgGlow: {
    position: 'absolute',
    top: -100,
    right: -80,
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: width * 0.4,
    backgroundColor: Colors.gold,
    opacity: 0.06,
  },
  header: {
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.md,
  },
  brand: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.gold,
    letterSpacing: 4,
    textTransform: 'lowercase',
  },
  hero: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  tagline: {
    fontSize: 42,
    lineHeight: 50,
    fontWeight: '700',
    color: Colors.white,
    marginBottom: Spacing.xl,
    letterSpacing: -0.5,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.systemGray2,
    lineHeight: 24,
    maxWidth: '90%',
  },
  features: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xxxl,
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Spacing.xxl,
  },
  featureItem: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  featureIcon: {
    fontSize: 24,
  },
  featureText: {
    ...Typography.caption1,
    color: Colors.systemGray2,
  },
  action: {
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Spacing.xxxxl,
    alignItems: 'center',
  },
  button: {
    backgroundColor: Colors.gold,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    width: '100%',
    ...Shadow.lg,
  },
  buttonText: {
    ...Typography.button,
    color: Colors.navy,
    fontSize: 18,
    letterSpacing: 0.5,
  },
  footnote: {
    ...Typography.footnote,
    color: Colors.systemGray2,
    marginTop: Spacing.lg,
  },
});
