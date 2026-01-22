import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Components
import Header from '../components/common/Header';

// Constants
import { COLORS, TYPOGRAPHY } from '../constants';

const ProfileScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Profile"
        showSearch={false}
        showNotifications={false}
        showMessages={false}
      />

      <View style={styles.content}>
        <Text style={styles.placeholder}>Profile Screen - Coming Soon</Text>
        <Text style={styles.description}>
          Manage your profile, collection, and account settings.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  placeholder: {
    ...TYPOGRAPHY.heading1,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default ProfileScreen;