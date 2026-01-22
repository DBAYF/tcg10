import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Types
import { TCGCard } from '../../services/tcgApis';

// Constants
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../constants';

interface DeckAnalysisProps {
  cards: Array<{ card: TCGCard; quantity: number }>;
  format: string;
  game: string;
  onClose?: () => void;
}

interface DeckStats {
  totalCards: number;
  uniqueCards: number;
  averageCost: number;
  colorDistribution: Record<string, number>;
  typeDistribution: Record<string, number>;
  manaCurve: Record<number, number>;
  synergies: string[];
  weaknesses: string[];
  suggestions: string[];
}

const DeckAnalysis: React.FC<DeckAnalysisProps> = ({ cards, format, game, onClose }) => {
  const [analysis, setAnalysis] = useState<DeckStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyzeDeck();
  }, [cards, format, game]);

  const analyzeDeck = async () => {
    setLoading(true);
    try {
      // Simulate analysis delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const stats = calculateDeckStats();
      setAnalysis(stats);
    } catch (error) {
      console.error('Error analyzing deck:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDeckStats = (): DeckStats => {
    const totalCards = cards.reduce((sum, item) => sum + item.quantity, 0);
    const uniqueCards = cards.length;

    // Calculate average cost (simplified)
    const totalCost = cards.reduce((sum, item) => {
      const cost = item.card.convertedManaCost || item.card.power ? parseInt(item.card.power) || 0 : 0;
      return sum + (cost * item.quantity);
    }, 0);
    const averageCost = totalCards > 0 ? totalCost / totalCards : 0;

    // Color distribution
    const colorDistribution: Record<string, number> = {};
    cards.forEach(item => {
      if (item.card.colors) {
        item.card.colors.forEach(color => {
          colorDistribution[color] = (colorDistribution[color] || 0) + item.quantity;
        });
      } else {
        colorDistribution['Colorless'] = (colorDistribution['Colorless'] || 0) + item.quantity;
      }
    });

    // Type distribution
    const typeDistribution: Record<string, number> = {};
    cards.forEach(item => {
      const type = item.card.type || item.card.supertypes?.[0] || 'Unknown';
      typeDistribution[type] = (typeDistribution[type] || 0) + item.quantity;
    });

    // Mana curve (simplified for demo)
    const manaCurve: Record<number, number> = {};
    cards.forEach(item => {
      const cost = Math.min(item.card.convertedManaCost || 0, 7); // Cap at 7 for display
      manaCurve[cost] = (manaCurve[cost] || 0) + item.quantity;
    });

    // Generate insights and suggestions
    const synergies = generateSynergies();
    const weaknesses = generateWeaknesses();
    const suggestions = generateSuggestions();

    return {
      totalCards,
      uniqueCards,
      averageCost,
      colorDistribution,
      typeDistribution,
      manaCurve,
      synergies,
      weaknesses,
      suggestions,
    };
  };

  const generateSynergies = (): string[] => {
    const synergies: string[] = [];

    // Color synergies
    const colors = Object.keys(analysis?.colorDistribution || {});
    if (colors.length === 1) {
      synergies.push('Mono-color deck for focused strategy');
    } else if (colors.length === 2) {
      synergies.push('Dual-color deck with strong synergies');
    } else if (colors.length >= 5) {
      synergies.push('Five+ color deck offers flexibility');
    }

    // Type synergies
    const creatureCount = analysis?.typeDistribution['Creature'] || 0;
    const spellCount = analysis?.typeDistribution['Instant'] || 0 + (analysis?.typeDistribution['Sorcery'] || 0);

    if (creatureCount > totalCards * 0.6) {
      synergies.push('Creature-heavy deck with strong board presence');
    }
    if (spellCount > totalCards * 0.4) {
      synergies.push('Spell-based deck with strong interaction');
    }

    return synergies;
  };

  const generateWeaknesses = (): string[] => {
    const weaknesses: string[] = [];

    // Check for format compliance
    if (format === 'Commander' && totalCards < 100) {
      weaknesses.push('Commander deck needs 100 cards (currently ' + totalCards + ')');
    }

    // Mana curve analysis
    const highCostCards = Object.entries(analysis?.manaCurve || {})
      .filter(([cost, count]) => parseInt(cost) >= 5)
      .reduce((sum, [, count]) => sum + count, 0);

    if (highCostCards > totalCards * 0.3) {
      weaknesses.push('High number of expensive cards may cause mana flood');
    }

    // Color distribution
    const colors = Object.keys(analysis?.colorDistribution || {});
    const maxColor = Math.max(...Object.values(analysis?.colorDistribution || { colorless: 0 }));
    const splashColors = colors.filter(color =>
      (analysis?.colorDistribution[color] || 0) < maxColor * 0.3
    );

    if (splashColors.length > 0) {
      weaknesses.push('Splash colors may cause mana fixing issues');
    }

    return weaknesses;
  };

  const generateSuggestions = (): string[] => {
    const suggestions: string[] = [];

    // Mana fixing suggestions
    const colors = Object.keys(analysis?.colorDistribution || {});
    if (colors.length >= 3) {
      suggestions.push('Consider adding mana fixing cards for multi-color deck');
    }

    // Card draw suggestions
    const drawEngine = cards.some(item =>
      item.card.text?.toLowerCase().includes('draw') ||
      item.card.name.toLowerCase().includes('brainstorm')
    );
    if (!drawEngine && totalCards >= 60) {
      suggestions.push('Consider adding card draw engines for consistency');
    }

    // Removal suggestions
    const removalCount = cards.filter(item =>
      item.card.text?.toLowerCase().includes('destroy') ||
      item.card.text?.toLowerCase().includes('exile') ||
      item.card.text?.toLowerCase().includes('counter')
    ).reduce((sum, item) => sum + item.quantity, 0);

    if (removalCount < totalCards * 0.1) {
      suggestions.push('Consider adding more removal/interaction');
    }

    // Win condition suggestions
    const winConditions = cards.filter(item =>
      item.card.type?.toLowerCase().includes('planeswalker') ||
      item.card.name.toLowerCase().includes('emblem') ||
      item.card.text?.toLowerCase().includes('commander')
    ).length;

    if (winConditions === 0 && format !== 'Standard') {
      suggestions.push('Consider adding clear win conditions');
    }

    return suggestions;
  };

  const totalCards = cards.reduce((sum, item) => sum + item.quantity, 0);

  const renderStatCard = (title: string, value: string | number, subtitle?: string) => (
    <View style={styles.statCard}>
      <Text style={styles.statTitle}>{title}</Text>
      <Text style={styles.statValue}>{value}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );

  const renderManaCurve = () => {
    if (!analysis) return null;

    const maxCount = Math.max(...Object.values(analysis.manaCurve));
    const bars = [];

    for (let cost = 0; cost <= 7; cost++) {
      const count = analysis.manaCurve[cost] || 0;
      const heightPercent = maxCount > 0 ? (count / maxCount) * 100 : 0;

      bars.push(
        <View key={cost} style={styles.manaCurveBar}>
          <View
            style={[
              styles.manaCurveFill,
              { height: `${heightPercent}%` }
            ]}
          />
          <Text style={styles.manaCurveLabel}>{cost}+</Text>
          <Text style={styles.manaCurveCount}>{count}</Text>
        </View>
      );
    }

    return (
      <View style={styles.manaCurveContainer}>
        <Text style={styles.sectionTitle}>Mana Curve</Text>
        <View style={styles.manaCurveBars}>
          {bars}
        </View>
      </View>
    );
  };

  const renderDistribution = (title: string, data: Record<string, number>, colors: string[]) => (
    <View style={styles.distributionSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.distributionItems}>
        {Object.entries(data).map(([key, value], index) => (
          <View key={key} style={styles.distributionItem}>
            <View style={styles.distributionBar}>
              <View
                style={[
                  styles.distributionFill,
                  {
                    width: `${(value / totalCards) * 100}%`,
                    backgroundColor: colors[index % colors.length]
                  }
                ]}
              />
            </View>
            <View style={styles.distributionLabels}>
              <Text style={styles.distributionKey}>{key}</Text>
              <Text style={styles.distributionValue}>{value}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderInsights = (title: string, items: string[], icon: string, color: string) => (
    <View style={styles.insightsSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {items.length > 0 ? (
        items.map((item, index) => (
          <View key={index} style={styles.insightItem}>
            <Ionicons name={icon as any} size={20} color={color} />
            <Text style={styles.insightText}>{item}</Text>
          </View>
        ))
      ) : (
        <Text style={styles.noInsights}>No specific insights for this deck</Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Ionicons name="analytics-outline" size={48} color={COLORS.primary} />
        <Text style={styles.loadingText}>Analyzing deck...</Text>
        <Text style={styles.loadingSubtitle}>This may take a moment</Text>
      </View>
    );
  }

  if (!analysis) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={48} color={COLORS.error} />
        <Text style={styles.errorText}>Failed to analyze deck</Text>
        <TouchableOpacity style={styles.retryButton} onPress={analyzeDeck}>
          <Text style={styles.retryButtonText}>Retry Analysis</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="analytics-outline" size={24} color={COLORS.primary} />
          <Text style={styles.title}>Deck Analysis</Text>
        </View>
        {onClose && (
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Overview Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.statsGrid}>
            {renderStatCard('Total Cards', analysis.totalCards)}
            {renderStatCard('Unique Cards', analysis.uniqueCards)}
            {renderStatCard('Average Cost', analysis.averageCost.toFixed(1))}
            {renderStatCard('Format', format)}
          </View>
        </View>

        {/* Mana Curve */}
        {renderManaCurve()}

        {/* Color Distribution */}
        {Object.keys(analysis.colorDistribution).length > 0 && renderDistribution(
          'Color Distribution',
          analysis.colorDistribution,
          ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8']
        )}

        {/* Type Distribution */}
        {renderDistribution(
          'Type Distribution',
          analysis.typeDistribution,
          ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD']
        )}

        {/* Insights */}
        {renderInsights('Strengths', analysis.synergies, 'checkmark-circle-outline', '#22C55E')}
        {renderInsights('Weaknesses', analysis.weaknesses, 'warning-outline', '#F59E0B')}
        {renderInsights('Suggestions', analysis.suggestions, 'bulb-outline', '#3B82F6')}

        {/* Export Options */}
        <View style={styles.exportSection}>
          <Text style={styles.sectionTitle}>Export & Share</Text>
          <View style={styles.exportButtons}>
            <TouchableOpacity
              style={styles.exportButton}
              onPress={() => Alert.alert('Export', 'Export to decklist format')}
            >
              <Ionicons name="document-text-outline" size={20} color={COLORS.primary} />
              <Text style={styles.exportButtonText}>Export List</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.exportButton}
              onPress={() => Alert.alert('Share', 'Share deck analysis')}
            >
              <Ionicons name="share-outline" size={20} color={COLORS.primary} />
              <Text style={styles.exportButtonText}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.exportButton}
              onPress={() => Alert.alert('Save', 'Save analysis to device')}
            >
              <Ionicons name="download-outline" size={20} color={COLORS.primary} />
              <Text style={styles.exportButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface.light,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  loadingText: {
    ...TYPOGRAPHY.heading2,
    color: COLORS.text.primary,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  loadingSubtitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
  },
  errorText: {
    ...TYPOGRAPHY.heading2,
    color: COLORS.text.primary,
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  retryButtonText: {
    ...TYPOGRAPHY.button,
    color: COLORS.surface.light,
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
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  title: {
    ...TYPOGRAPHY.heading2,
    color: COLORS.text.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  statsSection: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  statCard: {
    backgroundColor: COLORS.background.light,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    minWidth: '45%',
    alignItems: 'center',
  },
  statTitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  statValue: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  statSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  manaCurveContainer: {
    marginBottom: SPACING.xl,
  },
  manaCurveBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 150,
    backgroundColor: COLORS.background.light,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },
  manaCurveBar: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: SPACING.xs,
  },
  manaCurveFill: {
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS.sm,
    width: '100%',
    marginBottom: SPACING.sm,
  },
  manaCurveLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
  },
  manaCurveCount: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.primary,
    fontWeight: '600',
    position: 'absolute',
    bottom: -20,
  },
  distributionSection: {
    marginBottom: SPACING.xl,
  },
  distributionItems: {
    gap: SPACING.sm,
  },
  distributionItem: {
    backgroundColor: COLORS.background.light,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },
  distributionBar: {
    height: 8,
    backgroundColor: COLORS.surface.dark,
    borderRadius: 4,
    marginBottom: SPACING.sm,
    overflow: 'hidden',
  },
  distributionFill: {
    height: '100%',
    borderRadius: 4,
  },
  distributionLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  distributionKey: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.primary,
    fontWeight: '600',
  },
  distributionValue: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
  },
  insightsSection: {
    marginBottom: SPACING.xl,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    backgroundColor: COLORS.background.light,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  insightText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.primary,
    flex: 1,
    lineHeight: 20,
  },
  noInsights: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: SPACING.lg,
  },
  exportSection: {
    marginBottom: SPACING.xl,
  },
  exportButtons: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  exportButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background.light,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    gap: SPACING.xs,
  },
  exportButtonText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.primary,
    fontWeight: '600',
  },
});

export default DeckAnalysis;