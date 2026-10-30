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
    const entries = Object.entries(skin.tokens);
    for (const [name, value] of entries) root.style.setProperty(name, value);
    root.dataset.skin = skin.id;

    // Both expressions, so the first card of a round never shows an empty gap.
    for (const src of Object.values(skin.mascotSrc ?? {})) new Image().src = src;

    return () => {
      for (const [name] of entries) root.style.removeProperty(name);
      delete root.dataset.skin;
    };
  }, [skin]);

  const value = useMemo(() => ({ skin, skins, setSkinId }), [skin, setSkinId]);

  return <SkinContext.Provider value={value}>{children}</SkinContext.Provider>;
}
