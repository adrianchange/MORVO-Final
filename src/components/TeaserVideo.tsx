import { useEffect, useLayoutEffect, useRef, useState, useCallback, useMemo, type CSSProperties } from "react";
import { motion } from "framer-motion";
import {
  buildTeaserRestImages,
  filterPetroleoTeaserUrls,
  getTeaserFamiliaUrls,
} from "../assets/stockImages";
import type { PaletteId } from "../theme/palettes";
import {
  applyHelechoCrescendoToCuts,
  applyHelechoDurationBoosts,
  applyHelechoFamilyMontage,
  applyHelechoRestMontage,
  buildHelechoCrescendoCuts,
  getHelechoTeaserTiming,
  HELECHO_CRESCENDO_STRENGTH,
  HELECHO_DURATION_BOOST_FACTOR,
  HELECHO_FAMILY_CRESCENDO_STRENGTH,
  HELECHO_FAMILY_DURATION_BOOST_URLS,
  HELECHO_BALLOONS_TO_MORVO_CROSSFADE_MS,
  HELECHO_BALLOONS_DURATION_BOOST_FACTOR,
  HELECHO_BALLOONS_URL,
  HELECHO_INTRO_TO_FAMILY_CROSSFADE_MS,
  HELECHO_REST_DURATION_BOOST_URLS,
  isHelechoBalloonsUrl,
  TEASER_HELECHO_EXTRA_URLS,
} from "../assets/teaserHelecho";

import {
  petroleoCoverToTypewriterFadeT,
  petroleoIntroPhraseLocalMs,
  petroleoIntroPhraseOpacity,
  petroleoPresentaTitleOpacity,
  PETROLEO_TEASER_COVER_MS,
  PETROLEO_MORVO_FINAL_MS,
  PETROLEO_COVER_TO_TYPEWRITER_FADE_START_MS,
  getPetroleoClipDurationMs,
  getPetroleoClipPlaybackUrl,
  preloadPetroleoTeaserClip,
  probePetroleoClipDuration,
} from "../assets/teaserPetroleo";
import {
  PETROLEO_BEAT_SEQUENCE,
  PETROLEO_BEAT_SEQUENCE_PART2,
  PETROLEO_BEAT_STILL_MS,
  PETROLEO_TEASER_AUDIO_TARGET_MS,
  petroleoBeatImageUrls,
  petroleoBeatVideoUrls,
  type PetroleoBeat,
} from "../assets/teaserPetroleoBeat";
import { PETROLEO_PHOTOS } from "../assets/petroleoPhotos";
import { MorvoTeaserTitleHeadline, ESMERALDA_SALMON, TEASER_CREDIT_DARK_BLUE, TEASER_CREDIT_MATCH_RED, TEASER_CREDIT_MATCH_RED_DARK } from "./MorvoTeaserTitle";
import { useIsMobile } from "../hooks/useIsMobile";
import {
  getTeaserFamiliaBeatCuts,
  normalizeBeatCutsToTotal,
  TEASER_FAMILIA_USE_BEAT_SYNC,
} from "../assets/teaserFamiliaBeatCuts";
import { getTeaserAudioForPalette, type TeaserAudioPreset } from "../assets/teaserAudio";

const SEQUOIA_IMG = "https://images.unsplash.com/photo-1758010408745-351cc25037c5?w=1600&h=900&fit=crop&auto=format";
const MASK_HORSE_SHOP = "https://images.unsplash.com/photo-1516944486937-aca8e1c5cfce?w=800&h=450&fit=crop&auto=format";
const MASK_CREEPY = "https://images.unsplash.com/photo-1724380597255-944485791d3d?w=800&h=450&fit=crop&auto=format";
const WOLVES_IMG = "https://images.unsplash.com/photo-1518504361720-82ccdc540022?w=800&h=450&fit=crop&auto=format";
const MORVO_FINAL_BG = "/images/teaser/morvo-final-paris-bilal.png";
const TEASER_COVER_BG = "/images/teaser/teaser-cover-paris-bilal-arches.jpg";
const TEASER_TYPEWRITER_BG = "/images/teaser/teaser-cover-mainak-bose.jpg";
const TYPEWRITER_TEXT_COLOR = "#F2EBE0";
const TYPEWRITER_ACCENT_COLOR = "#E85D4C";
const TEASER_COVER_LINE_TOP = "Compañía OBSCENA TEATRAL";
const TEASER_COVER_LINE_BOTTOM = "PRESENTA";
/** 2.ª frase empieza aquí (s) */
const SECOND_PHRASE_START_MS = 30_000;
/** Portada con crédito de producción */
const TEASER_COVER_MS = 5_000;

/** Sin foto de la directora (MASK_HORNS) — queda solo en su diapositiva del dossier */
const DEFAULT_EXTRA_TEASER_IMAGES = [SEQUOIA_IMG, MASK_HORSE_SHOP, MASK_CREEPY, WOLVES_IMG];
/** Helecho: sin foto directora ni máscara creepy */
const HELECHO_EXTRA_TEASER_IMAGES = [SEQUOIA_IMG, MASK_HORSE_SHOP, WOLVES_IMG];
const FAMILY_MONTAGE_ELENA_MUSHROOM =
  "/images/teaser/nuevas/elena-mozhvilo-hmcF-Lx9jig-unsplash.jpg";
const FAMILY_MONTAGE_LIANA_HAND = "/images/teaser/nuevas/liana-s-JsXDxr4eI0Y-unsplash.jpg";
const FAMILY_MONTAGE_FIRST_AFTER_INTRO =
  "/images/teaser/nuevas/sergey-vinogradov-VjcUuHNidgo-unsplash.jpg";

function buildTeaserRestImagesForPalette(paletteId?: PaletteId): string[] {
  const extra =
    paletteId === "raiz_helecho" ? HELECHO_EXTRA_TEASER_IMAGES : DEFAULT_EXTRA_TEASER_IMAGES;
  const base = filterPetroleoTeaserUrls(buildTeaserRestImages(extra), paletteId);
  if (paletteId === "raiz_helecho") return applyHelechoRestMontage(base);
  if (paletteId === "raiz_petroleo") return petroleoBeatImageUrls();
  return base;
}

function buildAllTeaserImages(paletteId?: PaletteId): string[] {
  if (paletteId === "raiz_petroleo") {
    // Solo assets del beat petróleo — no familia/rest (ahorra decode + memoria en móvil)
    return [
      PETROLEO_PHOTOS.portada,
      TEASER_COVER_BG,
      TEASER_TYPEWRITER_BG,
      MORVO_FINAL_BG,
      ...petroleoBeatImageUrls(),
    ];
  }
  const rest = buildTeaserRestImagesForPalette(paletteId);
  return [
    ...getTeaserFamiliaUrls(paletteId),
    FAMILY_MONTAGE_ELENA_MUSHROOM,
    FAMILY_MONTAGE_LIANA_HAND,
    ...rest,
    TEASER_COVER_BG,
    TEASER_TYPEWRITER_BG,
    MORVO_FINAL_BG,
    ...(paletteId === "raiz_helecho" ? TEASER_HELECHO_EXTRA_URLS : []),
  ];
}

const SALMON = "#FA8072";
const BLACK = "#000000";
const WHITE = "#FFFFFF";
const RED = "#CC0000";

const TYPEWRITER_TEXT = "UNA VEZ NOS CONTARON UN CUENTO...";
const SYNTH_OVERLAY_TEXT = "Hoy te han traído aquí para que lo cambies";
const INTRO_REVEAL_MS = 4_800;
const INTRO_HOLD_MS = 800;
const INTRO_TYPEWRITER_MS = INTRO_REVEAL_MS + INTRO_HOLD_MS;
const OVERLAY_REVEAL_MS = 4_000;
const OVERLAY_HOLD_MS = 800;
/** Tras la 2.ª frase — pitido / relleno (recortado para fundido de textos portada → 1.ª frase) */
const SYNTH_FILL_MS = 1_000;
const SYNTH_MIDDLE_MS = OVERLAY_REVEAL_MS + OVERLAY_HOLD_MS + SYNTH_FILL_MS;
const OVERLAY_TEXT_MS = OVERLAY_REVEAL_MS + OVERLAY_HOLD_MS;
const AUDIO_BRIDGE_FADE_MS = 900;
/** Segundo de pared en el que empieza a oírse el audio */
const AUDIO_WALL_START_MS = 1_000;
/** Salta los primeros N ms del archivo de audio al reproducir */
const AUDIO_START_TRIM_MS = 1_000;
/** Fade de cierre — largo y suave (Ravel / créditos); curva ease en teaserEndVolume */
const AUDIO_END_FADE_MS = 8_500;
/** MORVO + créditos de reparto — cierre del teaser */
const MORVO_FINAL_MS = 5_000;

const TEASER_CAST = [
  { character: "Mario", actorLines: ["Javier", "Estévez"] as const },
  { character: "Víctor", actorLines: ["Adrian", "Popovici"] as const },
  { character: "Cristian", actorLines: ["Ciprian", "Gheorghe"] as const },
] as const;

/** Duración objetivo del teaser */
const TARGET_TOTAL_MS = 60_000;

/** Tramo 1: portada + 1.ª frase + montaje familia → 2.ª frase a los 30 s */
const FAMILY_MONTAGE_MS = SECOND_PHRASE_START_MS - TEASER_COVER_MS - INTRO_TYPEWRITER_MS;

function teaserCoverMs(paletteId?: PaletteId): number {
  return paletteId === "raiz_petroleo" ? PETROLEO_TEASER_COVER_MS : TEASER_COVER_MS;
}

function teaserMorvoFinalMs(paletteId?: PaletteId): number {
  return paletteId === "raiz_petroleo" ? PETROLEO_MORVO_FINAL_MS : MORVO_FINAL_MS;
}

function familyMontageMsFor(paletteId?: PaletteId): number {
  return SECOND_PHRASE_START_MS - teaserCoverMs(paletteId) - INTRO_TYPEWRITER_MS;
}

const FIXED_BEFORE_REST_MS =
  TEASER_COVER_MS + INTRO_TYPEWRITER_MS + FAMILY_MONTAGE_MS + SYNTH_MIDDLE_MS + MORVO_FINAL_MS;
const REST_MONTAGE_MS = TARGET_TOTAL_MS - FIXED_BEFORE_REST_MS;

const TOTAL_TEASER_MS = TARGET_TOTAL_MS;

const MUSIC1_SECTION_MS = INTRO_TYPEWRITER_MS + FAMILY_MONTAGE_MS;
const MUSIC1_SECTION_WALL_MS = TEASER_COVER_MS + MUSIC1_SECTION_MS;
const MUSIC2_START_WALL_MS = MUSIC1_SECTION_WALL_MS + SYNTH_MIDDLE_MS;
const MUSIC2_SECTION_MS = REST_MONTAGE_MS;
const AUDIO_WALL_START_SEC = AUDIO_WALL_START_MS / 1000;

function teaserContentSec(elapsedSec: number): number {
  return Math.max(0, elapsedSec - AUDIO_WALL_START_SEC);
}

function teaserEndVolume(elapsedSec: number, teaserEndSec: number, baseVolume: number): number {
  const fadeSec = AUDIO_END_FADE_MS / 1000;
  const fadeStart = teaserEndSec - fadeSec;
  if (elapsedSec <= fadeStart) return baseVolume;
  if (elapsedSec >= teaserEndSec) return 0;
  const t = Math.min(1, Math.max(0, (elapsedSec - fadeStart) / fadeSec));
  // smoothstep: baja despacio al principio y termina en silencio sin corte seco
  const eased = t * t * (3 - 2 * t);
  return baseVolume * (1 - eased);
}

type ImageFit = "cover" | "contain";

type Frame = {
  duration: number;
  bg?: string;
  bgImg?: string;
  bgVideo?: string;
  videoVolume?: number;
  /** Zoom visual del clip (1 = sin zoom) */
  videoZoom?: number;
  morvo?: boolean;
  presenta?: boolean;
  typewriter?: boolean;
  overlayText?: string;
  /** Título fijo a pantalla completa sobre el clip (no typewriter) */
  videoTitle?: string;
  /** Líneas del título (p. ej. Mario — abajo, 3 renglones) */
  videoTitleLines?: readonly string[];
  /** Escala relativa por línea del título */
  videoTitleLineScales?: readonly number[];
  /** Ancla vertical del título sobre el beat */
  videoTitleAnchor?: "bottom" | "top";
  /** Desplazamiento vertical del título en px (negativo = hacia arriba) */
  videoTitleOffsetY?: number;
  /** Fondo cover detrás del frente (foto o vídeo contain) */
  layerBackImg?: string;
  /** Zoom extra del fondo (1 = cover normal) */
  layerBackZoom?: number;
  fit?: ImageFit;
  /** Foto anterior a cover de fondo + actual a contain — solo 2.ª parte */
  layered?: boolean;
};

/** Reparte el tiempo entre todas las imágenes del pool, cada una una sola vez */
function buildUniqueMontage(
  pool: string[],
  totalMs: number,
  fit: ImageFit,
  layered = false,
): Frame[] {
  if (totalMs <= 0 || pool.length === 0) return [];

  const base = Math.floor(totalMs / pool.length);
  const extra = totalMs % pool.length;

  return pool.map((url, i) => ({
    duration: base + (i < extra ? 1 : 0),
    bgImg: url,
    fit,
    layered,
  }));
}

/** Montaje familia con duraciones fijas (p. ej. al ritmo del audio) */
function buildTimedMontage(
  pool: string[],
  cutMs: readonly number[],
  fit: ImageFit,
  layered = false,
): Frame[] {
  const n = Math.min(pool.length, cutMs.length);
  return pool.slice(0, n).map((url, i) => ({
    duration: cutMs[i],
    bgImg: url,
    fit,
    layered,
  }));
}

const FAMILY_MONTAGE_START_MS = TEASER_COVER_MS + INTRO_TYPEWRITER_MS;
/** Fundido portada → 1.ª frase */
const COVER_TO_TYPEWRITER_FADE_MS = 1_200;
const COVER_TO_TYPEWRITER_FADE_START_MS = TEASER_COVER_MS - COVER_TO_TYPEWRITER_FADE_MS;

function coverToTypewriterFadeT(elapsedMs: number, paletteId?: PaletteId): number {
  const petroleo = petroleoCoverToTypewriterFadeT(elapsedMs, paletteId);
  if (petroleo !== null) return petroleo;
  if (elapsedMs <= COVER_TO_TYPEWRITER_FADE_START_MS) return 0;
  if (elapsedMs >= TEASER_COVER_MS) return 1;
  return (elapsedMs - COVER_TO_TYPEWRITER_FADE_START_MS) / COVER_TO_TYPEWRITER_FADE_MS;
}

function smoothstep(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

function balloonsToMorvoCrossfadeT(
  frame: Frame | undefined,
  nextFrame: Frame | undefined,
  frameLocalMs: number,
  paletteId?: PaletteId,
): number {
  if (paletteId !== "raiz_helecho" || !isHelechoBalloonsUrl(frame?.bgImg) || !nextFrame?.morvo) {
    return 0;
  }
  const fadeMs = HELECHO_BALLOONS_TO_MORVO_CROSSFADE_MS;
  const start = Math.max(0, (frame?.duration ?? 0) - fadeMs);
  if (frameLocalMs <= start) return 0;
  const t = (frameLocalMs - start) / fadeMs;
  return smoothstep(smoothstep(t));
}

/** Globos (contain) → créditos (cover): expansión gradual hasta pantalla completa */
function balloonsToMorvoTransition(t: number): {
  balloonsOpacity: number;
  morvoOpacity: number;
  morvoGrow: number;
  titleOpacity: number;
} {
  if (t <= 0) {
    return { balloonsOpacity: 1, morvoOpacity: 0, morvoGrow: 0, titleOpacity: 0 };
  }
  if (t >= 1) {
    return { balloonsOpacity: 0, morvoOpacity: 1, morvoGrow: 1, titleOpacity: 1 };
  }

  const morvoGrow = smoothstep(Math.max(0, (t - 0.06) / 0.94));
  const morvoOpacity = smoothstep(Math.max(0, (t - 0.1) / 0.9));
  const balloonsOpacity = 1 - smoothstep(Math.min(1, t * 1.15));
  const titleOpacity = t <= 0.42 ? 0 : smoothstep((t - 0.42) / 0.58);

  return { balloonsOpacity, morvoOpacity, morvoGrow, titleOpacity };
}

/** Entremezcla 1.ª frase → primera foto familia (Helecho / Petróleo) */
function introFamilyMixT(elapsedMs: number, paletteId?: PaletteId): number {
  const fadeMs = paletteId === "raiz_helecho" ? HELECHO_INTRO_TO_FAMILY_CROSSFADE_MS : 0;
  if (fadeMs <= 0) return 0;
  const mixStart = TEASER_COVER_MS + INTRO_TYPEWRITER_MS - fadeMs;
  const mixEnd = TEASER_COVER_MS + INTRO_TYPEWRITER_MS;
  if (elapsedMs <= mixStart) return 0;
  if (elapsedMs >= mixEnd) return 1;
  return smoothstep((elapsedMs - mixStart) / fadeMs);
}

/** Texto visible un poco más que el fondo durante la entremezcla */
function introFamilyTextOpacity(mixT: number): number {
  if (mixT <= 0) return 1;
  if (mixT >= 1) return 0;
  return 1 - smoothstep(mixT);
}

function markIntroFamilyFirstFrameLayered(frames: Frame[], paletteId?: PaletteId): Frame[] {
  if (paletteId !== "raiz_helecho") {
    return frames;
  }
  return frames.map((f, i) => (i === 0 ? { ...f, layered: true } : f));
}

function firstFamilyPhotoUrl(frames: Frame[]): string | null {
  const photo = frames.find(
    (f) => f.bgImg && !f.bgVideo && !f.typewriter && !f.presenta && !f.overlayText && !f.morvo,
  );
  return photo?.bgImg ?? null;
}

const crossfadeGpuLayerStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  willChange: "opacity",
  WebkitBackfaceVisibility: "hidden",
  backfaceVisibility: "hidden",
  transform: "translateZ(0)",
};

const TEASER_VIEWPORT_ASPECT = 16 / 9;

/** Embebida: llena el contenedor. Fullscreen portada (solo desktop): proporción embebida. Móvil/montaje: 100 % pantalla. */
function teaserViewportStyle(
  isFullscreen: boolean,
  embeddedAspect: number,
  portadaLayout: boolean,
): CSSProperties {
  if (!isFullscreen || !portadaLayout) {
    return {
      position: "absolute",
      inset: 0,
      overflow: "hidden",
      containerType: "size",
    };
  }
  const screenAspect =
    typeof window !== "undefined" ? window.innerWidth / window.innerHeight : embeddedAspect;
  if (embeddedAspect > screenAspect) {
    return {
      position: "absolute",
      left: "50%",
      top: 0,
      height: "100vh",
      width: `calc(100vh * ${embeddedAspect})`,
      transform: "translateX(-50%)",
      overflow: "hidden",
      containerType: "size",
    };
  }
  return {
    position: "absolute",
    left: 0,
    top: "50%",
    width: "100vw",
    height: `calc(100vw / ${embeddedAspect})`,
    transform: "translateY(-50%)",
    overflow: "hidden",
    containerType: "size",
  };
}

/** Cuánto recorta el layout de portada fullscreen arriba/abajo (para no perder «Compañía / PRESENTA»). */
function teaserPortadaFullscreenCropY(
  isFullscreen: boolean,
  embeddedAspect: number,
  portadaLayout: boolean,
): number {
  if (!isFullscreen || !portadaLayout || typeof window === "undefined") return 0;
  const screenAspect = window.innerWidth / window.innerHeight;
  if (embeddedAspect > screenAspect) return 0;
  const viewportH = window.innerWidth / embeddedAspect;
  return Math.max(0, (viewportH - window.innerHeight) / 2);
}

/** Fundido textos portada → 1.ª frase (solapado, en ms de pared) */
const INTRO_PHRASE_FADE_IN_MS = 1_400;
const INTRO_PHRASE_DELAY_MS = 550;

function coverPresentaOpacity(elapsedMs: number, paletteId?: PaletteId): number {
  return petroleoPresentaTitleOpacity(elapsedMs, paletteId);
}

function introPhraseOpacity(elapsedMs: number, paletteId?: PaletteId): number {
  const petroleo = petroleoIntroPhraseOpacity(elapsedMs, paletteId);
  if (petroleo !== null) return petroleo;
  if (elapsedMs < TEASER_COVER_MS) return 0;
  const end = TEASER_COVER_MS + INTRO_PHRASE_FADE_IN_MS;
  if (elapsedMs >= end) return 1;
  return (elapsedMs - TEASER_COVER_MS) / INTRO_PHRASE_FADE_IN_MS;
}

function teaserPhraseFadeOpacity(localMs: number): number {
  if (localMs >= INTRO_PHRASE_FADE_IN_MS) return 1;
  return localMs / INTRO_PHRASE_FADE_IN_MS;
}

function teaserPhraseRevealLocalMs(localMs: number): number {
  return Math.max(0, localMs - INTRO_PHRASE_DELAY_MS);
}

function introPhraseLocalMs(elapsedMs: number, paletteId?: PaletteId): number {
  const petroleo = petroleoIntroPhraseLocalMs(elapsedMs, paletteId);
  if (petroleo !== null) return petroleo;
  return teaserPhraseRevealLocalMs(Math.max(0, elapsedMs - TEASER_COVER_MS));
}

function familyMontageIndexAtMs(elapsedMs: number, photoCount: number): number {
  const t = elapsedMs - FAMILY_MONTAGE_START_MS;
  if (t < 0) return 0;
  const base = Math.floor(FAMILY_MONTAGE_MS / photoCount);
  const extra = FAMILY_MONTAGE_MS % photoCount;
  let acc = 0;
  for (let i = 0; i < photoCount; i++) {
    acc += base + (i < extra ? 1 : 0);
    if (t < acc) return i;
  }
  return photoCount - 1;
}

/** Segundos de pared calibrados con portada 3 s — se desplazan si TEASER_COVER_MS cambia */
const LEGACY_COVER_MS = 3_000;

function wallMsFromLegacySecond(second: number): number {
  return second * 1000 + (TEASER_COVER_MS - LEGACY_COVER_MS);
}

function familyMontageIndexAtLegacySecond(second: number, photoCount: number): number {
  return familyMontageIndexAtMs(wallMsFromLegacySecond(second), photoCount);
}

function montageIndicesInLegacySecond(second: number, photoCount: number): number[] {
  const out: number[] = [];
  const start = wallMsFromLegacySecond(second);
  const end = start + 1000;
  for (let ms = start; ms < end; ms += 50) {
    const idx = familyMontageIndexAtMs(ms, photoCount);
    if (!out.includes(idx)) out.push(idx);
  }
  return out;
}

function insertUrlAfter(pool: string[], afterIndex: number, url: string): string[] {
  const at = afterIndex + 1;
  return [...pool.slice(0, at), url, ...pool.slice(at)];
}

function insertUrlBefore(pool: string[], beforeIndex: number, url: string): string[] {
  return [...pool.slice(0, beforeIndex), url, ...pool.slice(beforeIndex)];
}

/** Inserta en s 9–12 las fotos que caían en s 25 y s 27; setas (s 12) y mano magenta (antes de s 13) */
function buildFamilyMontageUrls(paletteId?: PaletteId): string[] {
  if (paletteId === "raiz_petroleo") {
    return getTeaserFamiliaUrls(paletteId);
  }

  const urls = getTeaserFamiliaUrls(paletteId);
  const n = urls.length;
  const earlyIdx = [9, 10, 11, 12].map((s) => familyMontageIndexAtLegacySecond(s, n));
  const ins25 = familyMontageIndexAtLegacySecond(25, n);
  const ins27 = familyMontageIndexAtLegacySecond(27, n);
  const skip = new Set([...earlyIdx, ins25, ins27]);
  const earlyBlock = [
    urls[earlyIdx[0]!],
    urls[ins25]!,
    urls[earlyIdx[1]!],
    urls[ins27]!,
    urls[earlyIdx[2]!],
    urls[earlyIdx[3]!],
  ].filter((url, i, arr) => url && arr.indexOf(url) === i);
  const tail = urls.filter((_, i) => !skip.has(i));
  let pool = [...earlyBlock, ...tail];

  const s12 = montageIndicesInLegacySecond(12, pool.length);
  const s13Photo = pool[familyMontageIndexAtLegacySecond(13, pool.length)];

  if (s12.length >= 2) {
    pool = insertUrlAfter(pool, s12[0]!, FAMILY_MONTAGE_ELENA_MUSHROOM);
  }

  if (s13Photo) {
    const s13Idx = pool.lastIndexOf(s13Photo);
    if (s13Idx >= 0) {
      pool = insertUrlBefore(pool, s13Idx, FAMILY_MONTAGE_LIANA_HAND);
    }
  }

  pool = pool.filter((url) => url !== FAMILY_MONTAGE_FIRST_AFTER_INTRO);
  return [FAMILY_MONTAGE_FIRST_AFTER_INTRO, ...pool];
}

function buildFamilyMontage(paletteId?: PaletteId, familyMontageMs = FAMILY_MONTAGE_MS): Frame[] {
  let pool = buildFamilyMontageUrls(paletteId);
  if (paletteId === "raiz_helecho") {
    pool = applyHelechoFamilyMontage(pool);
  }

  const timing = getHelechoTeaserTiming(
    teaserCoverMs(paletteId),
    INTRO_TYPEWRITER_MS,
    familyMontageMs,
    OVERLAY_REVEAL_MS,
    SYNTH_MIDDLE_MS,
    teaserMorvoFinalMs(paletteId),
    TARGET_TOTAL_MS,
    paletteId,
  );

  const familiaBeatCuts = getTeaserFamiliaBeatCuts(paletteId);
  if (
    TEASER_FAMILIA_USE_BEAT_SYNC &&
    familiaBeatCuts.length >= pool.length
  ) {
    let cuts = timing.familyCrescendo
      ? applyHelechoCrescendoToCuts(
          familiaBeatCuts.slice(0, pool.length),
          HELECHO_FAMILY_CRESCENDO_STRENGTH,
        )
      : [...familiaBeatCuts.slice(0, pool.length)];
    if (paletteId === "raiz_helecho") {
      cuts = applyHelechoDurationBoosts(pool, cuts, HELECHO_FAMILY_DURATION_BOOST_URLS);
    } else {
      /** Escala al presupuesto real (si no, el hueco se queda pegado a los créditos) */
      cuts = normalizeBeatCutsToTotal(cuts, familyMontageMs);
    }
    return markIntroFamilyFirstFrameLayered(buildTimedMontage(pool, cuts, "contain", false), paletteId);
  }

  const restCuts = timing.familyCrescendo
    ? buildHelechoCrescendoCuts(pool.length, familyMontageMs, HELECHO_FAMILY_CRESCENDO_STRENGTH)
    : null;
  if (restCuts) {
    const cuts =
      paletteId === "raiz_helecho"
        ? applyHelechoDurationBoosts(pool, restCuts, HELECHO_FAMILY_DURATION_BOOST_URLS)
        : restCuts;
    return markIntroFamilyFirstFrameLayered(buildTimedMontage(pool, cuts, "contain", false), paletteId);
  }
  return markIntroFamilyFirstFrameLayered(
    buildUniqueMontage(pool, familyMontageMs, "contain", false),
    paletteId,
  );
}

function framesTotalMs(frames: Frame[]): number {
  return frames.reduce((sum, f) => sum + f.duration, 0);
}

/** Si los frames no suman el total, el hueco se queda en el último (créditos). Redistribuye al montaje. */
function reconcileFramesToTarget(frames: Frame[], targetMs: number): Frame[] {
  const sum = framesTotalMs(frames);
  const diff = targetMs - sum;
  if (diff === 0) return frames;

  const out = frames.map((f) => ({ ...f }));
  const absorbIdx = (() => {
    for (let i = out.length - 1; i >= 0; i--) {
      const f = out[i]!;
      if (f.morvo || f.bgVideo || f.presenta || f.typewriter || f.overlayText || f.videoTitle || f.videoTitleLines)
        continue;
      if (f.bgImg) return i;
    }
    for (let i = out.length - 1; i >= 0; i--) {
      if (!out[i]!.morvo) return i;
    }
    return out.length - 1;
  })();

  if (absorbIdx < 0) return out;

  if (diff > 0) {
    out[absorbIdx]!.duration += diff;
    return out;
  }

  let remain = -diff;
  for (let i = absorbIdx; i >= 0 && remain > 0; i--) {
    const f = out[i]!;
    // Nunca recortar clips de vídeo ni portada/créditos — si no, “desaparecen”
    if (f.morvo || f.presenta || f.bgVideo || f.typewriter) continue;
    const take = Math.min(remain, Math.max(0, f.duration - 120));
    f.duration -= take;
    remain -= take;
  }
  return out;
}

function buildPetroleoClipFrame(
  url: string,
  durationMs: number,
  volume: number,
  fit: ImageFit = "cover",
  extras?: {
    overlayText?: string;
    videoTitle?: string;
    videoTitleLines?: readonly string[];
    videoTitleLineScales?: readonly number[];
    videoTitleAnchor?: "bottom" | "top";
    videoTitleOffsetY?: number;
    videoZoom?: number;
    layerBackImg?: string;
  },
): Frame {
  return {
    duration: Math.max(120, durationMs),
    bgVideo: url,
    videoVolume: volume,
    fit,
    overlayText: extras?.overlayText,
    videoTitle: extras?.videoTitle,
    videoTitleLines: extras?.videoTitleLines,
    videoTitleLineScales: extras?.videoTitleLineScales,
    videoTitleAnchor: extras?.videoTitleAnchor,
    videoTitleOffsetY: extras?.videoTitleOffsetY,
    videoZoom: extras?.videoZoom,
    layerBackImg: extras?.layerBackImg,
  };
}

type PetroleoClipDurations = Record<string, number>;

function buildPetroleoBeatFrames(
  sequence: readonly PetroleoBeat[],
  clipMs: PetroleoClipDurations,
): Frame[] {
  return sequence.map((beat: PetroleoBeat) => {
    if (beat.kind === "video") {
      const duration = getPetroleoClipDurationMs(
        beat.front,
        clipMs[beat.front] ?? 0,
        beat.fallbackMs ?? 5_000,
      );
      return buildPetroleoClipFrame(beat.front, duration, beat.volume ?? 0.12, "contain", {
        layerBackImg: beat.back,
        videoTitleLines: beat.titleLines,
        videoTitleLineScales: beat.titleLineScales,
        videoTitleAnchor: beat.titleAnchor,
        videoTitleOffsetY: beat.titleOffsetY,
      });
    }
    return {
      duration: PETROLEO_BEAT_STILL_MS,
      bgImg: beat.front,
      layerBackImg: beat.back,
      layerBackZoom: beat.backZoom,
      fit: "contain" as const,
      layered: true,
      videoTitleLines: beat.titleLines,
      videoTitleLineScales: beat.titleLineScales,
      videoTitleAnchor: beat.titleAnchor,
      videoTitleOffsetY: beat.titleOffsetY,
    };
  });
}

function fitPetroleoFramesToAudioTarget(frames: Frame[], targetMs: number): Frame[] {
  const out = frames.map((f) => ({ ...f }));
  const isStill = (f: Frame) =>
    Boolean(f.layered && f.bgImg && !f.bgVideo && !f.presenta && !f.typewriter && !f.overlayText && !f.morvo);

  const stillIndices = out.map((f, i) => (isStill(f) ? i : -1)).filter((i) => i >= 0);
  if (stillIndices.length === 0) return out;

  const fixedMs = out.reduce((sum, f, i) => (stillIndices.includes(i) ? sum : sum + f.duration), 0);
  const minStill = 900;
  const budget = Math.max(stillIndices.length * minStill, targetMs - fixedMs);
  const base = Math.floor(budget / stillIndices.length);
  let rem = budget - base * stillIndices.length;
  for (const i of stillIndices) {
    out[i]!.duration = base + (rem > 0 ? 1 : 0);
    if (rem > 0) rem -= 1;
  }

  const sum = out.reduce((s, f) => s + f.duration, 0);
  const diff = targetMs - sum;
  const morvo = out.find((f) => f.morvo);
  if (morvo && Math.abs(diff) > 20) {
    morvo.duration = Math.max(1_200, morvo.duration + diff);
  }
  return out;
}

function buildTeaserFrames(paletteId?: PaletteId, petroleoClips: PetroleoClipDurations = {}): Frame[] {
  const coverMs = teaserCoverMs(paletteId);
  const familyMs = familyMontageMsFor(paletteId);
  const morvoMs = teaserMorvoFinalMs(paletteId);

  if (paletteId === "raiz_petroleo") {
    /** Portada → 1.ª frase → parte 1 → 2.ª frase → parte 2 → créditos; duración ≈ Ravel */
    const raw: Frame[] = [
      { duration: coverMs, bgImg: TEASER_COVER_BG, fit: "cover", presenta: true },
      { duration: INTRO_TYPEWRITER_MS, bgImg: TEASER_TYPEWRITER_BG, fit: "cover", typewriter: true },
      ...buildPetroleoBeatFrames(PETROLEO_BEAT_SEQUENCE, petroleoClips),
      {
        duration: OVERLAY_TEXT_MS,
        bgImg: TEASER_TYPEWRITER_BG,
        fit: "cover",
        overlayText: SYNTH_OVERLAY_TEXT,
      },
      ...buildPetroleoBeatFrames(PETROLEO_BEAT_SEQUENCE_PART2, petroleoClips),
      { duration: morvoMs, bgImg: MORVO_FINAL_BG, fit: "cover", morvo: true },
    ];
    return fitPetroleoFramesToAudioTarget(raw, PETROLEO_TEASER_AUDIO_TARGET_MS);
  }

  const restImages = buildTeaserRestImagesForPalette(paletteId);
  const timing = getHelechoTeaserTiming(
    coverMs,
    INTRO_TYPEWRITER_MS,
    familyMs,
    OVERLAY_REVEAL_MS,
    SYNTH_MIDDLE_MS,
    morvoMs,
    TARGET_TOTAL_MS,
    paletteId,
  );

  let restCuts = timing.restCrescendo
    ? buildHelechoCrescendoCuts(restImages.length, timing.restMontageMs, HELECHO_CRESCENDO_STRENGTH, 300)
    : null;
  if (restCuts && paletteId === "raiz_helecho") {
    restCuts = applyHelechoDurationBoosts(
      restImages,
      restCuts,
      HELECHO_REST_DURATION_BOOST_URLS,
      HELECHO_DURATION_BOOST_FACTOR,
      300,
    );
    restCuts = applyHelechoDurationBoosts(
      restImages,
      restCuts,
      [HELECHO_BALLOONS_URL],
      HELECHO_BALLOONS_DURATION_BOOST_FACTOR,
      300,
    );
  }

  const restFrames =
    restCuts && restCuts.length === restImages.length
      ? buildTimedMontage(restImages, restCuts, "contain", true)
      : buildUniqueMontage(restImages, Math.max(300, timing.restMontageMs), "contain", true);

  return reconcileFramesToTarget(
    [
      { duration: coverMs, bgImg: TEASER_COVER_BG, fit: "cover", presenta: true },
      { duration: INTRO_TYPEWRITER_MS, bgImg: TEASER_TYPEWRITER_BG, fit: "cover", typewriter: true },
      ...buildFamilyMontage(paletteId, familyMs),
      {
        duration: timing.synthMiddleMs,
        bgImg: TEASER_TYPEWRITER_BG,
        fit: "cover",
        overlayText: SYNTH_OVERLAY_TEXT,
      },
      ...restFrames,
      { duration: timing.morvoFinalMs, bgImg: MORVO_FINAL_BG, fit: "cover", morvo: true },
    ],
    TARGET_TOTAL_MS,
  );
}

function frameLocalElapsedMs(elapsedMs: number, frameIndex: number, frames: Frame[]): number {
  let acc = 0;
  for (let i = 0; i < frameIndex; i++) acc += frames[i].duration;
  return Math.max(0, elapsedMs - acc);
}

function frameIndexAt(elapsedMs: number, frames: Frame[]): number {
  let acc = 0;
  for (let i = 0; i < frames.length; i++) {
    acc += frames[i].duration;
    if (elapsedMs < acc) return i;
  }
  return Math.max(0, frames.length - 1);
}

function formatTime(ms: number): string {
  const sec = Math.floor(ms / 1000);
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

type TeaserVideoProps = {
  font: string;
  accentColor?: string;
  paletteId?: PaletteId;
  onEnd?: () => void;
  style?: React.CSSProperties;
};

const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`;

function TeaserFilmGrain() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 4,
        opacity: 0.09,
        backgroundImage: GRAIN_SVG,
        backgroundRepeat: "repeat",
        backgroundSize: "180px 180px",
        mixBlendMode: "overlay",
      }}
    />
  );
}

const teaserImageCache = new Map<string, HTMLImageElement>();
const teaserAudioUrlReady = new Map<string, Promise<void>>();

function waitForAudioMetadata(audio: HTMLAudioElement): Promise<void> {
  const isReady = () => audio.readyState >= HTMLMediaElement.HAVE_METADATA;
  if (isReady()) return Promise.resolve();

  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      clearInterval(pollId);
      clearTimeout(timeoutId);
      for (const ev of events) audio.removeEventListener(ev, finish);
      resolve();
    };

    const events = ["loadedmetadata", "loadeddata", "canplay", "durationchange", "error"] as const;
    for (const ev of events) audio.addEventListener(ev, finish);

    const pollId = window.setInterval(() => {
      if (isReady()) finish();
    }, 120);

    const timeoutId = window.setTimeout(finish, 12_000);

    audio.preload = "auto";
    audio.load();
  });
}

function preloadTeaserAudioUrl(url: string): Promise<void> {
  const cached = teaserAudioUrlReady.get(url);
  if (cached) return cached;

  const promise = new Promise<void>((resolve) => {
    const probe = new Audio();
    probe.src = url;
    void waitForAudioMetadata(probe).then(resolve);
  });

  teaserAudioUrlReady.set(url, promise);
  return promise;
}

function preloadTeaserAudioPreset(preset: TeaserAudioPreset): Promise<void> {
  const urls = [
    preset.tracks[0],
    preset.tracks[1],
    preset.middleTrack,
  ].filter((url): url is string => Boolean(url));

  return Promise.all(urls.map(preloadTeaserAudioUrl)).then(() => undefined);
}

function preloadTeaserImages(urls: readonly string[]): Promise<void> {
  return Promise.all(
    urls.map(
      (url) =>
        new Promise<void>((resolve) => {
          if (teaserImageCache.has(url)) {
            resolve();
            return;
          }
          const img = new Image();
          img.onload = () => {
            const done = () => {
              teaserImageCache.set(url, img);
              resolve();
            };
            if (img.decode) void img.decode().then(done).catch(done);
            else done();
          };
          img.onerror = () => resolve();
          img.src = url;
        }),
    ),
  ).then(() => undefined);
}

const TEASER_COVER_PRIORITY_URLS = [TEASER_COVER_BG, TEASER_TYPEWRITER_BG] as const;

/** Portada visible al abrir el teaser — precarga en cuanto se importa el módulo */
export function preloadTeaserCoverImages(): Promise<void> {
  return preloadTeaserImages(TEASER_COVER_PRIORITY_URLS);
}

void preloadTeaserCoverImages();

function TeaserCoverBackdrop() {
  const coverUrl = teaserImageCache.get(TEASER_COVER_BG)?.src ?? TEASER_COVER_BG;
  const [ready, setReady] = useState(() => {
    const c = teaserImageCache.get(TEASER_COVER_BG);
    return Boolean(c && c.complete && c.naturalWidth > 0);
  });

  useLayoutEffect(() => {
    const cached = teaserImageCache.get(TEASER_COVER_BG);
    if (cached?.complete && cached.naturalWidth > 0) {
      setReady(true);
      return;
    }
    const probe = cached ?? new Image();
    const onDone = () => setReady(true);
    probe.onload = onDone;
    if (probe.decode) void probe.decode().then(onDone).catch(onDone);
    if (!cached) {
      probe.src = TEASER_COVER_BG;
      void preloadTeaserCoverImages();
    }
  }, []);

  return (
    <>
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: BLACK,
          backgroundImage: `url("${coverUrl}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <img
        src={coverUrl}
        alt=""
        decoding="sync"
        loading="eager"
        fetchPriority="high"
        onLoad={() => setReady(true)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          pointerEvents: "none",
          userSelect: "none",
          opacity: ready ? 1 : 0,
          transition: ready ? "opacity 0.15s ease-out" : undefined,
        }}
      />
    </>
  );
}

function drawCoverImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  width: number,
  height: number,
) {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  if (!iw || !ih) return;
  const ir = iw / ih;
  const cr = width / height;
  let dw: number;
  let dh: number;
  let dx: number;
  let dy: number;
  if (ir > cr) {
    dh = height;
    dw = height * ir;
    dx = (width - dw) / 2;
    dy = 0;
  } else {
    dw = width;
    dh = width / ir;
    dx = 0;
    dy = (height - dh) / 2;
  }
  ctx.drawImage(img, dx, dy, dw, dh);
}

function drawContainImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  width: number,
  height: number,
  letterbox: string,
) {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  if (!iw || !ih) return;
  const scale = Math.min(width / iw, height / ih);
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = (width - dw) / 2;
  const dy = (height - dh) / 2;
  ctx.fillStyle = letterbox;
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, dx, dy, dw, dh);
}

const montageImgBaseStyle: CSSProperties = {
  position: "absolute",
  inset: 0,
  width: "100%",
  height: "100%",
  objectPosition: "center",
  pointerEvents: "none",
  userSelect: "none",
};

/** Slot frontal: PC más estrecho; móvil intermedio (ni 44% ni 80%) */
function layeredFrontInset(_aspect: number | null): {
  left: string;
  top: string;
  width: string;
  height: string;
} {
  if (typeof window !== "undefined" && window.innerWidth < 900) {
    return { left: "16%", top: "4%", width: "68%", height: "92%" };
  }
  return { left: "28%", top: "5%", width: "44%", height: "90%" };
}

/**
 * Frente contain + fondo cover.
 * Remount total por key del padre; back = CSS url directa (sin canvas / sin arrastrar beat anterior).
 */
function TeaserLayeredMontage({
  backSrc,
  frontSrc,
  frontOpacity = 1,
  backZoom = 1,
}: {
  backSrc: string | null;
  frontSrc: string;
  frontOpacity?: number;
  backZoom?: number;
}) {
  const [narrow, setNarrow] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 900,
  );

  useEffect(() => {
    const onResize = () => setNarrow(window.innerWidth < 900);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const urls = [backSrc, frontSrc].filter((u): u is string => Boolean(u));
    if (urls.length > 0) void preloadTeaserImages(urls);
  }, [backSrc, frontSrc]);

  const inset = narrow
    ? { left: "16%", top: "4%", width: "68%", height: "92%" }
    : layeredFrontInset(null);
  const zoom = Number.isFinite(backZoom) && backZoom > 1 ? backZoom : 1;

  return (
    <div style={{ position: "absolute", inset: 0, background: BLACK, overflow: "hidden" }}>
      {backSrc ? (
        <div
          key={`back-${backSrc}-${zoom}`}
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            backgroundColor: BLACK,
            backgroundImage: `url("${backSrc}")`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
            transform: zoom > 1 ? `scale(${zoom})` : undefined,
            transformOrigin: "center center",
          }}
        />
      ) : (
        <div aria-hidden style={{ position: "absolute", inset: 0, background: BLACK, zIndex: 0 }} />
      )}
      <img
        key={`front-${frontSrc}`}
        src={frontSrc}
        alt=""
        decoding="async"
        loading="eager"
        style={{
          position: "absolute",
          left: inset.left,
          top: inset.top,
          width: inset.width,
          height: inset.height,
          objectFit: "contain",
          objectPosition: "center",
          pointerEvents: "none",
          userSelect: "none",
          zIndex: 2,
          opacity: frontOpacity,
        }}
      />
    </div>
  );
}

function TeaserClipVideo({
  src,
  fit = "cover",
  zoom = 1,
  localMs,
  playing,
  volume,
  elapsedSec,
  teaserEndSec,
  layered = false,
}: {
  src: string;
  fit?: ImageFit;
  zoom?: number;
  localMs: number;
  playing: boolean;
  volume: number;
  elapsedSec: number;
  teaserEndSec: number;
  /** Vídeo contain inset sobre foto de fondo */
  layered?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const scale = Number.isFinite(zoom) && zoom > 1 ? zoom : 1;
  const [playbackSrc, setPlaybackSrc] = useState(() => getPetroleoClipPlaybackUrl(src));
  const insetBox = layered && fit === "contain" ? layeredFrontInset(null) : null;

  const localMsRef = useRef(localMs);
  const elapsedSecRef = useRef(elapsedSec);
  const playingRef = useRef(playing);
  const volumeRef = useRef(volume);
  const teaserEndSecRef = useRef(teaserEndSec);
  localMsRef.current = localMs;
  elapsedSecRef.current = elapsedSec;
  playingRef.current = playing;
  volumeRef.current = volume;
  teaserEndSecRef.current = teaserEndSec;

  // Blob en memoria: preferir blob, pero NO cambiar src a mitad del clip (provoca cortes)
  useEffect(() => {
    let cancelled = false;
    const initial = getPetroleoClipPlaybackUrl(src);
    setPlaybackSrc(initial);
    if (initial.startsWith("blob:")) return;

    void preloadPetroleoTeaserClip(src).then(() => {
      if (cancelled) return;
      const next = getPetroleoClipPlaybackUrl(src);
      if (!next.startsWith("blob:")) return;
      const vid = videoRef.current;
      if (vid && vid.currentTime > 0.05) return;
      setPlaybackSrc(next);
    });
    return () => {
      cancelled = true;
    };
  }, [src]);

  // Sync por refs + intervalo — NO re-enganchar listeners cada RAF (eso traba el clip)
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const sync = (forceSeek = false) => {
      const t = Math.max(0, localMsRef.current / 1000);
      const dur = Number.isFinite(vid.duration) && vid.duration > 0 ? vid.duration : null;
      const target = dur != null ? Math.min(t, Math.max(0, dur - 0.05)) : t;
      const vol = volumeRef.current;
      const endSec = teaserEndSecRef.current;
      const isPlaying = playingRef.current;

      if (vid.readyState >= HTMLMediaElement.HAVE_METADATA) {
        const drift = Math.abs(vid.currentTime - target);
        if (forceSeek || drift > 0.7) {
          try {
            vid.currentTime = target;
          } catch {
            /* seek pendiente */
          }
        }
      }

      const targetVol = teaserEndVolume(elapsedSecRef.current, endSec, vol);
      if (vol <= 0.001 || targetVol <= 0.001) {
        vid.muted = true;
        vid.volume = 0;
      } else {
        vid.muted = false;
        vid.volume = Math.min(1, Math.max(0, targetVol));
      }

      if (!isPlaying) {
        vid.pause();
        return;
      }

      if (vid.ended && dur != null && target < dur - 0.08) {
        try {
          vid.currentTime = target;
        } catch {
          /* */
        }
      }

      if (vid.paused || vid.ended) {
        void vid.play().catch(() => {});
      }
    };

    sync(true);
    const onMeta = () => sync(true);
    vid.addEventListener("loadedmetadata", onMeta);
    vid.addEventListener("canplay", onMeta);
    const interval = window.setInterval(() => sync(false), 500);
    return () => {
      vid.removeEventListener("loadedmetadata", onMeta);
      vid.removeEventListener("canplay", onMeta);
      window.clearInterval(interval);
    };
  }, [playing, playbackSrc, volume]);

  const sizePct = scale > 1 ? `${scale * 100}%` : "100%";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 2,
        overflow: "hidden",
        backgroundColor: layered ? "transparent" : BLACK,
      }}
    >
      <video
        key={src}
        ref={videoRef}
        src={playbackSrc}
        preload="auto"
        playsInline
        muted={volume <= 0.001}
        style={{
          position: "absolute",
          left: insetBox ? insetBox.left : scale > 1 ? "50%" : "0",
          top: insetBox ? insetBox.top : scale > 1 ? "50%" : "0",
          right: insetBox || scale > 1 ? "auto" : "0",
          bottom: insetBox || scale > 1 ? "auto" : "0",
          width: insetBox ? insetBox.width : sizePct,
          height: insetBox ? insetBox.height : sizePct,
          maxWidth: "none",
          maxHeight: "none",
          objectFit: fit,
          objectPosition: "center center",
          transform: !insetBox && scale > 1 ? "translate(-50%, -50%)" : "none",
          transformOrigin: "center center",
          pointerEvents: "none",
          userSelect: "none",
        }}
      />
    </div>
  );
}

function TeaserMontageSurface({
  src,
  fit = "cover",
}: {
  src: string;
  fit?: ImageFit;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const backRef = useRef<HTMLImageElement>(null);
  const frontRef = useRef<HTMLImageElement>(null);
  const activeLayerRef = useRef<"back" | "front">("back");
  const shownSrcRef = useRef<string | null>(null);
  const canvasOnlyContain = fit === "contain";

  const paintCanvas = useCallback(
    (url: string) => {
      const wrap = wrapRef.current;
      const canvas = canvasRef.current;
      const img = teaserImageCache.get(url);
      if (!wrap || !canvas || !img) return false;

      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      if (w < 2 || h < 2) return false;

      const ctx = canvas.getContext("2d");
      if (!ctx) return false;

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

      if (fit === "contain") drawContainImage(ctx, img, w, h, BLACK);
      else drawCoverImage(ctx, img, w, h);
      return true;
    },
    [fit],
  );

  const showCached = useCallback((url: string) => {
    const img = teaserImageCache.get(url);
    if (!img) return false;

    const back = backRef.current;
    const front = frontRef.current;
    if (!back || !front) return false;

    const next = activeLayerRef.current === "back" ? front : back;
    const prev = activeLayerRef.current === "back" ? back : front;

    next.src = img.src;
    next.style.opacity = "1";
    next.style.zIndex = "2";
    prev.style.zIndex = "1";
    prev.style.opacity = "0";

    activeLayerRef.current = activeLayerRef.current === "back" ? "front" : "back";
    shownSrcRef.current = url;
    return true;
  }, []);

  const reveal = useCallback(
    (url: string) => {
      if (canvasOnlyContain) {
        if (paintCanvas(url)) shownSrcRef.current = url;
        return;
      }
      if (!showCached(url) && !paintCanvas(url)) return;
      shownSrcRef.current = url;
    },
    [canvasOnlyContain, paintCanvas, showCached],
  );

  useEffect(() => {
    if (!src || src === shownSrcRef.current) return;

    const cached = teaserImageCache.get(src);
    if (cached) {
      reveal(src);
      return;
    }

    void preloadTeaserImages([src]).then(() => reveal(src));
  }, [src, reveal]);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const onResize = () => {
      if (shownSrcRef.current) paintCanvas(shownSrcRef.current);
    };

    const ro = new ResizeObserver(onResize);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [paintCanvas]);

  useEffect(() => {
    if (src && teaserImageCache.has(src)) reveal(src);
  }, [src, reveal]);

  const backImgStyle: CSSProperties = {
    ...montageImgBaseStyle,
    objectFit: fit,
    zIndex: 1,
    opacity: 0,
  };

  const frontImgStyle: CSSProperties = {
    ...montageImgBaseStyle,
    objectFit: fit,
    zIndex: 2,
    opacity: 0,
  };

  return (
    <div ref={wrapRef} style={{ position: "absolute", inset: 0, background: BLACK, overflow: "hidden" }}>
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", display: "block", zIndex: 0 }}
      />
      {!canvasOnlyContain && (
        <>
          <img ref={backRef} alt="" decoding="sync" style={backImgStyle} />
          <img ref={frontRef} alt="" decoding="sync" style={frontImgStyle} />
        </>
      )}
    </div>
  );
}

function splitTeaserWords(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean);
}

function visibleWordCount(
  wordCount: number,
  localMs: number,
  revealMs: number,
  pacing: "progressive" | "burst",
): number {
  if (wordCount === 0 || revealMs <= 0) return 0;
  if (pacing === "progressive") {
    return Math.min(wordCount, Math.max(0, Math.ceil((localMs / revealMs) * wordCount)));
  }
  const burstWindow = revealMs * 0.62;
  const interval = burstWindow / wordCount;
  return Math.min(wordCount, Math.max(0, Math.floor(localMs / interval) + 1));
}

const verticalGrowEase = [0.16, 1, 0.3, 1] as const;

function TeaserTextBlock({
  font,
  accentColor,
  textColor = WHITE,
  words,
  visible,
  pacing,
  uppercase,
  fontSize,
  showCursor,
  softAccentGlow = true,
}: {
  font: string;
  accentColor: string;
  textColor?: string;
  words: string[];
  visible: number;
  pacing: "progressive" | "burst";
  uppercase: boolean;
  fontSize: string;
  showCursor: boolean;
  softAccentGlow?: boolean;
}) {
  const progress = words.length > 0 ? visible / words.length : 0;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "center",
        maxWidth: "min(92%, 560px)",
        width: "100%",
      }}
    >
      <motion.div
        aria-hidden
        style={{
          flexShrink: 0,
          width: 2,
          marginRight: "clamp(10px, 2.5cqw, 22px)",
          minHeight: "clamp(80px, 28cqh, 240px)",
          transformOrigin: "top center",
          background: softAccentGlow
            ? `linear-gradient(180deg, ${accentColor}ee 0%, ${accentColor}55 55%, transparent 100%)`
            : `linear-gradient(180deg, ${accentColor} 0%, ${accentColor}99 55%, transparent 100%)`,
          boxShadow: softAccentGlow ? `0 0 20px ${accentColor}55` : "none",
        }}
        animate={{ scaleY: Math.max(0.08, progress) }}
        transition={{ duration: 0.55, ease: verticalGrowEase }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          minWidth: 0,
          maxWidth: "100%",
        }}
      >
        {words.slice(0, visible).map((word, i) => (
          <motion.span
            key={`${i}-${word}`}
            initial={{ scaleY: 0, opacity: 0, y: -10, filter: "blur(8px)" }}
            animate={{ scaleY: 1, opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ scaleY: 0.6, opacity: 0, y: -6, filter: "blur(6px)" }}
            transition={{
              duration: 0.72,
              ease: verticalGrowEase,
              delay: pacing === "burst" ? i * 0.11 : 0,
            }}
            style={{
              display: "block",
              transformOrigin: "top center",
              fontFamily: font,
              fontSize,
              fontWeight: 600,
              letterSpacing: uppercase ? "0.09em" : "0.035em",
              lineHeight: 1.12,
              color: textColor,
              textTransform: uppercase ? "uppercase" : "none",
              textShadow: softAccentGlow
                ? `0 0 24px ${accentColor}55, 0 2px 16px rgba(0,0,0,0.75)`
                : "0 2px 16px rgba(0,0,0,0.75)",
              marginBottom: "clamp(2px, 0.7cqh, 8px)",
              maxWidth: "100%",
              overflowWrap: "anywhere",
            }}
          >
            {word}
          </motion.span>
        ))}
        {showCursor && (
          <motion.span
            aria-hidden
            animate={{ opacity: [0.2, 1, 0.2], scaleY: [0.85, 1, 0.85] }}
            transition={{ duration: 0.85, repeat: Infinity, ease: "easeInOut" }}
            style={{
              display: "block",
              width: 2,
              height: "clamp(12px, 2.5cqh, 22px)",
              marginTop: 4,
              transformOrigin: "top center",
              background: accentColor,
              boxShadow: softAccentGlow ? `0 0 10px ${accentColor}` : "none",
            }}
          />
        )}
      </div>
    </div>
  );
}

function TeaserVerticalGrowText({
  font,
  text,
  localMs,
  accentColor,
  textColor = WHITE,
  scrim = false,
  scrimOpacity = 0.38,
  pacing,
  uppercase = true,
  revealMs,
  softAccentGlow = true,
}: {
  font: string;
  text: string;
  localMs: number;
  accentColor: string;
  textColor?: string;
  scrim?: boolean;
  scrimOpacity?: number;
  pacing: "progressive" | "burst";
  uppercase?: boolean;
  revealMs: number;
  softAccentGlow?: boolean;
}) {
  const words = useMemo(() => splitTeaserWords(text), [text]);
  const revealComplete = localMs >= revealMs;
  const visible = revealComplete
    ? words.length
    : visibleWordCount(words.length, localMs, revealMs, pacing);
  const baseFont = "clamp(14px, min(5.2cqw, 7.5cqh), 34px)";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: scrim ? `rgba(0,0,0,${scrimOpacity})` : BLACK,
        zIndex: 2,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(12px, min(4cqw, 5cqh), 40px)",
        containerType: "size",
        boxSizing: "border-box",
      }}
    >
      <TeaserTextBlock
        font={font}
        accentColor={accentColor}
        textColor={textColor}
        words={words}
        visible={visible}
        pacing={pacing}
        uppercase={uppercase}
        fontSize={baseFont}
        showCursor={pacing === "progressive" && !revealComplete}
        softAccentGlow={softAccentGlow}
      />
    </div>
  );
}

function TeaserFullscreenButton({
  accentColor,
  isFullscreen,
  onToggle,
  style,
}: {
  accentColor: string;
  isFullscreen: boolean;
  onToggle: () => void;
  style?: CSSProperties;
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      aria-label={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
      title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
      style={{
        flexShrink: 0,
        width: 34,
        height: 34,
        borderRadius: 6,
        border: `1.5px solid ${accentColor}`,
        background: "rgba(0,0,0,0.55)",
        color: accentColor,
        cursor: "pointer",
        fontSize: 15,
        lineHeight: 1,
        padding: 0,
        ...style,
      }}
    >
      {isFullscreen ? "⤡" : "⤢"}
    </button>
  );
}

function TeaserControls({
  playing,
  elapsedMs,
  totalMs,
  accentColor,
  isFullscreen,
  visible,
  onPlay,
  onPause,
  onSeek,
  onToggleFullscreen,
}: {
  playing: boolean;
  elapsedMs: number;
  totalMs: number;
  accentColor: string;
  isFullscreen: boolean;
  visible: boolean;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (ms: number) => void;
  onToggleFullscreen: () => void;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const pct = totalMs > 0 ? Math.min(100, (elapsedMs / totalMs) * 100) : 0;

  const seekFromClientX = (clientX: number) => {
    const bar = barRef.current;
    if (!bar || totalMs <= 0) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    onSeek(ratio * totalMs);
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 10px",
        background: "linear-gradient(to top, rgba(0,0,0,0.82), rgba(0,0,0,0.35), transparent)",
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transition: "opacity 0.22s ease",
      }}
    >
      <button
        type="button"
        onClick={playing ? onPause : onPlay}
        aria-label={playing ? "Pausar teaser" : "Reproducir teaser"}
        style={{
          flexShrink: 0,
          width: 34,
          height: 34,
          borderRadius: "50%",
          border: `1.5px solid ${accentColor}`,
          background: "rgba(0,0,0,0.55)",
          color: accentColor,
          cursor: "pointer",
          fontSize: 14,
          lineHeight: 1,
          padding: 0,
        }}
      >
        {playing ? "❚❚" : "▶"}
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          ref={barRef}
          role="slider"
          aria-valuemin={0}
          aria-valuemax={totalMs}
          aria-valuenow={elapsedMs}
          tabIndex={0}
          onClick={(e) => seekFromClientX(e.clientX)}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") onSeek(Math.min(totalMs, elapsedMs + 2000));
            if (e.key === "ArrowLeft") onSeek(Math.max(0, elapsedMs - 2000));
          }}
          style={{
            height: 6,
            borderRadius: 3,
            background: "rgba(255,255,255,0.18)",
            cursor: "pointer",
            position: "relative",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${pct}%`,
              borderRadius: 3,
              background: accentColor,
              transition: playing ? "none" : "width 0.1s linear",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: `${pct}%`,
              transform: "translate(-50%, -50%)",
              width: 12,
              height: 12,
              borderRadius: "50%",
              background: accentColor,
              boxShadow: "0 0 6px rgba(0,0,0,0.5)",
            }}
          />
        </div>
        <div
          style={{
            marginTop: 4,
            fontSize: 10,
            letterSpacing: "0.08em",
            color: "rgba(255,255,255,0.65)",
            fontFamily: "system-ui, sans-serif",
          }}
        >
          {formatTime(elapsedMs)} / {formatTime(totalMs)}
        </div>
      </div>
      <TeaserFullscreenButton
        accentColor={accentColor}
        isFullscreen={isFullscreen}
        onToggle={onToggleFullscreen}
      />
    </div>
  );
}

export function TeaserVideo({ font, accentColor = SALMON, paletteId, onEnd, style }: TeaserVideoProps) {
  const [elapsedMs, setElapsedMs] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [embeddedAspect, setEmbeddedAspect] = useState(TEASER_VIEWPORT_ASPECT);
  const [imagesReady, setImagesReady] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(false);
  const [petroleoClipMs, setPetroleoClipMs] = useState<PetroleoClipDurations>({});

  const rootRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const controlsHideTimerRef = useRef<number | null>(null);
  const frames = useMemo(
    () => buildTeaserFrames(paletteId, petroleoClipMs),
    [paletteId, petroleoClipMs],
  );
  const audioPreset = useMemo(() => getTeaserAudioForPalette(paletteId), [paletteId]);
  const audioPresetRef = useRef(audioPreset);
  audioPresetRef.current = audioPreset;
  const totalMs = useMemo(() => {
    const sum = framesTotalMs(frames);
    return sum > 0 ? sum : TOTAL_TEASER_MS;
  }, [frames]);
  const totalMsRef = useRef(totalMs);
  totalMsRef.current = totalMs;
  const frameIndex = frameIndexAt(elapsedMs, frames);
  const frame = frames[frameIndex];
  const nextFrame = frames[frameIndex + 1];
  const frameLocalMs = frameLocalElapsedMs(elapsedMs, frameIndex, frames);
  const coverPhraseFadeT = coverToTypewriterFadeT(elapsedMs, paletteId);
  const morvoCrossfadeT = balloonsToMorvoCrossfadeT(frame, nextFrame, frameLocalMs, paletteId);
  const balloonsMorvoTransition = balloonsToMorvoTransition(morvoCrossfadeT);
  const isBalloonsToMorvo =
    paletteId === "raiz_helecho" &&
    isHelechoBalloonsUrl(frame?.bgImg) &&
    morvoCrossfadeT > 0;
  const introFamilyMix = introFamilyMixT(elapsedMs, paletteId);
  /** Fullscreen = pantalla entera con cover (sin letterbox 16:9 que recorta al centro) */
  const fullscreenPortadaViewport = false;
  const typewriterAccent =
    paletteId === "raiz_petroleo" ? ESMERALDA_SALMON : TYPEWRITER_ACCENT_COLOR;
  const typewriterTextColor =
    paletteId === "raiz_petroleo" ? ESMERALDA_SALMON : TYPEWRITER_TEXT_COLOR;
  const petroleoSoftAccentGlow = paletteId !== "raiz_petroleo";
  const introFirstFamilyPhoto =
    paletteId === "raiz_helecho" ? firstFamilyPhotoUrl(frames) : null;
  /** Solo el back declarado en el beat — NUNCA el frame anterior (en móvil dejaba VictorsParty detrás del jardinero) */
  const layeredBackSrc = frame?.layerBackImg ?? null;
  const layeredBackZoom = frame?.layerBackZoom ?? 1;
  const layeredMontageKey = `L${frameIndex}|${layeredBackSrc ?? "x"}|${frame?.bgImg ?? frame?.bgVideo ?? "x"}|z${layeredBackZoom}`;

  const playAnchorRef = useRef({ wall: 0, elapsed: 0 });
  const music1Ref = useRef<HTMLAudioElement | null>(null);
  const music2Ref = useRef<HTMLAudioElement | null>(null);
  const middleRef = useRef<HTMLAudioElement | null>(null);
  const playingRef = useRef(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<AudioScheduledSourceNode[]>([]);
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);
  const keepAwakeVideoRef = useRef<HTMLVideoElement>(null);
  const keepAwakeStopRef = useRef<(() => void) | null>(null);

  const releaseWakeLock = useCallback(async () => {
    try {
      await wakeLockRef.current?.release();
    } catch {
      /* */
    }
    wakeLockRef.current = null;
  }, []);

  const acquireWakeLock = useCallback(async () => {
    if (!("wakeLock" in navigator)) return;
    try {
      if (wakeLockRef.current && !wakeLockRef.current.released) return;
      if (wakeLockRef.current?.released) wakeLockRef.current = null;
      const lock = await navigator.wakeLock.request("screen");
      wakeLockRef.current = lock;
      lock.addEventListener("release", () => {
        wakeLockRef.current = null;
        if (playingRef.current) void acquireWakeLock();
      });
    } catch {
      /* permiso denegado o API no disponible */
    }
  }, []);

  const stopKeepAwakeVideo = useCallback(() => {
    keepAwakeStopRef.current?.();
    keepAwakeStopRef.current = null;
  }, []);

  const startKeepAwakeVideo = useCallback(() => {
    stopKeepAwakeVideo();
    const video = keepAwakeVideoRef.current;
    if (!video || typeof HTMLCanvasElement === "undefined") return;

    const canvas = document.createElement("canvas");
    canvas.width = 2;
    canvas.height = 2;
    const ctx = canvas.getContext("2d");
    if (!ctx || !canvas.captureStream) return;

    const stream = canvas.captureStream(1);
    video.srcObject = stream;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute("playsinline", "true");
    video.setAttribute("webkit-playsinline", "true");
    void video.play().catch(() => {});

    // 1 fps basta para keep-awake — no pelear con el teaser a 60 RAF
    const paint = () => {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, 2, 2);
    };
    paint();
    const interval = window.setInterval(paint, 1000);

    keepAwakeStopRef.current = () => {
      window.clearInterval(interval);
      video.pause();
      video.removeAttribute("src");
      video.srcObject = null;
    };
  }, [stopKeepAwakeVideo]);

  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  const clearControlsHideTimer = useCallback(() => {
    if (controlsHideTimerRef.current !== null) {
      window.clearTimeout(controlsHideTimerRef.current);
      controlsHideTimerRef.current = null;
    }
  }, []);

  const revealControls = useCallback(() => {
    clearControlsHideTimer();
    setControlsVisible(true);
  }, [clearControlsHideTimer]);

  const scheduleHideControls = useCallback(
    (delayMs = 900) => {
      clearControlsHideTimer();
      controlsHideTimerRef.current = window.setTimeout(() => {
        setControlsVisible(false);
        controlsHideTimerRef.current = null;
      }, delayMs);
    },
    [clearControlsHideTimer],
  );

  useEffect(() => {
    if (!hasStarted) {
      setControlsVisible(false);
      return;
    }
    if (!playing) {
      revealControls();
      return;
    }
    revealControls();
    scheduleHideControls(1200);
    return clearControlsHideTimer;
  }, [hasStarted, playing, revealControls, scheduleHideControls, clearControlsHideTimer]);

  useEffect(() => () => clearControlsHideTimer(), [clearControlsHideTimer]);

  const hasStartedRef = useRef(false);
  hasStartedRef.current = hasStarted;
  const framesRef = useRef(frames);
  framesRef.current = frames;
  const elapsedMsRef = useRef(elapsedMs);
  elapsedMsRef.current = elapsedMs;
  const lastUiPushMsRef = useRef(0);
  const lastUiFrameIndexRef = useRef(-1);

  useEffect(() => {
    let cancelled = false;
    setImagesReady(false);
    // No poner duraciones a 0: eso sacaba los clips del montaje hasta que el preload terminaba.

    // Solo metadata al abrir (sin blobear todos los clips a la vez)
    const videoProbe =
      paletteId === "raiz_petroleo"
        ? Promise.all(
            petroleoBeatVideoUrls().map(async (url) => {
              const ms = await probePetroleoClipDuration(url);
              return [url, ms] as const;
            }),
          )
        : Promise.resolve([] as const);

    void Promise.all([preloadTeaserCoverImages(), videoProbe])
      .then(([, videoMs]) => {
        if (cancelled) return;
        if (paletteId === "raiz_petroleo" && Array.isArray(videoMs) && !hasStartedRef.current) {
          const next: PetroleoClipDurations = {};
          for (const [url, ms] of videoMs) {
            if (ms > 0) next[url] = ms;
          }
          if (Object.keys(next).length > 0) setPetroleoClipMs((prev) => ({ ...prev, ...next }));
        }
        // Imágenes siempre: no bloquear el ready si el timeline ya no se actualiza
        return preloadTeaserImages(buildAllTeaserImages(paletteId));
      })
      .then(() => {
        if (!cancelled) setImagesReady(true);
      })
      .catch(() => {
        // Aunque falle el preload, el teaser sigue con fallbacks de duración
        if (!cancelled) setImagesReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [paletteId]);

  useEffect(() => {
    const ahead = [
      frames[frameIndex + 1]?.bgImg,
      frames[frameIndex + 1]?.layerBackImg,
      frames[frameIndex + 2]?.bgImg,
      frames[frameIndex + 2]?.layerBackImg,
    ].filter((url): url is string => Boolean(url));
    if (ahead.length > 0) void preloadTeaserImages(ahead);

    // Calentar solo el siguiente clip (blob) — no 4 en paralelo
    const nextClip = frames[frameIndex]?.bgVideo ?? frames[frameIndex + 1]?.bgVideo;
    if (nextClip) void preloadPetroleoTeaserClip(nextClip);
  }, [frameIndex, frames]);

  useEffect(() => {
    let cancelled = false;
    const preset = getTeaserAudioForPalette(paletteId);

    void preloadTeaserAudioPreset(preset).then(() => {
      if (cancelled) return;

      const a1 = new Audio(preset.tracks[0]);
      a1.preload = "auto";
      music1Ref.current = a1;

      let a2: HTMLAudioElement | null = null;
      if (preset.mode === "dual-with-synth" && preset.tracks[1]) {
        a2 = new Audio(preset.tracks[1]);
        a2.preload = "auto";
        music2Ref.current = a2;
      } else {
        music2Ref.current = null;
      }

      let mid: HTMLAudioElement | null = null;
      if (preset.middleTrack) {
        mid = new Audio(preset.middleTrack);
        mid.preload = "auto";
        middleRef.current = mid;
      } else {
        middleRef.current = null;
      }

      setAudioReady(true);
    });

    return () => {
      cancelled = true;
      music1Ref.current?.pause();
      music2Ref.current?.pause();
      middleRef.current?.pause();
      music1Ref.current = null;
      music2Ref.current = null;
      middleRef.current = null;
      setAudioReady(false);
    };
  }, [paletteId]);

  const measureEmbeddedAspect = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    if (width > 2 && height > 2) {
      setEmbeddedAspect(width / height);
    }
  }, []);

  useLayoutEffect(() => {
    if (isFullscreen) return;
    measureEmbeddedAspect();
  }, [isFullscreen, measureEmbeddedAspect]);

  useEffect(() => {
    if (isFullscreen) return;
    const el = viewportRef.current;
    if (!el) return;
    const ro = new ResizeObserver(measureEmbeddedAspect);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isFullscreen, measureEmbeddedAspect]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === rootRef.current);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    if (document.fullscreenElement) {
      void document.exitFullscreen();
    } else {
      measureEmbeddedAspect();
      void root.requestFullscreen();
    }
  }, [measureEmbeddedAspect]);

  const stopSynth = useCallback(() => {
    for (const n of nodesRef.current) {
      try {
        n.stop();
      } catch {
        /* */
      }
    }
    nodesRef.current = [];
    if (ctxRef.current) {
      ctxRef.current.close();
      ctxRef.current = null;
    }
  }, []);

  const pauseMusic = useCallback(() => {
    music1Ref.current?.pause();
    music2Ref.current?.pause();
    middleRef.current?.pause();
  }, []);

  const syncMusic = useCallback((elapsedSec: number, shouldPlay: boolean) => {
    const preset = audioPresetRef.current;
    const a1 = music1Ref.current;
    if (!a1) return;

    const teaserEnd = Math.max(1, totalMsRef.current / 1000);
    const audioTrim = AUDIO_START_TRIM_MS / 1000;
    const contentSec = teaserContentSec(elapsedSec);

    if (elapsedSec < AUDIO_WALL_START_SEC) {
      a1.pause();
      a1.volume = 0;
      music2Ref.current?.pause();
      if (music2Ref.current) music2Ref.current.volume = 0;
      middleRef.current?.pause();
      if (middleRef.current) middleRef.current.volume = 0;
      if (Math.abs(a1.currentTime - audioTrim) > 0.25) a1.currentTime = audioTrim;
      return;
    }

    if (preset.mode === "single-continuous") {
      music2Ref.current?.pause();
      if (music2Ref.current) music2Ref.current.volume = 0;
      middleRef.current?.pause();
      if (middleRef.current) middleRef.current.volume = 0;

      if (elapsedSec >= teaserEnd) {
        a1.pause();
        a1.volume = 0;
        return;
      }

      // No pasar del final del fichero: fundir con el cierre del teaser o del audio
      const audioDur =
        Number.isFinite(a1.duration) && a1.duration > 0 ? a1.duration : teaserEnd;
      const fadeEnd = Math.min(teaserEnd, audioDur);
      a1.volume = teaserEndVolume(elapsedSec, fadeEnd, 1);
      const contentEnd = fadeEnd - AUDIO_WALL_START_SEC;
      const t = Math.min(contentSec + audioTrim, audioTrim + Math.max(0, contentEnd - 0.05));
      if (Math.abs(a1.currentTime - t) > 0.3) a1.currentTime = t;
      if (shouldPlay && a1.paused && !a1.ended) void a1.play().catch(() => {});
      if (!shouldPlay) a1.pause();
      return;
    }

    if (preset.mode === "single") {
      music2Ref.current?.pause();
      if (music2Ref.current) music2Ref.current.volume = 0;

      const middleStart = MUSIC1_SECTION_WALL_MS / 1000;
      const middleEnd = MUSIC2_START_WALL_MS / 1000;
      const overlayTextEnd = middleStart + OVERLAY_TEXT_MS / 1000;
      const fadeSec = AUDIO_BRIDGE_FADE_MS / 1000;

      if (elapsedSec >= teaserEnd) {
        a1.pause();
        a1.volume = 0;
        middleRef.current?.pause();
        if (middleRef.current) middleRef.current.volume = 0;
        return;
      }

      if (elapsedSec < middleStart) {
        middleRef.current?.pause();
        if (middleRef.current) {
          middleRef.current.volume = 0;
          if (middleRef.current.currentTime > 0.05) middleRef.current.currentTime = 0;
        }
        a1.volume = teaserEndVolume(elapsedSec, teaserEnd, 1);
        const t = Math.min(contentSec + audioTrim, audioTrim + Math.max(0, MUSIC1_SECTION_MS / 1000 - 0.05));
        if (Math.abs(a1.currentTime - t) > 0.3) a1.currentTime = t;
        if (shouldPlay && a1.paused && !a1.ended) void a1.play().catch(() => {});
        if (!shouldPlay) a1.pause();
        return;
      }

      if (elapsedSec < middleEnd) {
        const mid = middleRef.current;
        const localMiddle = elapsedSec - middleStart;

        if (mid) {
          if (elapsedSec < overlayTextEnd) {
            const into = Math.min(1, localMiddle / fadeSec);
            a1.volume = teaserEndVolume(elapsedSec, teaserEnd, Math.max(0, 1 - into * 0.88));
            a1.currentTime = middleStart + audioTrim;
            mid.volume = teaserEndVolume(elapsedSec, teaserEnd, Math.min(1, into * 0.95));
            if (Math.abs(mid.currentTime - localMiddle) > 0.25) mid.currentTime = Math.max(0, localMiddle);
            if (shouldPlay) {
              if (a1.paused && !a1.ended) void a1.play().catch(() => {});
              if (mid.paused && !mid.ended) void mid.play().catch(() => {});
            } else {
              a1.pause();
              mid.pause();
            }
          } else {
            a1.pause();
            a1.volume = 0;
            mid.volume = teaserEndVolume(elapsedSec, teaserEnd, 1);
            if (Math.abs(mid.currentTime - localMiddle) > 0.25) mid.currentTime = Math.max(0, localMiddle);
            if (shouldPlay && mid.paused && !mid.ended) void mid.play().catch(() => {});
            if (!shouldPlay) mid.pause();
          }
        } else if (elapsedSec < overlayTextEnd) {
          const into = Math.min(1, localMiddle / fadeSec);
          a1.volume = teaserEndVolume(elapsedSec, teaserEnd, Math.max(0, 1 - into * 0.88));
          a1.currentTime = middleStart + audioTrim;
          if (shouldPlay && a1.paused && !a1.ended) void a1.play().catch(() => {});
          if (!shouldPlay) a1.pause();
        } else {
          a1.pause();
          a1.volume = 0;
        }
        return;
      }

      middleRef.current?.pause();
      if (middleRef.current) middleRef.current.volume = 0;

      const t = middleStart + (elapsedSec - middleEnd) + audioTrim;
      a1.volume = teaserEndVolume(elapsedSec, teaserEnd, 1);
      if (Math.abs(a1.currentTime - t) > 0.35) a1.currentTime = Math.max(0, t);
      if (shouldPlay && a1.paused && !a1.ended) void a1.play().catch(() => {});
      if (!shouldPlay) a1.pause();
      return;
    }

    const a2 = music2Ref.current;
    if (!a2) return;

    const music1End = MUSIC1_SECTION_WALL_MS / 1000;
    const middleEnd = MUSIC2_START_WALL_MS / 1000;
    const music2End = (TOTAL_TEASER_MS - MORVO_FINAL_MS) / 1000;

    if (elapsedSec < music1End && !a1.ended) {
      a2.pause();
      a2.volume = 0;
      if (a2.currentTime > 0.05) a2.currentTime = 0;
      a1.volume = teaserEndVolume(elapsedSec, teaserEnd, 1);
      const t1 = Math.min(contentSec + audioTrim, audioTrim + Math.max(0, MUSIC1_SECTION_MS / 1000 - 0.05));
      if (Math.abs(a1.currentTime - t1) > 0.3) a1.currentTime = t1;
      if (shouldPlay && a1.paused) void a1.play().catch(() => {});
      if (!shouldPlay) a1.pause();
      return;
    }

    if (elapsedSec < middleEnd) {
      a1.pause();
      a2.pause();
      a1.volume = 0;
      a2.volume = 0;
      return;
    }

    if (elapsedSec < music2End) {
      const t2 = Math.min(elapsedSec - middleEnd, MUSIC2_SECTION_MS / 1000 - 0.05);
      a1.pause();
      a1.volume = 0;
      a2.volume = teaserEndVolume(elapsedSec, teaserEnd, 1);
      if (Math.abs(a2.currentTime - t2) > 0.35) a2.currentTime = Math.max(0, t2);
      if (shouldPlay && a2.paused) void a2.play().catch(() => {});
      if (!shouldPlay) a2.pause();
      return;
    }

    a1.pause();
    a2.pause();
    a1.volume = 0;
    a2.volume = 0;
  }, []);

  const startSynth = useCallback(
    (elapsedWallSec: number) => {
      const preset = audioPresetRef.current;
      const mode = preset.mode;
      if (mode === "single-continuous" || preset.middleTrack) return;
      stopSynth();

      const middleDur = SYNTH_MIDDLE_MS / 1000;
      const middleStartWall = MUSIC1_SECTION_WALL_MS / 1000;
      const middleEndWall = middleStartWall + middleDur;
      if (elapsedWallSec >= middleEndWall) return;

      try {
        const ctx = new AudioContext();
        ctxRef.current = ctx;
        void ctx.resume();
        const master = ctx.createGain();
        master.gain.value = 0.5;
        master.connect(ctx.destination);

        const delay = Math.max(0, middleStartWall - elapsedWallSec);
        const t0 = ctx.currentTime + delay;
        const effectiveFrom = Math.max(elapsedWallSec, middleStartWall);
        const remain = middleEndWall - effectiveFrom;
        if (remain <= 0) return;

        const fadeInSec = AUDIO_BRIDGE_FADE_MS / 1000;
        master.gain.setValueAtTime(0, t0);
        master.gain.linearRampToValueAtTime(0.22, t0 + fadeInSec);
        master.gain.linearRampToValueAtTime(0.5, t0 + Math.min(remain, fadeInSec + 1.2));

        const heartbeatWindow = Math.min(5, remain);
        const heartbeatStart = remain - heartbeatWindow;

        const makeOsc = (freq: number, type: OscillatorType, attack: number, peak: number) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = type;
          osc.frequency.setValueAtTime(freq, t0);
          gain.gain.setValueAtTime(0, t0);
          gain.gain.linearRampToValueAtTime(peak, t0 + attack);
          gain.gain.linearRampToValueAtTime(0, t0 + remain);
          osc.connect(gain).connect(master);
          osc.start(t0);
          osc.stop(t0 + remain);
          nodesRef.current.push(osc);
        };

        makeOsc(852, "sine", 2, 0.05);
        makeOsc(369, "sine", 1.5, 0.035);
        makeOsc(55, "sawtooth", 2, 0.025);

        let beatTime = heartbeatStart;
        let beatSpeed = 0.5;
        while (beatTime < remain) {
          const t = t0 + beatTime;
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(40, t);
          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.4, t + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);
          osc.connect(gain).connect(master);
          osc.start(t);
          osc.stop(t + 0.3);
          nodesRef.current.push(osc);
          beatTime += beatSpeed;
          beatSpeed = Math.max(0.18, beatSpeed * 0.88);
        }
      } catch {
        /* */
      }
    },
    [stopSynth],
  );

  const stopAll = useCallback(() => {
    pauseMusic();
    stopSynth();
  }, [pauseMusic, stopSynth]);

  const seek = useCallback(
    (ms: number) => {
      const clamped = Math.max(0, Math.min(totalMs, ms));
      setElapsedMs(clamped);
      playAnchorRef.current = { wall: performance.now(), elapsed: clamped };
      syncMusic(clamped / 1000, playing);
      if (playing) startSynth(clamped / 1000);
    },
    [totalMs, playing, syncMusic, startSynth],
  );

  const play = useCallback(() => {
    if (!audioReady) return;
    if (elapsedMs >= totalMs) {
      setElapsedMs(0);
      playAnchorRef.current = { wall: performance.now(), elapsed: 0 };
    } else {
      playAnchorRef.current = { wall: performance.now(), elapsed: elapsedMs };
    }
    setHasStarted(true);
    setPlaying(true);
    void acquireWakeLock();
    startKeepAwakeVideo();
    void ctxRef.current?.resume();
    syncMusic(playAnchorRef.current.elapsed / 1000, true);
    startSynth(playAnchorRef.current.elapsed / 1000);
  }, [audioReady, elapsedMs, totalMs, syncMusic, startSynth, acquireWakeLock, startKeepAwakeVideo]);

  useEffect(() => {
    if (!playing || !audioReady) return;
    const { wall, elapsed } = playAnchorRef.current;
    const e = elapsed + (performance.now() - wall);
    syncMusic(e / 1000, true);
    startSynth(e / 1000);
  }, [audioReady, playing, syncMusic, startSynth]);

  const pause = useCallback(() => {
    const { wall, elapsed } = playAnchorRef.current;
    const e = elapsed + (performance.now() - wall);
    setElapsedMs(e);
    playAnchorRef.current.elapsed = e;
    setPlaying(false);
    stopAll();
  }, [stopAll]);

  useEffect(() => {
    if (!playing) return;
    let raf: number;
    const tick = () => {
      const { wall, elapsed } = playAnchorRef.current;
      const e = elapsed + (performance.now() - wall);
      const allFrames = framesRef.current;
      const end = totalMsRef.current;
      if (e >= end) {
        setElapsedMs(end);
        setPlaying(false);
        stopAll();
        onEnd?.();
        return;
      }

      elapsedMsRef.current = e;
      syncMusic(e / 1000, true);

      // No re-renderizar a 60fps: solo al cambiar de beat o con throttle suave
      const idx = frameIndexAt(e, allFrames);
      const f = allFrames[idx];
      const needsSmooth =
        Boolean(f?.typewriter) ||
        Boolean(f?.overlayText) ||
        Boolean(f?.presenta) ||
        Boolean(f?.morvo) ||
        idx === 0;
      const interval = needsSmooth ? 40 : 120;
      const frameChanged = idx !== lastUiFrameIndexRef.current;
      const due = e - lastUiPushMsRef.current >= interval;
      if (frameChanged || due) {
        lastUiPushMsRef.current = e;
        lastUiFrameIndexRef.current = idx;
        setElapsedMs(e);
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, onEnd, stopAll, syncMusic]);

  useEffect(() => () => stopAll(), [stopAll]);

  /** Evita que el móvil atenúe la pantalla mientras el teaser está en play */
  useEffect(() => {
    if (!playing) {
      void releaseWakeLock();
      stopKeepAwakeVideo();
      return;
    }

    void acquireWakeLock();
    startKeepAwakeVideo();

    const interval = window.setInterval(() => {
      if (playingRef.current) void acquireWakeLock();
    }, 12000);

    const onVisibility = () => {
      if (document.visibilityState === "visible" && playingRef.current) {
        void acquireWakeLock();
        startKeepAwakeVideo();
        const { wall, elapsed } = playAnchorRef.current;
        const e = elapsed + (performance.now() - wall);
        void ctxRef.current?.resume();
        syncMusic(e / 1000, true);
      }
    };

    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibility);
      void releaseWakeLock();
      stopKeepAwakeVideo();
    };
  }, [playing, acquireWakeLock, releaseWakeLock, startKeepAwakeVideo, stopKeepAwakeVideo, syncMusic]);

  return (
    <div
      ref={rootRef}
      onClick={() => {
        if (!hasStarted) return;
        if (playing) pause();
        else play();
      }}
      onMouseEnter={revealControls}
      onMouseMove={() => {
        if (!hasStarted) return;
        revealControls();
        if (playing) scheduleHideControls(1000);
      }}
      onMouseLeave={() => {
        if (!hasStarted) return;
        if (playing) scheduleHideControls(200);
        else setControlsVisible(false);
      }}
      style={{
        position: "relative",
        background: BLACK,
        overflow: "hidden",
        borderRadius: isFullscreen ? 0 : 4,
        cursor: hasStarted ? "pointer" : undefined,
        ...style,
        ...(isFullscreen
          ? {
              width: "100vw",
              height: "100vh",
              maxWidth: "none",
              maxHeight: "100vh",
              aspectRatio: undefined,
            }
          : null),
      }}
    >
      <video
        ref={keepAwakeVideoRef}
        muted
        playsInline
        loop
        aria-hidden
        tabIndex={-1}
        style={{
          position: "fixed",
          width: 1,
          height: 1,
          opacity: 0,
          pointerEvents: "none",
          zIndex: -1,
        }}
      />
      <div ref={viewportRef} style={teaserViewportStyle(isFullscreen, embeddedAspect, fullscreenPortadaViewport)}>
      {!hasStarted && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            backgroundColor: BLACK,
            zIndex: 5,
            containerType: "size",
            overflow: "hidden",
          }}
        >
          <TeaserCoverBackdrop />
          <TeaserPresentaTitle
            font={font}
            isFullscreen={isFullscreen}
            paletteId={paletteId}
            cropY={teaserPortadaFullscreenCropY(isFullscreen, embeddedAspect, fullscreenPortadaViewport)}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              pointerEvents: "none",
            }}
          >
            <button
              type="button"
              onClick={play}
              disabled={!imagesReady || !audioReady}
              aria-label="Reproducir teaser"
              style={{
                pointerEvents: "auto",
                width: 64,
                height: 64,
                borderRadius: "50%",
                border: `2px solid ${accentColor}`,
                background: "rgba(0,0,0,0.45)",
                cursor: imagesReady && audioReady ? "pointer" : "wait",
                opacity: imagesReady && audioReady ? 1 : 0.55,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div
                style={{
                  width: 0,
                  height: 0,
                  borderLeft: `22px solid ${accentColor}`,
                  borderTop: "14px solid transparent",
                  borderBottom: "14px solid transparent",
                  marginLeft: 6,
                }}
              />
            </button>
          </div>
          <TeaserFullscreenButton
            accentColor={accentColor}
            isFullscreen={isFullscreen}
            onToggle={toggleFullscreen}
            style={{
              position: "absolute",
              right: 10,
              bottom: 10,
              zIndex: 6,
            }}
          />
        </div>
      )}

      {hasStarted && frame && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: frame.bg ?? BLACK,
            overflow: "hidden",
            containerType: "size",
          }}
        >
          {frame.presenta && coverPhraseFadeT < 1 && (
            <div style={{ ...crossfadeGpuLayerStyle, opacity: 1 - coverPhraseFadeT }}>
              <TeaserMontageSurface src={TEASER_COVER_BG} fit="cover" />
            </div>
          )}
          {frame.presenta && coverPhraseFadeT > 0 && (
            <div style={{ ...crossfadeGpuLayerStyle, opacity: coverPhraseFadeT }}>
              <TeaserMontageSurface src={TEASER_TYPEWRITER_BG} fit="cover" />
            </div>
          )}
          {frame.typewriter && introFamilyMix === 0 && (
            <TeaserMontageSurface src={TEASER_TYPEWRITER_BG} fit="cover" />
          )}
          {frame.typewriter && introFamilyMix > 0 && introFirstFamilyPhoto && (
            <TeaserLayeredMontage
              key={`intro-family|${introFirstFamilyPhoto}`}
              backSrc={TEASER_TYPEWRITER_BG}
              frontSrc={introFirstFamilyPhoto}
              frontOpacity={introFamilyMix}
            />
          )}
          {frame.bgVideo && frame.layerBackImg && (
            /* isolation: el z-index interno de MontageSurface no debe tapar el clip */
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 0,
                isolation: "isolate",
              }}
            >
              <TeaserMontageSurface src={frame.layerBackImg} fit="cover" />
            </div>
          )}
          {frame.bgVideo && (
            <TeaserClipVideo
              key={frame.bgVideo}
              src={frame.bgVideo}
              fit={frame.fit ?? "cover"}
              zoom={frame.videoZoom ?? 1}
              localMs={frameLocalMs}
              playing={playing}
              volume={frame.videoVolume ?? 0.12}
              elapsedSec={elapsedMs / 1000}
              teaserEndSec={totalMs / 1000}
              layered={Boolean(frame.layerBackImg)}
            />
          )}
          {frame.bgImg && !frame.typewriter && !frame.presenta && frame.layered && isBalloonsToMorvo && (
            <>
              {balloonsMorvoTransition.balloonsOpacity > 0 && (
                <div
                  style={{
                    ...crossfadeGpuLayerStyle,
                    opacity: balloonsMorvoTransition.balloonsOpacity,
                  }}
                >
                  <TeaserLayeredMontage
                    key={layeredMontageKey}
                    backSrc={layeredBackSrc}
                    frontSrc={frame.bgImg}
                    backZoom={layeredBackZoom}
                  />
                </div>
              )}
              {balloonsMorvoTransition.morvoOpacity > 0 && (
                <div
                  style={{
                    position: "absolute",
                    left: `${3.5 * (1 - balloonsMorvoTransition.morvoGrow)}%`,
                    top: `${3.5 * (1 - balloonsMorvoTransition.morvoGrow)}%`,
                    width: `${93 + 7 * balloonsMorvoTransition.morvoGrow}%`,
                    height: `${93 + 7 * balloonsMorvoTransition.morvoGrow}%`,
                    opacity: balloonsMorvoTransition.morvoOpacity,
                    overflow: "hidden",
                    willChange: "opacity, width, height, left, top",
                    WebkitBackfaceVisibility: "hidden",
                    backfaceVisibility: "hidden",
                  }}
                >
                  <TeaserMontageSurface src={MORVO_FINAL_BG} fit="cover" />
                </div>
              )}
            </>
          )}
          {frame.bgImg && !frame.typewriter && !frame.presenta && frame.layered && !isBalloonsToMorvo && (
            <TeaserLayeredMontage
              key={layeredMontageKey}
              backSrc={layeredBackSrc}
              frontSrc={frame.bgImg}
              backZoom={layeredBackZoom}
            />
          )}
          {frame.bgImg && !frame.typewriter && !frame.presenta && !frame.layered && morvoCrossfadeT > 0 && (
            <>
              <div style={{ ...crossfadeGpuLayerStyle, opacity: 1 - morvoCrossfadeT }}>
                <TeaserMontageSurface src={frame.bgImg} fit={frame.fit ?? "cover"} />
              </div>
              <div style={{ ...crossfadeGpuLayerStyle, opacity: morvoCrossfadeT }}>
                <TeaserMontageSurface src={MORVO_FINAL_BG} fit="cover" />
              </div>
            </>
          )}
          {frame.bgImg && !frame.typewriter && !frame.presenta && !frame.layered && morvoCrossfadeT === 0 && (
            <TeaserMontageSurface src={frame.bgImg} fit={frame.fit ?? "cover"} />
          )}
          {(frame.typewriter ||
            (paletteId === "raiz_petroleo" &&
              frame.presenta &&
              elapsedMs >= PETROLEO_COVER_TO_TYPEWRITER_FADE_START_MS)) &&
            introPhraseOpacity(elapsedMs, paletteId) > 0 && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 4,
                opacity: introPhraseOpacity(elapsedMs, paletteId) * introFamilyTextOpacity(introFamilyMix),
                pointerEvents: "none",
              }}
            >
              <TeaserVerticalGrowText
                font={font}
                accentColor={typewriterAccent}
                textColor={typewriterTextColor}
                scrim
                scrimOpacity={
                  0.38 *
                  introPhraseOpacity(elapsedMs, paletteId) *
                  introFamilyTextOpacity(introFamilyMix)
                }
                localMs={introPhraseLocalMs(elapsedMs, paletteId)}
                text={TYPEWRITER_TEXT}
                pacing="progressive"
                uppercase
                revealMs={INTRO_REVEAL_MS}
                softAccentGlow={petroleoSoftAccentGlow}
              />
            </div>
          )}
          {frame.overlayText && teaserPhraseFadeOpacity(frameLocalMs) > 0 && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 4,
                opacity: teaserPhraseFadeOpacity(frameLocalMs),
                pointerEvents: "none",
              }}
            >
              <TeaserVerticalGrowText
                font={font}
                accentColor={typewriterAccent}
                textColor={typewriterTextColor}
                scrim
                scrimOpacity={0.38 * teaserPhraseFadeOpacity(frameLocalMs)}
                localMs={teaserPhraseRevealLocalMs(frameLocalMs)}
                text={frame.overlayText}
                pacing="progressive"
                uppercase={false}
                revealMs={OVERLAY_REVEAL_MS}
                softAccentGlow={petroleoSoftAccentGlow}
              />
            </div>
          )}
          {(frame.videoTitle || frame.videoTitleLines) && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 5,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: frame.videoTitleAnchor === "top" ? "flex-start" : "flex-end",
                padding:
                  frame.videoTitleAnchor === "top"
                    ? "clamp(20px, 6cqh, 56px) clamp(16px, 4cqw, 48px) clamp(16px, 4cqh, 40px)"
                    : "clamp(16px, 4cqw, 48px) clamp(16px, 4cqw, 48px) clamp(28px, 7cqh, 64px)",
                boxSizing: "border-box",
                pointerEvents: "none",
                background:
                  frame.videoTitleAnchor === "top"
                    ? "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 42%, transparent 70%)"
                    : "linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.2) 42%, transparent 70%)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "clamp(2px, 0.6cqh, 8px)",
                  textAlign: "center",
                  fontFamily: font,
                  fontWeight: 700,
                  fontSize: "clamp(18px, min(4.5cqw, 6cqh), 44px)",
                  letterSpacing: "0.08em",
                  lineHeight: 1.15,
                  textTransform: "uppercase",
                  color: paletteId === "raiz_petroleo" ? ESMERALDA_SALMON : typewriterTextColor,
                  textShadow: "0 2px 18px rgba(0,0,0,0.85)",
                  transform:
                    frame.videoTitleOffsetY != null && frame.videoTitleOffsetY !== 0
                      ? `translateY(${frame.videoTitleOffsetY}px)`
                      : undefined,
                }}
              >
                {(frame.videoTitleLines ?? [frame.videoTitle!]).map((line, i) => {
                  const scale = frame.videoTitleLineScales?.[i] ?? 1;
                  return (
                    <span key={`${line}-${i}`} style={scale !== 1 ? { fontSize: `${scale}em` } : undefined}>
                      {line}
                    </span>
                  );
                })}
              </div>
            </div>
          )}
          {paletteId === "raiz_petroleo" && !frame.presenta && !frame.morvo && (
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 3,
                background: `${SALMON}73`,
                pointerEvents: "none",
              }}
            />
          )}
          {!frame.typewriter &&
            !frame.overlayText &&
            !frame.videoTitle &&
            !frame.videoTitleLines &&
            !frame.presenta &&
            !frame.bgVideo &&
            paletteId !== "raiz_petroleo" && <TeaserFilmGrain />}
          {coverPresentaOpacity(elapsedMs, paletteId) > 0 && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 3,
                opacity: coverPresentaOpacity(elapsedMs, paletteId),
                pointerEvents: "none",
              }}
            >
              <TeaserPresentaTitle
                font={font}
                isFullscreen={isFullscreen}
                paletteId={paletteId}
                cropY={teaserPortadaFullscreenCropY(isFullscreen, embeddedAspect, fullscreenPortadaViewport)}
              />
            </div>
          )}
          {(frame.morvo || morvoCrossfadeT > 0) && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 4,
                opacity: frame.morvo ? 1 : balloonsMorvoTransition.titleOpacity,
                pointerEvents: "none",
              }}
            >
              <FinalMorvoTitle font={font} paletteId={paletteId} />
            </div>
          )}
        </div>
      )}
      </div>

      {hasStarted && (
        <TeaserControls
          playing={playing}
          elapsedMs={elapsedMs}
          totalMs={totalMs}
          accentColor={accentColor}
          isFullscreen={isFullscreen}
          visible={controlsVisible}
          onPlay={play}
          onPause={pause}
          onSeek={seek}
          onToggleFullscreen={toggleFullscreen}
        />
      )}
    </div>
  );
}

function TeaserPresentaTitle({
  font,
  isFullscreen,
  paletteId,
  cropY = 0,
}: {
  font: string;
  isFullscreen: boolean;
  paletteId?: PaletteId;
  /** Recorte vertical del viewport fullscreen (px) — evita que «Compañía» quede fuera de pantalla */
  cropY?: number;
}) {
  const isMobile = useIsMobile();
  const mobileFullscreen = isMobile && isFullscreen;
  const titleRed = paletteId === "raiz_petroleo" ? ESMERALDA_SALMON : RED;
  const textGlow = paletteId === "raiz_petroleo" ? "none" : `0 0 16px ${RED}cc, 0 0 32px ${RED}55, 0 2px 10px rgba(0,0,0,0.5)`;
  const sidePad = "clamp(10px, 4cqw, 32px)";
  const baseTop = "clamp(24px, 8cqh, 56px)";
  const baseBottom = "clamp(24px, 8cqh, 56px)";
  const cropPad = Math.max(0, cropY);

  const top = mobileFullscreen
    ? `calc(${cropPad}px + ${baseTop} + 10px)`
    : isMobile
      ? `calc(${cropPad}px + ${baseTop})`
      : `calc(${cropPad}px + ${baseTop} + 20px)`;
  const bottom = isMobile
    ? `calc(${cropPad}px + ${baseBottom})`
    : `calc(${cropPad}px + ${baseBottom} + 10px)`;

  const topTextStyle: CSSProperties = {
    position: "absolute",
    top,
    left: sidePad,
    right: sidePad,
    margin: 0,
    fontFamily: font,
    fontSize: "clamp(9px, min(4.2cqw, 5.5cqh), 28px)",
    fontWeight: 700,
    letterSpacing: "clamp(0.04em, 0.65cqw, 0.12em)",
    lineHeight: 1.3,
    textAlign: "center",
    textTransform: "uppercase",
    color: titleRed,
    WebkitTextFillColor: paletteId === "raiz_petroleo" ? titleRed : undefined,
    textShadow: textGlow,
    maxWidth: "100%",
    boxSizing: "border-box",
  };

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 2,
        containerType: "size",
        pointerEvents: "none",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.22)",
        }}
      />
      {mobileFullscreen ? (
        <p style={topTextStyle}>
          <span style={{ display: "block" }}>Compañía</span>
          <span style={{ display: "block" }}>OBSCENA TEATRAL</span>
        </p>
      ) : (
        <p style={topTextStyle}>{TEASER_COVER_LINE_TOP}</p>
      )}
      <p
        style={{
          position: "absolute",
          bottom,
          left: sidePad,
          right: sidePad,
          margin: 0,
          fontFamily: font,
          fontSize: "clamp(14px, min(7cqw, 10cqh), 44px)",
          fontWeight: 700,
          letterSpacing: "clamp(0.08em, 1.4cqw, 0.18em)",
          lineHeight: 1.1,
          textAlign: "center",
          textTransform: "uppercase",
          color: titleRed,
          WebkitTextFillColor: paletteId === "raiz_petroleo" ? titleRed : undefined,
          textShadow: textGlow,
          maxWidth: "100%",
          boxSizing: "border-box",
        }}
      >
        {TEASER_COVER_LINE_BOTTOM}
      </p>
    </div>
  );
}

const TEASER_CREDIT_BLUE_MID = "#243D5C";
const TEASER_CREDIT_BLUE_LIGHT = "#3A5A7A";

const castRowFlickerTransition = (delay: number) => ({
  duration: 3.4,
  repeat: Infinity,
  ease: "easeInOut" as const,
  delay,
  repeatDelay: 0.2,
});

const CAST_ROW_OPACITY = [0.86, 1, 0.9, 1, 0.88, 1] as const;

function CastCreditColumn({
  character,
  actorLines,
  font,
  delay,
  isMobile,
}: {
  character: string;
  actorLines: readonly string[];
  font: string;
  delay: number;
  isMobile: boolean;
}) {
  const rowTransition = castRowFlickerTransition(delay);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.94, filter: "blur(5px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.9, delay: delay - 0.35, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: "clamp(2px, 0.45cqh, 5px)",
        textAlign: "center",
        minWidth: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <motion.div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "inherit",
          width: "100%",
        }}
        animate={{ opacity: [...CAST_ROW_OPACITY] }}
        transition={rowTransition}
      >
        <motion.span
          style={{
            fontFamily: font,
            fontSize: isMobile
              ? "clamp(7px, min(3.5cqw, 5cqh), 14px)"
              : "clamp(8px, min(3.6cqw, 5.2cqh), 17px)",
            fontWeight: 600,
            letterSpacing: "0.03em",
            color: TEASER_CREDIT_DARK_BLUE,
            lineHeight: 1.15,
            minHeight: "1.15em",
          }}
          animate={{
            textShadow: [
              `0 0 8px ${TEASER_CREDIT_DARK_BLUE}66`,
              `0 0 16px ${TEASER_CREDIT_BLUE_MID}cc, 0 0 28px ${TEASER_CREDIT_BLUE_LIGHT}55`,
              `0 0 6px ${TEASER_CREDIT_DARK_BLUE}55`,
              `0 0 14px ${TEASER_CREDIT_BLUE_MID}bb, 0 0 24px ${TEASER_CREDIT_BLUE_LIGHT}44`,
              `0 0 8px ${TEASER_CREDIT_DARK_BLUE}77`,
              `0 0 12px ${TEASER_CREDIT_BLUE_MID}aa, 0 0 20px ${TEASER_CREDIT_BLUE_LIGHT}33`,
            ],
          }}
          transition={rowTransition}
        >
          {character}
        </motion.span>
        <motion.span
          aria-hidden
          style={{
            fontFamily: font,
            fontSize: "clamp(4px, min(1.2cqw, 1.8cqh), 8px)",
            lineHeight: 1,
            letterSpacing: "0.08em",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
          animate={{
            color: [
              `${TEASER_CREDIT_BLUE_MID}59`,
              `${TEASER_CREDIT_BLUE_LIGHT}d9`,
              `${TEASER_CREDIT_BLUE_MID}66`,
              `${TEASER_CREDIT_BLUE_LIGHT}e6`,
              `${TEASER_CREDIT_BLUE_MID}61`,
              `${TEASER_CREDIT_BLUE_LIGHT}c4`,
            ],
          }}
          transition={rowTransition}
        >
          <span>·</span>
          <span>·</span>
          <span>·</span>
        </motion.span>
        <motion.span
          style={{
            fontFamily: font,
            fontSize: isMobile
              ? "clamp(6px, min(2.8cqw, 4cqh), 11px)"
              : "clamp(7px, min(3.2cqw, 4.6cqh), 15px)",
            fontWeight: 700,
            letterSpacing: isMobile ? "0.05em" : "0.08em",
            textTransform: "uppercase",
            lineHeight: 1.2,
            maxWidth: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0,
            minHeight: "2.4em",
            color: TEASER_CREDIT_DARK_BLUE,
          }}
          animate={{
            color: [
              `${TEASER_CREDIT_DARK_BLUE}d1`,
              TEASER_CREDIT_BLUE_LIGHT,
              `${TEASER_CREDIT_DARK_BLUE}db`,
              TEASER_CREDIT_BLUE_MID,
              `${TEASER_CREDIT_DARK_BLUE}cc`,
              `${TEASER_CREDIT_BLUE_LIGHT}f2`,
            ],
            textShadow: [
              `0 0 6px ${TEASER_CREDIT_DARK_BLUE}33`,
              `0 0 14px ${TEASER_CREDIT_BLUE_MID}aa, 0 0 26px ${TEASER_CREDIT_BLUE_LIGHT}66`,
              `0 0 4px ${TEASER_CREDIT_DARK_BLUE}22`,
              `0 0 12px ${TEASER_CREDIT_BLUE_MID}99, 0 0 22px ${TEASER_CREDIT_BLUE_LIGHT}55`,
              `0 0 5px ${TEASER_CREDIT_DARK_BLUE}28`,
              `0 0 10px ${TEASER_CREDIT_BLUE_MID}77`,
            ],
          }}
          transition={rowTransition}
        >
          {actorLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}

function FinalMorvoCastCredits({ font }: { font: string }) {
  const isMobile = useIsMobile();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        gap: isMobile ? "clamp(2px, 1.2cqw, 6px)" : "clamp(8px, 3.2cqw, 22px)",
        width: isMobile ? "min(96%, 320px)" : "min(88%, 520px)",
        marginLeft: 0,
        alignItems: "start",
        transform: "translateY(5px)",
        paddingBottom: 0,
      }}
    >
      {TEASER_CAST.map(({ character, actorLines }, i) => (
        <CastCreditColumn
          key={character}
          character={character}
          actorLines={actorLines}
          font={font}
          delay={0.55 + i * 0.48}
          isMobile={isMobile}
        />
      ))}
    </motion.div>
  );
}

function FinalMorvoTitle({ font, paletteId }: { font: string; paletteId?: PaletteId }) {
  const isMobile = useIsMobile();
  const isPetroleo = paletteId === "raiz_petroleo";

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 2,
        containerType: "size",
        padding: isMobile
          ? "clamp(6px, 2cqh, 14px) clamp(8px, 3cqw, 20px) clamp(14%, 18cqh, 26%)"
          : "clamp(8px, 3cqh, 20px) clamp(10px, 4cqw, 28px) clamp(16%, 20cqh, 28%)",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: isMobile ? "clamp(10px, 3.5cqh, 18px)" : "clamp(12px, 4cqh, 28px)",
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.18)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          flex: "0 0 auto",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MorvoTeaserTitleHeadline
          font={font}
          sizeUnit="cq"
          titleColor={isPetroleo ? TEASER_CREDIT_MATCH_RED : undefined}
          titleDarkColor={isPetroleo ? TEASER_CREDIT_MATCH_RED_DARK : undefined}
          titleFlicker="default"
          centerCredit
        />
      </div>
      <div
        style={{
          position: "relative",
          zIndex: 1,
          flex: "0 0 auto",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <FinalMorvoCastCredits font={font} />
      </div>
    </div>
  );
}
