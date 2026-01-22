import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Modal from 'react-native-modal';

// Types
import { FilterOptions, CardRarity } from '../../types';

// Constants
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, CARD_RARITIES } from '../../constants';

interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  gameId?: string | null;
}

const FilterSheet: React.FC<FilterSheetProps> = ({
  visible,
  onClose,
  filters,
  onFiltersChange,
  gameId,
}) => {
  const [localFilters, setLocalFilters] = useState<FilterOptions>(filters);

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
  };

  const handleResetFilters = () => {
    setLocalFilters({});
  };

  const toggleRarity = (rarity: CardRarity) => {
    const currentRarities = localFilters.rarity || [];
    const newRarities = currentRarities.includes(rarity)
      ? currentRarities.filter(r => r !== rarity)
      : [...currentRarities, rarity];

    setLocalFilters({
      ...localFilters,
      rarity: newRarities.length > 0 ? newRarities : undefined,
    });
  };

  const setPriceRange = (min?: number, max?: number) => {
    setLocalFilters({
      ...localFilters,
      priceRange: min !== undefined && max !== undefined ? [min, max] : undefined,
    });
  };

  const toggleFoilOnly = () => {
    setLocalFilters({
      ...localFilters,
      foilOnly: !localFilters.foilOnly,
    });
  };

  const toggleFreeShipping = () => {
    setLocalFilters({
      ...localFilters,
      freeShipping: !localFilters.freeShipping,
    });
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
          <Text style={styles.title}>Filters</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeText}>Done</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Rarity Filter */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rarity</Text>
            <View style={styles.rarityGrid}>
              {CARD_RARITIES.map(rarity => (
                <TouchableOpacity
                  key={rarity}
                  style={[
                    styles.rarityChip,
                    (localFilters.rarity || []).includes(rarity) && styles.rarityChipActive
                  ]}
                  onPress={() => toggleRarity(rarity)}
                >
                  <Text
                    style={[
                      styles.rarityChipText,
                      (localFilters.rarity || []).includes(rarity) && styles.rarityChipTextActive
                    ]}
                  >
                    {rarity.replace('_', ' ').toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Price Range */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Price Range</Text>
            <View style={styles.priceButtons}>
              <TouchableOpacity
                style={[styles.priceButton, !localFilters.priceRange && styles.priceButtonActive]}
                onPress={() => setPriceRange()}
              >
                <Text style={[styles.priceButtonText, !localFilters.priceRange && styles.priceButtonTextActive]}>
                  Any Price
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.priceButton, localFilters.priceRange?.[1] === 10 && styles.priceButtonActive]}
                onPress={() => setPriceRange(0, 10)}
              >
                <Text style={[styles.priceButtonText, localFilters.priceRange?.[1] === 10 && styles.priceButtonTextActive]}>
                  Under $10
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.priceButton, localFilters.priceRange?.[1] === 50 && styles.priceButtonActive]}
                onPress={() => setPriceRange(0, 50)}
              >
                <Text style={[styles.priceButtonText, localFilters.priceRange?.[1] === 50 && styles.priceButtonTextActive]}>
                  Under $50
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Options</Text>
            <View style={styles.optionsList}>
              <TouchableOpacity
                style={styles.optionRow}
                onPress={toggleFoilOnly}
              >
                <Text style={styles.optionText}>Foil Only</Text>
                <View style={[
                  styles.checkbox,
                  localFilters.foilOnly && styles.checkboxActive
                ]}>
                  {localFilters.foilOnly && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.optionRow}
                onPress={toggleFreeShipping}
              >
                <Text style={styles.optionText}>Free Shipping</Text>
                <View style={[
                  styles.checkbox,
                  localFilters.freeShipping && styles.checkboxActive
                ]}>
                  {localFilters.freeShipping && <Text style={styles.checkmark}>✓</Text>}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleResetFilters}
          >
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.applyButton}
            onPress={handleApplyFilters}
          >
            <Text style={styles.applyButtonText}>Apply Filters</Text>
          </TouchableOpacity>
        </View>
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
    maxHeight: '80%',
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
  },
  closeText: {
    ...TYPOGRAPHY.body,
    color: COLORS.primary,
    fontWeight: '600',
  },
  content: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
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
  rarityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  rarityChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: COLORS.background.light,
    borderWidth: 1,
    borderColor: COLORS.surface.dark,
  },
  rarityChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  rarityChipText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  rarityChipTextActive: {
    color: COLORS.surface.light,
  },
  priceButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  priceButton: {
    flex: 1,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.background.light,
    borderWidth: 1,
    borderColor: COLORS.surface.dark,
    alignItems: 'center',
  },
  priceButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  priceButtonText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  priceButtonTextActive: {
    color: COLORS.surface.light,
  },
  optionsList: {
    gap: SPACING.md,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SPACING.sm,
  },
  optionText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 2,
    borderColor: COLORS.surface.dark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkmark: {
    color: COLORS.surface.light,
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.surface.dark,
    gap: SPACING.md,
  },
  resetButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.background.light,
  },
  resetButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.text.secondary,
  },
  applyButton: {
    flex: 2,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primary,
  },
  applyButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.surface.light,
  },
});

export default FilterSheet;