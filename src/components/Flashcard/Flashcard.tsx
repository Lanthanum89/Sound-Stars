import type { FlashcardItem } from '../../content/types';
import styles from './Flashcard.module.css';

interface FlashcardProps {
  item: FlashcardItem;
}

export function Flashcard({ item }: FlashcardProps) {
  const isGrapheme = item.kind === 'grapheme';

  return (
    <div className={styles.card} data-phase={item.phase} data-kind={item.kind}>
      <p className={styles.label}>
        Phase {item.phase} {isGrapheme ? 'sound' : 'tricky word'}
      </p>
      <p className={styles.prompt}>{item.prompt}</p>
      {isGrapheme && <p className={styles.word}>{item.word}</p>}
    </div>
  );
}
