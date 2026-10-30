import type { CSSProperties, ReactNode } from 'react';
import { useSkin } from '../../skins/context';
import styles from './Scene.module.css';

// Each theme is a small flat-colour place rather than a pattern of emoji: a
// ground strip anchored to the bottom edge (so it holds its shape from a phone
// to a tablet) plus a few things that drift, fall or rise across the screen.
// Ground strips take their height from the screen width (so wide screens don't
// crop their tops) up to a share of the screen height. Everything is positioned
// in percentages/viewport units so it spreads out on any screen. Colours here are fixed hex on purpose: the scene belongs to one
// theme, unlike the screens' UI, which reads the shared tokens.

const CLOUD = 'M10 40 C-2 40 -2 25 12 25 C13 12 30 8 38 18 C44 4 68 4 74 20 C90 16 104 26 98 40 Z';

function Cloud({ fill }: { fill: string }) {
  return (
    <svg viewBox="0 0 104 44" aria-hidden="true">
      <path d={CLOUD} fill={fill} />
    </svg>
  );
}

interface DriftSpec {
  top: string;
  width: string;
  duration: number;
  delay: number;
  opacity?: number;
}

function Drifters({ specs, children }: { specs: DriftSpec[]; children: ReactNode }) {
  return (
    <>
      {specs.map((spec, i) => (
        <span
          key={i}
          className={styles.drift}
          style={{ top: spec.top, width: spec.width, animationDuration: `${spec.duration}s`, animationDelay: `${spec.delay}s`, opacity: spec.opacity }}
        >
          {children}
        </span>
      ))}
    </>
  );
}

const CLOUDS: DriftSpec[] = [
  { top: '7%', width: 'clamp(70px, 11vw, 150px)', duration: 62, delay: -14 },
  { top: '19%', width: 'clamp(56px, 8vw, 110px)', duration: 78, delay: -52 },
  { top: '33%', width: 'clamp(84px, 13vw, 180px)', duration: 70, delay: -30 },
  { top: '52%', width: 'clamp(60px, 9vw, 120px)', duration: 84, delay: -4 },
];


/* A small figure that crosses the bottom of the screen, like the railway train. */
interface WalkerSpec {
  bottom: string | number;
  width: string;
  duration: number;
  delay?: number;
  left?: string;
}

function Walker({ spec, children }: { spec: WalkerSpec; children: ReactNode }) {
  return (
    <div
      className={styles.walker}
      style={{ bottom: spec.bottom, width: spec.width, left: spec.left, animationDuration: `${spec.duration}s`, animationDelay: `${spec.delay ?? 0}s` }}
    >
      {children}
    </div>
  );
}

function Tractor() {
  return (
    <svg viewBox="0 0 120 70" aria-hidden="true">
      <rect x="52" y="26" width="56" height="20" rx="4" fill="#d9442f" />
      <rect x="20" y="8" width="36" height="38" rx="4" fill="#d9442f" />
      <rect x="26" y="14" width="24" height="16" rx="2" fill="#fff7dc" />
      <rect x="16" y="2" width="44" height="7" rx="2" fill="#8f2a1c" />
      <rect x="96" y="12" width="5" height="16" fill="#3b2f26" />
      <circle cx="38" cy="50" r="18" fill="#2b2118" />
      <circle cx="38" cy="50" r="7" fill="#f5b21b" />
      <circle cx="98" cy="58" r="10" fill="#2b2118" />
      <circle cx="98" cy="58" r="4" fill="#f5b21b" />
    </svg>
  );
}

function Hedgehog() {
  return (
    <svg viewBox="0 0 80 50" aria-hidden="true">
      <path d="M8 38 L4 28 L12 28 L10 16 L20 20 L22 8 L32 14 L38 4 L44 14 L54 8 L54 20 L62 24 L58 38 Z" fill="#5c3d2c" />
      <ellipse cx="36" cy="32" rx="28" ry="14" fill="#6f4b37" />
      <ellipse cx="64" cy="34" rx="13" ry="9" fill="#ecc9a0" />
      <circle cx="76" cy="34" r="3.2" fill="#2b2118" />
      <circle cx="68" cy="30" r="2" fill="#2b2118" />
      <rect x="24" y="42" width="8" height="8" rx="3" fill="#ecc9a0" />
      <rect x="50" y="42" width="8" height="8" rx="3" fill="#ecc9a0" />
    </svg>
  );
}

function Stegosaurus() {
  return (
    <svg viewBox="0 0 140 80" aria-hidden="true">
      <path d="M4 52 Q22 44 34 40 L40 56 Q22 60 4 52 Z" fill="#7fb069" />
      <ellipse cx="68" cy="44" rx="40" ry="22" fill="#7fb069" />
      <path d="M40 26 L46 10 L54 24 L62 6 L70 22 L80 6 L86 24 L96 12 L98 30 Z" fill="#e8a23a" />
      <circle cx="108" cy="38" r="13" fill="#7fb069" />
      <circle cx="113" cy="34" r="2.6" fill="#2b2118" />
      <path d="M110 44 Q116 47 121 43" stroke="#2b2118" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <g className={styles.legA}>
        <rect x="44" y="56" width="13" height="22" rx="5" fill="#5f9150" />
        <rect x="90" y="56" width="13" height="22" rx="5" fill="#5f9150" />
      </g>
      <g className={styles.legB}>
        <rect x="60" y="58" width="13" height="20" rx="5" fill="#6aa058" />
        <rect x="76" y="58" width="13" height="20" rx="5" fill="#6aa058" />
      </g>
    </svg>
  );
}

function Runner() {
  return (
    <svg viewBox="0 0 50 90" aria-hidden="true">
      <g className={styles.legB}>
        <rect x="27" y="58" width="8" height="26" rx="3" fill="#f0c8a0" />
        <rect x="26" y="78" width="12" height="8" rx="3" fill="#2b2118" />
      </g>
      <g className={styles.legA}>
        <rect x="15" y="58" width="8" height="26" rx="3" fill="#f0c8a0" />
        <rect x="14" y="78" width="12" height="8" rx="3" fill="#2b2118" />
      </g>
      <rect x="13" y="46" width="24" height="16" rx="4" fill="#15305a" />
      <rect x="13" y="22" width="24" height="28" rx="6" fill="#cc2f2c" />
      <rect x="35" y="26" width="7" height="18" rx="3" fill="#f0c8a0" transform="rotate(-20 38 26)" />
      <circle cx="25" cy="13" r="9" fill="#f0c8a0" />
      <path d="M16 12 Q18 2 27 3 Q34 4 34 12 Q28 7 16 12 Z" fill="#3a2a20" />
    </svg>
  );
}

/* ---------------------------------------------------------------- Sunny Day */

function SunnyDay() {
  return (
    <>
      <span
        style={{
          position: 'absolute',
          top: '10%',
          right: '4%',
          width: 'clamp(54px, 9vw, 112px)',
          aspectRatio: '1',
          borderRadius: '50%',
          background: '#ffd24a',
          boxShadow: '0 0 0 clamp(8px, 1.4vw, 18px) rgba(255, 253, 247, 0.5)',
        }}
      />
      <Drifters specs={CLOUDS}>
        <Cloud fill="#fffdf7" />
      </Drifters>
      <svg className={styles.ground} style={{ height: 'clamp(110px, 20vw, 34vh)' }} viewBox="0 0 1200 240" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <path d="M0 240 V120 C150 60 300 70 450 112 C600 154 760 80 900 84 C1040 88 1130 120 1200 100 V240 Z" fill="#b6dc99" />
        <path d="M0 240 V170 C170 120 330 150 520 168 C700 186 860 128 1040 140 C1120 146 1170 160 1200 156 V240 Z" fill="#86c077" />
        <g>
          <rect x="146" y="124" width="7" height="40" fill="#6b4f33" />
          <circle cx="149" cy="114" r="26" fill="#5fa25b" />
          <circle cx="136" cy="128" r="16" fill="#5fa25b" />
          <rect x="1004" y="112" width="7" height="46" fill="#6b4f33" />
          <circle cx="1007" cy="100" r="30" fill="#5fa25b" />
          <circle cx="1024" cy="118" r="17" fill="#5fa25b" />
        </g>
        <g fill="#fffdf7">
          <circle cx="250" cy="196" r="5" />
          <circle cx="262" cy="202" r="5" />
          <circle cx="780" cy="190" r="5" />
          <circle cx="1010" cy="204" r="5" />
        </g>
        <g fill="#f5b21b">
          <circle cx="256" cy="199" r="2.6" />
          <circle cx="780" cy="190" r="2.6" />
          <circle cx="1010" cy="204" r="2.6" />
        </g>
      </svg>
      <Walker spec={{ bottom: 6, width: 'clamp(54px, 9vw, 96px)', duration: 90, delay: -20 }}>
        <Tractor />
      </Walker>
    </>
  );
}

/* ---------------------------------------------------------------- Hedgerow */

const HEDGE_BACK = `M0 260 V118 ${'a34 30 0 0 1 68 0 '.repeat(18)} V260 Z`;
const HEDGE_FRONT = `M0 260 V172 ${'a26 24 0 0 1 52 0 '.repeat(24)} V260 Z`;

function Poppy({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 6 V58" stroke="#2f6b3e" strokeWidth="4" />
      <g fill="#cf3a22">
        <circle cx="-8" cy="-4" r="11" />
        <circle cx="8" cy="-4" r="11" />
        <circle cx="-6" cy="8" r="10" />
        <circle cx="6" cy="8" r="10" />
      </g>
      <circle cx="0" cy="2" r="5" fill="#2b2118" />
    </g>
  );
}

function Buttercup({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 6 V52" stroke="#2f6b3e" strokeWidth="3.4" />
      <g fill="#f2b705">
        {[0, 72, 144, 216, 288].map((a) => (
          <circle key={a} cx={8 * Math.cos((a * Math.PI) / 180)} cy={8 * Math.sin((a * Math.PI) / 180)} r="7" />
        ))}
      </g>
      <circle r="4.4" fill="#fff3b0" />
    </g>
  );
}

function Bluebell({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M0 62 C0 30 2 14 12 6" stroke="#2f6b3e" strokeWidth="3.4" fill="none" strokeLinecap="round" />
      {[
        [10, 10],
        [4, 24],
        [-2, 38],
      ].map(([bx, by]) => (
        <path key={by} d={`M${bx} ${by} q10 2 10 14 q-6 4 -12 0 q-2 -10 2 -14 Z`} fill="#4562b3" />
      ))}
    </g>
  );
}

const PETALS: { left: string; size: number; duration: number; delay: number; fill: string }[] = [
  { left: '8%', size: 14, duration: 27, delay: -4, fill: '#cf3a22' },
  { left: '24%', size: 11, duration: 33, delay: -19, fill: '#f2b705' },
  { left: '41%', size: 13, duration: 29, delay: -9, fill: '#fffdf4' },
  { left: '57%', size: 10, duration: 36, delay: -27, fill: '#cf3a22' },
  { left: '72%', size: 14, duration: 31, delay: -14, fill: '#f2b705' },
  { left: '88%', size: 11, duration: 34, delay: -22, fill: '#fffdf4' },
];

function Hedgerow() {
  return (
    <>
      {PETALS.slice(0, 4).map((p, i) => (
        <svg
          key={i}
          className={styles.fall}
          viewBox="0 0 20 20"
          style={{ left: p.left, width: p.size, animationDuration: `${p.duration}s`, animationDelay: `${p.delay}s` }}
          aria-hidden="true"
        >
          <path d="M10 1 C17 6 17 15 10 19 C3 15 3 6 10 1 Z" fill={p.fill} />
        </svg>
      ))}
      <svg className={styles.ground} style={{ height: 'clamp(130px, 21.7vw, 36vh)' }} viewBox="0 0 1200 260" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <path d={HEDGE_BACK} fill="#7cb56f" />
        <Poppy x={70} y={72} s={0.9} />
        <Buttercup x={210} y={80} />
        <Bluebell x={330} y={62} />
        <Poppy x={480} y={78} s={1.1} />
        <Buttercup x={620} y={70} s={0.9} />
        <Bluebell x={760} y={64} s={1.1} />
        <Poppy x={900} y={74} />
        <Buttercup x={1030} y={82} s={1.1} />
        <Bluebell x={1130} y={60} />
        <path d={HEDGE_FRONT} fill="#4d9058" />
        <Buttercup x={150} y={134} s={0.8} />
        <Poppy x={400} y={140} s={0.75} />
        <Bluebell x={560} y={126} s={0.9} />
        <Buttercup x={840} y={136} s={0.8} />
        <Poppy x={1090} y={138} s={0.8} />
      </svg>
      <Walker spec={{ bottom: 4, width: 'clamp(44px, 7vw, 76px)', duration: 110, delay: -35 }}>
        <Hedgehog />
      </Walker>
    </>
  );
}

/* ---------------------------------------------------------------- Dino Dig */

function spiral(cx: number, cy: number, turns: number, grow: number): string {
  const pts: string[] = [];
  for (let t = 0; t <= turns * 360; t += 12) {
    const r = 3 + (t / 360) * grow;
    const a = (t * Math.PI) / 180;
    pts.push(`${(cx + r * Math.cos(a)).toFixed(1)} ${(cy + r * Math.sin(a)).toFixed(1)}`);
  }
  return `M${pts.join(' L')}`;
}

function Dinosaur() {
  return (
    <>
      <span
        style={{
          position: 'absolute',
          top: '5%',
          left: '9%',
          width: 'clamp(50px, 8vw, 100px)',
          aspectRatio: '1',
          borderRadius: '50%',
          background: '#fff2c9',
          boxShadow: '0 0 0 clamp(8px, 1.3vw, 16px) rgba(255, 242, 201, 0.5)',
        }}
      />
      <Drifters specs={CLOUDS.slice(0, 3)}>
        <Cloud fill="#fbf0d4" />
      </Drifters>
      <Drifters specs={[{ top: '13%', width: 'clamp(46px, 7vw, 90px)', duration: 58, delay: -20 }]}>
        <svg viewBox="0 0 60 30" aria-hidden="true">
          <path d="M0 14 Q8 2 18 12 L30 8 L40 12 Q52 2 60 14 Q48 10 40 18 L30 28 L20 18 Q10 10 0 14 Z" fill="#8a5a37" opacity="0.6" />
        </svg>
      </Drifters>
      <svg className={styles.ground} style={{ height: 'clamp(190px, 33.3vw, 46vh)' }} viewBox="0 0 1200 400" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <path d="M0 400 V92 L130 60 L330 66 L430 92 L600 76 L780 70 L900 92 L1040 62 L1200 84 V400 Z" fill="#ecd3a2" />
        <path d="M0 400 V104 Q150 78 300 98 T600 94 T900 102 T1200 90 V400 Z" fill="#e4c38c" />
        <path d="M0 400 V190 Q200 168 380 188 T760 184 T1200 176 V400 Z" fill="#d6a06f" />
        <path d="M0 400 V288 Q220 268 420 286 T820 280 T1200 272 V400 Z" fill="#c2855c" />
        <path d="M0 400 V350 Q240 336 460 348 T900 344 T1200 338 V400 Z" fill="#a46a46" />
        <g fill="none" stroke="#8a5530" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" opacity="0.85">
          <path d={spiral(220, 236, 2.3, 7)} />
        </g>
        <g transform="translate(870 140) rotate(-12)" fill="#f8edd2" stroke="#caa774" strokeWidth="3">
          <rect x="-34" y="-6" width="68" height="12" rx="6" />
          <circle cx="-36" cy="-8" r="9" />
          <circle cx="-36" cy="8" r="9" />
          <circle cx="36" cy="-8" r="9" />
          <circle cx="36" cy="8" r="9" />
        </g>
        <g fill="#c8a56a" opacity="0.8">
          <ellipse cx="560" cy="150" rx="11" ry="9" />
          <ellipse cx="536" cy="132" rx="5" ry="7" />
          <ellipse cx="560" cy="126" rx="5" ry="7" />
          <ellipse cx="584" cy="132" rx="5" ry="7" />
        </g>
        <g fill="#a46a46" opacity="0.6">
          <circle cx="90" cy="320" r="7" />
          <circle cx="680" cy="322" r="9" />
          <circle cx="1090" cy="262" r="6" />
          <circle cx="430" cy="376" r="8" />
        </g>
      </svg>
      <Walker spec={{ bottom: 10, width: 'clamp(70px, 11vw, 130px)', duration: 100, delay: -30 }}>
        <Stegosaurus />
      </Walker>
    </>
  );
}

/* ---------------------------------------------------------------- Main Stage */

const CONFETTI: { left: string; size: number; duration: number; delay: number; fill: string; shape: 'dot' | 'tri' | 'bar' }[] = [
  { left: '6%', size: 12, duration: 30, delay: -3, fill: '#6fa8e8', shape: 'dot' },
  { left: '17%', size: 10, duration: 38, delay: -20, fill: '#f77fa5', shape: 'tri' },
  { left: '29%', size: 14, duration: 34, delay: -11, fill: '#ffd76e', shape: 'dot' },
  { left: '38%', size: 9, duration: 41, delay: -29, fill: '#6fa8e8', shape: 'bar' },
  { left: '52%', size: 12, duration: 32, delay: -7, fill: '#f77fa5', shape: 'dot' },
  { left: '63%', size: 11, duration: 39, delay: -24, fill: '#ffd76e', shape: 'tri' },
  { left: '74%', size: 13, duration: 35, delay: -15, fill: '#6fa8e8', shape: 'dot' },
  { left: '84%', size: 9, duration: 43, delay: -33, fill: '#f77fa5', shape: 'bar' },
  { left: '93%', size: 12, duration: 31, delay: -9, fill: '#ffd76e', shape: 'dot' },
];

function MainStage() {
  return (
    <>
      <div className={styles.rays} />
      <div className={`${styles.halftone} ${styles.halftoneA}`} />
      <div className={`${styles.halftone} ${styles.halftoneB}`} />
      {CONFETTI.slice(0, 5).map((c, i) => {
        const shape: CSSProperties =
          c.shape === 'dot'
            ? { borderRadius: '50%' }
            : c.shape === 'tri'
              ? { clipPath: 'polygon(50% 0, 100% 100%, 0 100%)' }
              : { height: c.size * 0.4, borderRadius: 2 };
        return (
          <span
            key={i}
            className={styles.rise}
            style={{ left: c.left, animationDuration: `${c.duration}s`, animationDelay: `${c.delay}s` }}
          >
            <span className={styles.confetti} style={{ display: 'block', width: c.size, height: c.size, background: c.fill, ...shape }} />
          </span>
        );
      })}
      <svg className={styles.ground} style={{ height: 'clamp(74px, 10.8vw, 16vh)' }} viewBox="0 0 1200 130" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <rect y="56" width="1200" height="74" fill="#f77fa5" />
        <rect y="46" width="1200" height="12" fill="#6fa8e8" />
        <rect y="104" width="1200" height="26" fill="#e0618a" />
        {Array.from({ length: 21 }, (_, i) => (
          <g key={i}>
            <circle className={styles.bulb} style={{ animationDelay: `${i % 2 ? 0 : 1}s` }} cx={30 + i * 57} cy="80" r="9" fill="#ffe9a8" />
            <circle cx={30 + i * 57} cy="80" r="4.5" fill="#fffaf0" />
          </g>
        ))}
      </svg>
    </>
  );
}

/* ---------------------------------------------------------------- Railway */

function Train() {
  return (
    <svg viewBox="0 -30 440 106" aria-hidden="true" style={{ overflow: "visible" }}>
      {/* tender-less loco on the right, two carriages behind */}
      <g>
        <rect x="8" y="14" width="124" height="42" rx="5" fill="#c43620" />
        <rect x="18" y="22" width="26" height="18" rx="2" fill="#fff7dc" />
        <rect x="52" y="22" width="26" height="18" rx="2" fill="#fff7dc" />
        <rect x="86" y="22" width="26" height="18" rx="2" fill="#fff7dc" />
        <rect x="8" y="46" width="124" height="5" fill="#7a1f10" />
      </g>
      <g>
        <rect x="142" y="14" width="124" height="42" rx="5" fill="#cf9522" />
        <rect x="152" y="22" width="26" height="18" rx="2" fill="#fff7dc" />
        <rect x="186" y="22" width="26" height="18" rx="2" fill="#fff7dc" />
        <rect x="220" y="22" width="26" height="18" rx="2" fill="#fff7dc" />
        <rect x="142" y="46" width="124" height="5" fill="#6e4f0a" />
      </g>
      <rect x="132" y="38" width="10" height="4" fill="#2b2118" />
      <g>
        <rect x="276" y="22" width="110" height="34" rx="4" fill="#1f5b3f" />
        <rect x="376" y="10" width="46" height="46" rx="4" fill="#1f5b3f" />
        <rect x="384" y="18" width="30" height="16" rx="2" fill="#fff7dc" />
        <rect x="300" y="4" width="16" height="22" fill="#12261c" />
        <rect x="294" y="0" width="28" height="7" rx="2" fill="#12261c" />
        <rect x="266" y="38" width="10" height="4" fill="#2b2118" />
        <rect x="276" y="46" width="146" height="6" fill="#12261c" />
      </g>
      {[0, 1, 2].map((i) => (
        <circle key={`puff-${i}`} className={styles.puff} cx="308" cy="0" r="9" style={{ animationDelay: `${i * 0.9}s` }} />
      ))}
      {[40, 100, 170, 230, 308, 358, 404].map((x) => (
        <g key={x}>
          <circle cx={x} cy="62" r="10" fill="#2b2118" />
          <circle cx={x} cy="62" r="3.6" fill="#cf9522" />
        </g>
      ))}
    </svg>
  );
}

const POLES = [140, 520, 900];

function Railway() {
  return (
    <>
      <Drifters specs={CLOUDS.slice(0, 3)}>
        <Cloud fill="#fffbf0" />
      </Drifters>
      <svg className={styles.ground} style={{ bottom: 40, height: 'clamp(150px, 25vw, 40vh)' }} viewBox="0 0 1200 300" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <path d="M0 300 V120 C120 60 260 80 400 130 C540 180 700 70 860 96 C1000 118 1100 90 1200 70 V300 Z" fill="#a8cfa4" />
        <path d="M0 300 V190 C160 130 320 170 520 190 C720 210 880 140 1060 160 C1130 168 1170 180 1200 176 V300 Z" fill="#86b98b" />
        {POLES.map((x) => (
          <g key={x}>
            <rect x={x - 3} y="150" width="6" height="150" fill="#5b4a3a" />
            <rect x={x - 22} y="162" width="44" height="5" fill="#5b4a3a" />
          </g>
        ))}
        <path d="M118 165 Q329 205 498 165 M542 165 Q711 205 878 165 M922 165 Q1060 195 1200 170" stroke="#3c3a35" strokeWidth="1.6" fill="none" />
        <path d="M0 300 V258 Q300 246 600 256 T1200 250 V300 Z" fill="#6f9f78" />
      </svg>
      <div className={styles.track} />
      <div className={styles.train}>
        <Train />
      </div>
    </>
  );
}

/* ---------------------------------------------------------------- Match Day */

const STAND_COLOURS = ['#15305a', '#cc2f2c', '#ffd23f', '#fffffb'];

function MatchDay() {
  return (
    <>
      <Drifters specs={CLOUDS.slice(0, 3)}>
        <Cloud fill="#fffffb" />
      </Drifters>
      <svg className={styles.ground} style={{ height: 'clamp(200px, 36vw, 40vh)' }} viewBox="0 0 1200 500" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
        <rect y="0" width="1200" height="64" fill="#dfe7ea" />
        {Array.from({ length: 3 }, (_, row) =>
          Array.from({ length: 60 }, (_, i) => (
            <circle key={`${row}-${i}`} cx={10 + i * 20 + (row % 2) * 10} cy={14 + row * 17} r="5" fill={STAND_COLOURS[(i * 7 + row * 3) % 4]} opacity="0.6" />
          )),
        )}
        {Array.from({ length: 7 }, (_, i) => (
          <rect key={i} y={64 + i * 63} width="1200" height="63" fill={i % 2 === 0 ? '#a3d490' : '#b3dc9f'} />
        ))}
        <rect y="62" width="1200" height="5" fill="#fffffb" />
        <rect y="206" width="1200" height="5" fill="#fffffb" opacity="0.5" />
        <ellipse cx="600" cy="208" rx="130" ry="44" fill="none" stroke="#fffffb" strokeWidth="5" opacity="0.5" />
        <circle cx="600" cy="208" r="6" fill="#fffffb" opacity="0.5" />
        <path d="M330 500 V392 H870 V500" fill="none" stroke="#fffffb" strokeWidth="5" opacity="0.5" />
      </svg>
      <div className={styles.runner}>
        <Runner />
      </div>
      <div className={styles.ball}>
        <svg viewBox="0 0 100 100" aria-hidden="true">
          <circle cx="50" cy="50" r="46" fill="#fffffb" stroke="#15305a" strokeWidth="6" />
          <polygon points="50,28 71,43 63,68 37,68 29,43" fill="#15305a" />
        </svg>
      </div>
    </>
  );
}

const SCENES: Record<string, () => ReactNode> = {
  classic: SunnyDay,
  flowers: Hedgerow,
  dinosaurs: Dinosaur,
  kpop: MainStage,
  trains: Railway,
  football: MatchDay,
};

/** The active theme's background: a drawn place, shared by every child-facing screen. */
export function Scene() {
  const { skin } = useSkin();
  const Art = SCENES[skin.id] ?? SunnyDay;
  return (
    <div className={styles.scene} aria-hidden="true">
      <Art />
    </div>
  );
}
