import type { Phase } from '../content/phonicsGraphemeBank';
import type { DeckKind } from '../content/types';

export type SessionSize = number | 'all';

export interface RoundSettings {
  phases: Phase[];
  deckKind: DeckKind;
  sessionSize: SessionSize;
  timedMode: boolean;
  secondsPerCard: number;
}
