import { useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { SkinContext } from './context';
import { defaultSkin, skins } from './registry';

export function SkinProvider({ children }: { children: ReactNode }) {
  const [skinId, setSkinId] = useState(defaultSkin.id);
  const skin = skins.find((s) => s.id === skinId) ?? defaultSkin;

  const themeStyle = useMemo(
    () =>
      ({
        '--accent': skin.accent,
        '--accent-bg': `rgba(${skin.accentRgb}, 0.12)`,
        '--accent-border': `rgba(${skin.accentRgb}, 0.5)`,
      }) as CSSProperties,
    [skin],
  );

  const value = useMemo(() => ({ skin, skins, setSkinId }), [skin]);

  return (
    <SkinContext.Provider value={value}>
      <div style={themeStyle}>{children}</div>
    </SkinContext.Provider>
  );
}
