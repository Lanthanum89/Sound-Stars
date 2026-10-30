import { useState } from 'react';
import { Icon } from '../components/Icon/Icon';
import { Mascot } from '../components/Mascot/Mascot';
import { Scene } from '../components/Scene/Scene';
import { SkinPicker } from '../skins/SkinPicker';
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
// that is the main choice; the raw phases sit behind "Choose phases".
const PHASE_YEAR: Record<Phase, string> = {
  2: 'Reception',
  3: 'Reception',
  4: 'Reception',
  5: 'Year 1',
};

const YEAR_GROUPS: { label: string; sub: string; phases: Phase[] }[] = [
  { label: 'Reception', sub: 'Phases 2-4', phases: [2, 3, 4] },
  { label: 'Year 1', sub: 'Phase 5', phases: [5] },
  { label: 'Both years', sub: 'Phases 2-5', phases: ALL_PHASES },
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
  availableCount: number;
  onStart: () => void;
  onOpenParentView: () => void;
  onOpenTrace: () => void;
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
  availableCount,
  onStart,
  onOpenParentView,
  onOpenTrace,
}: SetupScreenProps) {
  const [showMore, setShowMore] = useState(false);
  const canStart = roundSize > 0;
  const noun = deckKind === 'tricky' ? 'words' : 'sounds';
  const presets = SESSION_SIZE_PRESETS.filter((n) => n < availableCount);

  return (
    <div className={`${shared.screen} ${shared.childSky}`}>
      <Scene />

      <div className={shared.content}>
        <div className={styles.header}>
          <Mascot expression="neutral" size={64} />
          <h1 className={styles.title}>Sound Stars</h1>
        </div>

        <div className={styles.card}>
          <section aria-labelledby="setup-year">
            <div id="setup-year" className={styles.groupLabel}>Which year group?</div>
            <div className={styles.pillRow}>
              {YEAR_GROUPS.map((group) => {
                const active = samePhases(phases, group.phases);
                return (
                  <button
                    key={group.label}
                    type="button"
                    className={styles.pill}
                    data-active={active}
                    onClick={() => onPhasesChange(group.phases)}
                    aria-pressed={active}
                  >
                    <span className={styles.pillMain}>{active && <Icon name="check" />} {group.label}</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section aria-labelledby="setup-game">
            <div id="setup-game" className={styles.groupLabel}>What shall we play?</div>
            <div className={styles.pillRow}>
              <button
                type="button"
                className={styles.pill}
                data-active={deckKind === 'grapheme'}
                onClick={() => onDeckKindChange('grapheme')}
                aria-pressed={deckKind === 'grapheme'}
              >
                <span className={styles.pillMain}>{deckKind === 'grapheme' && <Icon name="check" />} Sounds</span>
              </button>
              <button
                type="button"
                className={styles.pill}
                data-active={deckKind === 'tricky'}
                onClick={() => onDeckKindChange('tricky')}
                aria-pressed={deckKind === 'tricky'}
              >
                <span className={styles.pillMain}>{deckKind === 'tricky' && <Icon name="check" />} Tricky words</span>
              </button>
            </div>
          </section>

          <section>
            <button
              type="button"
              className={styles.disclosure}
              onClick={() => setShowMore((open) => !open)}
              aria-expanded={showMore}
              aria-controls="setup-more"
            >
              <Icon name="sliders" /> More options <Icon name={showMore ? 'chevronUp' : 'chevronDown'} />
            </button>
            {showMore && (
              <div id="setup-more" className={styles.more}>
                <div>
                  <div className={styles.moreLabel}>Phases</div>
                  <div className={styles.pillRow}>
                    {ALL_PHASES.map((phase) => (
                      <button
                        key={phase}
                        type="button"
                        className={styles.pill}
                        data-active={phases.includes(phase)}
                        onClick={() => onTogglePhase(phase)}
                        aria-pressed={phases.includes(phase)}
                      >
                        <span className={styles.pillMain}>{phases.includes(phase) && <Icon name="check" />} {phase}</span>
                        <span className={styles.pillSub}>{PHASE_YEAR[phase]}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className={styles.moreLabel}>How many {noun}?</div>
                  <div className={styles.pillRow}>
                    {presets.map((n) => (
                      <button
                        key={n}
                        type="button"
                        className={styles.pill}
                        data-active={sessionSize === n}
                        onClick={() => onSessionSizeChange(n)}
                        aria-pressed={sessionSize === n}
                      >
                        <span className={styles.pillMain}>{sessionSize === n && <Icon name="check" />} {n}</span>
                      </button>
                    ))}
                    <button
                      type="button"
                      className={styles.pill}
                      data-active={sessionSize === 'all'}
                      onClick={() => onSessionSizeChange('all')}
                      aria-pressed={sessionSize === 'all'}
                    >
                      <span className={styles.pillMain}>
                        {sessionSize === 'all' && <Icon name="check" />} All{availableCount > 0 ? ` (${availableCount})` : ''}
                      </span>
                    </button>
                  </div>
                </div>

                <label className={styles.optionRow}>
                  <span>Or pick a number</span>
                  <input
                    type="number"
                    min={1}
                    step={1}
                    placeholder="e.g. 15"
                    value={sessionSize === 'all' ? '' : sessionSize}
                    onChange={(e) => {
                      const value = Math.floor(Number(e.target.value));
                      onSessionSizeChange(value > 0 ? value : 'all');
                    }}
                    className={styles.numberInput}
                  />
                </label>

                <div className={styles.optionRow}>
                  <span id="setup-timed">Timed round</span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={timedMode}
                    aria-labelledby="setup-timed"
                    className={styles.switch}
                    data-on={timedMode}
                    onClick={() => onTimedModeChange(!timedMode)}
                  >
                    <span className={styles.switchKnob} />
                  </button>
                </div>
                {timedMode && (
                  <label className={styles.optionRow}>
                    <span>Seconds per card</span>
                    <input
                      type="number"
                      min={2}
                      max={30}
                      value={secondsPerCard}
                      onChange={(e) => onSecondsPerCardChange(Number(e.target.value) || DEFAULT_SECONDS_PER_CARD)}
                      className={styles.numberInput}
                    />
                  </label>
                )}
              </div>
            )}
          </section>
        </div>

        <SkinPicker />

        <button type="button" className={styles.cta} onClick={onStart} disabled={!canStart}>
          {canStart ? "Let's go!" : 'Pick a year group first'}
        </button>

        <button type="button" className={styles.trace} onClick={onOpenTrace}>
          <Icon name="pencil" /> Trace letters
        </button>

        <div className={styles.links}>
          <button type="button" className={styles.link} onClick={onOpenParentView}>
            Grown-ups
          </button>
        </div>
      </div>
    </div>
  );
}
