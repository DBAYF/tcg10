import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Types
import { TCGCard } from '../../services/tcgApis';

// Constants
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../../constants';

const { width } = Dimensions.get('window');

interface PriceAnalyticsProps {
  card: TCGCard;
  onClose?: () => void;
}

interface PriceDataPoint {
  date: string;
  price: number;
  volume?: number;
}

const PriceAnalytics: React.FC<PriceAnalyticsProps> = ({ card, onClose }) => {
  const [priceHistory, setPriceHistory] = useState<PriceDataPoint[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPriceHistory();
  }, [card.id, selectedPeriod]);

  const loadPriceHistory = async () => {
    setLoading(true);
    try {
      // Generate mock price history data
      const days = selectedPeriod === '7d' ? 7 : selectedPeriod === '30d' ? 30 : selectedPeriod === '90d' ? 90 : 365;
      const basePrice = card.price || 10;
      const mockHistory: PriceDataPoint[] = [];

      for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        // Generate realistic price fluctuations
        const volatility = 0.3; // 30% volatility
        const trend = i > days / 2 ? 0.002 : -0.001; // Slight upward trend in recent days
        const randomChange = (Math.random() - 0.5) * volatility;
        const price = basePrice * (1 + trend * i + randomChange);

        mockHistory.push({
          date: date.toISOString().split('T')[0],
          price: Math.max(0.01, price),
          volume: Math.floor(Math.random() * 100) + 10,
        });
      }

      setPriceHistory(mockHistory);
    } catch (error) {
      console.error('Error loading price history:', error);
    } finally {
      setLoading(false);
    }
  };

  const priceAnalytics = useMemo(() => {
    if (priceHistory.length === 0) return null;

    const prices = priceHistory.map(p => p.price);
    const currentPrice = prices[prices.length - 1];
    const previousPrice = prices[prices.length - 2] || currentPrice;

    const change = currentPrice - previousPrice;
    const changePercent = previousPrice > 0 ? (change / previousPrice) * 100 : 0;

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const avgPrice = prices.reduce((sum, price) => sum + price, 0) / prices.length;

    const volatility = prices.length > 1 ?
      Math.sqrt(prices.reduce((sum, price) => sum + Math.pow(price - avgPrice, 2), 0) / (prices.length - 1)) / avgPrice * 100
      : 0;

    return {
      currentPrice,
      change,
      changePercent,
      minPrice,
      maxPrice,
      avgPrice,
      volatility,
      trend: changePercent > 0 ? 'up' : changePercent < 0 ? 'down' : 'stable',
    };
  }, [priceHistory]);

  const renderPriceChart = () => {
    if (priceHistory.length === 0) return null;

    const prices = priceHistory.map(p => p.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice || 1;

    const chartWidth = width - SPACING.lg * 2;
    const chartHeight = 200;

    return (
      <View style={styles.chartContainer}>
        <View style={styles.chart}>
          {priceHistory.map((point, index) => {
            const x = (index / (priceHistory.length - 1)) * chartWidth;
            const y = chartHeight - ((point.price - minPrice) / priceRange) * chartHeight;

            return (
              <View
                key={index}
                style={[
                  styles.dataPoint,
                  { left: x, top: y }
                ]}
              />
            );
          })}

          {/* Trend line (simplified) */}
          <View style={styles.trendLine}>
            {priceHistory.map((point, index) => {
              if (index === 0) return null;
              const prevPoint = priceHistory[index - 1];

              const x1 = ((index - 1) / (priceHistory.length - 1)) * chartWidth;
              const y1 = chartHeight - ((prevPoint.price - minPrice) / priceRange) * chartHeight;
              const x2 = (index / (priceHistory.length - 1)) * chartWidth;
              const y2 = chartHeight - ((point.price - minPrice) / priceRange) * chartHeight;

              const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
              const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

              return (
                <View
                  key={`line-${index}`}
                  style={[
                    styles.lineSegment,
                    {
                      left: x1,
                      top: y1,
                      width: length,
                      transform: [{ rotate: `${angle}deg` }],
                    }
                  ]}
                />
              );
            })}
          </View>
        </View>

        {/* Price labels */}
        <View style={styles.priceLabels}>
          <Text style={styles.maxPriceLabel}>${maxPrice.toFixed(2)}</Text>
          <Text style={styles.minPriceLabel}>${minPrice.toFixed(2)}</Text>
        </View>
      </View>
    );
  };

  const renderStatsCard = (title: string, value: string, subtitle?: string, trend?: 'up' | 'down' | 'stable') => (
    <View style={styles.statsCard}>
      <View style={styles.statsHeader}>
        <Text style={styles.statsTitle}>{title}</Text>
        {trend && (
          <Ionicons
            name={trend === 'up' ? 'trending-up' : trend === 'down' ? 'trending-down' : 'remove-outline'}
            size={16}
            color={trend === 'up' ? '#22C55E' : trend === 'down' ? '#EF4444' : COLORS.text.secondary}
          />
        )}
      </View>
      <Text style={styles.statsValue}>{value}</Text>
      {subtitle && <Text style={styles.statsSubtitle}>{subtitle}</Text>}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading price analytics...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="analytics-outline" size={24} color={COLORS.primary} />
          <Text style={styles.title}>Price Analytics</Text>
        </View>
        {onClose && (
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Card Info */}
        <View style={styles.cardInfo}>
          <Text style={styles.cardName}>{card.name}</Text>
          <Text style={styles.cardGame}>{card.game.toUpperCase()}</Text>
          {card.set && <Text style={styles.cardSet}>{card.set}</Text>}
        </View>

        {/* Time Period Selector */}
        <View style={styles.periodSelector}>
          {(['7d', '30d', '90d', '1y'] as const).map(period => (
            <TouchableOpacity
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.periodButtonActive
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={[
                styles.periodButtonText,
                selectedPeriod === period && styles.periodButtonTextActive
              ]}>
                {period}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Current Price & Change */}
        {priceAnalytics && (
          <View style={styles.priceOverview}>
            <View style={styles.currentPriceContainer}>
              <Text style={styles.currentPriceLabel}>Current Price</Text>
              <Text style={styles.currentPrice}>${priceAnalytics.currentPrice.toFixed(2)}</Text>
              <View style={styles.priceChange}>
                <Ionicons
                  name={priceAnalytics.change >= 0 ? 'arrow-up' : 'arrow-down'}
                  size={16}
                  color={priceAnalytics.change >= 0 ? '#22C55E' : '#EF4444'}
                />
                <Text style={[
                  styles.priceChangeText,
                  { color: priceAnalytics.change >= 0 ? '#22C55E' : '#EF4444' }
                ]}>
                  ${Math.abs(priceAnalytics.change).toFixed(2)} ({priceAnalytics.changePercent >= 0 ? '+' : ''}{priceAnalytics.changePercent.toFixed(2)}%)
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Price Chart */}
        <View style={styles.chartSection}>
          <Text style={styles.sectionTitle}>Price History</Text>
          {renderPriceChart()}
        </View>

        {/* Statistics */}
        {priceAnalytics && (
          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Statistics</Text>
            <View style={styles.statsGrid}>
              {renderStatsCard(
                'Average Price',
                `$${priceAnalytics.avgPrice.toFixed(2)}`,
                `Over ${selectedPeriod}`
              )}
              {renderStatsCard(
                'Price Range',
                `$${priceAnalytics.minPrice.toFixed(2)} - $${priceAnalytics.maxPrice.toFixed(2)}`,
                `${((priceAnalytics.maxPrice - priceAnalytics.minPrice) / priceAnalytics.avgPrice * 100).toFixed(1)}% spread`
              )}
              {renderStatsCard(
                'Volatility',
                `${priceAnalytics.volatility.toFixed(1)}%`,
                priceAnalytics.volatility > 20 ? 'High volatility' : priceAnalytics.volatility > 10 ? 'Moderate' : 'Low volatility'
              )}
              {renderStatsCard(
                'Trend',
                priceAnalytics.trend === 'up' ? 'Rising' : priceAnalytics.trend === 'down' ? 'Falling' : 'Stable',
                `Based on recent data`,
                priceAnalytics.trend
              )}
            </View>
          </View>
        )}

        {/* Insights */}
        <View style={styles.insightsSection}>
          <Text style={styles.sectionTitle}>Market Insights</Text>
          <View style={styles.insightsList}>
            {priceAnalytics && (
              <>
                <View style={styles.insight}>
                  <Ionicons name="bulb-outline" size={20} color={COLORS.primary} />
                  <Text style={styles.insightText}>
                    {priceAnalytics.volatility > 20
                      ? 'High price volatility detected. Consider monitoring closely.'
                      : 'Price appears stable. Good time for long-term holding.'
                    }
                  </Text>
                </View>

                <View style={styles.insight}>
                  <Ionicons
                    name={priceAnalytics.trend === 'up' ? 'trending-up' : 'trending-down'}
                    size={20}
                    color={priceAnalytics.trend === 'up' ? '#22C55E' : '#EF4444'}
                  />
                  <Text style={styles.insightText}>
                    {priceAnalytics.trend === 'up'
                      ? `Price trending upward by ${Math.abs(priceAnalytics.changePercent).toFixed(1)}% recently.`
                      : priceAnalytics.trend === 'down'
                      ? `Price trending downward by ${Math.abs(priceAnalytics.changePercent).toFixed(1)}% recently.`
                      : 'Price remains stable with no significant trend.'
                    }
                  </Text>
                </View>

                <View style={styles.insight}>
                  <Ionicons name="time-outline" size={20} color={COLORS.primary} />
                  <Text style={styles.insightText}>
                    Based on {priceHistory.length} data points over the selected period.
                  </Text>
                </View>
              </>
            )}
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
  },
  loadingText: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.secondary,
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
  cardInfo: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  cardName: {
    ...TYPOGRAPHY.heading1,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
  },
  cardGame: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.primary,
    fontWeight: '600',
    textAlign: 'center',
  },
  cardSet: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.lg,
  },
  periodButton: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.background.light,
    borderWidth: 1,
    borderColor: COLORS.surface.dark,
  },
  periodButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  periodButtonText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.secondary,
    fontWeight: '500',
  },
  periodButtonTextActive: {
    color: COLORS.surface.light,
  },
  priceOverview: {
    marginBottom: SPACING.xl,
  },
  currentPriceContainer: {
    alignItems: 'center',
  },
  currentPriceLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xs,
  },
  currentPrice: {
    ...TYPOGRAPHY.display,
    color: COLORS.primary,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  priceChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  priceChangeText: {
    ...TYPOGRAPHY.bodySmall,
    fontWeight: '600',
  },
  chartSection: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
    fontWeight: '600',
    marginBottom: SPACING.md,
  },
  chartContainer: {
    backgroundColor: COLORS.background.light,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    height: 250,
  },
  chart: {
    flex: 1,
    position: 'relative',
  },
  dataPoint: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
    marginLeft: -3,
    marginTop: -3,
  },
  trendLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  lineSegment: {
    position: 'absolute',
    height: 2,
    backgroundColor: COLORS.primary,
    opacity: 0.7,
  },
  priceLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
  },
  maxPriceLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
  },
  minPriceLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
  },
  statsSection: {
    marginBottom: SPACING.xl,
  },
  statsGrid: {
    gap: SPACING.md,
  },
  statsCard: {
    backgroundColor: COLORS.background.light,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  statsTitle: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.secondary,
    fontWeight: '600',
  },
  statsValue: {
    ...TYPOGRAPHY.body,
    color: COLORS.text.primary,
    fontWeight: '700',
  },
  statsSubtitle: {
    ...TYPOGRAPHY.caption,
    color: COLORS.text.secondary,
    marginTop: SPACING.xs,
  },
  insightsSection: {
    marginBottom: SPACING.xl,
  },
  insightsList: {
    gap: SPACING.md,
  },
  insight: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    backgroundColor: COLORS.background.light,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },
  insightText: {
    ...TYPOGRAPHY.bodySmall,
    color: COLORS.text.primary,
    flex: 1,
    lineHeight: 20,
  },
});

export default PriceAnalytics;