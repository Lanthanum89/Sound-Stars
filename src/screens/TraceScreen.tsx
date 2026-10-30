import { useEffect, useMemo, useRef, useState, type PointerEvent } from 'react';
import { Icon } from '../components/Icon/Icon';
import { Scene } from '../components/Scene/Scene';
import { PhraseText } from '../components/PhraseText/PhraseText';
import { CELL_HEIGHT, CELL_WIDTH, LINES, letterStrokes, type Point, type Stroke } from '../content/letterStrokes';
import { scoreWriting, type Hint, type WritingScore } from '../content/scoring';
import { recordWritingStars } from '../progress/writing';
import shared from './shared.module.css';
import styles from './TraceScreen.module.css';

// Touches this soon after a stylus event are treated as a resting palm.
const PALM_WINDOW_MS = 1500;
const DEMO_SPEED = 60; // viewBox units per second

type Mode = 'trace' | 'write';

const VERDICTS = ['', 'Good try!', 'Great writing!', 'Brilliant!'] as const;

// A result starts with something true and good, then at most one gentle thing
// to try. Nothing here says a child got something wrong.
function praiseText(score: WritingScore, letters: string[], label: string): string {
  const { kind, letterIndex } = score.praise;
  switch (kind) {
    case 'best':
      return `Your “${letters[letterIndex]}” was the best one!`;
    case 'shape':
      return `That looks like “${label}”!`;
    case 'start':
      return 'Great start!';
    case 'way':
      return 'You went the right way!';
    case 'size':
      return 'Lovely size!';
    case 'effort':
      return 'Great effort!';
  }
}

function tipText(hint: Hint, letter: string): string {
  switch (hint) {
    case 'empty':
      return `Next time, add the “${letter}”.`;
    case 'missing':
      return 'Next time, add every part. Press Watch to see them all.';
    case 'shape':
      return 'Press Watch to see how it goes, then have another go.';
    case 'direction':
      return 'Try going the other way round. Press Watch to see.';
    case 'start':
      return 'Try starting at the green dot.';
    case 'size':
      return 'Try making it fit the lines.';
  }
}

interface Feedback {
  /** A line celebrating progress, if there is any to celebrate. */
  badge?: string;
}

const toPath = (points: Stroke) => points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');

function pathLength(points: Stroke) {
  return points.slice(1).reduce((sum, p, i) => sum + Math.hypot(p.x - points[i].x, p.y - points[i].y), 0);
}

/** The first `length` units of a polyline, for the "watch me" animation. */
function partial(points: Stroke, length: number): Stroke {
  const out: Stroke = [points[0]];
  let left = length;
  for (let i = 1; i < points.length && left > 0; i++) {
    const seg = Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y);
    if (seg <= left) {
      out.push(points[i]);
      left -= seg;
    } else {
      const t = left / seg;
      out.push({
        x: points[i - 1].x + (points[i].x - points[i - 1].x) * t,
        y: points[i - 1].y + (points[i].y - points[i - 1].y) * t,
      });
      left = 0;
    }
  }
  return out;
}

interface TraceScreenProps {
  soundKey: string;
  label: string;
  /** One entry per letter box: the letter to write, or null for an open box (the middle of a split digraph). */
  cells: (string | null)[];
  phrase?: string;
  onPractise?: () => void;
  onClose: () => void;
}

export function TraceScreen({ soundKey, label, cells, phrase, onPractise, onClose }: TraceScreenProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const activePointer = useRef<number | null>(null);
  const lastPenAt = useRef(-Infinity);
  const [ink, setInk] = useState<Stroke[]>([]);
  const [demoLength, setDemoLength] = useState<number | null>(0); // the letter is demonstrated as soon as the screen opens
  const [mode, setMode] = useState<Mode>('trace');
  const [result, setResult] = useState<WritingScore | null>(null);
  const [feedback, setFeedback] = useState<Feedback>({});
  const lastScore = useRef<number | null>(null);

  const width = cells.length * CELL_WIDTH;
  const letters = useMemo(() => cells.filter((c): c is string => c !== null), [cells]);

  // The guide: every stroke of every letter, shifted into its cell, in writing order.
  const guide = useMemo(
    () =>
      cells.flatMap((letter, i) =>
        (letter === null ? [] : letterStrokes[letter]).map((stroke, n) => ({
          key: `${i}-${n}`,
          number: n + 1,
          points: stroke.map((p) => ({ x: p.x + i * CELL_WIDTH, y: p.y })),
        })),
      ),
    [cells],
  );
  const references = useMemo(() => letters.map((letter) => letterStrokes[letter]), [letters]);
  const cellOf = useMemo(() => cells.flatMap((letter, i) => (letter === null ? [] : [i])), [cells]);
  const totalLength = useMemo(() => guide.reduce((sum, s) => sum + pathLength(s.points), 0), [guide]);

  const demoRunning = demoLength !== null;
  useEffect(() => {
    if (!demoRunning) return;
    const start = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const length = ((now - start) / 1000) * DEMO_SPEED;
      if (length >= totalLength + DEMO_SPEED / 2) {
        setDemoLength(null);
        return;
      }
      setDemoLength(length);
      frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [demoRunning, totalLength]);

  const toPoint = (e: { clientX: number; clientY: number }): Point => {
    const rect = svgRef.current!.getBoundingClientRect();
    return { x: ((e.clientX - rect.left) / rect.width) * width, y: ((e.clientY - rect.top) / rect.height) * CELL_HEIGHT };
  };

  const onPointerDown = (e: PointerEvent<SVGSVGElement>) => {
    if (e.pointerType === 'pen') lastPenAt.current = e.timeStamp;
    else if (e.pointerType === 'touch' && e.timeStamp - lastPenAt.current < PALM_WINDOW_MS) return;
    if (activePointer.current !== null) return;
    activePointer.current = e.pointerId;
    setDemoLength(null);
    setResult(null);
    setInk((strokes) => [...strokes, [toPoint(e)]]);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // The pointer may already be gone; the stroke still works without capture.
    }
  };

  const onPointerMove = (e: PointerEvent<SVGSVGElement>) => {
    if (e.pointerId !== activePointer.current) return;
    if (e.pointerType === 'pen') lastPenAt.current = e.timeStamp;
    const events = e.nativeEvent.getCoalescedEvents?.() ?? [];
    const points = (events.length > 0 ? events : [e.nativeEvent]).map(toPoint);
    setInk((strokes) => [...strokes.slice(0, -1), [...strokes[strokes.length - 1], ...points]]);
  };

  const onPointerEnd = (e: PointerEvent<SVGSVGElement>) => {
    if (e.pointerId === activePointer.current) activePointer.current = null;
  };

  const check = () => {
    const next = scoreWriting(ink, references, CELL_WIDTH, cellOf);
    const feedback: Feedback = {};
    if (next.stars > 0) {
      const { previous } = recordWritingStars(soundKey, next.stars);
      const last = lastScore.current;
      if (previous > 0 && next.stars > previous) feedback.badge = 'New best!';
      else if (last !== null && next.score >= last + 6) feedback.badge = 'Better than last time!';
      else if (previous === 0) feedback.badge = `First stars for “${label}”!`;
      lastScore.current = next.score;
    }
    setFeedback(feedback);
    setResult(next);
  };

  const chooseMode = (next: Mode) => {
    setMode(next);
    setInk([]);
    setResult(null);
    setDemoLength(null);
  };

  const showGuide = mode === 'trace' || result !== null;

  // Demo: strokes are drawn one after another, each finishing before the next starts.
  const demoStrokes: Stroke[] = [];
  if (demoLength !== null) {
    let left = demoLength;
    for (const s of guide) {
      const len = pathLength(s.points);
      if (left <= 0) break;
      demoStrokes.push(partial(s.points, Math.min(left, len)));
      left -= len;
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={`${shared.screen} ${shared.childSky}`}>
        <Scene />

        <div className={`${shared.content} ${styles.content}`}>
          <div className={styles.topBar}>
            <button type="button" className={shared.roundButton} onClick={onClose} aria-label="Back to the sound sheet">
              <Icon name="back" />
            </button>
            <h1 className={styles.title}>{mode === 'trace' ? 'Trace' : 'Now write'} “{label}”</h1>
            <div className={styles.topSpacer} />
          </div>

          {phrase && !result && (
            <p className={styles.phrase}>
              <PhraseText phrase={phrase} />
            </p>
          )}

          <div className={styles.paper}>
            <svg
              ref={svgRef}
              className={styles.canvas}
              viewBox={`0 0 ${width} ${CELL_HEIGHT}`}
              style={{ aspectRatio: `${width} / ${CELL_HEIGHT}` }}
              role="img"
              aria-label={`Writing area for ${label}`}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerEnd}
              onPointerCancel={onPointerEnd}
            >
              <line className={styles.lineHint} x1={0} x2={width} y1={LINES.ascender} y2={LINES.ascender} />
              <line className={styles.lineHint} x1={0} x2={width} y1={LINES.xHeight} y2={LINES.xHeight} />
              <line className={styles.baseline} x1={0} x2={width} y1={LINES.baseline} y2={LINES.baseline} />
              <line className={styles.lineHint} x1={0} x2={width} y1={LINES.descender} y2={LINES.descender} />
              {mode === 'write' &&
                cells.map((_, i) => (
                  <rect key={`box-${i}`} className={styles.writeBox} x={i * CELL_WIDTH + 4} y={LINES.ascender - 12} width={CELL_WIDTH - 8} height={LINES.descender - LINES.ascender + 24} rx={10} />
                ))}

              {cells.map((letter, i) =>
                letter === null ? (
                  <g key={`gap-${i}`}>
                    <rect className={styles.gap} x={i * CELL_WIDTH + 12} y={LINES.xHeight - 4} width={CELL_WIDTH - 24} height={LINES.baseline - LINES.xHeight + 8} rx={6} />
                    <text className={styles.gapMark} x={i * CELL_WIDTH + CELL_WIDTH / 2} y={(LINES.xHeight + LINES.baseline) / 2}>
                      ?
                    </text>
                  </g>
                ) : null,
              )}
              {showGuide &&
                guide.map((s) => <path key={s.key} className={result ? styles.revealRoad : styles.guideRoad} d={toPath(s.points)} />)}
              {showGuide &&
                guide.map((s) => <path key={`d-${s.key}`} className={styles.guideDash} d={toPath(s.points)} />)}
              {showGuide &&
                guide.map((s, i) => {
                  // Two strokes can start in nearly the same place (as in "g"): nudge the later dot aside so both numbers show.
                  const clashes = guide.slice(0, i).filter((o) => Math.hypot(o.points[0].x - s.points[0].x, o.points[0].y - s.points[0].y) < 20).length;
                  const x = s.points[0].x + clashes * 14;
                  const y = s.points[0].y - clashes * 14;
                  return (
                    <g key={`n-${s.key}`}>
                      <circle className={styles.startDot} cx={x} cy={y} r={9} />
                      <text className={styles.startNumber} x={x} y={y}>
                        {s.number}
                      </text>
                    </g>
                  );
                })}

              {ink.map((stroke, i) => (
                <path key={i} className={styles.ink} d={toPath(stroke.length > 1 ? stroke : [...stroke, stroke[0]])} />
              ))}
              {demoStrokes.map((stroke, i) => (
                <path key={`demo-${i}`} className={styles.demo} d={toPath(stroke)} />
              ))}
            </svg>
          </div>

          {result && (
            <div className={styles.result} role="status">
              {result.stars === 0 ? (
                <p className={styles.praise}>Write the letter in the box, then check it.</p>
              ) : (
                <>
                  <div className={styles.stars} aria-label={`${result.stars} out of 3 stars`}>
                    {[1, 2, 3].map((n) => (
                      <span key={n} className={styles.star} data-earned={n <= result.stars} style={{ animationDelay: `${(n - 1) * 0.18}s` }}>
                        <Icon name="star" filled={n <= result.stars} />
                      </span>
                    ))}
                  </div>
                  <div className={styles.verdict}>{VERDICTS[result.stars]}</div>
                  <p className={styles.praise}>{praiseText(result, letters, label)}</p>
                  {feedback.badge && <div className={styles.badge}>{feedback.badge}</div>}
                  {result.hint && result.stars < 3 && (
                    <p className={styles.hint}>{tipText(result.hint.hint, letters[result.hint.letterIndex])}</p>
                  )}
                </>
              )}
            </div>
          )}

          {mode === 'trace' ? (
            <button type="button" className={styles.check} onClick={() => chooseMode('write')}>
              Now you write it!
            </button>
          ) : (
            <button
              type="button"
              className={styles.check}
              disabled={ink.length === 0 && result === null}
              onClick={() => (result ? chooseMode('write') : check())}
            >
              {result ? 'Have another go' : 'Check my writing'}
            </button>
          )}

          <div className={styles.actions}>
            <button type="button" className={styles.action} onClick={() => setDemoLength(0)}>
              <Icon name="play" /> Watch me
            </button>
            <button
              type="button"
              className={styles.action}
              onClick={() => {
                setResult(null);
                setInk((strokes) => strokes.slice(0, -1));
              }}
              disabled={ink.length === 0}
            >
              <Icon name="undo" /> Undo
            </button>
            <button type="button" className={styles.action} onClick={() => {
                setResult(null);
                setInk([]);
              }}
              disabled={ink.length === 0}
            >
              <Icon name="trash" /> Start again
            </button>
          </div>

          <div className={styles.links}>
            {mode === 'write' && (
              <button type="button" className={styles.linkButton} onClick={() => chooseMode('trace')}>
                Trace it again
              </button>
            )}
            {onPractise && (
              <button type="button" className={styles.linkButton} onClick={onPractise}>
                Practise with flashcards
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
