import type { ProgressData } from './types';

const STORAGE_KEY = 'sound-stars-progress';
const CURRENT_VERSION = 1;

function emptyProgress(): ProgressData {
  return {
    version: CURRENT_VERSION,
    childName: '',
    updatedAt: new Date().toISOString(),
    lastBackupAt: null,
    graphemes: {},
    sessions: [],
  };
}

export function loadProgress(): ProgressData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyProgress();
    const parsed = JSON.parse(raw);
    if (parsed?.version !== CURRENT_VERSION) return emptyProgress();
    return { ...emptyProgress(), ...parsed };
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(data: ProgressData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function downloadProgressBackup(data: ProgressData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `sound-stars-progress-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

/** Returns null if the file isn't a recognizable progress export. */
export function parseProgressBackup(json: string): ProgressData | null {
  try {
    const parsed = JSON.parse(json);
    if (
      typeof parsed !== 'object' ||
      parsed === null ||
      parsed.version !== CURRENT_VERSION ||
      typeof parsed.graphemes !== 'object' ||
      !Array.isArray(parsed.sessions)
    ) {
      return null;
    }
    return { ...emptyProgress(), ...parsed };
  } catch {
    return null;
  }
}
