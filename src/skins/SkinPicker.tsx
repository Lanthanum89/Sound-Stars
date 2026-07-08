import { useSkin } from './context';
import styles from './SkinPicker.module.css';

export function SkinPicker() {
  const { skin, skins, setSkinId } = useSkin();

  return (
    <div className={styles.picker} role="radiogroup" aria-label="Choose a skin">
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
          <span aria-hidden="true">{s.emoji}</span> {s.name}
        </label>
      ))}
    </div>
  );
}
