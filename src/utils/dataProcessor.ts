import type { DataPoint, ProcessedDataPoint, TimeRange, Variation } from "../types";

export const calculateConversionRate = (conversions: number, visits: number): number =>
  visits === 0 ? 0 : (conversions / visits) * 100;

export const processChartData = (
  data: DataPoint[],
  selectedVariations: number[],
  timeRange: TimeRange
): ProcessedDataPoint[] => {
  const aggregatedData = timeRange === 'week' ? aggregateByWeek(data) : data;

  return aggregatedData.map(point => {
    const processed: ProcessedDataPoint = { date: point.date };

    selectedVariations.forEach(varId => {
      const varIdStr = String(varId);
      const visits = point.visits[varIdStr] || 0;
      const conversions = point.conversions[varIdStr] || 0;
      processed[`var_${varId}`] = calculateConversionRate(conversions, visits);
    });

    return processed;
  });
};
const aggregateByWeek = (data: DataPoint[]): DataPoint[] => {
  const weeks = new Map<string, DataPoint>();

  data.forEach(point => {
    const weekStartKey = getWeekStart(point.date);

    if (!weeks.has(weekStartKey)) {
      weeks.set(weekStartKey, { date: weekStartKey, visits: {}, conversions: {} });
    }

    const weekData = weeks.get(weekStartKey)!;

    Object.keys(point.visits).forEach(varId => {
      weekData.visits[varId] = (weekData.visits[varId] || 0) + (point.visits[varId] || 0);
      weekData.conversions[varId] = (weekData.conversions[varId] || 0) + (point.conversions[varId] || 0);
    });
  });

  return Array.from(weeks.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

const getWeekStart = (dateInput: string | Date): string => {
  const date = new Date(dateInput);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  const weekStart = new Date(date);
  weekStart.setDate(diff);
  return weekStart.toISOString().split('T')[0];
};

export const formatDate = (dateStr: string, timeRange: TimeRange): string => {
  const date = new Date(dateStr);

  if (timeRange === 'week') {
    const weekEnd = new Date(date);
    weekEnd.setDate(weekEnd.getDate() + 6);
    return `${formatShortDate(date)} - ${formatShortDate(weekEnd)}`;
  }

  return formatShortDate(date);
};

const formatShortDate = (date: Date): string =>
  date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const VARIATION_COLORS: Record<number, string> = {
  0: '#3B82F6',
  10001: '#10B981',
  10002: '#F59E0B',
  10003: '#EF4444'
};

export const getVariationColor = (variationId: number): string =>
  VARIATION_COLORS[variationId] || '#6B7280';

export const getVariationName = (variations: Variation[], variationId: number): string =>
  variations.find(v => v.id === variationId)?.name || `Original ${variationId}`;
