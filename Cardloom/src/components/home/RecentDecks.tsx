import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Types
import { Deck } from '../../types';

// Constants
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../constants';

interface DeckCardProps {
  deck: Deck;
  onPress: () => void;
}

const DeckCard: React.FC<DeckCardProps> = ({ deck, onPress }) => {
  return (
    <TouchableOpacity style={styles.deckCard} onPress={onPress}>
      <View style={styles.deckImage}>
        {deck.coverImageUrl ? (
          // Placeholder for now - in real app, use Image component
          <View style={styles.imagePlaceholder}>
            <Ionicons name="layers" size={24} color={COLORS.primary} />
          </View>
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="layers" size={24} color={COLORS.primary} />
          </View>
        )}
      </View>
      <View style={styles.deckInfo}>
        <Text style={styles.deckTitle} numberOfLines={1}>
          {deck.title}
        </Text>
        <Text style={styles.deckMeta}>
          {deck.stats.totalCards} cards • {deck.format}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const RecentDecks: React.FC = () => {
  const navigation = useNavigation();
  const userDecks = useSelector((state: any) => state.decks.userDecks);

  // Get the 3 most recent decks
  const recentDecks = userDecks.slice(0, 3);

  if (recentDecks.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>No decks yet</Text>
        <Text style={styles.emptySubtitle}>Create your first deck to get started</Text>
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => (navigation as any).navigate('DeckBuilder')}
        >
          <Text style={styles.createButtonText}>Create Deck</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleDeckPress = (deckId: string) => {
    (navigation as any).navigate('DeckDetail', { deckId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>Recent Decks</Text>
        <TouchableOpacity onPress={() => (navigation as any).navigate('Decks')}>
          <Text style={styles.viewAllText}>View All</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={recentDecks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DeckCard deck={item} onPress={() => handleDeckPress(item.id)} />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.decksList}
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
  decksList: {
    paddingVertical: SPACING.sm,
  },
  deckCard: {
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
  deckImage: {
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
  deckInfo: {
    flex: 1,
  },
  deckTitle: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.primary,
    fontWeight: '600',
    marginBottom: 2,
  },
  deckMeta: {
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

export default RecentDecks;