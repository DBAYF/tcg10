import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Constants
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants';

interface ActionButtonProps {
  title: string;
  subtitle: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ title, subtitle, icon, onPress }) => {
  return (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
      <View style={styles.actionIcon}>
        <Ionicons name={icon} size={28} color={COLORS.primary} />
      </View>
      <View style={styles.actionContent}>
        <Text style={styles.actionTitle}>{title}</Text>
        <Text style={styles.actionSubtitle}>{subtitle}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={COLORS.text.secondary} />
    </TouchableOpacity>
  );
};

const QuickActions: React.FC = () => {
  const navigation = useNavigation();

  const actions = [
    {
      title: 'Create Deck',
      subtitle: 'Build a new deck for your favorite game',
      icon: 'add-circle-outline' as const,
      onPress: () => navigation.navigate('DeckBuilder' as never),
    },
    {
      title: 'List Card',
      subtitle: 'Sell or trade cards from your collection',
      icon: 'storefront-outline' as const,
      onPress: () => navigation.navigate('CreateListing' as never),
    },
    {
      title: 'Browse Cards',
      subtitle: 'Explore the complete card catalog',
      icon: 'search-outline' as const,
      onPress: () => navigation.navigate('Cards' as never),
    },
    {
      title: 'Find Events',
      subtitle: 'Discover local tournaments and meetups',
      icon: 'calendar-outline' as const,
      onPress: () => {
        // Navigate to events - for now go to home since events screen doesn't exist yet
        navigation.navigate('Home' as never);
      },
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actionsList}>
        {actions.map((action, index) => (
          <ActionButton
            key={index}
            title={action.title}
            subtitle={action.subtitle}
            icon={action.icon}
            onPress={action.onPress}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    ...TYPOGRAPHY.heading2,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  actionsList: {
    backgroundColor: COLORS.surface.light,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface.dark,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.background.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
    fontWeight: '600',
    marginBottom: 2,
  },
  actionSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
  },
});

export default QuickActions;