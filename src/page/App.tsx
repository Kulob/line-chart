import html2canvas from 'html2canvas';
import { useEffect, useRef, useState } from 'react';
import { Controls } from '../components/Controls';
import { LineChart } from '../components/LineChart';
import { VariationSelector } from '../components/VariationSelector';
import useThemeStore from '../store/useThemeStore';
import type { ChartData, LineStyle, TimeRange } from '../types';
import { processChartData } from '../utils/dataProcessor';
import styles from './App.module.scss';

function App() {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [selectedVariations, setSelectedVariations] = useState<number[]>([0]);
  const [timeRange, setTimeRange] = useState<TimeRange>('day');
  const [lineStyle, setLineStyle] = useState<LineStyle>('line');
  const [zoomDomain, setZoomDomain] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { theme } = useThemeStore();

  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
      const dataUrl = `${import.meta.env.BASE_URL}data.json`;
      fetch(dataUrl)
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to load data');
        }
        return res.json();
      })
      .then((data: ChartData) => {
        setChartData(data);
        const defaultVariations = data.variations.slice(0, 2).map(el => el.id);
        setSelectedVariations(defaultVariations);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleExport = async () => {
    if (!chartRef.current) return;

    try {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: theme === 'dark' ? '#111827' : '#ffffff',
        scale: 2
      });

      const link = document.createElement('a');
      link.download = `ab-test-chart-${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const handleZoom = () => {
    if (!chartData) return;
    const processedData = processChartData(chartData.data, selectedVariations, timeRange);
    const mid = Math.floor(processedData.length / 2);
    const zoomSize = Math.floor(processedData.length / 3);
    setZoomDomain([
      Math.max(0, mid - zoomSize),
      Math.min(processedData.length - 1, mid + zoomSize)
    ]);
  };

  const handleResetZoom = () => {
    setZoomDomain(null);
  };

 if (loading || error || !chartData) {
    return (
      <div className={`${styles.app} ${theme === 'dark' ? styles.dark : ''}`}>
        <div className={styles.container}>
          {loading && <div className={styles.loading}>Loading chart data...</div>}
          {error && (
            <div className={styles.error}>
              <span>Failed to load chart data</span>
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  const processedData = processChartData(chartData.data, selectedVariations, timeRange);

  return (
    <div className={`${styles.app} ${theme === 'dark' ? styles.dark : ''}`}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Line Chart</h1>
        </div>

        <div className={styles.content}>
          <VariationSelector
            variations={chartData.variations}
            selectedVariations={selectedVariations}
            onChange={setSelectedVariations}
          />

          <Controls
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
            lineStyle={lineStyle}
            onLineStyleChange={setLineStyle}
            onExport={handleExport}
            onZoom={handleZoom}
            onResetZoom={handleResetZoom}
            isZoomed={zoomDomain !== null}
          />

          <div ref={chartRef} className={styles.chartWrapper}>
            <LineChart
              data={processedData}
              variations={chartData.variations}
              selectedVariations={selectedVariations}
              timeRange={timeRange}
              lineStyle={lineStyle}
              zoomDomain={zoomDomain}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
