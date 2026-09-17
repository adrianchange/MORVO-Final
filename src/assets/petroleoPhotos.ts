/** Fotos locales — paleta Raíz Petróleo (carpeta Morvo del escritorio) */
export const PETROLEO_PHOTOS = {
  mario: "/images/petroleo/MarioActor.png",
  cristian: "/images/petroleo/CristianActor.jpg",
  victor: "/images/petroleo/VictorActor.png",
  /** Puerta del teaser (calibrada) */
  portada: "/images/petroleo/PortadaMejorada.jpg",
  /** Vista 02 — fondo (cover) + frontal (contain) */
  portadaFlyer: "/images/petroleo/Portadaposible.jpg",
  /** Vista 02 — foto frontal (contain) */
  portadaFlyerFront: "/images/petroleo/Portadaposible.jpg",
  sinopsis: "/images/petroleo/Sinopsis1.jpg",
} as const;

/** Fondo compartido Petróleo — vistas 02, 04–08 (mismo teal que PortadaFondoVerde) */
export const PETROLEO_SLIDE_BG = "#325F51";
/** @deprecated Usar PETROLEO_SLIDE_BG */
export const PETROLEO_TRIAL_SLIDE_BG = PETROLEO_SLIDE_BG;
/** @deprecated Usar PETROLEO_SLIDE_BG */
export const PETROLEO_FLYER_BG = PETROLEO_SLIDE_BG;

const PETROLEO_TEASER = "/images/teaser/petroleo";

const PETROLEO_FAMILIA_NINOS: readonly string[] = [
  `${PETROLEO_TEASER}/victor-pequeno.png`,
  `${PETROLEO_TEASER}/cristian-pequeno.png`,
  `${PETROLEO_TEASER}/mario-gordo.png`,
];

const PETROLEO_FAMILIA_ESCENAS: readonly string[] = [
  `${PETROLEO_TEASER}/jardinero.png`,
  `${PETROLEO_TEASER}/david-benes-15UxUVXcMBk-unsplash.jpg`,
  `${PETROLEO_TEASER}/eugenia-pan-kiv-PLka1OBImFw-unsplash.jpg`,
  `${PETROLEO_TEASER}/darien-attridge-18ez9ijsAEM-unsplash.jpg`,
  `${PETROLEO_TEASER}/genet-schneider-Rqr4IErJ1h4-unsplash.jpg`,
  `${PETROLEO_TEASER}/hans-ott-YG2rJQvs-bc-unsplash.jpg`,
  `${PETROLEO_TEASER}/hayley-clues-4KGH5Qzoddk-unsplash.jpg`,
  `${PETROLEO_TEASER}/yves-cedric-schulze-97VMqi8VWN4-unsplash.jpg`,
  `${PETROLEO_TEASER}/nuno-alves-77tcyyZ5fDA-unsplash.jpg`,
];

/** Sustituciones en el montaje Petróleo (nahid → VictorAfterBosque, etc.) */
export const PETROLEO_TEASER_URL_REPLACEMENTS: Record<string, string> = {
  "/images/teaser/nuevas/nahid-hatami-tUXjhvLxmYk-unsplash.jpg": `${PETROLEO_TEASER}/victor-after-bosque.png`,
};

/** Fotos extra al inicio de la 2.ª parte del teaser Petróleo */
export const TEASER_PETROLEO_REST_EXTRA_URLS: readonly string[] = [
  `${PETROLEO_TEASER}/MarioEnelBosque.jpg`,
  `${PETROLEO_TEASER}/Sinopsis1.jpg`,
];

function interleavePetroleoFamilia(ninos: readonly string[], escenas: readonly string[]): string[] {
  const max = Math.max(ninos.length, escenas.length);
  const out: string[] = [];
  for (let i = 0; i < max; i++) {
    if (i < ninos.length) out.push(ninos[i]!);
    if (i < escenas.length) out.push(escenas[i]!);
  }
  return out;
}

/** 1.er tramo del teaser Petróleo (10,6 s → 30 s) — niños intercalados con escenas */
export const TEASER_PETROLEO_FAMILIA_URLS: readonly string[] = interleavePetroleoFamilia(
  PETROLEO_FAMILIA_NINOS,
  PETROLEO_FAMILIA_ESCENAS,
);

/** Retratos 04–06: tono B/N unificado (referencia Cristian) */
export const PETROLEO_PORTRAIT_URLS = new Set<string>([
  PETROLEO_PHOTOS.mario,
  PETROLEO_PHOTOS.cristian,
  PETROLEO_PHOTOS.victor,
]);

/** Retratos 04–06: tono B/N unificado */
export const PETROLEO_PORTRAIT_FILTER = "grayscale(100%) contrast(1.06) brightness(0.97)";

export function isPetroleoPortrait(url?: string): url is (typeof PETROLEO_PHOTOS)[keyof typeof PETROLEO_PHOTOS] {
  return url != null && PETROLEO_PORTRAIT_URLS.has(url);
}

export function getPetroleoPortraitFilter(url?: string): string | undefined {
  if (!isPetroleoPortrait(url)) return undefined;
  return PETROLEO_PORTRAIT_FILTER;
}
