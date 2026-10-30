import { useSkin } from './context';
import styles from './SkinPicker.module.css';

export function SkinPicker() {
  const { skin, skins, setSkinId } = useSkin();

  return (
    <div className={styles.picker} role="radiogroup" aria-label="Pick a look">
      {skins.map((s) => (
        <label key={s.id} className={styles.chip} data-active={s.id === skin.id}>
          <input
            type="radio"
            name="skin"
            value={s.id}
            checked={s.id === skin.id}
            onChange={() => setSkinId(s.id)}
            className={styles.radioInput}
          />
          <span className={styles.swatch} aria-hidden="true">
            {s.swatch.map((colour) => (
              <span key={colour} style={{ background: colour }} />
            ))}
          </span>
          {s.name}
        </label>
      ))}
    </div>
  );
}
