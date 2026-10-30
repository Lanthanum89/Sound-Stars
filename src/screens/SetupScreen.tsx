import { useState } from 'react';
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

// Letters and Sounds phases map onto school year groups: Phases 2-4 are taught
// in Reception, Phase 5 in Year 1. Parents and teachers talk in year groups, so
// that is the main choice; the raw phases sit behind "Fine-tune".
const PHASE_YEAR: Record<Phase, string> = {
  2: 'Reception',
  3: 'Reception',
  4: 'Reception',
  5: 'Year 1',
};

const YEAR_GROUPS: { label: string; sub: string; phases: Phase[] }[] = [
  { label: 'Reception', sub: 'Phases 2-4', phases: [2, 3, 4] },
  { label: 'Year 1', sub: 'Phase 5', phases: [5] },
  { label: 'Everything', sub: 'All phases', phases: ALL_PHASES },
];

const samePhases = (a: readonly Phase[], b: readonly Phase[]) =>
  a.length === b.length && b.every((phase) => a.includes(phase));

interface SetupScreenProps {
  phases: Phase[];
  onTogglePhase: (phase: Phase) => void;
  onPhasesChange: (phases: Phase[]) => void;
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
  onPhasesChange,
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
  const [fineTune, setFineTune] = useState(false);
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
            <div className={styles.groupLabel}>Which year group?</div>
            <div className={styles.pillRow}>
              {YEAR_GROUPS.map((group) => {
                const active = samePhases(phases, group.phases);
                return (
                  <button
                    key={group.label}
                    type="button"
                    className={styles.pill}
                    data-variant="gold"
                    data-active={active}
                    onClick={() => onPhasesChange(group.phases)}
                    aria-pressed={active}
                  >
                    <span className={styles.pillMain}>{active ? '✓ ' : ''}{group.label}</span>
                    <span className={styles.pillSub}>({group.sub})</span>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              className={styles.fineTuneLink}
              onClick={() => setFineTune((open) => !open)}
              aria-expanded={fineTune}
            >
              {fineTune ? 'Hide phases' : 'Fine-tune phases'}
            </button>
            {fineTune && (
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
                    <span className={styles.pillMain}>{phases.includes(phase) ? '✓ ' : ''}Phase {phase}</span>
                    <span className={styles.pillSub}>({PHASE_YEAR[phase]})</span>
                  </button>
                ))}
              </div>
            )}
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
