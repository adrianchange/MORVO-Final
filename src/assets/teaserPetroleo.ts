import type { PaletteId } from "../theme/palettes";

/** Opacidad en 0:03 con la curva anterior (50 % pico → fundido) */
function holdOpacityAtSecondThree(): number {
  const x = Math.min(1, Math.max(0, 1000 / 1800));
  const smooth = x * x * (3 - 2 * x);
  return 0.5 * (1 - smooth);
}

export const PETROLEO_DOOR_PORTADA_HOLD_OPACITY = holdOpacityAtSecondThree();
/** Constante desde 0:01 */
export const PETROLEO_DOOR_PORTADA_RAMP_END_MS = 1_000;
/** Portada inicial del teaser (+2 s para ver Compañía / PRESENTA con calma) */
export const PETROLEO_TEASER_COVER_MS = 4_500;
/** MORVO + créditos — cierre corto para liberar montaje */
export const PETROLEO_MORVO_FINAL_MS = 2_800;
/** PortadaMejorada en el arco — desactivada (no convence) */
export const PETROLEO_DOOR_PORTADA_VISIBLE_UNTIL_MS = 0;
/** Solapamiento portada → 1.ª frase (fundido largo, sin corte brusco) */
export const PETROLEO_COVER_TO_TYPEWRITER_FADE_MS = 2_200;
export const PETROLEO_COVER_TO_TYPEWRITER_FADE_START_MS =
  PETROLEO_TEASER_COVER_MS - PETROLEO_COVER_TO_TYPEWRITER_FADE_MS;

export const PETROLEO_DOOR_PORTADA_MIN_OPACITY = PETROLEO_DOOR_PORTADA_HOLD_OPACITY;
export const PETROLEO_DOOR_BLUR_PX = 0;

/** Calibrado en vista embebida (MuestraPortada) — no tocar salvo petición explícita */
export const PETROLEO_DOOR_LAYOUT = {
  widthPct: 16,
  heightPct: 17,
  topPct: 44,
  leftPct: 50,
  topOffsetPx: -3,
  objectPosition: "center 12%",
} as const;

/** Ajuste fino embebida */
export const PETROLEO_DOOR_EMBEDDED_NUDGE = { topPx: -1, leftPx: -1 } as const;
/** Ajuste fino pantalla completa */
export const PETROLEO_DOOR_FULLSCREEN_NUDGE = { topPx: -8, leftPx: -5 } as const;
/** Desplazamiento visual 2 px a la derecha — no modifica la calibración de leftPx */
export const PETROLEO_DOOR_SHIFT_RIGHT_PX = -2;
/** Extra solo pantalla completa (+2 px derecha respecto a embebida) */
export const PETROLEO_DOOR_FULLSCREEN_EXTRA_RIGHT_PX = -2;

export type PetroleoDoorLayout = typeof PETROLEO_DOOR_LAYOUT;

function smoothstep(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

/** 0:00→… — puerta/portada en el arco desactivada */
export function petroleoDoorPortadaOpacity(_elapsedMs: number, paletteId?: PaletteId): number {
  if (paletteId !== "raiz_petroleo") return 0;
  return 0;
}

/** Título Compañía/PRESENTA — funde con el paso a la 1.ª frase */
export function petroleoPresentaTitleOpacity(elapsedMs: number, paletteId?: PaletteId): number {
  if (paletteId !== "raiz_petroleo") return coverPresentaOpacityDefault(elapsedMs);
  if (elapsedMs >= PETROLEO_TEASER_COVER_MS) return 0;
  const fadeStart = PETROLEO_COVER_TO_TYPEWRITER_FADE_START_MS;
  if (elapsedMs <= fadeStart) return 1;
  return 1 - smoothstep((elapsedMs - fadeStart) / PETROLEO_COVER_TO_TYPEWRITER_FADE_MS);
}

function coverPresentaOpacityDefault(elapsedMs: number): number {
  const COVER_TITLE_FADE_START_MS = 5_000 - 900;
  const COVER_TITLE_FADE_END_MS = 5_000 + 400;
  if (elapsedMs < COVER_TITLE_FADE_START_MS) return 1;
  if (elapsedMs >= COVER_TITLE_FADE_END_MS) return 0;
  return 1 - (elapsedMs - COVER_TITLE_FADE_START_MS) / (COVER_TITLE_FADE_END_MS - COVER_TITLE_FADE_START_MS);
}

export function petroleoCoverToTypewriterFadeT(elapsedMs: number, paletteId?: PaletteId): number | null {
  if (paletteId !== "raiz_petroleo") return null;
  const start = PETROLEO_COVER_TO_TYPEWRITER_FADE_START_MS;
  const fadeMs = PETROLEO_COVER_TO_TYPEWRITER_FADE_MS;
  if (elapsedMs <= start) return 0;
  if (elapsedMs >= start + fadeMs) return 1;
  return smoothstep((elapsedMs - start) / fadeMs);
}

export function petroleoIntroPhraseOpacity(elapsedMs: number, paletteId?: PaletteId): number | null {
  if (paletteId !== "raiz_petroleo") return null;
  const start = PETROLEO_COVER_TO_TYPEWRITER_FADE_START_MS;
  const fadeEnd = PETROLEO_TEASER_COVER_MS + 1_800;
  if (elapsedMs < start) return 0;
  if (elapsedMs >= fadeEnd) return 1;
  return smoothstep((elapsedMs - start) / (fadeEnd - start));
}

export function petroleoIntroPhraseLocalMs(elapsedMs: number, paletteId?: PaletteId): number | null {
  if (paletteId !== "raiz_petroleo") return null;
  return Math.max(0, elapsedMs - PETROLEO_COVER_TO_TYPEWRITER_FADE_START_MS - 400);
}

/** Clip tras la 2.ª frase — audio nativo muy bajo */
export const PETROLEO_VICTOR_BOSQUE_VIDEO_URL = "/video/teaser/petroleo/VictorBosque.mp4";
/** ~12 % — el audio del teaser debe dominar */
export const PETROLEO_VICTOR_BOSQUE_VIDEO_VOLUME = 0.12;
/** Si el preload aún no tiene metadata, el clip igual entra al montaje */
export const PETROLEO_VICTOR_BOSQUE_FALLBACK_MS = 6_500;

/** @deprecated Sustituido por MarioElSantoFinal.png en el beat */
export const PETROLEO_MARIO_PSIQUIATRICO_VIDEO_URL = "/video/teaser/petroleo/MarioPsiquiatricoBueno.mp4";
export const PETROLEO_MARIO_PSIQUIATRICO_VIDEO_VOLUME = 0;
export const PETROLEO_MARIO_PSIQUIATRICO_FALLBACK_MS = 3_042;
export const PETROLEO_MARIO_PSIQUIATRICO_OVERLAY_TEXT = "Mario El Santo de los Milagros";
/** Tres líneas — MarioElSantoFinal */
export const PETROLEO_MARIO_PSIQUIATRICO_OVERLAY_LINES = [
  "Mario",
  "El Santo",
  "de los Milagros",
] as const;

/** Clip 2.ª parte — proyecciones Cristian (sin zoom — clip entero) */
export const PETROLEO_CRISTIAN_PROYECCIONES_VIDEO_URL = "/video/teaser/petroleo/CristianProyecciones.mp4";
export const PETROLEO_CRISTIAN_PROYECCIONES_VIDEO_VOLUME = 0.12;
export const PETROLEO_CRISTIAN_PROYECCIONES_FALLBACK_MS = 6_500;
/** Sin zoom — el clip debe verse entero */
export const PETROLEO_CRISTIAN_PROYECCIONES_VIDEO_ZOOM = 1;

type CachedPetroleoClip = {
  /** Object URL del fichero entero en memoria — reproducción instantánea */
  playbackUrl: string;
  durationMs: number;
};

const petroleoClipCache = new Map<string, CachedPetroleoClip>();
/** Últimas duraciones buenas — sobreviven a remounts / Strict Mode */
const petroleoClipLastMs = new Map<string, number>();
const petroleoClipInflight = new Map<string, Promise<number>>();

/** @deprecated Preferir getPetroleoClipPlaybackUrl — ya no se reutiliza el elemento DOM */
export function getCachedPetroleoTeaserClip(_url: string): HTMLVideoElement | null {
  return null;
}

/** URL lista para <video src> (blob si está precargado; si no, path original) */
export function getPetroleoClipPlaybackUrl(url: string): string {
  return petroleoClipCache.get(url)?.playbackUrl ?? url;
}

export function getPetroleoClipDurationMs(url: string, probedMs: number, fallbackMs: number): number {
  if (probedMs > 0) return probedMs;
  const cached = petroleoClipCache.get(url)?.durationMs ?? 0;
  if (cached > 0) return cached;
  const last = petroleoClipLastMs.get(url) ?? 0;
  if (last > 0) return last;
  return fallbackMs;
}

function readVideoDurationMs(video: HTMLVideoElement): number {
  const d = video.duration;
  if (!Number.isFinite(d) || d <= 0) return 0;
  return Math.round(d * 1000);
}

function probeDurationFromUrl(src: string): Promise<number> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    video.playsInline = true;
    let settled = false;
    const done = (ms: number) => {
      if (settled) return;
      settled = true;
      clearTimeout(tid);
      video.removeAttribute("src");
      video.load();
      resolve(ms);
    };
    const tid = window.setTimeout(() => done(readVideoDurationMs(video) || 0), 8_000);
    const tryAccept = () => {
      const ms = readVideoDurationMs(video);
      if (ms > 0) done(ms);
    };
    video.addEventListener("loadedmetadata", tryAccept);
    video.addEventListener("durationchange", tryAccept);
    video.addEventListener("error", () => done(0), { once: true });
    video.src = src;
    video.load();
  });
}

/** Solo metadata (sin blob) — para armar el timeline sin saturar memoria al abrir */
export function probePetroleoClipDuration(url: string): Promise<number> {
  const cached = petroleoClipCache.get(url)?.durationMs ?? 0;
  if (cached > 0) {
    petroleoClipLastMs.set(url, cached);
    return Promise.resolve(cached);
  }
  const last = petroleoClipLastMs.get(url) ?? 0;
  if (last > 0) return Promise.resolve(last);

  return probeDurationFromUrl(url).then((ms) => {
    if (ms > 0) petroleoClipLastMs.set(url, ms);
    return ms;
  });
}

/**
 * Precarga el clip entero en memoria (blob URL).
 * Así cada montaje de <video> arranca con datos locales — no depende de red/buffer a mitad del teaser.
 */
export function preloadPetroleoTeaserClip(url: string): Promise<number> {
  const cached = petroleoClipCache.get(url);
  if (cached && cached.durationMs > 0) {
    petroleoClipLastMs.set(url, cached.durationMs);
    return Promise.resolve(cached.durationMs);
  }

  const inflight = petroleoClipInflight.get(url);
  if (inflight) return inflight;

  const job = (async () => {
    try {
      const res = await fetch(url, { cache: "force-cache" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      if (blob.size < 1_000) throw new Error("blob vacío");

      const playbackUrl = URL.createObjectURL(blob);
      let durationMs = await probeDurationFromUrl(playbackUrl);
      if (durationMs <= 0) durationMs = petroleoClipLastMs.get(url) ?? 0;

      const prev = petroleoClipCache.get(url);
      if (prev?.playbackUrl && prev.playbackUrl !== playbackUrl) {
        try {
          URL.revokeObjectURL(prev.playbackUrl);
        } catch {
          /* */
        }
      }

      if (durationMs > 0) {
        petroleoClipCache.set(url, { playbackUrl, durationMs });
        petroleoClipLastMs.set(url, durationMs);
        return durationMs;
      }

      try {
        URL.revokeObjectURL(playbackUrl);
      } catch {
        /* */
      }
      return petroleoClipLastMs.get(url) ?? 0;
    } catch {
      // Fallback: al menos metadata por URL remota
      const ms = await probeDurationFromUrl(url);
      if (ms > 0) petroleoClipLastMs.set(url, ms);
      return ms > 0 ? ms : petroleoClipLastMs.get(url) ?? 0;
    } finally {
      petroleoClipInflight.delete(url);
    }
  })();

  petroleoClipInflight.set(url, job);
  return job;
}

export function preloadPetroleoVictorBosqueVideo(): Promise<number> {
  return preloadPetroleoTeaserClip(PETROLEO_VICTOR_BOSQUE_VIDEO_URL);
}

export function preloadPetroleoMarioPsiquiatricoVideo(): Promise<number> {
  return preloadPetroleoTeaserClip(PETROLEO_MARIO_PSIQUIATRICO_VIDEO_URL);
}

export function preloadPetroleoCristianProyeccionesVideo(): Promise<number> {
  return preloadPetroleoTeaserClip(PETROLEO_CRISTIAN_PROYECCIONES_VIDEO_URL);
}

export function getCachedPetroleoVictorBosqueVideo(): HTMLVideoElement | null {
  return getCachedPetroleoTeaserClip(PETROLEO_VICTOR_BOSQUE_VIDEO_URL);
}

/** @deprecated Usar preloadPetroleoVictorBosqueVideo */
export function preloadPetroleoBosqueVideo(): Promise<number> {
  return preloadPetroleoVictorBosqueVideo();
}
