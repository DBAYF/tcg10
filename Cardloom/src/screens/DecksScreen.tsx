import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';

// Components
import Header from '../components/common/Header';
import DeckCardItem from '../components/decks/DeckCardItem';

// Types
import { Deck, DeckCard, TCGGame } from '../types';

// Constants
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, TCG_GAMES } from '../constants';

const DecksScreen: React.FC = () => {
  const dispatch = useDispatch();
  const userDecks = useSelector((state: any) => state.decks.userDecks);

  // State
  const [decks, setDecks] = useState<Deck[]>([]);
  const [currentDeck, setCurrentDeck] = useState<Deck | null>(null);
  const [deckCards, setDeckCards] = useState<DeckCard[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState<TCGGame>('pokemon');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  // Mock data for demonstration
  useEffect(() => {
    loadDecks();
  }, []);

  const loadDecks = async () => {
    // Mock decks loading - in real app, this would be an API call
    const mockDecks: Deck[] = Array.from({ length: 3 }, (_, index) => ({
      id: `deck-${index}`,
      userId: 'user-1',
      gameId: 'pokemon',
      title: `Deck ${index + 1}`,
      description: 'A great deck for competitive play',
      format: 'Standard',
      isPublic: true,
      coverImageUrl: '',
      tags: ['competitive', 'control'],
      stats: {
        totalCards: 60,
        cardCounts: { pokemon: 20, trainer: 20, energy: 20 },
        estimatedValue: 150,
        likes: 25,
        rating: 4.2,
        viewCount: 150,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    setDecks(mockDecks);
  };

  const handleCreateDeck = () => {
    const newDeck: Deck = {
      id: `deck-${Date.now()}`,
      userId: 'user-1',
      gameId: selectedGame,
      title: `New ${TCG_GAMES[selectedGame].displayName} Deck`,
      description: '',
      format: 'Standard',
      isPublic: false,
      coverImageUrl: '',
      tags: [],
      stats: {
        totalCards: 0,
        cardCounts: {},
        estimatedValue: 0,
        likes: 0,
        rating: 0,
        viewCount: 0,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCurrentDeck(newDeck);
    setDeckCards([]);
  };

  const handleDeckSelect = (deck: Deck) => {
    setCurrentDeck(deck);
    // Mock deck cards loading
    const mockCards: DeckCard[] = Array.from({ length: 10 }, (_, index) => ({
      id: `deck-card-${index}`,
      deckId: deck.id,
      cardId: `card-${index}`,
      quantity: Math.floor(Math.random() * 4) + 1,
      notes: index % 3 === 0 ? 'Key card' : undefined,
    }));
    setDeckCards(mockCards);
  };

  const handleSearchCards = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    // Mock card search - in real app, this would be an API call
    setTimeout(() => {
      const mockResults = Array.from({ length: 5 }, (_, index) => ({
        id: `search-card-${index}`,
        name: `${query} Card ${index + 1}`,
        rarity: 'common',
        imageUrl: '',
        price: Math.random() * 50,
      }));
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 500);
  };

  const handleAddCardToDeck = (card: any) => {
    if (!currentDeck) return;

    const existingCard = deckCards.find(dc => dc.cardId === card.id);
    if (existingCard) {
      // Increment quantity
      setDeckCards(prev =>
        prev.map(dc =>
          dc.cardId === card.id
            ? { ...dc, quantity: dc.quantity + 1 }
            : dc
        )
      );
    } else {
      // Add new card
      const newDeckCard: DeckCard = {
        id: `deck-card-${Date.now()}`,
        deckId: currentDeck.id,
        cardId: card.id,
        quantity: 1,
      };
      setDeckCards(prev => [...prev, newDeckCard]);
    }
  };

  const handleUpdateCardQuantity = (deckCardId: string, increment: boolean) => {
    setDeckCards(prev =>
      prev.map(dc =>
        dc.id === deckCardId
          ? { ...dc, quantity: increment ? dc.quantity + 1 : Math.max(1, dc.quantity - 1) }
          : dc
      )
    );
  };

  const handleRemoveCard = (deckCardId: string) => {
    setDeckCards(prev => prev.filter(dc => dc.id !== deckCardId));
  };

  const handleSaveDeck = () => {
    if (!currentDeck) return;

    const updatedDeck = {
      ...currentDeck,
      stats: {
        ...currentDeck.stats,
        totalCards: deckCards.reduce((sum, card) => sum + card.quantity, 0),
      },
      updatedAt: new Date().toISOString(),
    };

    // Update decks list
    setDecks(prev =>
      prev.map(deck => deck.id === updatedDeck.id ? updatedDeck : deck)
    );

    console.log('Deck saved:', updatedDeck);
  };

  const renderDeckCard = ({ item }: { item: DeckCard }) => (
    <DeckCardItem
      deckCard={item}
      onIncrement={() => handleUpdateCardQuantity(item.id, true)}
      onDecrement={() => handleUpdateCardQuantity(item.id, false)}
      onRemove={() => handleRemoveCard(item.id)}
    />
  );

  const renderSearchResult = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.searchResult}
      onPress={() => handleAddCardToDeck(item)}
    >
      <View style={styles.searchResultImage}>
        <Ionicons name="image-outline" size={24} color={COLORS.text.secondary} />
      </View>
      <View style={styles.searchResultInfo}>
        <Text style={styles.searchResultName}>{item.name}</Text>
        <Text style={styles.searchResultPrice}>${item.price?.toFixed(2)}</Text>
      </View>
      <TouchableOpacity style={styles.addButton}>
        <Ionicons name="add" size={20} color={COLORS.primary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (currentDeck) {
    return (
      <SafeAreaView style={styles.container}>
        <Header
          title={currentDeck.title}
          showSearch={false}
          showNotifications={false}
          showMessages={false}
          showBack={true}
        />

        {/* Deck Header */}
        <View style={styles.deckHeader}>
          <View style={styles.deckInfo}>
            <Text style={styles.deckTitle}>{currentDeck.title}</Text>
            <Text style={styles.deckStats}>
              {deckCards.reduce((sum, card) => sum + card.quantity, 0)} cards • {currentDeck.format}
            </Text>
          </View>
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveDeck}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>

        {/* Card Search */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color={COLORS.text.secondary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search cards to add..."
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                handleSearchCards(text);
              }}
            />
          </View>
        </View>

        {/* Search Results */}
        {searchQuery && (
          <View style={styles.searchResults}>
            {isSearching ? (
              <Text style={styles.searchingText}>Searching...</Text>
            ) : (
              <FlatList
                data={searchResults}
                renderItem={renderSearchResult}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
              />
            )}
          </View>
        )}

        {/* Deck Cards */}
        {!searchQuery && (
          <FlatList
            data={deckCards}
            renderItem={renderDeckCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.deckCardsList}
            ListEmptyComponent={
              <View style={styles.emptyDeck}>
                <Ionicons name="layers-outline" size={48} color={COLORS.text.secondary} />
                <Text style={styles.emptyDeckTitle}>No cards in deck</Text>
                <Text style={styles.emptyDeckSubtitle}>Search and add cards above</Text>
              </View>
            }
          />
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="My Decks"
        showSearch={false}
        showNotifications={false}
        showMessages={false}
      />

      {/* Game Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.gameSelector}
      >
        {Object.values(TCG_GAMES).map(game => (
          <TouchableOpacity
            key={game.id}
            style={[
              styles.gameButton,
              selectedGame === game.id && styles.gameButtonActive
            ]}
            onPress={() => setSelectedGame(game.id)}
          >
            <Text
              style={[
                styles.gameButtonText,
                selectedGame === game.id && styles.gameButtonTextActive
              ]}
            >
              {game.displayName}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Decks List */}
      <ScrollView style={styles.decksContainer} showsVerticalScrollIndicator={false}>
        {decks.filter(deck => deck.gameId === selectedGame).map(deck => (
          <TouchableOpacity
            key={deck.id}
            style={styles.deckItem}
            onPress={() => handleDeckSelect(deck)}
          >
            <View style={styles.deckItemImage}>
              <Ionicons name="layers" size={32} color={COLORS.primary} />
            </View>
            <View style={styles.deckItemInfo}>
              <Text style={styles.deckItemTitle}>{deck.title}</Text>
              <Text style={styles.deckItemStats}>
                {deck.stats.totalCards} cards • {deck.format} • {deck.stats.likes} likes
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.text.secondary} />
          </TouchableOpacity>
        ))}

        {/* Create New Deck */}
        <TouchableOpacity
          style={styles.createDeckButton}
          onPress={handleCreateDeck}
        >
          <Ionicons name="add" size={24} color={COLORS.primary} />
          <Text style={styles.createDeckText}>Create New Deck</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
  gameSelector: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface.dark,
  },
  gameButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
    borderRadius: 20,
    backgroundColor: COLORS.surface.light,
  },
  gameButtonActive: {
    backgroundColor: COLORS.primary,
  },
  gameButtonText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  gameButtonTextActive: {
    color: COLORS.surface.light,
  },
  decksContainer: {
    flex: 1,
    padding: SPACING.md,
  },
  deckItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface.light,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  deckItemImage: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.background.light,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  deckItemInfo: {
    flex: 1,
  },
  deckItemTitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  deckItemStats: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
  },
  createDeckButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface.light,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderStyle: 'dashed',
  },
  createDeckText: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
    fontWeight: '600',
    marginLeft: SPACING.sm,
  },
  deckHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface.dark,
  },
  deckInfo: {
    flex: 1,
  },
  deckTitle: {
    ...TYPOGRAPHY.heading1,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  deckStats: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
  },
  saveButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.surface.light,
  },
  searchContainer: {
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface.dark,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface.light,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    marginLeft: SPACING.sm,
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
  },
  searchResults: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface.dark,
  },
  searchingText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
    textAlign: 'center',
    padding: SPACING.lg,
  },
  searchResult: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface.dark,
  },
  searchResultImage: {
    width: 40,
    height: 56,
    backgroundColor: COLORS.background.light,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  searchResultInfo: {
    flex: 1,
  },
  searchResultName: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.primary,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  searchResultPrice: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.background.light,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  deckCardsList: {
    padding: SPACING.md,
  },
  emptyDeck: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
  },
  emptyDeckTitle: {
    ...TYPOGRAPHY.heading2,
    color: COLORS.text.primary,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  emptyDeckSubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
});

export default DecksScreen;