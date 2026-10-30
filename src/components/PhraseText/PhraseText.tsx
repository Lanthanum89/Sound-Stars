import { parsePhrase } from '../../content/soundSheet';
import styles from './PhraseText.module.css';

/** A sound-sheet phrase with the letters that make the sound picked out in colour. */
export function PhraseText({ phrase }: { phrase: string }) {
  return (
    <>
      {parsePhrase(phrase).map((segment, i) => (
        <span key={i} className={segment.highlight ? styles.mark : undefined}>
          {segment.text}
        </span>
      ))}
    </>
  );
}
