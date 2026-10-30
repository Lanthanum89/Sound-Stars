import { useState } from 'react';
import { Icon } from '../components/Icon/Icon';
import { graphemeBank } from '../content/phonicsGraphemeBank';
import { getGraphemeLabel } from '../content/highlightGrapheme';
import { soundSheet, type SoundSheetEntry } from '../content/soundSheet';
import { traceCells } from '../content/letterStrokes';
import { PhraseText } from '../components/PhraseText/PhraseText';
import { TraceScreen } from './TraceScreen';
import { loadWritingBest } from '../progress/writing';
import shared from './shared.module.css';
import styles from './SoundSheetScreen.module.css';

const YEAR_TABS = [
  { label: 'Reception', phases: [2, 3] },
  { label: 'Year 1', phases: [5] },
];

// Tiles carry a tiny cue word so repeated spellings (several "a" or "ch" tiles)
// can be told apart at a glance.
const cueWords = new Map(graphemeBank.map((entry) => [entry.grapheme, entry.words[0]]));

interface SoundSheetScreenProps {
  onBack: () => void;
  onPractise: (key: string) => void;
}

export function SoundSheetScreen({ onBack, onPractise }: SoundSheetScreenProps) {
  const [tab, setTab] = useState(0);
  const [open, setOpen] = useState<SoundSheetEntry | null>(null);
  const [tracing, setTracing] = useState<SoundSheetEntry | null>(null);
  const [best, setBest] = useState(loadWritingBest);

  const entries = soundSheet.filter((entry) => YEAR_TABS[tab].phases.includes(entry.phase));
  const groups = YEAR_TABS[tab].phases.map((phase) => ({
    phase,
    entries: entries.filter((entry) => entry.phase === phase),
  }));

  return (
    <div className={`${shared.screen} ${shared.childSky}`}>
      <div className={`${shared.content} ${styles.content}`}>
        <div className={styles.topBar}>
          <button type="button" className={shared.roundButton} onClick={onBack} aria-label="Back">
            <Icon name="back" />
          </button>
          <h1 className={styles.title}>Sound sheet</h1>
          <div className={styles.topSpacer} />
        </div>

        <div className={styles.tabs} role="tablist" aria-label="Year group">
          {YEAR_TABS.map((t, i) => (
            <button
              key={t.label}
              type="button"
              role="tab"
              aria-selected={tab === i}
              className={styles.tab}
              data-active={tab === i}
              onClick={() => setTab(i)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {groups.map((group) => (
          <section key={group.phase}>
            <h2 className={styles.phaseHeading}>Phase {group.phase}</h2>
            <div className={styles.grid}>
              {group.entries.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  className={styles.tile}
                  data-phase={entry.phase}
                  onClick={() => setOpen(entry)}
                  aria-label={`${getGraphemeLabel(entry.key)}, ${entry.phrase.replace(/[[\]]/g, '')}${best[entry.key] ? `, ${best[entry.key]} stars for writing` : ''}`}
                >
                  <span className={styles.tileGrapheme}>{getGraphemeLabel(entry.key)}</span>
                  <span className={styles.tileCue}>{cueWords.get(entry.key)}</span>
                  {best[entry.key] > 0 && (
                    <span className={styles.tileStars} aria-hidden="true">
                      {Array.from({ length: best[entry.key] }, (_, n) => (
                        <Icon key={n} name="star" />
                      ))}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>

      {tracing && (
        <TraceScreen
          soundKey={tracing.key}
          label={getGraphemeLabel(tracing.key)}
          cells={traceCells(getGraphemeLabel(tracing.key)) ?? []}
          phrase={tracing.phrase}
          onClose={() => {
            setBest(loadWritingBest());
            setTracing(null);
          }}
        />
      )}

      {open && !tracing && (
        <div className={styles.backdrop} onClick={() => setOpen(null)}>
          <div
            className={styles.sheet}
            role="dialog"
            aria-modal="true"
            aria-label={`Sound ${getGraphemeLabel(open.key)}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" className={styles.close} onClick={() => setOpen(null)} aria-label="Close">
              <Icon name="cross" />
            </button>
            <div className={styles.bigGrapheme}>{getGraphemeLabel(open.key)}</div>
            <p className={styles.phrase}>
              <PhraseText phrase={open.phrase} />
            </p>
            <button type="button" className={styles.practise} onClick={() => onPractise(open.key)}>
              Practise this sound
            </button>
            {traceCells(getGraphemeLabel(open.key)) && (
              <button type="button" className={styles.trace} onClick={() => setTracing(open)}>
                <Icon name="pencil" /> Trace it
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
