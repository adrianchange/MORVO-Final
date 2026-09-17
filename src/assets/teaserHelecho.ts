/** Imágenes locales del teaser — solo paleta Raíz Helecho */
export const TEASER_HELECHO_IMAGES = {
  victorCristo: "/images/teaser/helecho/VictorCristo.jpg",
  cipYears: "/images/teaser/helecho/CipYears.jpg",
  cristianMario: "/images/teaser/helecho/CristianMario.jpg",
  quelocambies: "/images/teaser/helecho/Quelocambies.jpg",
  sinopsis: "/images/petroleo/Sinopsis.jpg",
  marioPrimer2: "/images/teaser/helecho/MarioPrimer2.jpg",
  marioInvertido: "/images/teaser/helecho/MarioInvertido.jpg",
  mascarasInvertidas: "/images/teaser/helecho/MascarasInvertidas.jpg",
  victorInvertida: "/images/teaser/helecho/VictorInvertida.jpg",
} as const;

const AMIR_HORSE = "/images/teaser/nuevas/amir-maleky-JYgoITTxgNg-unsplash.jpg";
const AMIR_RINGS = "/images/teaser/nuevas/amir-maleky-s0Qdp5g_OJ4-unsplash.jpg";
const WOLVES_IMG = "photo-1518504361720-82ccdc540022";
const IGOR_BANDAGED = "/images/teaser/nuevas/igor-rand-vYFfSPfdsWE-unsplash.jpg";
const SEUNG_UPSIDE = "/images/teaser/nuevas/seungwon-park-ntbjVxhffmo-unsplash.jpg";
const SURGICAL_INSTRUMENTS = "/images/teaser/nuevas/annie-spratt-ADhy6hS4sIs-unsplash.jpg";
const ANNIE_THREE_KIDS = "/images/teaser/nuevas/annie-spratt-nG7vuM7SBm8-unsplash.jpg";
const DEFAULT_FIRST_AFTER_INTRO = "/images/teaser/nuevas/sergey-vinogradov-VjcUuHNidgo-unsplash.jpg";
const DIRECTOR_PHOTO_ID = "1736507020688";
const VIDAR_SUNBATH = "/images/teaser/nuevas/vidar-nordli-mathisen-f4OmS_SluJc-unsplash.jpg";
/** Foto stock del slide personaje Víctor (no petróleo) */
const VICTOR_ACTOR_STOCK = "photo-1724380597255-944485791d3d";
const BALLOONS_LAST = "/images/teaser/nuevas/alex-shuper-Zj4O7gGT-uw-unsplash.jpg";

export const HELECHO_BALLOONS_URL = BALLOONS_LAST;
export const HELECHO_BALLOONS_TO_MORVO_CROSSFADE_MS = 2_800;
export const HELECHO_BALLOONS_DURATION_BOOST_FACTOR = 8;
export const HELECHO_INTRO_TO_FAMILY_CROSSFADE_MS = 1_000;

export function isHelechoBalloonsUrl(url?: string): boolean {
  return url != null && (url === BALLOONS_LAST || url.includes("alex-shuper-Zj4O7gGT-uw"));
}

export function isHelechoMarioInvertidoUrl(url?: string): boolean {
  return (
    url != null &&
    (url === TEASER_HELECHO_IMAGES.marioInvertido || url.includes("MarioInvertido"))
  );
}

function movePhotoToEnd(pool: string[], match: string): string[] {
  const idx = pool.findIndex((url) => url === match || url.includes(match.split("/").pop()!));
  if (idx < 0) return pool;
  const [photo] = pool.splice(idx, 1);
  return [...pool, photo!];
}

/** Fotos excluidas del montaje Helecho (teaser) */
function isHelechoExcludedFromMontage(url: string): boolean {
  return (
    url.includes(VICTOR_ACTOR_STOCK) ||
    url === VIDAR_SUNBATH ||
    url.includes("vidar-nordli-mathisen-f4OmS_SluJc")
  );
}

function filterHelechoMontage(urls: string[]): string[] {
  return urls.filter((url) => !isHelechoExcludedFromMontage(url));
}

/** Tramo familia (después de «Una vez nos contaron…») — solo Helecho */
export function applyHelechoFamilyMontage(pool: string[]): string[] {
  const withoutKids = pool.filter(
    (url) => url !== ANNIE_THREE_KIDS && !url.includes("annie-spratt-nG7vuM7SBm8"),
  );

  const rest = withoutKids.filter(
    (url) =>
      url !== DEFAULT_FIRST_AFTER_INTRO &&
      !url.includes("sergey-vinogradov-VjcUuHNidgo") &&
      url !== TEASER_HELECHO_IMAGES.marioInvertido,
  );

  return filterHelechoMontage([TEASER_HELECHO_IMAGES.marioInvertido, ...rest]);
}

/** 2.ª parte del teaser — sustituciones y orden propios de Helecho */
export function applyHelechoRestMontage(pool: string[]): string[] {
  let urls = pool.filter((url) => !url.includes(DIRECTOR_PHOTO_ID));

  urls = urls.map((url) => {
    if (url === SURGICAL_INSTRUMENTS || url.includes("annie-spratt-ADhy6hS4sIs")) {
      return TEASER_HELECHO_IMAGES.marioPrimer2;
    }
    if (url === AMIR_RINGS || url.includes("amir-maleky-s0Qdp5g_OJ4")) {
      return TEASER_HELECHO_IMAGES.victorInvertida;
    }
    if (url.includes(WOLVES_IMG)) {
      return TEASER_HELECHO_IMAGES.mascarasInvertidas;
    }
    if (url === AMIR_HORSE || url.includes("amir-maleky-JYgoITTxgNg")) {
      return TEASER_HELECHO_IMAGES.victorCristo;
    }
    if (url === SEUNG_UPSIDE || url.includes("seungwon-park-ntbjVxhffmo")) {
      return TEASER_HELECHO_IMAGES.sinopsis;
    }
    return url;
  });

  const igorIdx = urls.findIndex(
    (url) => url === IGOR_BANDAGED || url.includes("igor-rand-vYFfSPfdsWE"),
  );
  if (igorIdx > 0) {
    urls[igorIdx - 1] = TEASER_HELECHO_IMAGES.cipYears;
    urls.splice(igorIdx - 1, 0, TEASER_HELECHO_IMAGES.cristianMario);
  }

  return movePhotoToEnd(
    filterHelechoMontage([TEASER_HELECHO_IMAGES.quelocambies, ...urls]),
    BALLOONS_LAST,
  );
}

export const TEASER_HELECHO_EXTRA_URLS = Object.values(TEASER_HELECHO_IMAGES);

/** Fotos con el doble de tiempo en pantalla (Helecho) */
export const HELECHO_DURATION_BOOST_URLS: readonly string[] = [
  TEASER_HELECHO_IMAGES.marioInvertido,
  TEASER_HELECHO_IMAGES.quelocambies,
  TEASER_HELECHO_IMAGES.cipYears,
];

export const HELECHO_REST_DURATION_BOOST_URLS: readonly string[] = [
  TEASER_HELECHO_IMAGES.quelocambies,
  TEASER_HELECHO_IMAGES.cipYears,
];

export const HELECHO_FAMILY_DURATION_BOOST_URLS: readonly string[] = [
  TEASER_HELECHO_IMAGES.marioInvertido,
];

export const HELECHO_DURATION_BOOST_FACTOR = 2;

/** Duplica duración de fotos clave y compensa en el resto (misma duración total) */
export function applyHelechoDurationBoosts(
  pool: readonly string[],
  cuts: readonly number[],
  boostUrls: readonly string[] = HELECHO_DURATION_BOOST_URLS,
  factor = HELECHO_DURATION_BOOST_FACTOR,
  minCutMs = 260,
): number[] {
  if (pool.length !== cuts.length || pool.length === 0) return [...cuts];

  const boostSet = new Set(boostUrls);
  const total = cuts.reduce((sum, ms) => sum + ms, 0);
  const next = cuts.map((ms, i) => (boostSet.has(pool[i]!) ? ms * factor : ms));

  let surplus = next.reduce((sum, ms) => sum + ms, 0) - total;
  if (surplus <= 0) return next;

  const donorIdx = pool
    .map((url, i) => ({ i, boosted: boostSet.has(url), ms: next[i]! }))
    .filter((d) => !d.boosted && d.ms > minCutMs)
    .sort((a, b) => b.ms - a.ms);

  let guard = 0;
  while (surplus > 0 && donorIdx.length > 0 && guard < 5000) {
    guard++;
    for (const d of donorIdx) {
      if (surplus <= 0) break;
      const take = Math.min(20, next[d.i]! - minCutMs, surplus);
      if (take <= 0) continue;
      next[d.i]! -= take;
      surplus -= take;
    }
    if (donorIdx.every((d) => next[d.i]! <= minCutMs)) break;
  }

  return next;
}

/** Montaje más lento + crescendo (cortes largos al inicio, más rápidos al final) */
export const HELECHO_CRESCENDO_STRENGTH = 0.45;
export const HELECHO_FAMILY_CRESCENDO_STRENGTH = 0.35;
export const HELECHO_MORVO_FINAL_MS = 2_000;
export const HELECHO_SYNTH_FILL_MS = 380;
export const HELECHO_OVERLAY_HOLD_MS = 550;

export function isHelechoTeaserPalette(paletteId?: string): boolean {
  return paletteId === "raiz_helecho";
}

/** Duraciones en crescendo que suman exactamente totalMs */
export function buildHelechoCrescendoCuts(
  photoCount: number,
  totalMs: number,
  strength: number,
  minCutMs = 260,
): number[] {
  if (photoCount <= 0 || totalMs <= 0) return [];

  const weights = Array.from({ length: photoCount }, (_, i) => {
    const t = photoCount === 1 ? 0.5 : i / (photoCount - 1);
    return 1 + strength * (1 - 2 * t);
  });
  const sumW = weights.reduce((a, b) => a + b, 0);

  let cuts = weights.map((w) => Math.max(minCutMs, Math.round((w / sumW) * totalMs)));

  let diff = totalMs - cuts.reduce((a, b) => a + b, 0);
  let pass = 0;
  while (diff !== 0 && pass < photoCount * 40) {
    const idx = diff > 0 ? pass % photoCount : (photoCount - 1 - (pass % photoCount));
    const step = diff > 0 ? 20 : -20;
    if (cuts[idx]! + step >= minCutMs) {
      cuts[idx]! += step;
      diff -= step;
    }
    pass++;
  }

  return cuts;
}

/** Reorganiza cortes existentes (p. ej. beat sync) con perfil crescendo */
export function applyHelechoCrescendoToCuts(
  cuts: readonly number[],
  strength: number,
  minCutMs = 260,
): number[] {
  const total = cuts.reduce((sum, ms) => sum + ms, 0);
  return buildHelechoCrescendoCuts(cuts.length, total, strength, minCutMs);
}

export type HelechoTeaserTiming = {
  synthMiddleMs: number;
  morvoFinalMs: number;
  restMontageMs: number;
  familyCrescendo: boolean;
  restCrescendo: boolean;
};

export function getHelechoTeaserTiming(
  teaserCoverMs: number,
  introTypewriterMs: number,
  familyMontageMs: number,
  overlayRevealMs: number,
  defaultSynthMiddleMs: number,
  defaultMorvoFinalMs: number,
  targetTotalMs: number,
  paletteId?: string,
): HelechoTeaserTiming {
  if (!isHelechoTeaserPalette(paletteId)) {
    const fixedBeforeRest =
      teaserCoverMs + introTypewriterMs + familyMontageMs + defaultSynthMiddleMs + defaultMorvoFinalMs;
    return {
      synthMiddleMs: defaultSynthMiddleMs,
      morvoFinalMs: defaultMorvoFinalMs,
      restMontageMs: targetTotalMs - fixedBeforeRest,
      familyCrescendo: false,
      restCrescendo: false,
    };
  }

  const synthMiddleMs = overlayRevealMs + HELECHO_OVERLAY_HOLD_MS + HELECHO_SYNTH_FILL_MS;
  const morvoFinalMs = HELECHO_MORVO_FINAL_MS;
  const fixedBeforeRest = teaserCoverMs + introTypewriterMs + familyMontageMs + synthMiddleMs + morvoFinalMs;

  return {
    synthMiddleMs,
    morvoFinalMs,
    restMontageMs: targetTotalMs - fixedBeforeRest,
    familyCrescendo: true,
    restCrescendo: true,
  };
}
