import styles from './Icon.module.css';

// A handful of plain line icons, so buttons don't lean on emoji, which render
// differently on every device and look the same in every app.
const PATHS = {
  check: 'M5 12.5 L10 17.5 L19 7',
  cross: 'M6 6 L18 18 M18 6 L6 18',
  back: 'M19 12 H5 M11 5 L4 12 L11 19',
  timer: 'M12 6 V13 L16 15 M9 2.5 H15 M12 3 V6 M5 13 A7 7 0 1 0 19 13 A7 7 0 1 0 5 13',
  book: 'M12 6 C10 4.5 7 4.5 4 5 V18 C7 17.5 10 17.5 12 19 C14 17.5 17 17.5 20 18 V5 C17 4.5 14 4.5 12 6 Z M12 6 V19',
  pencil: 'M4 20 L5 15 L16 4 L20 8 L9 19 Z M14 6 L18 10',
  undo: 'M8 8 L4 12 L8 16 M4 12 H15 A5 5 0 0 1 15 22 H10',
  trash: 'M5 7 H19 M9 7 V4 H15 V7 M7 7 L8 20 H16 L17 7 M10 11 V16 M14 11 V16',
  play: 'M8 5 L19 12 L8 19 Z',
  star: 'M12 3.5 L14.6 9.3 L20.9 9.9 L16.2 14.1 L17.6 20.3 L12 17 L6.4 20.3 L7.8 14.1 L3.1 9.9 L9.4 9.3 Z',
} as const;

export type IconName = keyof typeof PATHS;

/** Solid by default for shapes that read as a block (play, star); `filled` overrides, e.g. an empty star. */
export function Icon({ name, filled = name === 'play' || name === 'star' }: { name: IconName; filled?: boolean }) {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
      <path d={PATHS[name]} fill={filled ? 'currentColor' : 'none'} />
    </svg>
  );
}
