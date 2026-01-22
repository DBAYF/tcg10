import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

// Constants
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants';

interface HeaderProps {
  title: string;
  showSearch?: boolean;
  showNotifications?: boolean;
  showMessages?: boolean;
  showBack?: boolean;
  onSearchChange?: (text: string) => void;
  searchPlaceholder?: string;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showSearch = false,
  showNotifications = false,
  showMessages = false,
  showBack = false,
  onSearchChange,
  searchPlaceholder = 'Search...',
}) => {
  const navigation = useNavigation();
  const unreadMessageCount = useSelector((state: any) => state.social.unreadMessageCount);
  const unreadNotificationCount = useSelector((state: any) => state.notifications.unreadCount);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleNotifications = () => {
    // Navigate to notifications screen
    navigation.navigate('Notifications' as never);
  };

  const handleMessages = () => {
    // Navigate to messages screen
    navigation.navigate('Messages' as never);
  };

  return (
    <View style={styles.container}>
      {/* Top Row */}
      <View style={styles.topRow}>
        {showBack && (
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        )}

        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        <View style={styles.actions}>
          {showMessages && (
            <TouchableOpacity onPress={handleMessages} style={styles.actionButton}>
              <Ionicons name="chatbubble-outline" size={24} color={COLORS.primary} />
              {unreadMessageCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {unreadMessageCount > 99 ? '99+' : unreadMessageCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}

          {showNotifications && (
            <TouchableOpacity onPress={handleNotifications} style={styles.actionButton}>
              <Ionicons name="notifications-outline" size={24} color={COLORS.primary} />
              {unreadNotificationCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {unreadNotificationCount > 99 ? '99+' : unreadNotificationCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Search Row */}
      {showSearch && (
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <Ionicons
              name="search"
              size={20}
              color={COLORS.text.secondary}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder={searchPlaceholder}
              placeholderTextColor={COLORS.text.secondary}
              onChangeText={onSearchChange}
              returnKeyType="search"
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface.light,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface.dark,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  title: {
    ...TYPOGRAPHY.heading1,
    color: COLORS.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.xs,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
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
  searchRow: {
    marginTop: SPACING.sm,
    marginBottom: SPACING.md,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background.light,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.surface.dark,
  },
  searchIcon: {
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
  },
});

export default Header;