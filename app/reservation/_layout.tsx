import { Stack, router } from 'expo-router';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '../../src/theme';

export default function ReservationLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.navy },
        headerTintColor: Colors.white,
        headerTitleStyle: {
          ...Typography.title3,
          color: Colors.white,
        },
        headerBackVisible: false,
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.cancelButton}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        ),
        contentStyle: { backgroundColor: Colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="airports"
        options={{ title: 'Airports' }}
      />
      <Stack.Screen
        name="details"
        options={{ title: 'Travel Details' }}
      />
      <Stack.Screen
        name="passenger"
        options={{ title: 'Passenger' }}
      />
      <Stack.Screen
        name="review"
        options={{
          title: 'Review',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.backText}>‹ Back</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="result"
        options={{
          title: 'Reservation',
          headerShown: false,
          gestureEnabled: false,
        }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  cancelButton: {
    paddingHorizontal: Spacing.sm,
  },
  cancelText: {
    ...Typography.body,
    color: Colors.systemGray2,
  },
  backButton: {
    paddingHorizontal: Spacing.sm,
  },
  backText: {
    ...Typography.body,
    color: Colors.white,
  },
});
