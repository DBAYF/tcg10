import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Types
import { Listing } from '../../types';

// Constants
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants';

interface ListingCardProps {
  listing: Listing;
  onPress: () => void;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, onPress }) => {
  return (
    <TouchableOpacity style={styles.listingCard} onPress={onPress}>
      <View style={styles.listingImage}>
        {listing.images && listing.images.length > 0 ? (
          // Placeholder for now - in real app, use Image component
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image" size={24} color={COLORS.primary} />
          </View>
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image" size={24} color={COLORS.primary} />
          </View>
        )}
      </View>
      <View style={styles.listingInfo}>
        <Text style={styles.listingTitle} numberOfLines={1}>
          {listing.title}
        </Text>
        <Text style={styles.listingPrice}>${listing.price}</Text>
        <Text style={styles.listingMeta}>
          {listing.condition} • {listing.listingType.replace('_', ' ')}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const RecentListings: React.FC = () => {
  const navigation = useNavigation();
  const userListings = useSelector((state: any) => state.marketplace.userListings);

  // Get the 3 most recent active listings
  const recentListings = userListings
    .filter((listing: Listing) => listing.status === 'active')
    .slice(0, 3);

  if (recentListings.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No active listings</Text>
        <Text style={styles.emptySubtitle}>List your cards to start selling or trading</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => (navigation as any).navigate('CreateListing')}
        >
          <Text style={styles.createButtonText}>List Card</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleListingPress = (listingId: string) => {
    (navigation as any).navigate('ListingDetail', { listingId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Recent Listings</Text>
        <TouchableOpacity onPress={() => (navigation as any).navigate('Market')}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={recentListings}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListingCard listing={item} onPress={() => handleListingPress(item.id)} />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listingsList}
        ItemSeparatorComponent={() => <View style={{ width: SPACING.md }} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
    fontWeight: '600',
  },
  viewAllText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: '600',
  },
  listingsList: {
    paddingVertical: SPACING.sm,
  },
  listingCard: {
    width: 160,
    backgroundColor: COLORS.surface.light,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.sm,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  listingImage: {
    width: '100%',
    height: 100,
    borderRadius: BORDER_RADIUS.sm,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.background.light,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.background.light,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.surface.dark,
    borderStyle: 'dashed',
  },
  listingInfo: {
    flex: 1,
  },
  listingTitle: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.primary,
    fontWeight: '600',
    marginBottom: 2,
  },
  listingPrice: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
    fontWeight: '700',
    marginBottom: 2,
  },
  listingMeta: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  emptyTitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  emptySubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  createButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  createButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.surface.light,
  },
});

export default RecentListings;