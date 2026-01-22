import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

// Constants
import { COLORS, SPACING, TYPOGRAPHY } from '../../constants';

const TabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  const unreadNotificationCount = useSelector((state: any) => state.notifications.unreadCount);

  const tabs = [
    {
      name: 'Home',
      icon: 'home-outline' as const,
      activeIcon: 'home' as const,
    },
    {
      name: 'Cards',
      icon: 'grid-outline' as const,
      activeIcon: 'grid' as const,
    },
    {
      name: 'Market',
      icon: 'storefront-outline' as const,
      activeIcon: 'storefront' as const,
    },
    {
      name: 'Decks',
      icon: 'layers-outline' as const,
      activeIcon: 'layers' as const,
    },
    {
      name: 'Profile',
      icon: 'person-outline' as const,
      activeIcon: 'person' as const,
    },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab, index) => {
        const isFocused = state.index === index;
        const route = state.routes[index];
        const { options } = descriptors[route.key];

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            key={tab.name}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tab}
          >
            <View style={styles.tabContent}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name={isFocused ? tab.activeIcon : tab.icon}
                  size={24}
                  color={isFocused ? COLORS.primary : COLORS.text.secondary}
                />
                {tab.name === 'Profile' && unreadNotificationCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}
                    </Text>
                  </View>
                )}
              </View>
              <Text
                style={[
                  styles.label,
                  { color: isFocused ? COLORS.primary : COLORS.text.secondary }
                ]}
              >
                {tab.name}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface.light,
    borderTopWidth: 1,
    borderTopColor: COLORS.surface.dark,
    paddingBottom: SPACING.md,
    paddingTop: SPACING.sm,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    position: 'relative',
    marginBottom: SPACING.xs,
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: COLORS.surface.light,
    fontSize: 12,
    fontWeight: '600',
  },
  label: {
    fontSize: TYPOGRAPHY.caption.fontSize,
    fontWeight: '500',
  },
});

export default TabBar;