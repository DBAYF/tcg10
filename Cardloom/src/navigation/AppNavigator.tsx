import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { View, Text } from 'react-native';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import CardCatalogScreen from '../screens/CardCatalogScreen';
import MarketplaceScreen from '../screens/MarketplaceScreen';
import DecksScreen from '../screens/DecksScreen';
import ProfileScreen from '../screens/ProfileScreen';

// Import components
import TabBar from '../components/navigation/TabBar';

// Types
import { RootStackParamList, TabParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

// Main tab navigator
function MainTabNavigator() {
  return (
    <Tab.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Cards" component={CardCatalogScreen} />
      <Tab.Screen name="Market" component={MarketplaceScreen} />
      <Tab.Screen name="Decks" component={DecksScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Authentication screens placeholder
function AuthNavigator() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Auth Screens - Coming Soon</Text>
    </View>
  );
}

// Main app navigator
export default function AppNavigator() {
  const isAuthenticated = useSelector((state: any) => !!state.auth.token);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}