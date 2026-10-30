import { useId, type ReactNode } from 'react';

export type MascotExpression = 'neutral' | 'happy';

const INK = '#2b2118';

interface FaceProps {
  cx: number;
  cy: number;
  expression: MascotExpression;
  /** Skip the eyes where a character supplies its own. */
  eyes?: boolean;
}

/** The shared face: eyes at cy, cheeks and a smile below. */
function Face({ cx, cy, expression, eyes = true }: FaceProps) {
  return (
    <>
      {eyes &&
        (expression === 'neutral' ? (
          <>
            <circle cx={cx - 10} cy={cy} r="4.6" fill={INK} />
            <circle cx={cx + 10} cy={cy} r="4.6" fill={INK} />
            <circle cx={cx - 8.2} cy={cy - 1.8} r="1.5" fill="#fff" />
            <circle cx={cx + 11.8} cy={cy - 1.8} r="1.5" fill="#fff" />
          </>
        ) : (
          <>
            <path d={`M${cx - 15} ${cy - 1} Q${cx - 9} ${cy - 7} ${cx - 3} ${cy - 1}`} stroke={INK} strokeWidth="3.2" strokeLinecap="round" fill="none" />
            <path d={`M${cx + 3} ${cy - 1} Q${cx + 9} ${cy - 7} ${cx + 15} ${cy - 1}`} stroke={INK} strokeWidth="3.2" strokeLinecap="round" fill="none" />
          </>
        ))}
      <circle cx={cx - 17.5} cy={cy + 10} r="5.4" fill="var(--coral-2)" opacity=".45" />
      <circle cx={cx + 17.5} cy={cy + 10} r="5.4" fill="var(--coral-2)" opacity=".45" />
      {expression === 'neutral' ? (
        <path d={`M${cx - 11} ${cy + 10} Q${cx} ${cy + 22} ${cx + 11} ${cy + 10}`} stroke={INK} strokeWidth="3.4" strokeLinecap="round" fill="none" />
      ) : (
        <path
          d={`M${cx - 12} ${cy + 9} Q${cx} ${cy + 24} ${cx + 12} ${cy + 9} Q${cx} ${cy + 15} ${cx - 12} ${cy + 9} Z`}
          fill="#a8341a"
          stroke={INK}
          strokeWidth="2.6"
          strokeLinejoin="round"
        />
      )}
    </>
  );
}

const STAR_PATH = 'M50 2 L61.8 33.8 L95.7 35.2 L69 56.2 L78.2 88.8 L50 70 L21.8 88.8 L31 56.2 L4.3 35.2 L38.2 33.8 Z';

function Star({ expression }: { expression: MascotExpression }) {
  const gradientId = useId();
  return (
    <>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--gold-1)" />
          <stop offset="1" stopColor="var(--gold-2)" />
        </linearGradient>
      </defs>
      <path d={STAR_PATH} fill={`url(#${gradientId})`} stroke="var(--gold-stroke)" strokeWidth="3.5" strokeLinejoin="round" />
      <Face cx={50} cy={45} expression={expression} />
    </>
  );
}

function Bee({ expression }: { expression: MascotExpression }) {
  const clip = useId();
  return (
    <>
      <defs>
        <clipPath id={clip}>
          <ellipse cx="50" cy="58" rx="32" ry="28" />
        </clipPath>
      </defs>
      <path d="M44 32 Q40 16 33 13 M56 32 Q60 16 67 13" stroke={INK} strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="33" cy="13" r="3.6" fill={INK} />
      <circle cx="67" cy="13" r="3.6" fill={INK} />
      <ellipse cx="33" cy="38" rx="17" ry="10" transform="rotate(-28 33 38)" fill="#fffdf4" stroke="#4562b3" strokeWidth="2.4" opacity=".92" />
      <ellipse cx="67" cy="38" rx="17" ry="10" transform="rotate(28 67 38)" fill="#fffdf4" stroke="#4562b3" strokeWidth="2.4" opacity=".92" />
      <ellipse cx="50" cy="58" rx="32" ry="28" fill="#f2b705" />
      <g clipPath={`url(#${clip})`}>
        <rect x="14" y="71" width="72" height="6" fill={INK} />
        <rect x="14" y="81" width="72" height="8" fill={INK} />
      </g>
      <ellipse cx="50" cy="58" rx="32" ry="28" fill="none" stroke={INK} strokeWidth="3.2" />
      <Face cx={50} cy={51} expression={expression} />
    </>
  );
}

function Egg({ expression }: { expression: MascotExpression }) {
  return (
    <>
      {expression === 'happy' && (
        <g fill="#3c7a33" stroke={INK} strokeWidth="2.4" strokeLinejoin="round">
          <path d="M33 22 L38 4 L45 18 Z" />
          <path d="M45 18 L52 1 L59 18 Z" />
          <path d="M55 18 L62 4 L68 22 Z" />
        </g>
      )}
      <path
        d="M50 14 C72 14 84 42 84 62 C84 82 69 94 50 94 C31 94 16 82 16 62 C16 42 28 14 50 14 Z"
        fill="#f6e7c8"
        stroke="#8a6a3b"
        strokeWidth="3.5"
      />
      <g fill="#bf4526" opacity=".55">
        <circle cx="28" cy="46" r="3" />
        <circle cx="70" cy="40" r="2.6" />
        <circle cx="76" cy="66" r="3.2" />
        <circle cx="22" cy="68" r="2.6" />
        <circle cx="62" cy="86" r="2.8" />
        <circle cx="36" cy="88" r="2.4" />
      </g>
      <path d="M19 38 L30 30 L39 40 L50 29 L61 40 L70 30 L81 38" stroke={INK} strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <Face cx={50} cy={58} expression={expression} />
    </>
  );
}

function Microphone({ expression }: { expression: MascotExpression }) {
  const clip = useId();
  const happy = expression === 'happy';
  return (
    <>
      <defs>
        <clipPath id={clip}>
          <circle cx="50" cy="35" r="27" />
        </clipPath>
      </defs>
      {happy && (
        <g stroke="#1b1f5c" strokeWidth="3" strokeLinecap="round" fill="none">
          <path d="M14 26 Q8 35 14 44" />
          <path d="M6 20 Q-4 35 6 50" />
          <path d="M86 26 Q92 35 86 44" />
          <path d="M94 20 Q104 35 94 50" />
        </g>
      )}
      <path d="M36 62 L64 62 L58 93 Q50 99 42 93 Z" fill="#2536b8" stroke="#1b1f5c" strokeWidth="3.4" strokeLinejoin="round" />
      <path d="M44 72 H56" stroke="#1b1f5c" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="50" cy="82" r="3.4" fill="#ffd23f" stroke="#1b1f5c" strokeWidth="2" />
      <circle cx="50" cy="35" r="27" fill="#fff7e6" />
      <g clipPath={`url(#${clip})`} stroke="#1b1f5c" strokeWidth="1.8" opacity=".13">
        {[-30, -18, -6, 6, 18, 30, 42, 54, 66, 78].map((o) => (
          <path key={o} d={`M${o} 0 L${o + 70} 70 M${o + 70} 0 L${o} 70`} />
        ))}
      </g>
      <circle cx="50" cy="35" r="27" fill="none" stroke="#1b1f5c" strokeWidth="3.4" />
      <path d="M30 59 Q50 69 70 59 L67 68 Q50 76 33 68 Z" fill="#ff7a1a" stroke="#1b1f5c" strokeWidth="3" strokeLinejoin="round" />
      <Face cx={50} cy={31} expression={expression} />
    </>
  );
}

function Loco({ expression }: { expression: MascotExpression }) {
  return (
    <>
      <path d="M37 12 H63 L58 20 H42 Z" fill="#12261c" />
      <rect x="43" y="19" width="14" height="14" fill="#12261c" />
      <circle cx="20" cy="70" r="11" fill="#2b2118" />
      <circle cx="80" cy="70" r="11" fill="#2b2118" />
      <circle cx="20" cy="70" r="4" fill="#cf9522" />
      <circle cx="80" cy="70" r="4" fill="#cf9522" />
      <circle cx="50" cy="58" r="29" fill="#1f5b3f" stroke="#12261c" strokeWidth="3.4" />
      <circle cx="50" cy="58" r="24.5" fill="none" stroke="#cf9522" strokeWidth="3" />
      <circle cx="50" cy="37" r="5.4" fill="#fff7dc" stroke="#6e4f0a" strokeWidth="2.2" />
      <rect x="16" y="84" width="68" height="10" rx="2.5" fill="#c43620" stroke="#7a1f10" strokeWidth="2.4" />
      <circle cx="27" cy="89" r="4.2" fill="#efe8d4" stroke="#6b6450" strokeWidth="1.8" />
      <circle cx="73" cy="89" r="4.2" fill="#efe8d4" stroke="#6b6450" strokeWidth="1.8" />
      <Face cx={50} cy={57} expression={expression} />
    </>
  );
}

const PENTAGON = (cx: number, cy: number, r: number, rot: number) =>
  Array.from({ length: 5 }, (_, i) => {
    const a = ((rot + i * 72) * Math.PI) / 180;
    return `${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)}`;
  }).join(' ');

function Ball({ expression }: { expression: MascotExpression }) {
  const clip = useId();
  return (
    <>
      <defs>
        <clipPath id={clip}>
          <circle cx="50" cy="52" r="34" />
        </clipPath>
      </defs>
      <circle cx="50" cy="52" r="34" fill="#fffffb" />
      <g clipPath={`url(#${clip})`} fill="#15305a" stroke="#15305a" strokeWidth="2" strokeLinejoin="round">
        <polygon points={PENTAGON(50, 25, 11, -90)} />
        <polygon points={PENTAGON(14, 46, 11.5, -18)} />
        <polygon points={PENTAGON(86, 46, 11.5, 198)} />
        <polygon points={PENTAGON(30, 90, 11, -54)} />
        <polygon points={PENTAGON(70, 90, 11, 234)} />
        <path d="M42 33 L24 41 M58 33 L76 41 M19 56 L25 78 M81 56 L75 78 M42 96 L58 96" fill="none" strokeWidth="2.2" />
      </g>
      <circle cx="50" cy="52" r="34" fill="none" stroke="#15305a" strokeWidth="3.6" />
      <Face cx={50} cy={55} expression={expression} />
    </>
  );
}

const ART: Record<string, (props: { expression: MascotExpression }) => ReactNode> = {
  classic: Star,
  flowers: Bee,
  dinosaurs: Egg,
  kpop: Microphone,
  trains: Loco,
  football: Ball,
};

export function MascotArt({ skinId, expression }: { skinId: string; expression: MascotExpression }) {
  const Art = ART[skinId] ?? Star;
  return <Art expression={expression} />;
}
