import type { PaletteId } from "../theme/palettes";

export type TeaserAudioPresetId =
  | "legacy-dual"
  | "grabacion-2026-06-12"
  | "grabacion-14-06-2026-full"
  | "grabacion-16-06-2026-full"
  | "ravel"
  | "siglocatorce"
  | "bach";

export type TeaserAudioPreset = {
  id: TeaserAudioPresetId;
  label: string;
  mode: "single" | "single-continuous" | "dual-with-synth";
  tracks: readonly [string] | readonly [string, string];
  /** 2.ª pista solo en `grabacion-2026-06-12` (tramo intermedio) */
  middleTrack?: string;
};

/** Audio intermedio del preset dual (grabación + intermedio) */
export const TEASER_MIDDLE_TRACK = "/audio/teaser-middle-13-06-2026.m4a";

export const TEASER_AUDIO_PRESETS: Record<TeaserAudioPresetId, TeaserAudioPreset> = {
  "legacy-dual": {
    id: "legacy-dual",
    label: "TeaserMusic1 + pitido + TeaserMusic2",
    mode: "dual-with-synth",
    tracks: ["/audio/TeaserMusic1.m4a", "/audio/TeaserMusic2.m4a"],
  },
  /** Setup que os gusta: grabación larga + audio intermedio (~15 s) */
  "grabacion-2026-06-12": {
    id: "grabacion-2026-06-12",
    label: "Grabación 12-06 + intermedio 13-06",
    mode: "single",
    tracks: ["/audio/teaser-grabacion-12-06-2026.m4a"],
    middleTrack: TEASER_MIDDLE_TRACK,
  },
  /** Prueba: un solo archivo ~61 s (sustituye a los dos anteriores) */
  "grabacion-14-06-2026-full": {
    id: "grabacion-14-06-2026-full",
    label: "Grabación completa 14-06-2026 (~61 s)",
    mode: "single-continuous",
    tracks: ["/audio/teaser-grabacion-14-06-2026.m4a"],
  },
  /** Grabación 16-06 (13:18) recortada a 60 s */
  "grabacion-16-06-2026-full": {
    id: "grabacion-16-06-2026-full",
    label: "Grabación 16-06-2026 13:57 (60 s)",
    mode: "single-continuous",
    tracks: ["/audio/teaser-grabacion-16-06-2026.m4a"],
  },
  /** RavelAudio recortado a 60 s (fade final 3 s) */
  ravel: {
    id: "ravel",
    label: "RavelAudio (60 s)",
    mode: "single-continuous",
    tracks: ["/audio/teaser-ravel-60s.m4a"],
  },
  /** Siglocatorce — Descargas */
  siglocatorce: {
    id: "siglocatorce",
    label: "Siglocatorce",
    mode: "single-continuous",
    tracks: ["/audio/teaser-siglocatorce.m4a"],
  },
  /** Bach — Descargas */
  bach: {
    id: "bach",
    label: "Bach",
    mode: "single-continuous",
    tracks: ["/audio/teaser-bach.m4a"],
  },
};

/**
 * Preset activo (default cuando la paleta no tiene override).
 */
export const ACTIVE_TEASER_AUDIO_ID: TeaserAudioPresetId = "bach";

/** Audio por paleta del teaser */
const TEASER_AUDIO_BY_PALETTE: Partial<Record<PaletteId, TeaserAudioPresetId>> = {
  /** Ravel 60 s — montaje y audio cierran juntos */
  raiz_petroleo: "ravel",
  /** Misma grabación que tenía Petróleo */
  raiz_helecho: "grabacion-16-06-2026-full",
};

export function getTeaserAudioPresetId(paletteId?: PaletteId): TeaserAudioPresetId {
  return (paletteId && TEASER_AUDIO_BY_PALETTE[paletteId]) ?? ACTIVE_TEASER_AUDIO_ID;
}

export function getTeaserAudioForPalette(paletteId?: PaletteId): TeaserAudioPreset {
  return TEASER_AUDIO_PRESETS[getTeaserAudioPresetId(paletteId)];
}

export const ACTIVE_TEASER_AUDIO = TEASER_AUDIO_PRESETS[ACTIVE_TEASER_AUDIO_ID];

export const TEASER_USES_SYNTH_MIDDLE = ACTIVE_TEASER_AUDIO.mode === "dual-with-synth";
