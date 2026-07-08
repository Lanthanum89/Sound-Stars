import { useMemo, useState } from 'react';
import { Round } from './components/Round/Round';
import { SkinPicker } from './skins/SkinPicker';
import { SkinStage } from './skins/SkinStage';
import { buildGraphemeDeck, buildTrickyWordDeck } from './content/deck';
import type { Phase } from './content/phonicsGraphemeBank';
import type { DeckKind } from './content/types';
import logo from './assets/logo.png';
import styles from './App.module.css';

const ALL_PHASES: Phase[] = [2, 3, 4, 5];
const DEFAULT_SECONDS_PER_CARD = 5;

function App() {
  const [phases, setPhases] = useState<Phase[]>(ALL_PHASES);
  const [deckKind, setDeckKind] = useState<DeckKind>('grapheme');
  const [timedMode, setTimedMode] = useState(false);
  const [secondsPerCard, setSecondsPerCard] = useState(DEFAULT_SECONDS_PER_CARD);

  const items = useMemo(
    () => (deckKind === 'grapheme' ? buildGraphemeDeck(phases) : buildTrickyWordDeck(phases)),
    [deckKind, phases],
  );

  const togglePhase = (phase: Phase) => {
    setPhases((prev) =>
      prev.includes(phase) ? prev.filter((p) => p !== phase) : [...prev, phase].sort(),
    );
  };

  return (
    <main className={styles.app}>
      <div className={styles.header}>
        <img src={logo} alt="" className={styles.logo} width={64} height={64} />
        <h1>Sound Stars</h1>
      </div>
      <p className={styles.subtitle}>Phonics flashcard practice for the Year 1 screening check</p>

      <SkinPicker />

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

        <fieldset className={styles.fieldset}>
          <legend>Timing</legend>
          <label className={styles.checkbox}>
            <input
              type="checkbox"
              checked={timedMode}
              onChange={(e) => setTimedMode(e.target.checked)}
            />
            Timed rounds
          </label>
          {timedMode && (
            <label className={styles.checkbox}>
              secs/card
              <input
                type="number"
                min={2}
                max={30}
                value={secondsPerCard}
                onChange={(e) => setSecondsPerCard(Number(e.target.value) || DEFAULT_SECONDS_PER_CARD)}
                className={styles.secondsInput}
              />
            </label>
          )}
        </fieldset>
      </div>

      {items.length === 0 ? (
        <p>Select at least one phase to start.</p>
      ) : (
        <SkinStage>
          <Round items={items} timed={timedMode} secondsPerCard={secondsPerCard} />
        </SkinStage>
      )}
    </main>
  );
}

export default App;
