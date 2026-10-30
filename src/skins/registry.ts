import type { Skin } from './types';
import { classic, dinosaurs, flowers, football, kpop, trains } from './palettes';

// A skin is a full palette plus a drawn scene and mascot (see components/Scene
// and components/Mascot, both keyed by skin id) over the same phonics content,
// which skins never touch (see src/content).
export const skins: Skin[] = [
  { id: 'classic', name: 'Sunny Day', swatch: ['#9fd5ea', '#f5b21b', '#cf4020'], tokens: classic },
  { id: 'flowers', name: 'Hedgerow', swatch: ['#cf3a22', '#f2b705', '#4562b3'], tokens: flowers },
  { id: 'dinosaurs', name: 'Dino Dig', swatch: ['#bf4526', '#3c7a33', '#e6cfa0'], tokens: dinosaurs },
  { id: 'kpop', name: 'Main Stage', swatch: ['#2536b8', '#ff7a1a', '#ffd23f'], tokens: kpop },
  { id: 'trains', name: 'Railway', swatch: ['#1f5b3f', '#c43620', '#cf9522'], tokens: trains },
  { id: 'football', name: 'Match Day', swatch: ['#15305a', '#cc2f2c', '#ffd23f'], tokens: football },
];

export const defaultSkin = skins[0];
