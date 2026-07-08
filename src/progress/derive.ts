import type { ProgressData, SessionLogEntry } from './types';

const DAY_MS = 24 * 60 * 60 * 1000;
const MASTERY_THRESHOLD = 0.8;
const MASTERY_MIN_ATTEMPTS = 3;
const NEEDS_PRACTICE_THRESHOLD = 0.6;
const NEEDS_PRACTICE_MIN_ATTEMPTS = 2;

function sessionsBetween(sessions: SessionLogEntry[], daysAgoStart: number, daysAgoEnd: number, from: Date): SessionLogEntry[] {
  const start = from.getTime() - daysAgoStart * DAY_MS;
  const end = from.getTime() - daysAgoEnd * DAY_MS;
  return sessions.filter((s) => {
    const t = new Date(s.date).getTime();
    return t >= start && t < end;
  });
}

function aggregate(sessions: SessionLogEntry[]): { sessionCount: number; soundsPractised: number; accuracy: number | null } {
  const soundsPractised = sessions.reduce((sum, s) => sum + s.count, 0);
  if (soundsPractised === 0) return { sessionCount: sessions.length, soundsPractised: 0, accuracy: null };
  const correct = sessions.reduce((sum, s) => sum + s.count * s.accuracy, 0);
  return { sessionCount: sessions.length, soundsPractised, accuracy: correct / soundsPractised };
}

export interface WeeklySummary {
  sessionCount: number;
  soundsPractised: number;
  accuracy: number | null;
  previousAccuracy: number | null;
}

export function getWeeklySummary(data: ProgressData, now: Date = new Date()): WeeklySummary {
  const thisWeek = aggregate(sessionsBetween(data.sessions, 7, 0, now));
  const lastWeek = aggregate(sessionsBetween(data.sessions, 14, 7, now));
  return {
    sessionCount: thisWeek.sessionCount,
    soundsPractised: thisWeek.soundsPractised,
    accuracy: thisWeek.accuracy,
    previousAccuracy: lastWeek.accuracy,
  };
}

export interface GraphemeProgress {
  grapheme: string;
  correct: number;
  attempts: number;
  accuracy: number;
}

function withAccuracy(data: ProgressData): GraphemeProgress[] {
  return Object.entries(data.graphemes).map(([grapheme, stat]) => ({
    grapheme,
    correct: stat.correct,
    attempts: stat.attempts,
    accuracy: stat.attempts ? stat.correct / stat.attempts : 0,
  }));
}

export function getSparkling(data: ProgressData): GraphemeProgress[] {
  return withAccuracy(data)
    .filter((g) => g.attempts >= MASTERY_MIN_ATTEMPTS && g.accuracy >= MASTERY_THRESHOLD)
    .sort((a, b) => b.accuracy - a.accuracy);
}

export function getNeedsPractice(data: ProgressData, limit = 3): GraphemeProgress[] {
  return withAccuracy(data)
    .filter((g) => g.attempts >= NEEDS_PRACTICE_MIN_ATTEMPTS && g.accuracy < NEEDS_PRACTICE_THRESHOLD)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, limit);
}

export function formatRelativeTime(iso: string | null): string {
  if (!iso) return 'Never backed up';
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}
