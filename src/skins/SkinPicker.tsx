import { useState } from 'react';
import { Icon } from '../components/Icon/Icon';
import { Mascot } from '../components/Mascot/Mascot';
import { useSkin } from './context';
import styles from './SkinPicker.module.css';

/** A one-line "look" row that opens into the six characters, so six themes are not six things on the setup screen. */
export function SkinPicker() {
  const { skin, skins, setSkinId } = useSkin();
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.picker}>
      <button type="button" className={styles.row} onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <Mascot skinId={skin.id} size={34} animate={false} />
        <span className={styles.label}>
          Look <strong className={styles.name}>{skin.name}</strong>
        </span>
        <span className={styles.change}>{open ? 'Done' : 'Change'}</span>
      </button>

      {open && (
        <div className={styles.grid} role="radiogroup" aria-label="Pick a look">
          {skins.map((s) => (
            <label key={s.id} className={styles.choice} data-active={s.id === skin.id}>
              <input
                type="radio"
                name="skin"
                value={s.id}
                checked={s.id === skin.id}
                onChange={() => setSkinId(s.id)}
                className={styles.radioInput}
              />
              <Mascot skinId={s.id} size={44} animate={false} />
              <span className={styles.choiceName}>
                {s.id === skin.id && <Icon name="check" />} {s.name}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
