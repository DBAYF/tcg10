import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Types
import { Listing } from '../../types';

// Constants
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../constants';

interface ListingCardProps {
  listing: Listing;
  onPress: () => void;
  showSeller?: boolean;
}

const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  onPress,
  showSeller = true
}) => {
  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`;
  };

  const getConditionColor = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'mint': return COLORS.success;
      case 'near_mint': return '#22C55E';
      case 'excellent': return '#84CC16';
      case 'good': return '#EAB308';
      case 'light_played': return '#F97316';
      case 'poor': return COLORS.error;
      default: return COLORS.text.secondary;
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {/* Card Image */}
      <View style={styles.imageContainer}>
        {listing.images && listing.images.length > 0 ? (
          <Image
            source={{ uri: listing.images[0] }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={32} color={COLORS.text.secondary} />
          </View>
        )}

        {/* Badges */}
        <View style={styles.badges}>
          {listing.isFoil && (
            <View style={[styles.badge, styles.foilBadge]}>
              <Text style={styles.badgeText}>Foil</Text>
            </View>
          )}
          {listing.listingType === 'trade' && (
            <View style={[styles.badge, styles.tradeBadge]}>
              <Text style={styles.badgeText}>Trade</Text>
            </View>
          )}
        </View>
      </View>

      {/* Card Info */}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {listing.title}
        </Text>

        <View style={styles.details}>
          <Text style={styles.condition}>
            Condition: <Text style={{ color: getConditionColor(listing.condition) }}>
              {listing.condition.replace('_', ' ')}
            </Text>
          </Text>

          <Text style={styles.quantity}>
            Qty: {listing.quantity}
          </Text>
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.price}>
            {formatPrice(listing.price)}
          </Text>

          {listing.shipping.freeShipping && (
            <View style={styles.freeShipping}>
              <Ionicons name="car-outline" size={14} color={COLORS.success} />
              <Text style={styles.freeShippingText}>Free shipping</Text>
            </View>
          )}
        </View>

        {showSeller && (
          <View style={styles.seller}>
            <Ionicons name="person-outline" size={14} color={COLORS.text.secondary} />
            <Text style={styles.sellerText} numberOfLines={1}>
              Seller info
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface.light,
    borderRadius: BORDER_RADIUS.md,
    margin: SPACING.sm,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    height: 140,
    backgroundColor: COLORS.background.light,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badges: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  badge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
  },
  foilBadge: {
    backgroundColor: '#FFD700',
  },
  tradeBadge: {
    backgroundColor: COLORS.primary,
  },
  badgeText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.surface.light,
    fontWeight: '600',
    fontSize: 10,
  },
  info: {
    padding: SPACING.md,
  },
  title: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
    fontWeight: '600',
    marginBottom: SPACING.xs,
    lineHeight: 20,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  condition: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    textTransform: 'capitalize',
  },
  quantity: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  price: {
    ...TYPOGRAPHY.heading2,
    color: COLORS.primary,
    fontWeight: '700',
  },
  freeShipping: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  freeShippingText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.success,
    fontWeight: '500',
  },
  seller: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  sellerText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    flex: 1,
  },
});

export default ListingCard;