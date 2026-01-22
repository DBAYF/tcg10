import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

// Components
import Header from '../components/common/Header';
import ListingCard from '../components/marketplace/ListingCard';

// Types
import { Listing, FilterOptions } from '../types';

// Constants
import { COLORS, TYPOGRAPHY, SPACING, TCG_GAMES } from '../constants';

const MarketplaceScreen: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.auth.user);

  // State
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState<'all' | 'selling' | 'offers'>('all');
  const [selectedGame, setSelectedGame] = useState<string | null>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'price_low' | 'price_high' | 'ending_soon'>('newest');

  // Mock data for demonstration
  useEffect(() => {
    loadListings();
  }, [selectedTab, selectedGame, sortBy]);

  const loadListings = async () => {
    setLoading(true);
    // Mock listings loading - in real app, this would be an API call
    setTimeout(() => {
      const mockListings: Listing[] = Array.from({ length: 20 }, (_, index) => ({
        id: `listing-${index}`,
        sellerId: 'seller-1',
        cardId: `card-${index}`,
        title: `Rare Card ${index + 1}`,
        description: 'Perfect condition, never played',
        price: Math.random() * 100 + 5,
        currency: 'USD',
        condition: ['mint', 'near_mint', 'excellent'][Math.floor(Math.random() * 3)] as any,
        isFoil: Math.random() > 0.7,
        quantity: Math.floor(Math.random() * 4) + 1,
        listingType: Math.random() > 0.8 ? 'trade' : 'sale',
        status: 'active',
        images: [],
        location: {
          city: 'New York',
          country: 'US',
          latitude: 40.7128,
          longitude: -74.0060,
        },
        shipping: {
          freeShipping: Math.random() > 0.5,
          cost: Math.random() * 10,
          method: 'Standard Shipping',
          shipsFrom: {
            city: 'New York',
            country: 'US',
            latitude: 40.7128,
            longitude: -74.0060,
          },
          shipsTo: ['US', 'CA', 'UK'],
        },
        language: 'English',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));
      setListings(mockListings);
      setLoading(false);
    }, 1000);
  };

  const handleListingPress = (listing: Listing) => {
    // Navigate to listing detail
    console.log('Listing pressed:', listing);
  };

  const handleCreateListing = () => {
    // Navigate to create listing screen
    console.log('Create listing');
  };

  const gameFilters = [
    { id: 'all', name: 'All Games' },
    ...Object.values(TCG_GAMES).map(game => ({
      id: game.id,
      name: game.displayName,
    })),
  ];

  const sortOptions = [
    { id: 'newest', label: 'Newest First' },
    { id: 'price_low', label: 'Price: Low to High' },
    { id: 'price_high', label: 'Price: High to Low' },
    { id: 'ending_soon', label: 'Ending Soon' },
  ];

  const renderListing = ({ item }: { item: Listing }) => (
    <ListingCard
      listing={item}
      onPress={() => handleListingPress(item)}
      showSeller={selectedTab === 'all'}
    />
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="storefront-outline" size={64} color={COLORS.text.secondary} />
      <Text style={styles.emptyTitle}>No listings found</Text>
      <Text style={styles.emptySubtitle}>
        {selectedTab === 'selling'
          ? 'You haven\'t created any listings yet'
          : 'No listings match your current filters'
        }
      </Text>
      {selectedTab === 'selling' && (
        <TouchableOpacity
          style={styles.createButton}
          onPress={handleCreateListing}
        >
          <Text style={styles.createButtonText}>Create Your First Listing</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Marketplace"
        showSearch={true}
        showNotifications={false}
        showMessages={false}
      />

      {/* Tabs */}
      <View style={styles.tabs}>
        {[
          { id: 'all', label: 'Browse', icon: 'grid-outline' },
          { id: 'selling', label: 'Selling', icon: 'storefront-outline' },
          { id: 'offers', label: 'Offers', icon: 'heart-outline' },
        ].map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tab, selectedTab === tab.id && styles.tabActive]}
            onPress={() => setSelectedTab(tab.id as any)}
          >
            <Ionicons
              name={tab.icon as any}
              size={20}
              color={selectedTab === tab.id ? COLORS.primary : COLORS.text.secondary}
            />
            <Text
              style={[styles.tabText, selectedTab === tab.id && styles.tabTextActive]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Filters */}
      <View style={styles.filters}>
        {/* Game Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.gameFilters}
        >
          {gameFilters.map(game => (
            <TouchableOpacity
              key={game.id}
              style={[
                styles.gameFilter,
                selectedGame === game.id && styles.gameFilterActive
              ]}
              onPress={() => setSelectedGame(game.id)}
            >
              <Text
                style={[
                  styles.gameFilterText,
                  selectedGame === game.id && styles.gameFilterTextActive
                ]}
              >
                {game.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Sort */}
        <TouchableOpacity style={styles.sortButton}>
          <Ionicons name="filter-outline" size={20} color={COLORS.primary} />
          <Text style={styles.sortButtonText}>
            {sortOptions.find(option => option.id === sortBy)?.label}
          </Text>
          <Ionicons name="chevron-down" size={16} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Listings */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading listings...</Text>
        </View>
      ) : (
        <FlatList
          data={listings}
          renderItem={renderListing}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listingsContainer}
          ListEmptyComponent={renderEmpty}
        />
      )}

      {/* Create Listing FAB */}
      {selectedTab === 'selling' && (
        <TouchableOpacity
          style={styles.fab}
          onPress={handleCreateListing}
        >
          <Ionicons name="add" size={24} color={COLORS.surface.light} />
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface.dark,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    gap: SPACING.xs,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  tabTextActive: {
    color: COLORS.primary,
  },
  filters: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface.dark,
  },
  gameFilters: {
    paddingRight: SPACING.md,
  },
  gameFilter: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
    borderRadius: 20,
    backgroundColor: COLORS.surface.light,
  },
  gameFilterActive: {
    backgroundColor: COLORS.primary,
  },
  gameFilterText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  gameFilterTextActive: {
    color: COLORS.surface.light,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    backgroundColor: COLORS.surface.light,
    gap: SPACING.xs,
  },
  sortButtonText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.primary,
    fontWeight: '500',
  },
  listingsContainer: {
    padding: SPACING.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  emptyTitle: {
    ...TYPOGRAPHY.heading2,
    color: COLORS.text.primary,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  createButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: 25,
  },
  createButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.surface.light,
  },
  fab: {
    position: 'absolute',
    bottom: SPACING.xl,
    right: SPACING.xl,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default MarketplaceScreen;