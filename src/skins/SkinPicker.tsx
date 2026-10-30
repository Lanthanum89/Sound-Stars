import { useEffect, useRef, useState } from 'react';
import { Icon } from '../components/Icon/Icon';
import { Mascot } from '../components/Mascot/Mascot';
import { useSkin } from './context';
import styles from './SkinPicker.module.css';

/** One "Theme" dropdown showing the current character; opens upward into the six. The choice is remembered. */
export function SkinPicker() {
  const { skin, skins, setSkinId } = useSkin();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    // Keyboard users land on the current theme and can arrow between the others.
    rootRef.current?.querySelector<HTMLInputElement>('input:checked')?.focus();
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div className={styles.picker} ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.row}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <Mascot skinId={skin.id} size={40} animate={false} />
        <span className={styles.name}>{skin.name}</span>
        <span className={styles.change}>
          {open ? 'Close' : 'Change theme'} <Icon name={open ? 'chevronUp' : 'chevronDown'} />
        </span>
      </button>

      {open && (
        <div className={styles.menu} role="radiogroup" aria-label="Theme">
          {skins.map((s) => (
            <label
              key={s.id}
              className={styles.choice}
              data-active={s.id === skin.id}
              // A real click (mouse or touch) closes the menu; arrow keys keep it open so you can browse.
              onClick={(e) => e.detail > 0 && setOpen(false)}
            >
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
