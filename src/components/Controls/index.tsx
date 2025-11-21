import { Download, Moon, Sun, ZoomIn, ZoomOut } from 'lucide-react';

import useThemeStore from '../../store/useThemeStore';
import type { LineStyle, TimeRange } from '../../types';
import styles from './Controls.module.scss';

interface ControlsProps {
  timeRange: TimeRange;
  onTimeRangeChange: (range: TimeRange) => void;
  lineStyle: LineStyle;
  onLineStyleChange: (style: LineStyle) => void;
  onExport: () => void;
  onZoom: () => void;
  onResetZoom: () => void;
  isZoomed: boolean;
}

export const Controls = ({
  timeRange,
  onTimeRangeChange,
  onLineStyleChange,
  onExport,
  onZoom,
  onResetZoom,
  isZoomed
}: ControlsProps) => {
    const { theme, toggleTheme } = useThemeStore();

    const handleToggle = () => {
    toggleTheme();
    const newTheme = theme === "light" ? "dark" : "light";
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div className={styles.container}>
      <div className={styles.group}>
        <label className={`${styles.label} ${theme === 'dark' ? styles.dark : ''}`}>
          Time Range:
        </label>
        <div className={styles.buttonGroup}>
           <select
           className={`${styles.select} ${theme === 'dark' ? styles.dark : ""}`}
            value={timeRange}
            onChange={(e) => onTimeRangeChange(e.target.value as TimeRange)}
          >
            <option value="day" className={styles.option}>Day</option>
            <option value="week" className={styles.option}>Week</option>
          </select>
        </div>
      </div>

      <div className={styles.group}>
        <label className={`${styles.label} ${theme === 'dark' ? styles.dark : ''}`}>
          Line Style:
        </label>
        <select className={`${styles.select} ${theme === 'dark' ? styles.dark : ""}`}
            value={timeRange}
            onChange={(e) => onLineStyleChange(e.target.value as LineStyle)}>
          <option value="line">Line</option>
          <option value="smooth">Smooth</option>
          <option value="area">Area</option>
        </select>
      </div>
      <div className={styles.actions}>
        {isZoomed ? (
          <button
            onClick={onResetZoom}
            className={`${styles.iconButton} ${theme === 'dark' ? styles.dark : ''}`}
            title="Reset Zoom"
          >
            <ZoomOut size={18} />
          </button>
        ) : (
          <button
            onClick={onZoom}
            className={`${styles.iconButton} ${theme === 'dark' ? styles.dark : ''}`}
            title="Zoom In"
          >
            <ZoomIn size={18} />
          </button>
        )}

        <button
          onClick={onExport}
          className={`${styles.iconButton} ${theme === 'dark' ? styles.dark : ''}`}
          title="Export to PNG"
        >
          <Download size={18} />
        </button>

        <button
          onClick={handleToggle}
          className={`${styles.iconButton} ${theme === 'dark' ? styles.dark : ''}`}
          title="Toggle Theme"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>
    </div>
  );
};
