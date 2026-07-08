import { useCallback, useState } from 'react';
import { downloadProgressBackup, loadProgress, parseProgressBackup, saveProgress } from '../progress/storage';
import type { ProgressData } from '../progress/types';
import type { FlashcardItem } from '../content/types';

export interface RoundAnswer {
  item: FlashcardItem;
  correct: boolean;
}

export function useProgress() {
  const [data, setData] = useState<ProgressData>(loadProgress);

  const recordSession = useCallback((answers: RoundAnswer[]) => {
    if (answers.length === 0) return;
    setData((prev) => {
      const graphemes = { ...prev.graphemes };
      for (const { item, correct } of answers) {
        const existing = graphemes[item.prompt] ?? { correct: 0, attempts: 0 };
        graphemes[item.prompt] = {
          correct: existing.correct + (correct ? 1 : 0),
          attempts: existing.attempts + 1,
        };
      }
      const accuracy = answers.filter((a) => a.correct).length / answers.length;
      const next: ProgressData = {
        ...prev,
        updatedAt: new Date().toISOString(),
        graphemes,
        sessions: [...prev.sessions, { date: new Date().toISOString(), count: answers.length, accuracy }],
      };
      saveProgress(next);
      return next;
    });
  }, []);

  const setChildName = useCallback((childName: string) => {
    setData((prev) => {
      const next = { ...prev, childName, updatedAt: new Date().toISOString() };
      saveProgress(next);
      return next;
    });
  }, []);

  const backup = useCallback(() => {
    setData((prev) => {
      const next = { ...prev, lastBackupAt: new Date().toISOString() };
      saveProgress(next);
      downloadProgressBackup(next);
      return next;
    });
  }, []);

  /** Returns false if the file wasn't a recognizable progress export. */
  const restore = useCallback((json: string): boolean => {
    const parsed = parseProgressBackup(json);
    if (!parsed) return false;
    saveProgress(parsed);
    setData(parsed);
    return true;
  }, []);

  return { data, recordSession, setChildName, backup, restore };
}
