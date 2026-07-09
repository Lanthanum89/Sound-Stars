import { useRef, useState } from 'react';
import { getGraphemeLabel } from '../content/highlightGrapheme';
import { formatRelativeTime, type WeeklySummary, type GraphemeProgress } from '../progress/derive';
import shared from './shared.module.css';
import styles from './ParentScreen.module.css';

const RING_RADIUS = 15;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

interface ParentScreenProps {
  childName: string;
  onRenameChild: (name: string) => void;
  weekly: WeeklySummary;
  sparkling: GraphemeProgress[];
  needsPractice: GraphemeProgress[];
  hasSessions: boolean;
  lastBackupAt: string | null;
  onBack: () => void;
  onBackup: () => void;
  onRestoreJson: (json: string) => boolean;
  onPractiseTogether: (prompts: string[]) => void;
}

export function ParentScreen({
  childName,
  onRenameChild,
  weekly,
  sparkling,
  needsPractice,
  hasSessions,
  lastBackupAt,
  onBack,
  onBackup,
  onRestoreJson,
  onPractiseTogether,
}: ParentScreenProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [restoreMessage, setRestoreMessage] = useState<string | null>(null);

  const pct = weekly.accuracy === null ? 0 : Math.round(weekly.accuracy * 100);
  const dashOffset = RING_CIRCUMFERENCE * (1 - pct / 100);
  const trendDelta =
    weekly.previousAccuracy !== null && weekly.accuracy !== null
      ? Math.round((weekly.accuracy - weekly.previousAccuracy) * 100)
      : null;

  const handleRestoreFile = (file: File) => {
    file
      .text()
      .then((text) => {
        const ok = onRestoreJson(text);
        setRestoreMessage(ok ? 'Restored!' : "That file doesn't look like a Sound Stars backup.");
      })
      .catch(() => setRestoreMessage('Could not read that file.'));
  };

  return (
    <div className={`${shared.screen} ${shared.parentSky}`}>
      <div className={`${shared.content} ${styles.content}`}>
        <div className={styles.topBar}>
          <button type="button" className={shared.roundButton} onClick={onBack} aria-label="Back">
            ‹
          </button>
          <button
            type="button"
            className={styles.title}
            onClick={() => {
              const next = window.prompt("Child's name", childName);
              if (next !== null) onRenameChild(next.trim());
            }}
          >
            {childName ? `${childName}'s progress` : 'Your progress'}
          </button>
          <span className={shared.roundButton} aria-hidden="true">
            ⭐
          </span>
        </div>

        <div className={styles.weekCard}>
          <svg width="66" height="66" viewBox="0 0 36 36" aria-hidden="true">
            <circle cx="18" cy="18" r={RING_RADIUS} fill="none" stroke="#eaf1f6" strokeWidth="4.5" />
            <circle
              cx="18"
              cy="18"
              r={RING_RADIUS}
              fill="none"
              stroke="var(--green)"
              strokeWidth="4.5"
              strokeLinecap="round"
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              transform="rotate(-90 18 18)"
            />
            <text x="18" y="21" textAnchor="middle" fontFamily="'Baloo 2',cursive" fontWeight="700" fontSize="10" fill="var(--ink-heading)">
              {weekly.accuracy === null ? '–' : `${pct}%`}
            </text>
          </svg>
          <div>
            <div className={styles.weekHeading}>This week</div>
            <div className={styles.weekDetail}>
              {weekly.sessionCount} session{weekly.sessionCount === 1 ? '' : 's'} · {weekly.soundsPractised} sounds practised
            </div>
            {trendDelta !== null && (
              <div className={styles.weekTrend} data-direction={trendDelta >= 0 ? 'up' : 'down'}>
                {trendDelta >= 0 ? '▲' : '▼'} {trendDelta >= 0 ? 'Up' : 'Down'} from {Math.round(weekly.previousAccuracy! * 100)}% last week
              </div>
            )}
          </div>
        </div>

        {sparkling.length > 0 && (
          <div>
            <div className={styles.sectionHeading}>✨ Sparkling</div>
            <div className={styles.sparklingWrap}>
              {sparkling.map((g) => (
                <span key={g.grapheme} className={styles.sparklingPill}>
                  {getGraphemeLabel(g.grapheme)}
                </span>
              ))}
            </div>
          </div>
        )}

        {needsPractice.length > 0 && (
          <div>
            <div className={styles.sectionHeading}>🌱 Needs practice</div>
            <div className={styles.needsPracticeList}>
              {needsPractice.map((g) => (
                <div key={g.grapheme} className={styles.needsPracticeRow}>
                  <span className={styles.needsPracticeGrapheme}>{getGraphemeLabel(g.grapheme)}</span>
                  <div className={styles.needsPracticeTrack}>
                    <div className={styles.needsPracticeFill} style={{ width: `${Math.round(g.accuracy * 100)}%` }} />
                  </div>
                  <span className={styles.needsPracticeCount}>
                    {g.correct} / {g.attempts}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {sparkling.length === 0 && needsPractice.length === 0 && (
          <p className={styles.emptyState}>
            {hasSessions
              ? "Keep practising — a few more goes at each sound will show what's sparkling and what needs work."
              : "No rounds practised yet — once you've played a round or two, progress shows up here."}
          </p>
        )}

        <div className={styles.footer}>
          {needsPractice.length > 0 && (
            <button
              type="button"
              className={styles.practiseButton}
              onClick={() => onPractiseTogether(needsPractice.map((g) => g.grapheme))}
            >
              Practise these sounds together
            </button>
          )}

          <div className={styles.backupRow}>
            <span aria-hidden="true">☁️</span>
            <div className={styles.backupText}>
              <div className={styles.backupTitle}>Progress saved on this device</div>
              <div className={styles.backupSubtitle}>
                {restoreMessage ?? (lastBackupAt ? `Last backup ${formatRelativeTime(lastBackupAt)}` : 'Never backed up')}
              </div>
            </div>
            <button type="button" className={styles.backupChip} onClick={onBackup}>
              Back up
            </button>
            <button type="button" className={styles.backupChip} onClick={() => fileInputRef.current?.click()}>
              Restore
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              className={styles.hiddenFileInput}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleRestoreFile(file);
                e.target.value = '';
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
