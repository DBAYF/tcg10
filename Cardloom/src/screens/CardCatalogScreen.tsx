import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, FlatList, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

// Services
import { tcgApi, TCGCard, TCGSearchFilters, TCGSearchResult } from '../services/tcgApis';
import localStorage from '../services/localStorage';

// Components
import Header from '../components/common/Header';
import CardGrid from '../components/cards/CardGrid';
import FilterSheet from '../components/cards/FilterSheet';
import CardDetailModal from '../components/cards/CardDetailModal';
import AdvancedSearchModal from '../components/cards/AdvancedSearchModal';

// Types
import { Card, FilterOptions } from '../types';

// Constants
import { COLORS, TYPOGRAPHY, SPACING, TCG_GAMES } from '../constants';

const CardCatalogScreen: React.FC = () => {
  const dispatch = useDispatch();
  const selectedGame = useSelector((state: any) => state.app.selectedGame);

  // State
  const [cards, setCards] = useState<TCGCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [filters, setFilters] = useState<TCGSearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [selectedGameFilter, setSelectedGameFilter] = useState<string>(
    selectedGame || 'pokemon'
  );
  const [selectedCard, setSelectedCard] = useState<TCGCard | null>(null);
  const [showCardDetail, setShowCardDetail] = useState(false);
  const [comparisonCards, setComparisonCards] = useState<TCGCard[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'rarity' | 'release'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<TCGCard[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 50,
    offset: 0,
    hasMore: false,
  });

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load initial data
  useEffect(() => {
    loadRecentSearches();
    loadFavorites();
  }, []);

  // Search when filters change
  useEffect(() => {
    if (debouncedSearchQuery || Object.keys(filters).length > 0) {
      searchCards();
    } else {
      loadFeaturedCards();
    }
  }, [selectedGameFilter, debouncedSearchQuery, filters, sortBy, sortOrder]);

  const loadRecentSearches = async () => {
    const searches = await localStorage.getRecentSearches();
    setRecentSearches(searches);
  };

  const loadFavorites = async () => {
    const favs = await localStorage.getFavorites();
    setFavorites(favs);
  };

  const loadFeaturedCards = async () => {
    setLoading(true);
    try {
      const result = await tcgApi.searchCards(selectedGameFilter, {
        limit: 50,
        offset: 0,
      });
      setCards(result.cards);
      setPagination({
        total: result.totalCount,
        limit: 50,
        offset: 0,
        hasMore: result.hasMore,
      });
    } catch (error) {
      console.error('Error loading featured cards:', error);
      Alert.alert('Error', 'Failed to load cards. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const searchCards = async (loadMore = false) => {
    if (!debouncedSearchQuery && Object.keys(filters).length === 0) return;

    setLoading(true);
    try {
      const offset = loadMore ? pagination.offset + pagination.limit : 0;
      const searchFilters: TCGSearchFilters = {
        ...filters,
        name: debouncedSearchQuery || undefined,
        limit: pagination.limit,
        offset,
      };

      const result = await tcgApi.searchCards(selectedGameFilter, searchFilters);

      if (loadMore) {
        setCards(prev => [...prev, ...result.cards]);
      } else {
        setCards(result.cards);
        // Save to recent searches
        if (debouncedSearchQuery) {
          await localStorage.addRecentSearch(debouncedSearchQuery);
          loadRecentSearches();
        }
      }

      setPagination({
        total: result.totalCount,
        limit: pagination.limit,
        offset,
        hasMore: result.hasMore,
      });
    } catch (error) {
      console.error('Error searching cards:', error);
      Alert.alert('Search Error', 'Failed to search cards. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleCardPress = useCallback(async (card: TCGCard) => {
    setSelectedCard(card);
    setShowCardDetail(true);

    // Track viewed cards for analytics
    await localStorage.updateUsageStats({ cardsViewed: (await localStorage.getUsageStats()).cardsViewed + 1 });

    // Update recently viewed
    const viewedCards = await localStorage.getItem('viewed_cards') || [];
    const updatedViewed = [card, ...viewedCards.filter(c => c.id !== card.id)].slice(0, 20);
    await localStorage.setItem('viewed_cards', updatedViewed);
  }, []);

  const handleGameSelect = useCallback((gameId: string) => {
    setSelectedGameFilter(gameId);
    setCards([]);
    setPagination({ total: 0, limit: 50, offset: 0, hasMore: false });
  }, []);

  const handleFiltersChange = useCallback((newFilters: TCGSearchFilters) => {
    setFilters(newFilters);
    setShowFilters(false);
  }, []);

  const handleAdvancedSearch = useCallback((searchFilters: TCGSearchFilters) => {
    setFilters(searchFilters);
    setShowAdvancedSearch(false);
  }, []);

  const handleAddToComparison = useCallback((card: TCGCard) => {
    if (comparisonCards.length < 4 && !comparisonCards.some(c => c.id === card.id)) {
      setComparisonCards(prev => [...prev, card]);
      Alert.alert('Added to Comparison', `${card.name} added to comparison`);
    } else if (comparisonCards.some(c => c.id === card.id)) {
      Alert.alert('Already Added', 'This card is already in comparison');
    } else {
      Alert.alert('Comparison Full', 'You can compare up to 4 cards at once');
    }
  }, [comparisonCards]);

  const handleToggleFavorite = useCallback(async (card: TCGCard) => {
    const isFavorite = favorites.some(f => f.id === card.id);
    if (isFavorite) {
      await localStorage.removeFromFavorites(card.id);
      setFavorites(prev => prev.filter(f => f.id !== card.id));
      Alert.alert('Removed from Favorites', `${card.name} removed from favorites`);
    } else {
      await localStorage.addToFavorites(card);
      setFavorites(prev => [...prev, card]);
      Alert.alert('Added to Favorites', `${card.name} added to favorites`);
    }
  }, [favorites]);

  const handleSortChange = useCallback((newSortBy: string, newSortOrder: 'asc' | 'desc') => {
    setSortBy(newSortBy as any);
    setSortOrder(newSortOrder);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (pagination.hasMore && !loading) {
      searchCards(true);
    }
  }, [pagination.hasMore, loading]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    if (debouncedSearchQuery || Object.keys(filters).length > 0) {
      searchCards();
    } else {
      loadFeaturedCards();
    }
  }, [debouncedSearchQuery, filters]);

  const handleQuickSearch = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // Sort cards based on current sort settings
  const sortedCards = useMemo(() => {
    return [...cards].sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = a.price || 0;
          bValue = b.price || 0;
          break;
        case 'rarity':
          const rarityOrder = { common: 1, uncommon: 2, rare: 3, 'holo_rare': 4, super_rare: 5, secret_rare: 6, mythic_rare: 7 };
          aValue = rarityOrder[a.rarity as keyof typeof rarityOrder] || 0;
          bValue = rarityOrder[b.rarity as keyof typeof rarityOrder] || 0;
          break;
        case 'release':
          aValue = new Date(a.releaseDate || '2024-01-01').getTime();
          bValue = new Date(b.releaseDate || '2024-01-01').getTime();
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
  }, [cards, sortBy, sortOrder]);

  const gameTabs = Object.values(TCG_GAMES).map(game => (
    <TouchableOpacity
      key={game.id}
      style={[
        styles.gameTab,
        selectedGameFilter === game.id && styles.gameTabActive
      ]}
      onPress={() => handleGameSelect(game.id)}
    >
      <Text
        style={[
          styles.gameTabText,
          selectedGameFilter === game.id && styles.gameTabTextActive
        ]}
      >
        {game.displayName}
      </Text>
    </TouchableOpacity>
  ));

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Card Catalog"
        showSearch={true}
        showNotifications={false}
        showMessages={false}
        onSearchChange={setSearchQuery}
        searchPlaceholder={`Search ${TCG_GAMES[selectedGameFilter]?.displayName || 'TCG'} cards...`}
      />

      {/* Game Selector */}
      <View style={styles.gameSelector}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.gameTabsContainer}
        >
          {gameTabs}
        </ScrollView>
      </View>

      {/* Toolbar */}
      <View style={styles.toolbar}>
        <View style={styles.leftToolbar}>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={() => setShowFilters(true)}
          >
            <Ionicons name="filter-outline" size={20} color={COLORS.primary} />
            <Text style={styles.filterButtonText}>Filters</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => setShowAdvancedSearch(true)}
          >
            <Ionicons name="search-circle-outline" size={20} color={COLORS.primary} />
            <Text style={styles.searchButtonText}>Advanced</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.rightToolbar}>
          <TouchableOpacity
            style={[styles.viewModeButton, viewMode === 'grid' && styles.viewModeButtonActive]}
            onPress={() => setViewMode('grid')}
          >
            <Ionicons name="grid-outline" size={18} color={viewMode === 'grid' ? COLORS.surface.light : COLORS.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.viewModeButton, viewMode === 'list' && styles.viewModeButtonActive]}
            onPress={() => setViewMode('list')}
          >
            <Ionicons name="list-outline" size={18} color={viewMode === 'list' ? COLORS.surface.light : COLORS.primary} />
          </TouchableOpacity>

          {comparisonCards.length > 0 && (
            <TouchableOpacity
              style={styles.compareButton}
              onPress={() => setShowComparison(true)}
            >
              <Ionicons name="git-compare-outline" size={18} color={COLORS.surface.light} />
              <Text style={styles.compareButtonText}>{comparisonCards.length}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Sort and Results Bar */}
      <View style={styles.sortBar}>
        <TouchableOpacity style={styles.sortButton}>
          <Text style={styles.sortButtonText}>
            Sort: {sortBy.replace('_', ' ').toUpperCase()} {sortOrder === 'asc' ? '↑' : '↓'}
          </Text>
          <Ionicons name="chevron-down" size={16} color={COLORS.primary} />
        </TouchableOpacity>

        <Text style={styles.resultsText}>
          {pagination.total > 0 ? `${pagination.total.toLocaleString()} cards` : 'No cards found'}
        </Text>
      </View>

      {/* Recent Searches */}
      {!debouncedSearchQuery && recentSearches.length > 0 && (
        <View style={styles.recentSearches}>
          <Text style={styles.recentSearchesTitle}>Recent Searches:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {recentSearches.slice(0, 5).map((search, index) => (
              <TouchableOpacity
                key={index}
                style={styles.recentSearchChip}
                onPress={() => handleQuickSearch(search)}
              >
                <Text style={styles.recentSearchText}>{search}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Card Display */}
      <View style={styles.cardContainer}>
        {loading && cards.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Searching cards...</Text>
          </View>
        ) : sortedCards.length > 0 ? (
          <FlatList
            data={sortedCards}
            renderItem={({ item }) => (
              <CardGrid
                cards={[item]}
                onCardPress={handleCardPress}
                numColumns={viewMode === 'grid' ? 3 : 1}
                showActions={true}
                onAddToComparison={handleAddToComparison}
                onToggleFavorite={handleToggleFavorite}
                isFavorite={favorites.some(f => f.id === item.id)}
                inComparison={comparisonCards.some(c => c.id === item.id)}
              />
            )}
            key={viewMode} // Force re-render when view mode changes
            keyExtractor={(item) => item.id}
            numColumns={viewMode === 'grid' ? 3 : 1}
            showsVerticalScrollIndicator={false}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                colors={[COLORS.primary]}
              />
            }
            ListFooterComponent={
              loading && cards.length > 0 ? (
                <View style={styles.loadMoreContainer}>
                  <ActivityIndicator size="small" color={COLORS.primary} />
                  <Text style={styles.loadMoreText}>Loading more cards...</Text>
                </View>
              ) : null
            }
          />
        ) : debouncedSearchQuery || Object.keys(filters).length > 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={64} color={COLORS.text.secondary} />
            <Text style={styles.emptyTitle}>No cards found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your search terms or filters
            </Text>
            <TouchableOpacity
              style={styles.clearSearchButton}
              onPress={() => {
                setSearchQuery('');
                setFilters({});
              }}
            >
              <Text style={styles.clearSearchText}>Clear Search</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.welcomeContainer}>
            <Ionicons name="card-outline" size={64} color={COLORS.primary} />
            <Text style={styles.welcomeTitle}>Explore the Card Catalog</Text>
            <Text style={styles.welcomeSubtitle}>
              Search for cards across all supported TCGs or browse featured cards
            </Text>
          </View>
        )}
      </View>

      {/* Modals */}
      <FilterSheet
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        gameId={selectedGameFilter}
      />

      <AdvancedSearchModal
        visible={showAdvancedSearch}
        onClose={() => setShowAdvancedSearch(false)}
        onSearch={handleAdvancedSearch}
        gameId={selectedGameFilter}
        initialFilters={filters}
      />

      {selectedCard && (
        <CardDetailModal
          visible={showCardDetail}
          onClose={() => setShowCardDetail(false)}
          card={selectedCard}
          onAddToComparison={handleAddToComparison}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={favorites.some(f => f.id === selectedCard.id)}
          inComparison={comparisonCards.some(c => c.id === selectedCard.id)}
        />
      )}

      {showComparison && (
        <CardComparison
          visible={showComparison}
          onClose={() => setShowComparison(false)}
          cards={comparisonCards}
          onRemoveCard={(cardId) => setComparisonCards(prev => prev.filter(c => c.id !== cardId))}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
  gameSelector: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface.dark,
  },
  gameTabsContainer: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  gameTab: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
    borderRadius: 20,
    backgroundColor: COLORS.surface.light,
  },
  gameTabActive: {
    backgroundColor: COLORS.primary,
  },
  gameTabText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  gameTabTextActive: {
    color: COLORS.surface.light,
  },
  filtersBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface.dark,
  },
  filterButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    backgroundColor: COLORS.surface.light,
  },
  filterButtonText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.primary,
    fontWeight: '600',
  },
  resultsText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
  },
  cardGridContainer: {
    flex: 1,
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
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
});

export default CardCatalogScreen;