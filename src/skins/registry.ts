import type { Skin } from './types';

// Skins are a thin decorative layer (accent colour + emoji motif) over the
// same phonics content — see src/content for the data/logic they never touch.
export const skins: Skin[] = [
  { id: 'classic', name: 'Classic', emoji: '⭐', accent: '#aa3bff', accentRgb: '170, 59, 255' },
  { id: 'flowers', name: 'Flower Garden', emoji: '🌸', accent: '#ec4899', accentRgb: '236, 72, 153' },
  { id: 'dinosaurs', name: 'Dino Dig', emoji: '🦕', accent: '#22c55e', accentRgb: '34, 197, 94' },
  { id: 'kpop', name: 'K-Pop Stage', emoji: '🎤', accent: '#d946ef', accentRgb: '217, 70, 239' },
  { id: 'trains', name: 'Railway', emoji: '🚂', accent: '#2563eb', accentRgb: '37, 99, 235' },
  { id: 'football', name: 'Football', emoji: '⚽', accent: '#f97316', accentRgb: '249, 115, 22' },
];

export const defaultSkin = skins[0];
