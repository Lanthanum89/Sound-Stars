import { useMemo, useState } from 'react';
import { Modal } from './components/Modal/Modal';
import { Round } from './components/Round/Round';
import { SkinPicker } from './skins/SkinPicker';
import { SkinStage } from './skins/SkinStage';
import { buildGraphemeDeck, buildTrickyWordDeck } from './content/deck';
import { useThemeMode } from './hooks/useThemeMode';
import type { Phase } from './content/phonicsGraphemeBank';
import type { DeckKind } from './content/types';
import logo from './assets/logo.png';
import styles from './App.module.css';

const ALL_PHASES: Phase[] = [2, 3, 4, 5];
const DEFAULT_SECONDS_PER_CARD = 5;
const SESSION_SIZE_PRESETS = [10, 20, 30];

type SessionSize = number | 'all';

function App() {
  const { mode: themeMode, toggle: toggleTheme } = useThemeMode();
  const [phases, setPhases] = useState<Phase[]>(ALL_PHASES);
  const [deckKind, setDeckKind] = useState<DeckKind>('grapheme');
  const [timedMode, setTimedMode] = useState(false);
  const [secondsPerCard, setSecondsPerCard] = useState(DEFAULT_SECONDS_PER_CARD);
  const [sessionSize, setSessionSize] = useState<SessionSize>('all');
  const [isRoundOpen, setIsRoundOpen] = useState(false);

  const items = useMemo(
    () => (deckKind === 'grapheme' ? buildGraphemeDeck(phases) : buildTrickyWordDeck(phases)),
    [deckKind, phases],
  );

  const togglePhase = (phase: Phase) => {
    setPhases((prev) =>
      prev.includes(phase) ? prev.filter((p) => p !== phase) : [...prev, phase].sort(),
    );
  };

  const roundSize = sessionSize === 'all' ? items.length : Math.min(sessionSize, items.length);

  return (
    <main className={styles.app}>
      <button
        type="button"
        className={styles.themeToggle}
        onClick={toggleTheme}
        aria-pressed={themeMode === 'dark'}
        aria-label={themeMode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        {themeMode === 'dark' ? '☀️' : '🌙'}
      </button>

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
          <legend>Cards</legend>
          {SESSION_SIZE_PRESETS.map((n) => (
            <button
              key={n}
              type="button"
              className={styles.pill}
              data-active={sessionSize === n}
              onClick={() => setSessionSize(n)}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            className={styles.pill}
            data-active={sessionSize === 'all'}
            onClick={() => setSessionSize('all')}
          >
            All
          </button>
          <label className={styles.checkbox}>
            <input
              type="number"
              min={1}
              step={1}
              placeholder="Custom"
              aria-label="Custom number of cards"
              value={sessionSize === 'all' ? '' : sessionSize}
              onChange={(e) => {
                const value = Math.floor(Number(e.target.value));
                setSessionSize(value > 0 ? value : 'all');
              }}
              className={styles.secondsInput}
            />
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
        <button type="button" className={styles.startButton} onClick={() => setIsRoundOpen(true)}>
          Start round ({roundSize} cards)
        </button>
      )}

      {isRoundOpen && (
        <Modal onClose={() => setIsRoundOpen(false)} label="Phonics flashcard round">
          <SkinStage>
            <Round
              items={items}
              timed={timedMode}
              secondsPerCard={secondsPerCard}
              sessionSize={sessionSize === 'all' ? undefined : sessionSize}
            />
          </SkinStage>
        </Modal>
      )}
    </main>
  );
}

export default App;
