import type { TooltipProps } from 'recharts/types/component/Tooltip';
import type { Variation } from '../../types';
import { getVariationColor, getVariationName } from '../../utils/dataProcessor';
import styles from './Tooltip.module.scss';

interface CustomTooltipProps extends TooltipProps<number, string> {
  variations: Variation[];
  selectedVariations: number[];
  theme: 'light' | 'dark';
  label: string;
  payload: { dataKey: string; value: number }[];
}

export const CustomTooltip = ({
  active,
  payload = [],
  label,
  variations,
  selectedVariations,
  theme
}: CustomTooltipProps) => {
  if (!active || payload.length === 0) return null;

  const bestKey = [...payload].sort((a, b) => b.value - a.value)[0]?.dataKey;

  const sortedVariations = [...selectedVariations].sort((a, b) => {
    const keyA = `var_${a}`;
    const keyB = `var_${b}`;
    return keyA === bestKey ? -1 : keyB === bestKey ? 1 : 0;
  });

  return (
    <div className={`${styles.tooltip} ${theme === 'dark' ? styles.dark : ''}`}>
      <p className={styles.label}>{label}</p>

      <div className={styles.items}>
        {sortedVariations.map((varId) => {
          const dataKey = `var_${varId}`;
          const item = payload.find((el) => el.dataKey === dataKey);
          const value = item?.value ?? 0;
          const isBest = dataKey === bestKey;

          return (
            <div key={varId} className={styles.item}>
              <div
                className={styles.dot}
                style={{ backgroundColor: getVariationColor(varId) }}
              />

              <span className={styles.name}>
                {getVariationName(variations, varId)}:
              </span>

              {isBest && (
                <span className={styles.trophy} role="img" aria-label="trophy">
                  🏆
                </span>
              )}

              <span className={styles.value}>{value.toFixed(2)}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
