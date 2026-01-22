import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Services
import localStorage from '../services/localStorage';

// Components
import Header from '../components/common/Header';
import CardGrid from '../components/cards/CardGrid';

// Types
import { TCGCard } from '../services/tcgApis';

// Constants
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, TCG_GAMES } from '../constants';

interface CollectionItem {
  id: string;
  cardId: string;
  name: string;
  game: string;
  imageUrl?: string;
  price?: number;
  condition: string;
  quantity: number;
  foil: boolean;
  set?: string;
  rarity?: string;
  dateAdded: string;
}

const CollectionScreen: React.FC = () => {
  const [collection, setCollection] = useState<CollectionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState<string>('all');
  const [selectedCondition, setSelectedCondition] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'date' | 'rarity'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useFocusEffect(
    React.useCallback(() => {
      loadCollection();
    }, [])
  );

  const loadCollection = async () => {
    try {
      setLoading(true);
      const collectionData = await localStorage.getCollection();
      setCollection(collectionData);
    } catch (error) {
      console.error('Error loading collection:', error);
      Alert.alert('Error', 'Failed to load collection');
    } finally {
      setLoading(false);
    }
  };

  const handleCardPress = (item: CollectionItem) => {
    // Navigate to card detail or show options
    Alert.alert(
      item.name,
      `Condition: ${item.condition}\nQuantity: ${item.quantity}\nPrice: $${item.price?.toFixed(2) || 'N/A'}`,
      [
        { text: 'Close', style: 'cancel' },
        {
          text: 'Edit',
          onPress: () => handleEditCard(item),
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => handleRemoveCard(item.id),
        },
      ]
    );
  };

  const handleEditCard = (item: CollectionItem) => {
    // For now, just show a simple edit dialog
    Alert.alert('Edit Card', 'Edit functionality coming soon!');
  };

  const handleRemoveCard = async (cardId: string) => {
    Alert.alert(
      'Remove Card',
      'Are you sure you want to remove this card from your collection?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              await localStorage.removeFromCollection(cardId);
              await loadCollection();
              Alert.alert('Success', 'Card removed from collection');
            } catch (error) {
              Alert.alert('Error', 'Failed to remove card');
            }
          },
        },
      ]
    );
  };

  const handleAddCard = () => {
    Alert.alert('Add Card', 'Add card functionality - navigate to card catalog to add cards');
  };

  const handleExportCollection = async () => {
    try {
      const data = await localStorage.exportData();
      Alert.alert('Export Success', 'Collection data exported to console');
      console.log('Collection Export:', data);
    } catch (error) {
      Alert.alert('Error', 'Failed to export collection');
    }
  };

  const handleImportCollection = () => {
    Alert.alert('Import Collection', 'Import functionality coming soon!');
  };

  // Filter and sort collection
  const filteredAndSortedCollection = useMemo(() => {
    let filtered = collection;

    // Filter by game
    if (selectedGame !== 'all') {
      filtered = filtered.filter(item => item.game === selectedGame);
    }

    // Filter by condition
    if (selectedCondition !== 'all') {
      filtered = filtered.filter(item => item.condition === selectedCondition);
    }

    // Sort
    filtered.sort((a, b) => {
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
        case 'date':
          aValue = new Date(a.dateAdded).getTime();
          bValue = new Date(b.dateAdded).getTime();
          break;
        case 'rarity':
          const rarityOrder = { common: 1, uncommon: 2, rare: 3, 'holo_rare': 4, super_rare: 5, secret_rare: 6, mythic_rare: 7 };
          aValue = rarityOrder[a.rarity as keyof typeof rarityOrder] || 0;
          bValue = rarityOrder[b.rarity as keyof typeof rarityOrder] || 0;
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

    return filtered;
  }, [collection, selectedGame, selectedCondition, sortBy, sortOrder]);

  // Calculate collection statistics
  const collectionStats = useMemo(() => {
    const totalCards = filteredAndSortedCollection.reduce((sum, item) => sum + item.quantity, 0);
    const totalValue = filteredAndSortedCollection.reduce((sum, item) => sum + (item.price || 0) * item.quantity, 0);
    const uniqueCards = filteredAndSortedCollection.length;
    const gameBreakdown = filteredAndSortedCollection.reduce((acc, item) => {
      acc[item.game] = (acc[item.game] || 0) + item.quantity;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalCards,
      totalValue,
      uniqueCards,
      gameBreakdown,
    };
  }, [filteredAndSortedCollection]);

  const gameFilters = [
    { id: 'all', name: 'All Games', count: collectionStats.totalCards },
    ...Object.values(TCG_GAMES).map(game => ({
      id: game.id,
      name: game.displayName,
      count: collectionStats.gameBreakdown[game.id] || 0,
    })),
  ];

  const conditionFilters = [
    { id: 'all', name: 'All Conditions' },
    { id: 'mint', name: 'Mint' },
    { id: 'near_mint', name: 'Near Mint' },
    { id: 'excellent', name: 'Excellent' },
    { id: 'good', name: 'Good' },
    { id: 'light_played', name: 'Light Played' },
    { id: 'poor', name: 'Poor' },
  ];

  const renderStatsCard = (title: string, value: string | number, subtitle?: string) => (
    <View style={styles.statsCard}>
      <Text style={styles.statsValue}>{value}</Text>
      <Text style={styles.statsTitle}>{title}</Text>
      {subtitle && <Text style={styles.statsSubtitle}>{subtitle}</Text>}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="My Collection" showSearch={false} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading collection...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="My Collection"
        showSearch={false}
        showNotifications={false}
        showMessages={false}
      />

      {/* Collection Stats */}
      <View style={styles.statsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsScroll}>
          {renderStatsCard('Total Cards', collectionStats.totalCards)}
          {renderStatsCard('Unique Cards', collectionStats.uniqueCards)}
          {renderStatsCard('Total Value', `$${collectionStats.totalValue.toFixed(2)}`)}
          {renderStatsCard('Games', Object.keys(collectionStats.gameBreakdown).length, 'different TCGs')}
        </ScrollView>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        {/* Game Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gameFilterScroll}>
          {gameFilters.map(game => (
            <TouchableOpacity
              key={game.id}
              style={[
                styles.filterChip,
                selectedGame === game.id && styles.filterChipActive
              ]}
              onPress={() => setSelectedGame(game.id)}
            >
              <Text style={[
                styles.filterChipText,
                selectedGame === game.id && styles.filterChipTextActive
              ]}>
                {game.name} ({game.count})
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Condition Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.conditionFilterScroll}>
          {conditionFilters.map(condition => (
            <TouchableOpacity
              key={condition.id}
              style={[
                styles.conditionChip,
                selectedCondition === condition.id && styles.conditionChipActive
              ]}
              onPress={() => setSelectedCondition(condition.id)}
            >
              <Text style={[
                styles.conditionChipText,
                selectedCondition === condition.id && styles.conditionChipTextActive
              ]}>
                {condition.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Toolbar */}
      <View style={styles.toolbar}>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => {
            const sorts = ['date', 'name', 'price', 'rarity'];
            const currentIndex = sorts.indexOf(sortBy);
            const nextIndex = (currentIndex + 1) % sorts.length;
            setSortBy(sorts[nextIndex] as any);
          }}
        >
          <Text style={styles.sortButtonText}>
            Sort: {sortBy.replace('_', ' ').toUpperCase()} {sortOrder === 'asc' ? '↑' : '↓'}
          </Text>
        </TouchableOpacity>

        <View style={styles.viewModeButtons}>
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
        </View>

        <TouchableOpacity style={styles.moreButton}>
          <Ionicons name="ellipsis-vertical" size={20} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {/* Collection Grid */}
      <View style={styles.collectionContainer}>
        {filteredAndSortedCollection.length > 0 ? (
          <FlatList
            data={filteredAndSortedCollection}
            renderItem={({ item }) => (
              <CardGrid
                cards={[{
                  id: item.cardId,
                  name: item.name,
                  game: item.game,
                  imageUrl: item.imageUrl,
                  price: item.price,
                  quantity: item.quantity,
                }]}
                onCardPress={() => handleCardPress(item)}
                numColumns={viewMode === 'grid' ? 3 : 1}
                showQuantity={true}
                showCondition={true}
                condition={item.condition}
                isFoil={item.foil}
              />
            )}
            key={viewMode} // Force re-render when view mode changes
            keyExtractor={(item) => item.id}
            numColumns={viewMode === 'grid' ? 3 : 1}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.collectionList}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="albums-outline" size={64} color={COLORS.text.secondary} />
            <Text style={styles.emptyTitle}>
              {collection.length === 0 ? 'Your collection is empty' : 'No cards match your filters'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {collection.length === 0
                ? 'Start building your collection by browsing cards in the catalog'
                : 'Try adjusting your filters or add more cards'
              }
            </Text>
            <TouchableOpacity
              style={styles.addCardButton}
              onPress={handleAddCard}
            >
              <Ionicons name="add" size={20} color={COLORS.surface.light} />
              <Text style={styles.addCardButtonText}>Browse Cards</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* FAB for adding cards */}
      <TouchableOpacity style={styles.fab} onPress={handleAddCard}>
        <Ionicons name="add" size={24} color={COLORS.surface.light} />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.light,
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
  statsContainer: {
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface.dark,
  },
  statsScroll: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.md,
  },
  statsCard: {
    backgroundColor: COLORS.surface.light,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    minWidth: 120,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statsValue: {
    ...TYPOGRAPHY.heading1,
    color: COLORS.primary,
    fontWeight: '700',
  },
  statsTitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
  },
  statsSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
  },
  filtersContainer: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface.dark,
  },
  gameFilterScroll: {
    marginBottom: SPACING.sm,
  },
  filterChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
    borderRadius: 20,
    backgroundColor: COLORS.surface.light,
    borderWidth: 1,
    borderColor: COLORS.surface.dark,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: COLORS.surface.light,
  },
  conditionFilterScroll: {
    marginBottom: SPACING.sm,
  },
  conditionChip: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    marginRight: SPACING.sm,
    borderRadius: 15,
    backgroundColor: COLORS.background.light,
    borderWidth: 1,
    borderColor: COLORS.surface.dark,
  },
  conditionChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  conditionChipText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  conditionChipTextActive: {
    color: COLORS.surface.light,
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface.dark,
  },
  sortButton: {
    flex: 1,
    paddingVertical: SPACING.sm,
  },
  sortButtonText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: '600',
  },
  viewModeButtons: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  viewModeButton: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background.light,
    borderWidth: 1,
    borderColor: COLORS.surface.dark,
  },
  viewModeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  moreButton: {
    width: 36,
    height: 36,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  collectionContainer: {
    flex: 1,
  },
  collectionList: {
    padding: SPACING.sm,
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
    textAlign: 'center',
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  emptySubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  addCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: 25,
    gap: SPACING.sm,
  },
  addCardButtonText: {
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

export default CollectionScreen;