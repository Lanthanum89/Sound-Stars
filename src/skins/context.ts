import { createContext, useContext } from 'react';
import type { Skin } from './types';

export interface SkinContextValue {
  skin: Skin;
  skins: Skin[];
  setSkinId: (id: string) => void;
}

export const SkinContext = createContext<SkinContextValue | null>(null);

export function useSkin() {
  const ctx = useContext(SkinContext);
  if (!ctx) throw new Error('useSkin must be used within a SkinProvider');
  return ctx;
}
