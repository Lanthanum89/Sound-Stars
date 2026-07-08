export interface GraphemeStat {
  correct: number;
  attempts: number;
}

export interface SessionLogEntry {
  /** ISO datetime the session was completed. */
  date: string;
  count: number;
  /** 0-1 */
  accuracy: number;
}

export interface ProgressData {
  version: 1;
  childName: string;
  updatedAt: string;
  lastBackupAt: string | null;
  /** Keyed by FlashcardItem.prompt (a grapheme, or a tricky word itself). */
  graphemes: Record<string, GraphemeStat>;
  sessions: SessionLogEntry[];
}
