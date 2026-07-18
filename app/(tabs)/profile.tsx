import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, BorderRadius } from '../../src/theme';

interface SettingRowProps {
  title: string;
  subtitle?: string;
  isLast?: boolean;
}

function SettingRow({ title, subtitle, isLast }: SettingRowProps) {
  return (
    <TouchableOpacity
      style={[styles.settingRow, !isLast && styles.settingRowBorder]}
      activeOpacity={0.6}
    >
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
        {/* Saved Passengers */}
        <Text style={styles.sectionTitle}>SAVED PASSENGERS</Text>
        <View style={styles.section}>
          <SettingRow
            title="Add Passenger"
            subtitle="Save passport details for quick booking"
            isLast
          />
        </View>

        {/* Receipts */}
        <Text style={styles.sectionTitle}>RECEIPTS & PAYMENTS</Text>
        <View style={styles.section}>
          <SettingRow title="Payment Methods" isLast={false} />
          <SettingRow title="Receipts" isLast />
        </View>

        {/* Preferences */}
        <Text style={styles.sectionTitle}>PREFERENCES</Text>
        <View style={styles.section}>
          <SettingRow title="Notifications" isLast={false} />
          <SettingRow title="Appearance" isLast />
        </View>

        {/* Support */}
        <Text style={styles.sectionTitle}>SUPPORT</Text>
        <View style={styles.section}>
          <SettingRow title="Help Center" isLast={false} />
          <SettingRow title="Contact Us" isLast={false} />
          <SettingRow title="Privacy Policy" isLast={false} />
          <SettingRow title="Terms of Service" isLast={false} />
          <SettingRow title="App Version" subtitle="1.0.0" isLast />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  title: {
    ...Typography.title1,
    color: Colors.textPrimary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: Spacing.xxxxl,
  },
  sectionTitle: {
    ...Typography.footnoteSemibold,
    color: Colors.textTertiary,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xxl,
    paddingBottom: Spacing.sm,
    letterSpacing: 0.5,
  },
  section: {
    backgroundColor: Colors.card,
    marginHorizontal: Spacing.lg,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  settingRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    ...Typography.body,
    color: Colors.textPrimary,
  },
  settingSubtitle: {
    ...Typography.footnote,
    color: Colors.textTertiary,
    marginTop: 2,
  },
  chevron: {
    fontSize: 24,
    color: Colors.systemGray2,
    marginLeft: Spacing.sm,
  },
});
