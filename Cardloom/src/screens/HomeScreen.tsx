import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';

// Components
import Header from '../components/common/Header';
import QuickStats from '../components/home/QuickStats';
import QuickActions from '../components/home/QuickActions';
import RecentDecks from '../components/home/RecentDecks';
import RecentListings from '../components/home/RecentListings';

// Constants
import { COLORS, SPACING, TYPOGRAPHY } from '../constants';

const HomeScreen: React.FC = () => {
  const user = useSelector((state: any) => state.auth.user);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={`Welcome back, ${user?.displayName || 'Collector'}!`}
        showSearch={false}
        showNotifications={true}
        showMessages={true}
      />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Quick Stats */}
          <QuickStats />

          {/* Quick Actions */}
          <QuickActions />

          {/* Recent Activity */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>

            <RecentDecks />
            <RecentListings />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: SPACING.md,
  },
  section: {
    marginTop: SPACING.lg,
  },
  sectionTitle: {
    ...TYPOGRAPHY.heading2,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
});

export default HomeScreen;