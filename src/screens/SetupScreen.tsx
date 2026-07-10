import { Mascot } from '../components/Mascot/Mascot';
import { SkyDecor } from '../components/SkyDecor/SkyDecor';
import { SkinPicker } from '../skins/SkinPicker';
import { useSkin } from '../skins/context';
import type { Phase } from '../content/phonicsGraphemeBank';
import type { DeckKind } from '../content/types';
import type { SessionSize } from './types';
import shared from './shared.module.css';
import styles from './SetupScreen.module.css';

const ALL_PHASES: Phase[] = [2, 3, 4, 5];
const SESSION_SIZE_PRESETS = [10, 20, 30];
const DEFAULT_SECONDS_PER_CARD = 5;

// Phase 2-5 is Letters and Sounds terminology parents/teachers will recognize,
// but it means nothing to a child on its own — the bracketed word is what
// tells them (and a parent new to the terms) which end is easy vs hard.
const PHASE_DIFFICULTY: Record<Phase, string> = {
  2: 'Easiest',
  3: 'Easy',
  4: 'Trickier',
  5: 'Trickiest',
};

interface SetupScreenProps {
  phases: Phase[];
  onTogglePhase: (phase: Phase) => void;
  deckKind: DeckKind;
  onDeckKindChange: (kind: DeckKind) => void;
  sessionSize: SessionSize;
  onSessionSizeChange: (size: SessionSize) => void;
  timedMode: boolean;
  onTimedModeChange: (timed: boolean) => void;
  secondsPerCard: number;
  onSecondsPerCardChange: (seconds: number) => void;
  roundSize: number;
  onStart: () => void;
  onOpenParentView: () => void;
}

export function SetupScreen({
  phases,
  onTogglePhase,
  deckKind,
  onDeckKindChange,
  sessionSize,
  onSessionSizeChange,
  timedMode,
  onTimedModeChange,
  secondsPerCard,
  onSecondsPerCardChange,
  roundSize,
  onStart,
  onOpenParentView,
}: SetupScreenProps) {
  const { skin } = useSkin();
  const canStart = roundSize > 0;

  return (
    <div className={`${shared.screen} ${shared.childSky}`}>
      <SkyDecor />

      <div className={shared.content}>
        <div className={styles.header}>
          <Mascot expression="neutral" size={92} emoji={skin.id === 'classic' ? undefined : skin.emoji} />
          <h1 className={styles.title}>Sound Stars</h1>
          <p className={styles.subtitle}>Ready to shine? ⭐</p>
        </div>

        <div className={styles.card}>
          <div>
            <div className={styles.groupLabel}>Pick your sounds</div>
            <div className={styles.pillRow}>
              {ALL_PHASES.map((phase) => (
                <button
                  key={phase}
                  type="button"
                  className={styles.pill}
                  data-variant="gold"
                  data-active={phases.includes(phase)}
                  onClick={() => onTogglePhase(phase)}
                  aria-pressed={phases.includes(phase)}
                >
                  <span className={styles.pillMain}>Phase {phase}</span>
                  <span className={styles.pillSub}>({PHASE_DIFFICULTY[phase]})</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className={styles.groupLabel}>What shall we play?</div>
            <div className={styles.pillRow}>
              <button
                type="button"
                className={styles.wideButton}
                data-variant="coral"
                data-active={deckKind === 'grapheme'}
                onClick={() => onDeckKindChange('grapheme')}
                aria-pressed={deckKind === 'grapheme'}
              >
                <span className={styles.pillMain}>🔤 Sounds</span>
                <span className={styles.pillSub}>(sound them out)</span>
              </button>
              <button
                type="button"
                className={styles.wideButton}
                data-variant="coral"
                data-active={deckKind === 'tricky'}
                onClick={() => onDeckKindChange('tricky')}
                aria-pressed={deckKind === 'tricky'}
              >
                <span className={styles.pillMain}>🌟 Tricky</span>
                <span className={styles.pillSub}>(learn by heart)</span>
              </button>
            </div>
          </div>

          <div>
            <div className={styles.groupLabel}>How long?</div>
            <div className={styles.pillRow}>
              {SESSION_SIZE_PRESETS.map((n) => (
                <button
                  key={n}
                  type="button"
                  className={styles.pill}
                  data-variant="green"
                  data-active={sessionSize === n}
                  onClick={() => onSessionSizeChange(n)}
                  aria-pressed={sessionSize === n}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                className={styles.pill}
                data-variant="green"
                data-active={sessionSize === 'all'}
                onClick={() => onSessionSizeChange('all')}
                aria-pressed={sessionSize === 'all'}
              >
                All
              </button>
            </div>
            <label className={styles.customSizeRow}>
              Custom
              <input
                type="number"
                min={1}
                step={1}
                placeholder="e.g. 15"
                aria-label="Custom number of cards"
                value={sessionSize === 'all' ? '' : sessionSize}
                onChange={(e) => {
                  const value = Math.floor(Number(e.target.value));
                  onSessionSizeChange(value > 0 ? value : 'all');
                }}
                className={styles.customSizeInput}
              />
            </label>
          </div>

          <div>
            <div className={styles.groupLabel}>Timing</div>
            <div className={styles.pillRow}>
              <button
                type="button"
                className={styles.wideButton}
                data-variant="blue"
                data-active={timedMode}
                onClick={() => onTimedModeChange(!timedMode)}
                aria-pressed={timedMode}
              >
                ⏱ Timed rounds
              </button>
            </div>
            {timedMode && (
              <label className={styles.customSizeRow}>
                Seconds per card
                <input
                  type="number"
                  min={2}
                  max={30}
                  value={secondsPerCard}
                  onChange={(e) => onSecondsPerCardChange(Number(e.target.value) || DEFAULT_SECONDS_PER_CARD)}
                  className={styles.customSizeInput}
                />
              </label>
            )}
          </div>
        </div>

        <SkinPicker />

        <button type="button" className={styles.cta} onClick={onStart} disabled={!canStart}>
          {canStart ? "Let's go! ✨" : 'Pick a phase first'}
        </button>

        <button type="button" className={styles.parentLink} onClick={onOpenParentView}>
          👪 Grown-ups
        </button>
      </div>
    </div>
  );
}
