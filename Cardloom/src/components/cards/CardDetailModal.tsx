import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert, Share } from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';

// Services
import { TCGCard } from '../../services/tcgApis';
import localStorage from '../../services/localStorage';

// Constants
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../constants';

interface CardDetailModalProps {
  visible: boolean;
  onClose: () => void;
  card: TCGCard;
  onAddToComparison?: (card: TCGCard) => void;
  onToggleFavorite?: (card: TCGCard) => void;
  isFavorite?: boolean;
  inComparison?: boolean;
}

const CardDetailModal: React.FC<CardDetailModalProps> = ({
  visible,
  onClose,
  card,
  onAddToComparison,
  onToggleFavorite,
  isFavorite = false,
  inComparison = false,
}) => {
  const [priceHistory, setPriceHistory] = useState<any[]>([]);
  const [relatedCards, setRelatedCards] = useState<TCGCard[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && card) {
      loadCardDetails();
    }
  }, [visible, card]);

  const loadCardDetails = async () => {
    setLoading(true);
    try {
      // Load price history (mock data for now)
      const mockPriceHistory = Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        price: card.price ? card.price * (0.8 + Math.random() * 0.4) : Math.random() * 50,
      }));
      setPriceHistory(mockPriceHistory);

      // Load related cards (mock data)
      const mockRelated = Array.from({ length: 3 }, (_, i) => ({
        ...card,
        id: `related-${i}`,
        name: `${card.name} Variant ${i + 1}`,
        price: card.price ? card.price * (0.9 + Math.random() * 0.2) : Math.random() * 40,
      }));
      setRelatedCards(mockRelated);
    } catch (error) {
      console.error('Error loading card details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this ${card.game.toUpperCase()} card: ${card.name}\nPrice: $${card.price?.toFixed(2) || 'N/A'}`,
        url: card.imageUrl,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share card');
    }
  };

  const handleAddToCollection = () => {
    Alert.alert(
      'Add to Collection',
      `Add ${card.name} to your collection?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add',
          onPress: async () => {
            try {
              await localStorage.addToCollection({
                cardId: card.id,
                name: card.name,
                game: card.game,
                imageUrl: card.imageUrl,
                price: card.price,
                condition: 'near_mint',
                quantity: 1,
                foil: false,
                set: card.set,
                rarity: card.rarity,
              });
              Alert.alert('Success', 'Card added to collection!');
            } catch (error) {
              Alert.alert('Error', 'Failed to add card to collection');
            }
          },
        },
      ]
    );
  };

  const handleAddToWatchlist = () => {
    Alert.alert(
      'Add to Watchlist',
      `Monitor price changes for ${card.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add',
          onPress: async () => {
            try {
              await localStorage.addToWatchlist(card, card.price);
              Alert.alert('Success', 'Card added to watchlist!');
            } catch (error) {
              Alert.alert('Error', 'Failed to add card to watchlist');
            }
          },
        },
      ]
    );
  };

  const getRarityColor = (rarity?: string) => {
    switch (rarity?.toLowerCase()) {
      case 'mythic_rare':
      case 'mythic rare':
        return '#FF8C00';
      case 'rare':
        return '#FFD700';
      case 'uncommon':
        return '#C0C0C0';
      case 'common':
        return '#CD7F32';
      default:
        return COLORS.primary;
    }
  };

  const renderPriceHistory = () => {
    if (priceHistory.length === 0) return null;

    const currentPrice = card.price || 0;
    const minPrice = Math.min(...priceHistory.map(p => p.price));
    const maxPrice = Math.max(...priceHistory.map(p => p.price));

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Price History (30 days)</Text>
        <View style={styles.priceStats}>
          <View style={styles.priceStat}>
            <Text style={styles.priceStatLabel}>Current</Text>
            <Text style={[styles.priceStatValue, { color: COLORS.primary }]}>
              ${currentPrice.toFixed(2)}
            </Text>
          </View>
          <View style={styles.priceStat}>
            <Text style={styles.priceStatLabel}>Min</Text>
            <Text style={[styles.priceStatValue, { color: '#22C55E' }]}>
              ${minPrice.toFixed(2)}
            </Text>
          </View>
          <View style={styles.priceStat}>
            <Text style={styles.priceStatLabel}>Max</Text>
            <Text style={[styles.priceStatValue, { color: '#EF4444' }]}>
              ${maxPrice.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderCardAttributes = () => {
    if (!card.attributes) return null;

    const attributes = [];

    // Game-specific attributes
    if (card.game === 'pokemon') {
      if (card.attributes.hp) attributes.push({ label: 'HP', value: card.attributes.hp });
      if (card.attributes.types) attributes.push({ label: 'Types', value: card.attributes.types.join(', ') });
      if (card.attributes.attacks) attributes.push({ label: 'Attacks', value: `${card.attributes.attacks.length} attack${card.attributes.attacks.length !== 1 ? 's' : ''}` });
    } else if (card.game === 'mtg') {
      if (card.manaCost) attributes.push({ label: 'Mana Cost', value: card.manaCost });
      if (card.colors) attributes.push({ label: 'Colors', value: card.colors.join(', ') });
      if (card.power && card.toughness) attributes.push({ label: 'P/T', value: `${card.power}/${card.toughness}` });
    } else if (card.game === 'yugioh') {
      if (card.attributes.atk !== undefined) attributes.push({ label: 'ATK', value: card.attributes.atk });
      if (card.attributes.def !== undefined) attributes.push({ label: 'DEF', value: card.attributes.def });
      if (card.attributes.level) attributes.push({ label: 'Level', value: card.attributes.level });
      if (card.attributes.attribute) attributes.push({ label: 'Attribute', value: card.attributes.attribute });
    }

    if (attributes.length === 0) return null;

    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Card Attributes</Text>
        <View style={styles.attributesGrid}>
          {attributes.map((attr, index) => (
            <View key={index} style={styles.attributeItem}>
              <Text style={styles.attributeLabel}>{attr.label}</Text>
              <Text style={styles.attributeValue}>{attr.value}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <Modal
      isVisible={visible}
      onBackdropPress={onClose}
      onSwipeComplete={onClose}
      swipeDirection="down"
      style={styles.modal}
      propagateSwipe
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.handle} />
          <Text style={styles.title} numberOfLines={1}>{card.name}</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Card Image */}
          <View style={styles.imageContainer}>
            {card.imageUrl ? (
              <Image source={{ uri: card.imageUrl }} style={styles.cardImage} resizeMode="contain" />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="image-outline" size={48} color={COLORS.text.secondary} />
                <Text style={styles.imagePlaceholderText}>No Image</Text>
              </View>
            )}
          </View>

          {/* Card Info */}
          <View style={styles.cardInfo}>
            <View style={styles.cardMeta}>
              <Text style={styles.gameBadge}>{card.game.toUpperCase()}</Text>
              {card.rarity && (
                <View style={[styles.rarityBadge, { backgroundColor: getRarityColor(card.rarity) }]}>
                  <Text style={styles.rarityText}>{card.rarity.replace('_', ' ').toUpperCase()}</Text>
                </View>
              )}
            </View>

            {card.price && (
              <View style={styles.priceContainer}>
                <Text style={styles.priceLabel}>Market Price</Text>
                <Text style={styles.priceValue}>${card.price.toFixed(2)}</Text>
              </View>
            )}

            {card.set && (
              <Text style={styles.setInfo}>Set: {card.set}</Text>
            )}

            {card.artist && (
              <Text style={styles.artistInfo}>Artist: {card.artist}</Text>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={handleAddToCollection}>
              <Ionicons name="add-circle-outline" size={20} color={COLORS.primary} />
              <Text style={styles.actionButtonText}>Add to Collection</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleAddToWatchlist}>
              <Ionicons name="eye-outline" size={20} color={COLORS.primary} />
              <Text style={styles.actionButtonText}>Watch Price</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Ionicons name="share-outline" size={20} color={COLORS.primary} />
              <Text style={styles.actionButtonText}>Share</Text>
            </TouchableOpacity>
          </View>

          {/* Comparison and Favorite Actions */}
          {(onAddToComparison || onToggleFavorite) && (
            <View style={styles.secondaryActions}>
              {onAddToComparison && (
                <TouchableOpacity
                  style={[styles.secondaryButton, inComparison && styles.secondaryButtonActive]}
                  onPress={() => onAddToComparison(card)}
                >
                  <Ionicons
                    name="git-compare-outline"
                    size={18}
                    color={inComparison ? COLORS.surface.light : COLORS.primary}
                  />
                  <Text style={[styles.secondaryButtonText, inComparison && styles.secondaryButtonTextActive]}>
                    {inComparison ? 'In Comparison' : 'Compare'}
                  </Text>
                </TouchableOpacity>
              )}

              {onToggleFavorite && (
                <TouchableOpacity
                  style={[styles.secondaryButton, isFavorite && styles.secondaryButtonActive]}
                  onPress={() => onToggleFavorite(card)}
                >
                  <Ionicons
                    name={isFavorite ? "heart" : "heart-outline"}
                    size={18}
                    color={isFavorite ? COLORS.surface.light : COLORS.primary}
                  />
                  <Text style={[styles.secondaryButtonText, isFavorite && styles.secondaryButtonTextActive]}>
                    {isFavorite ? 'Favorited' : 'Favorite'}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Card Text */}
          {card.text && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Card Text</Text>
              <Text style={styles.cardText}>{card.text}</Text>
            </View>
          )}

          {/* Card Attributes */}
          {renderCardAttributes()}

          {/* Price History */}
          {renderPriceHistory()}

          {/* Related Cards */}
          {relatedCards.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Related Cards</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {relatedCards.map((relatedCard) => (
                  <TouchableOpacity key={relatedCard.id} style={styles.relatedCard}>
                    {relatedCard.imageUrl ? (
                      <Image source={{ uri: relatedCard.imageUrl }} style={styles.relatedCardImage} />
                    ) : (
                      <View style={styles.relatedCardPlaceholder}>
                        <Text style={styles.relatedCardName} numberOfLines={2}>
                          {relatedCard.name}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: COLORS.surface.light,
    borderTopLeftRadius: BORDER_RADIUS.lg,
    borderTopRightRadius: BORDER_RADIUS.lg,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface.dark,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.surface.dark,
    borderRadius: 2,
    position: 'absolute',
    top: 8,
    left: '50%',
    marginLeft: -20,
  },
  title: {
    ...TYPOGRAPHY.heading2,
    color: COLORS.text.primary,
    flex: 1,
    textAlign: 'center',
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  cardImage: {
    width: 250,
    height: 350,
    borderRadius: BORDER_RADIUS.md,
  },
  imagePlaceholder: {
    width: 250,
    height: 350,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.background.light,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.surface.dark,
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.secondary,
    marginTop: SPACING.sm,
  },
  cardInfo: {
    marginBottom: SPACING.lg,
  },
  cardMeta: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  gameBadge: {
    ...TYPOGRAPHY.caption,
    backgroundColor: COLORS.primary,
    color: COLORS.surface.light,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    fontWeight: '600',
  },
  rarityBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  rarityText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.surface.light,
    fontWeight: '600',
  },
  priceContainer: {
    marginBottom: SPACING.sm,
  },
  priceLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  priceValue: {
    ...TYPOGRAPHY.heading1,
    color: COLORS.primary,
    fontWeight: '700',
  },
  setInfo: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  artistInfo: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.secondary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background.light,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    gap: SPACING.xs,
  },
  actionButtonText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.primary,
    fontWeight: '600',
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background.light,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.surface.dark,
    gap: SPACING.xs,
  },
  secondaryButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  secondaryButtonText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.primary,
    fontWeight: '500',
  },
  secondaryButtonTextActive: {
    color: COLORS.surface.light,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  cardText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
    lineHeight: 24,
    textAlign: 'center',
  },
  attributesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  attributeItem: {
    backgroundColor: COLORS.background.light,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    minWidth: '45%',
  },
  attributeLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  attributeValue: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.primary,
    fontWeight: '600',
  },
  priceStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.sm,
  },
  priceStat: {
    flex: 1,
    alignItems: 'center',
  },
  priceStatLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  priceStatValue: {
    ...TYPOGRAPHY.body,
    fontWeight: '700',
  },
  relatedCard: {
    marginRight: SPACING.md,
  },
  relatedCardImage: {
    width: 80,
    height: 112,
    borderRadius: BORDER_RADIUS.sm,
  },
  relatedCardPlaceholder: {
    width: 80,
    height: 112,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.background.light,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xs,
  },
  relatedCardName: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
});

export default CardDetailModal;