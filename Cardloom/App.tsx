import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Simple loading screen
const LoadingScreen = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Cardloom TCG</Text>
    <Text style={styles.subtitle}>Loading...</Text>
  </View>
);

// Simple test app to verify basic functionality
const TestApp = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>🎴 Cardloom TCG</Text>
        <Text style={styles.subtitle}>Welcome to the Card Trading Platform!</Text>
        <View style={styles.features}>
          <Text style={styles.feature}>• Card Catalog</Text>
          <Text style={styles.feature}>• Marketplace</Text>
          <Text style={styles.feature}>• Deck Builder</Text>
          <Text style={styles.feature}>• Collection Manager</Text>
        </View>
        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6366F1',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: 'white',
    marginBottom: 30,
    textAlign: 'center',
  },
  features: {
    alignItems: 'center',
  },
  feature: {
    fontSize: 16,
    color: 'white',
    marginBottom: 5,
  },
});

export default function App() {
  // For now, just show the test app to verify it loads
  return <TestApp />;
}
