import React from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from '../../types';

// Constants
import { SPACING, BORDER_RADIUS } from '../../constants';

interface CardGridProps {
  cards: Card[];
  onCardPress: (card: Card) => void;
  numColumns?: number;
  showsVerticalScrollIndicator?: boolean;
}

interface CardItemProps {
  card: Card;
  onPress: () => void;
}

const CardItem: React.FC<CardItemProps> = ({ card, onPress }) => {
  return (
    <TouchableOpacity style={styles.cardItem} onPress={onPress}>
      <View style={styles.cardImage}>
        {/* Placeholder for card image - in real app, use Image component */}
        <View style={styles.imagePlaceholder}>
          <View style={styles.cardContent}>
            <View style={styles.cardName}>
              {/* Card name would be displayed here */}
            </View>
            <View style={styles.cardDetails}>
              {/* Card details like set, rarity, etc. */}
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const CardGrid: React.FC<CardGridProps> = ({
  cards,
  onCardPress,
  numColumns = 3,
  showsVerticalScrollIndicator = false,
}) => {
  const renderItem = ({ item }: { item: Card }) => (
    <CardItem card={item} onPress={() => onCardPress(item)} />
  );

  return (
    <FlatList
      data={cards}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      contentContainerStyle={styles.gridContainer}
      columnWrapperStyle={numColumns > 1 ? styles.row : undefined}
    />
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    padding: SPACING.sm,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  cardItem: {
    flex: 1,
    marginHorizontal: SPACING.xs,
    maxWidth: '32%', // For 3-column grid
  },
  cardImage: {
    aspectRatio: 2.5 / 3.5, // Standard card aspect ratio
    backgroundColor: '#f0f0f0',
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  cardContent: {
    flex: 1,
    padding: SPACING.sm,
  },
  cardName: {
    height: 20,
    backgroundColor: '#d0d0d0',
    borderRadius: BORDER_RADIUS.xs,
    marginBottom: SPACING.xs,
  },
  cardDetails: {
    height: 16,
    backgroundColor: '#c0c0c0',
    borderRadius: BORDER_RADIUS.xs,
  },
});

export default CardGrid;