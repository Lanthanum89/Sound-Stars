// The best stars a child has earned writing each sound, kept on this device
// (separately from flashcard progress). Only ever goes up, so a wobbly attempt
// never takes a star away.

const STORAGE_KEY = 'sound-stars-writing';

/** Sound key (e.g. "a_ar") to best stars, 1 to 3. */
export type WritingBest = Record<string, number>;

export function loadWritingBest(): WritingBest {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}');
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return {};
    return Object.fromEntries(
      Object.entries(parsed).filter(([, stars]) => typeof stars === 'number' && stars >= 1 && stars <= 3),
    );
  } catch {
    return {};
  }
}

/** Records an attempt and returns the best stars before it and after it. */
export function recordWritingStars(key: string, stars: number): { previous: number; best: number } {
  const all = loadWritingBest();
  const previous = all[key] ?? 0;
  const best = Math.max(previous, stars);
  if (best > previous) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...all, [key]: best }));
    } catch {
      // Storage can be unavailable (private window); the stars just don't persist.
    }
  }
  return { previous, best };
}
