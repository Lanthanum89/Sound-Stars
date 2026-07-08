import { useMemo, useState } from 'react';
import { Flashcard } from './components/Flashcard/Flashcard';
import { buildGraphemeDeck, buildTrickyWordDeck } from './content/deck';
import type { Phase } from './content/phonicsGraphemeBank';
import type { DeckKind } from './content/types';
import { useFlashcardDeck } from './hooks/useFlashcardDeck';
import styles from './App.module.css';

const ALL_PHASES: Phase[] = [2, 3, 4, 5];

function App() {
  const [phases, setPhases] = useState<Phase[]>(ALL_PHASES);
  const [deckKind, setDeckKind] = useState<DeckKind>('grapheme');

  const items = useMemo(
    () => (deckKind === 'grapheme' ? buildGraphemeDeck(phases) : buildTrickyWordDeck(phases)),
    [deckKind, phases],
  );
  const { current, position, total, isComplete, next, restart } = useFlashcardDeck(items);

  const togglePhase = (phase: Phase) => {
    setPhases((prev) =>
      prev.includes(phase) ? prev.filter((p) => p !== phase) : [...prev, phase].sort(),
    );
  };

  return (
    <main className={styles.app}>
      <h1>Sound Stars</h1>
      <p className={styles.subtitle}>Phonics flashcard practice for the Year 1 screening check</p>

      <div className={styles.controls}>
        <fieldset className={styles.fieldset}>
          <legend>Phase</legend>
          {ALL_PHASES.map((phase) => (
            <label key={phase} className={styles.checkbox}>
              <input
                type="checkbox"
                checked={phases.includes(phase)}
                onChange={() => togglePhase(phase)}
              />
              {phase}
            </label>
          ))}
        </fieldset>

        <fieldset className={styles.fieldset}>
          <legend>Deck</legend>
          <label className={styles.checkbox}>
            <input
              type="radio"
              name="deckKind"
              checked={deckKind === 'grapheme'}
              onChange={() => setDeckKind('grapheme')}
            />
            Graphemes
          </label>
          <label className={styles.checkbox}>
            <input
              type="radio"
              name="deckKind"
              checked={deckKind === 'tricky'}
              onChange={() => setDeckKind('tricky')}
            />
            Tricky words
          </label>
        </fieldset>
      </div>

      {total === 0 && <p>Select at least one phase to start.</p>}

      {total > 0 && !isComplete && current && (
        <>
          <p className={styles.progress}>
            Card {position + 1} of {total}
          </p>
          <Flashcard item={current} />
          <button type="button" className={styles.nextButton} onClick={next}>
            Next
          </button>
        </>
      )}

      {isComplete && (
        <div className={styles.done}>
          <p>Deck complete! {total} cards reviewed.</p>
          <button type="button" onClick={restart}>
            Shuffle &amp; restart
          </button>
        </div>
      )}
    </main>
  );
}

export default App;
