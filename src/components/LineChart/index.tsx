import { useRef } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { formatDate, getVariationColor, getVariationName } from '../../utils/dataProcessor';

import useThemeStore from '../../store/useThemeStore';
import type { ProcessedDataPoint, TimeRange, Variation } from '../../types';
import { CustomTooltip } from '../Tooltip';
import styles from './LineChart.module.scss';

export type LineStyle = 'line' | 'smooth' | 'area';

interface LineChartProps {
  data: ProcessedDataPoint[];
  variations: Variation[];
  selectedVariations: number[];
  timeRange: TimeRange;
  lineStyle: LineStyle;
  zoomDomain: [number, number] | null;
  onMouseMove?: (index: number | null) => void;
}

export const LineChart = ({
  data,
  variations,
  selectedVariations,
  timeRange,
  lineStyle,
  zoomDomain
}: LineChartProps) => {
  const {theme} = useThemeStore();
  const chartRef = useRef<HTMLDivElement>(null);

  const displayData = zoomDomain
    ? data.slice(zoomDomain[0], zoomDomain[1] + 1)
    : data;

  const chartColors = {
    text: theme === 'dark' ? '#9ca3af' : '#6b7280',
    grid: theme === 'dark' ? '#374151' : '#e5e7eb',
    background: theme === 'dark' ? '#111827' : '#ffffff'
  };

  const formatXAxis = (dateStr: string) => {
    return formatDate(dateStr, timeRange);
  };

  const formatYAxis = (value: number) => {
    return `${value.toFixed(0)}%`;
  };

  const ChartComponent = lineStyle === 'area' ? AreaChart : RechartsLineChart;
  const strokeType = lineStyle === 'smooth' ? 'monotone' : 'linear';

  return (
    <div ref={chartRef} className={styles.container}>
      <ResponsiveContainer width="100%" height={400}>
        <ChartComponent data={displayData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
          <XAxis
            dataKey="date"
            tickFormatter={formatXAxis}
            stroke={chartColors.text}
            style={{ fontSize: '12px' }}
          />
          <YAxis
            tickFormatter={formatYAxis}
            stroke={chartColors.text}
            style={{ fontSize: '12px' }}
            domain={['auto', 'auto']}
          />
          <Tooltip
            content={
              <CustomTooltip
                variations={variations}
                selectedVariations={selectedVariations}
                theme={theme} label={''} payload={[]}              />
            }
            cursor={{
              stroke: theme === 'dark' ? '#6b7280' : '#9ca3af',
              strokeWidth: 1,
              strokeDasharray: '5 5'
            }}
          />

          {selectedVariations.map(varId => {
            const dataKey = `var_${varId}`;
            const color = getVariationColor(varId);
            const name = getVariationName(variations, varId);

            if (lineStyle === 'area') {
              return (
                <Area
                  key={varId}
                  type={strokeType}
                  dataKey={dataKey}
                  stroke={color}
                  fill={color}
                  fillOpacity={0.2}
                  strokeWidth={2}
                  name={name}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              );
            }

            return (
              <Line
                key={varId}
                type={strokeType}
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2}
                name={name}
                dot={false}
                activeDot={{ r: 6 }}
              />
            );
          })}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
};
