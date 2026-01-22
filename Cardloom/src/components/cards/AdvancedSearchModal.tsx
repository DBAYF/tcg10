import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons';

// Types
import { TCGSearchFilters } from '../../services/tcgApis';

// Constants
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../constants';

interface AdvancedSearchModalProps {
  visible: boolean;
  onClose: () => void;
  onSearch: (filters: TCGSearchFilters) => void;
  gameId: string;
  initialFilters?: TCGSearchFilters;
}

const AdvancedSearchModal: React.FC<AdvancedSearchModalProps> = ({
  visible,
  onClose,
  onSearch,
  gameId,
  initialFilters = {},
}) => {
  const [filters, setFilters] = useState<TCGSearchFilters>(initialFilters);

  const handleApplySearch = () => {
    // Validate filters
    if (!filters.name && !filters.set && !filters.rarity && !filters.type &&
        !filters.colors && !filters.manaCost && !filters.power && !filters.toughness &&
        !filters.artist && filters.priceMin === undefined && filters.priceMax === undefined) {
      Alert.alert('No Search Criteria', 'Please enter at least one search criteria.');
      return;
    }

    onSearch(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({});
  };

  const updateFilter = (key: keyof TCGSearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const renderTextInput = (
    label: string,
    key: keyof TCGSearchFilters,
    placeholder: string,
    multiline = false
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={[styles.textInput, multiline && styles.multilineInput]}
        placeholder={placeholder}
        value={filters[key] as string || ''}
        onChangeText={(value) => updateFilter(key, value)}
        multiline={multiline}
        numberOfLines={multiline ? 3 : 1}
      />
    </View>
  );

  const renderPriceRange = () => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>Price Range</Text>
      <View style={styles.priceRangeContainer}>
        <TextInput
          style={styles.priceInput}
          placeholder="Min $"
          value={filters.priceMin?.toString() || ''}
          onChangeText={(value) => updateFilter('priceMin', value ? parseFloat(value) : undefined)}
          keyboardType="numeric"
        />
        <Text style={styles.priceSeparator}>-</Text>
        <TextInput
          style={styles.priceInput}
          placeholder="Max $"
          value={filters.priceMax?.toString() || ''}
          onChangeText={(value) => updateFilter('priceMax', value ? parseFloat(value) : undefined)}
          keyboardType="numeric"
        />
      </View>
    </View>
  );

  const renderCheckbox = (label: string, key: keyof TCGSearchFilters) => (
    <TouchableOpacity
      style={styles.checkboxContainer}
      onPress={() => updateFilter(key, !filters[key])}
    >
      <View style={[styles.checkbox, filters[key] && styles.checkboxChecked]}>
        {filters[key] && <Ionicons name="checkmark" size={16} color={COLORS.surface.light} />}
      </View>
      <Text style={styles.checkboxLabel}>{label}</Text>
    </TouchableOpacity>
  );

  const renderGameSpecificFilters = () => {
    switch (gameId) {
      case 'pokemon':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Pokémon Specific</Text>
            {renderTextInput('HP', 'power', 'e.g., 120')}
            {renderTextInput('Types', 'type', 'e.g., Fire, Water')}
            {renderCheckbox('Has Flavor Text', 'flavorText')}
          </View>
        );

      case 'mtg':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Magic: The Gathering Specific</Text>
            {renderTextInput('Mana Cost', 'manaCost', 'e.g., {2}{W}{U}')}
            {renderTextInput('Colors', 'colors', 'e.g., White, Blue')}
            {renderTextInput('Power', 'power', 'e.g., 2')}
            {renderTextInput('Toughness', 'toughness', 'e.g., 3')}
            {renderCheckbox('Include Flavor Text', 'flavorText')}
          </View>
        );

      case 'yugioh':
        return (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Yu-Gi-Oh! Specific</Text>
            {renderTextInput('ATK', 'power', 'e.g., 2500')}
            {renderTextInput('DEF', 'toughness', 'e.g., 2000')}
            {renderTextInput('Level/Rank', 'manaCost', 'e.g., 8')}
            {renderTextInput('Attribute', 'type', 'e.g., LIGHT, DARK')}
          </View>
        );

      default:
        return null;
    }
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
          <Text style={styles.title}>Advanced Search</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Basic Filters */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Basic Filters</Text>
            {renderTextInput('Card Name', 'name', 'Enter card name or keywords')}
            {renderTextInput('Set/Code', 'set', 'Enter set name or code')}
            {renderTextInput('Rarity', 'rarity', 'e.g., rare, uncommon')}
            {renderTextInput('Type', 'type', 'e.g., Creature, Instant')}
            {renderTextInput('Artist', 'artist', 'Artist name')}
            {renderPriceRange()}
          </View>

          {/* Game-Specific Filters */}
          {renderGameSpecificFilters()}

          {/* Search Options */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Search Options</Text>
            <View style={styles.searchOptions}>
              {renderCheckbox('Exact Name Match', 'exactName')}
              {renderCheckbox('Include Tokens', 'includeTokens')}
              {renderCheckbox('Include Digital Cards', 'includeDigital')}
            </View>
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={handleReset}
          >
            <Text style={styles.resetButtonText}>Reset All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.searchButton}
            onPress={handleApplySearch}
          >
            <Ionicons name="search" size={18} color={COLORS.surface.light} />
            <Text style={styles.searchButtonText}>Search Cards</Text>
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
    maxHeight: '85%',
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
  inputGroup: {
    marginBottom: SPACING.md,
  },
  inputLabel: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.primary,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  textInput: {
    borderWidth: 1,
    borderColor: COLORS.surface.dark,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
    backgroundColor: COLORS.background.light,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  priceRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  priceInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.surface.dark,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
    backgroundColor: COLORS.background.light,
  },
  priceSeparator: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: COLORS.surface.dark,
    borderRadius: BORDER_RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
    backgroundColor: COLORS.background.light,
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  checkboxLabel: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
    flex: 1,
  },
  searchOptions: {
    gap: SPACING.sm,
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
    borderWidth: 1,
    borderColor: COLORS.surface.dark,
  },
  resetButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.text.secondary,
  },
  searchButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primary,
    gap: SPACING.xs,
  },
  searchButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.surface.light,
  },
});

export default AdvancedSearchModal;