import type { PaletteId } from "../theme/palettes";

/** Bach — Raíz Helecho y paletas sin override (~94 BPM) */
export const TEASER_FAMILIA_BEAT_CUTS_BACH: readonly number[] = [
  420, 620, 640, 320, 620, 640, 260, 680, 560, 420, 640, 340, 640, 680, 340, 560, 640, 320, 640,
  640, 320, 620, 600, 400, 640, 320, 640, 580, 340, 680, 580, 380, 640, 320, 640, 660, 420,
];

/** Grabación 16-06 — Raíz Petróleo (~115 BPM, ventana 10,6 s → 30 s) */
export const TEASER_FAMILIA_BEAT_CUTS_GRABACION_16: readonly number[] = [
  600, 460, 560, 520, 540, 520, 520, 540, 520, 520, 520, 500, 540, 540, 520, 500, 540, 480, 540,
  520, 540, 520, 560, 540, 440, 520, 520, 480, 560, 480, 640, 400, 500, 620, 400, 520, 660,
];

export const TEASER_FAMILIA_USE_BEAT_SYNC = true;

export function normalizeBeatCutsToTotal(
  cuts: readonly number[],
  totalMs: number,
  minCutMs = 260,
): number[] {
  if (cuts.length === 0 || totalMs <= 0) return [];

  let normalized = cuts.map((ms) => Math.max(minCutMs, ms));
  let diff = totalMs - normalized.reduce((sum, ms) => sum + ms, 0);
  let pass = 0;

  while (diff !== 0 && pass < normalized.length * 40) {
    const idx = diff > 0 ? pass % normalized.length : normalized.length - 1 - (pass % normalized.length);
    const step = diff > 0 ? 20 : -20;
    if (normalized[idx]! + step >= minCutMs) {
      normalized[idx]! += step;
      diff -= step;
    }
    pass++;
  }

  return normalized;
}

export function getTeaserFamiliaBeatCuts(paletteId?: PaletteId): readonly number[] {
  return paletteId === "raiz_petroleo"
    ? TEASER_FAMILIA_BEAT_CUTS_GRABACION_16
    : TEASER_FAMILIA_BEAT_CUTS_BACH;
}

/** @deprecated Usar getTeaserFamiliaBeatCuts(paletteId) */
export const TEASER_FAMILIA_BEAT_CUTS_MS = TEASER_FAMILIA_BEAT_CUTS_BACH;

export function teaserFamiliaMontageMs(photoCount: number, paletteId?: PaletteId): number {
  const cuts = getTeaserFamiliaBeatCuts(paletteId);
  if (!TEASER_FAMILIA_USE_BEAT_SYNC || cuts.length < photoCount) {
    return 0;
  }
  return cuts.slice(0, photoCount).reduce((sum, ms) => sum + ms, 0);
}
