
import useThemeStore from '../../store/useThemeStore';
import type { Variation } from '../../types';
import { getVariationColor } from '../../utils/dataProcessor';
import styles from './VariationSelector.module.scss';

interface VariationSelectorProps {
  variations: Variation[];
  selectedVariations: number[];
  onChange: (selected: number[]) => void;
}

export const VariationSelector = ({
  variations,
  selectedVariations,
  onChange,
}: VariationSelectorProps) => {
    const { theme } = useThemeStore();
    
  const handleToggle = (varId: number) => {
    if (selectedVariations.includes(varId)) {
      if (selectedVariations.length > 1) {
        onChange(selectedVariations.filter(id => id !== varId));
      }
    } else {
      onChange([...selectedVariations, varId]);
    }
  };

  return (
    <div className={styles.container}>
      <label className={`${styles.label} ${theme === 'dark' ? styles.dark : ''}`}>
        Variations:
      </label>
      <div className={styles.options}>
        {variations.map(variation => {
          const isSelected = selectedVariations.includes(variation.id);
          const color = getVariationColor(variation.id);

          return (
            <button
              key={variation.id}
              onClick={() => handleToggle(variation.id)}
              className={`${styles.option} ${isSelected ? styles.selected : ''} ${
                theme === 'dark' ? styles.dark : ''
              }`}
              style={{
                borderColor: isSelected ? color : undefined,
                backgroundColor: isSelected
                  ? `${color}15`
                  : theme === 'dark'
                  ? '#1f2937'
                  : '#ffffff'
              }}
            >
              <div
                className={styles.dot}
                style={{ backgroundColor: color }}
              />
              {variation.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
