import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Constants
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, onPress }) => {
  return (
    <TouchableOpacity style={styles.statCard} onPress={onPress}>
      <View style={styles.statIcon}>
        <Ionicons name={icon} size={24} color={COLORS.primary} />
      </View>
      <View style={styles.statContent}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const QuickStats: React.FC = () => {
  const navigation = useNavigation();
  const collections = useSelector((state: any) => state.collections);
  const decks = useSelector((state: any) => state.decks);
  const marketplace = useSelector((state: any) => state.marketplace);

  const stats = [
    {
      title: 'Collection',
      value: collections.items.length,
      icon: 'albums-outline' as const,
      onPress: () => navigation.navigate('Profile' as never), // Navigate to collection tab
    },
    {
      title: 'Decks',
      value: decks.userDecks.length,
      icon: 'layers-outline' as const,
      onPress: () => navigation.navigate('Decks' as never),
    },
    {
      title: 'Active Listings',
      value: marketplace.userListings.filter((l: any) => l.status === 'active').length,
      icon: 'storefront-outline' as const,
      onPress: () => navigation.navigate('Market' as never),
    },
    {
      title: 'Collection Value',
      value: `$${collections.totalValue.toFixed(2)}`,
      icon: 'cash-outline' as const,
      onPress: () => navigation.navigate('Profile' as never),
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Quick Stats</Text>
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            onPress={stat.onPress}
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: COLORS.surface.light,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.background.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    ...TYPOGRAPHY.heading1,
    color: COLORS.primary,
    fontWeight: '700',
  },
  statTitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    marginTop: 2,
  },
});

export default QuickStats;