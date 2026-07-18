import { View, Text, StyleSheet } from 'react-native';
import { Colors, Typography, Spacing } from '../theme';

interface Props {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

export function ProgressIndicator({ currentStep, totalSteps, labels }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.dots}>
        {Array.from({ length: totalSteps }).map((_, i) => (
          <View key={i} style={styles.dotWrapper}>
            <View
              style={[
                styles.dot,
                i < currentStep && styles.dotCompleted,
                i === currentStep && styles.dotActive,
              ]}
            />
            {i < totalSteps - 1 && (
              <View
                style={[
                  styles.line,
                  i < currentStep && styles.lineCompleted,
                ]}
              />
            )}
          </View>
        ))}
      </View>
      {labels && (
        <Text style={styles.label}>
          Step {currentStep + 1} of {totalSteps}: {labels[currentStep]}
        </Text>
      )}
    </View>
  );
}

const DOT_SIZE = 10;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  dotWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: Colors.systemGray4,
  },
  dotCompleted: {
    backgroundColor: Colors.gold,
  },
  dotActive: {
    backgroundColor: Colors.gold,
    transform: [{ scale: 1.3 }],
  },
  line: {
    width: 32,
    height: 2,
    backgroundColor: Colors.systemGray4,
    marginHorizontal: 4,
  },
  lineCompleted: {
    backgroundColor: Colors.gold,
  },
  label: {
    ...Typography.footnote,
    color: Colors.textTertiary,
    textAlign: 'center',
  },
});
