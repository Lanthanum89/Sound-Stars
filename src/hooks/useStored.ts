import { useCallback, useState } from 'react';

/**
 * State that is remembered on this device between visits. A stored value that
 * fails `isValid` (an old shape, a hand-edited value) is ignored in favour of
 * the default, and storage being unavailable (a private window) just means
 * nothing is remembered.
 */
export function useStored<T>(key: string, initial: T, isValid: (value: unknown) => value is T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw !== null) {
        const parsed: unknown = JSON.parse(raw);
        if (isValid(parsed)) return parsed;
      }
    } catch {
      // fall through to the default
    }
    return initial;
  });

  const set = useCallback(
    (next: T | ((previous: T) => T)) => {
      setValue((previous) => {
        const resolved = typeof next === 'function' ? (next as (previous: T) => T)(previous) : next;
        try {
          localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          // Not remembered; the app still works.
        }
        return resolved;
      });
    },
    [key],
  );

  return [value, set] as const;
}
