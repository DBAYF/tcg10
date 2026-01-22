import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Types
import { DeckCard } from '../../types';

// Constants
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../constants';

interface DeckCardItemProps {
  deckCard: DeckCard;
  onPress?: () => void;
  onIncrement?: () => void;
  onDecrement?: () => void;
  onRemove?: () => void;
  showControls?: boolean;
}

const DeckCardItem: React.FC<DeckCardItemProps> = ({
  deckCard,
  onPress,
  onIncrement,
  onDecrement,
  onRemove,
  showControls = true,
}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.imageContainer}>
        {/* Placeholder for card image - in real app, use Image component */}
        <View style={styles.imagePlaceholder}>
          <View style={styles.cardPreview}>
            <View style={styles.cardName}>
              <Text style={styles.cardNameText} numberOfLines={1}>
                Card Name
              </Text>
            </View>
            <View style={styles.cardDetails}>
              <Text style={styles.cardDetailText}>Details</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.info}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          Card Title Here
        </Text>

        {deckCard.notes && (
          <Text style={styles.notes} numberOfLines={1}>
            {deckCard.notes}
          </Text>
        )}
      </View>

      {showControls && (
        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={onDecrement}
            disabled={deckCard.quantity <= 1}
          >
            <Ionicons
              name="remove"
              size={16}
              color={deckCard.quantity <= 1 ? COLORS.text.secondary : COLORS.primary}
            />
          </TouchableOpacity>

          <Text style={styles.quantity}>{deckCard.quantity}</Text>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={onIncrement}
          >
            <Ionicons name="add" size={16} color={COLORS.primary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.removeButton]}
            onPress={onRemove}
          >
            <Ionicons name="trash-outline" size={16} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      )}

      {!showControls && (
        <View style={styles.quantityBadge}>
          <Text style={styles.quantityBadgeText}>{deckCard.quantity}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface.light,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginVertical: SPACING.xs,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  imageContainer: {
    width: 60,
    height: 84, // Standard card aspect ratio
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
    backgroundColor: COLORS.background.light,
    marginRight: SPACING.md,
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  cardPreview: {
    flex: 1,
    padding: SPACING.xs,
  },
  cardName: {
    height: 12,
    backgroundColor: '#d0d0d0',
    borderRadius: BORDER_RADIUS.xs,
    marginBottom: SPACING.xs,
  },
  cardNameText: {
    fontSize: 8,
    color: '#333',
    textAlign: 'center',
  },
  cardDetails: {
    height: 8,
    backgroundColor: '#c0c0c0',
    borderRadius: BORDER_RADIUS.xs,
  },
  cardDetailText: {
    fontSize: 6,
    color: '#666',
    textAlign: 'center',
  },
  info: {
    flex: 1,
  },
  cardTitle: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.primary,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  notes: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  controlButton: {
    width: 32,
    height: 32,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.background.light,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.surface.dark,
  },
  removeButton: {
    borderColor: COLORS.error,
  },
  quantity: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
    fontWeight: '600',
    minWidth: 24,
    textAlign: 'center',
  },
  quantityBadge: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.md,
    minWidth: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityBadgeText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.surface.light,
    fontWeight: '600',
  },
});

export default DeckCardItem;