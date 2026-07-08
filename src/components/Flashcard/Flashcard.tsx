import { useSkin } from '../../skins/context';
import type { FlashcardItem } from '../../content/types';
import styles from './Flashcard.module.css';

interface FlashcardProps {
  item: FlashcardItem;
}

export function Flashcard({ item }: FlashcardProps) {
  const { skin } = useSkin();
  const isGrapheme = item.kind === 'grapheme';

  return (
    <div className={styles.card} data-phase={item.phase} data-kind={item.kind}>
      <div className={styles.mascot} aria-hidden="true">
        {skin.mascotSrc ? (
          <img src={skin.mascotSrc} alt="" className={styles.mascotImg} />
        ) : (
          <span>{skin.emoji}</span>
        )}
      </div>
      <p className={styles.label}>
        Phase {item.phase} {isGrapheme ? 'sound' : 'tricky word'}
      </p>
      <p className={styles.prompt}>{item.prompt}</p>
      {isGrapheme && <p className={styles.word}>{item.word}</p>}
    </div>
  );
}
