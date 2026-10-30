import { useEffect, useMemo, useRef, useState, type PointerEvent } from 'react';
import { Icon } from '../components/Icon/Icon';
import { Scene } from '../components/Scene/Scene';
import { PhraseText } from '../components/PhraseText/PhraseText';
import { CELL_HEIGHT, CELL_WIDTH, LINES, letterStrokes, type Point, type Stroke } from '../content/letterStrokes';
import shared from './shared.module.css';
import styles from './TraceScreen.module.css';

// Touches this soon after a stylus event are treated as a resting palm.
const PALM_WINDOW_MS = 1500;
const DEMO_SPEED = 60; // viewBox units per second

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
  label: string;
  letters: string[];
  phrase?: string;
  onClose: () => void;
}

export function TraceScreen({ label, letters, phrase, onClose }: TraceScreenProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const activePointer = useRef<number | null>(null);
  const lastPenAt = useRef(-Infinity);
  const [ink, setInk] = useState<Stroke[]>([]);
  const [demoLength, setDemoLength] = useState<number | null>(null);

  const width = letters.length * CELL_WIDTH;

  // The guide: every stroke of every letter, shifted into its cell, in writing order.
  const guide = useMemo(
    () =>
      letters.flatMap((letter, i) =>
        letterStrokes[letter].map((stroke, n) => ({
          key: `${i}-${n}`,
          number: n + 1,
          points: stroke.map((p) => ({ x: p.x + i * CELL_WIDTH, y: p.y })),
        })),
      ),
    [letters],
  );
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
            <h1 className={styles.title}>Trace “{label}”</h1>
            <div className={styles.topSpacer} />
          </div>

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

              {guide.map((s) => (
                <path key={s.key} className={styles.guideRoad} d={toPath(s.points)} />
              ))}
              {guide.map((s) => (
                <path key={`d-${s.key}`} className={styles.guideDash} d={toPath(s.points)} />
              ))}
              {guide.map((s) => (
                <g key={`n-${s.key}`}>
                  <circle className={styles.startDot} cx={s.points[0].x} cy={s.points[0].y} r={6} />
                  <text className={styles.startNumber} x={s.points[0].x} y={s.points[0].y}>
                    {s.number}
                  </text>
                </g>
              ))}

              {ink.map((stroke, i) => (
                <path key={i} className={styles.ink} d={toPath(stroke.length > 1 ? stroke : [...stroke, stroke[0]])} />
              ))}
              {demoStrokes.map((stroke, i) => (
                <path key={`demo-${i}`} className={styles.demo} d={toPath(stroke)} />
              ))}
            </svg>
          </div>

          {phrase && (
            <p className={styles.phrase}>
              <PhraseText phrase={phrase} />
            </p>
          )}

          <div className={styles.actions}>
            <button type="button" className={styles.action} onClick={() => setDemoLength(0)}>
              <Icon name="play" /> Watch
            </button>
            <button
              type="button"
              className={styles.action}
              onClick={() => setInk((strokes) => strokes.slice(0, -1))}
              disabled={ink.length === 0}
            >
              <Icon name="undo" /> Undo
            </button>
            <button type="button" className={styles.action} onClick={() => setInk([])} disabled={ink.length === 0}>
              <Icon name="trash" /> Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
