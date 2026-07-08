import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { SkinContext } from './context';
import { defaultSkin, skins } from './registry';

export function SkinProvider({ children }: { children: ReactNode }) {
  const [skinId, setSkinId] = useState(defaultSkin.id);
  const skin = skins.find((s) => s.id === skinId) ?? defaultSkin;

  // Set on the root element (not a wrapper div) so the active skin's colours
  // still apply to content rendered via a portal (e.g. the round Modal),
  // which sits outside the React tree's DOM position but stays a descendant
  // of <html> — CSS custom properties inherit through the DOM tree.
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--accent', skin.accent);
    root.style.setProperty('--accent-bg', `rgba(${skin.accentRgb}, 0.12)`);
    root.style.setProperty('--accent-border', `rgba(${skin.accentRgb}, 0.5)`);

    return () => {
      root.style.removeProperty('--accent');
      root.style.removeProperty('--accent-bg');
      root.style.removeProperty('--accent-border');
    };
  }, [skin]);

  const value = useMemo(() => ({ skin, skins, setSkinId }), [skin, setSkinId]);

  return <SkinContext.Provider value={value}>{children}</SkinContext.Provider>;
}
