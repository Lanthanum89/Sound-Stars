import { useSkin } from './context';
import styles from './SkinPicker.module.css';

export function SkinPicker() {
  const { skin, skins, setSkinId } = useSkin();

  return (
    <div className={styles.picker} role="radiogroup" aria-label="Choose a skin">
      {skins.map((s) => (
        <button
          key={s.id}
          type="button"
          role="radio"
          aria-checked={s.id === skin.id}
          data-active={s.id === skin.id}
          className={styles.chip}
          onClick={() => setSkinId(s.id)}
        >
          <span aria-hidden="true">{s.emoji}</span> {s.name}
        </button>
      ))}
    </div>
  );
}
