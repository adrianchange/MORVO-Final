export type PaletteFonts = {
  display: string;
  body: string;
};

const DEFAULT_FONTS: PaletteFonts = {
  display: "'Cinzel', serif",
  body: "'Cormorant Garamond', serif",
};

/**
 * Solo paleta Invertida — no reutilizar en otras versiones.
 * Libre Baskerville (títulos) + Source Serif 4 (cuerpo).
 */
export const INVERTIDA_FONTS: PaletteFonts = {
  display: "'Libre Baskerville', serif",
  body: "'Source Serif 4', serif",
};

/** Raíz Helecho — cuerpo: sans condensada similar a Killing; acentos completos */
export const HELECHO_FONTS: PaletteFonts = {
  display: "'Barlow Condensed', sans-serif",
  body: "'Barlow Condensed', sans-serif",
};

/** Solo el título MORVO usa la réplica Killing Eve */
export const HELECHO_TITLE_FONT = "'Killing', sans-serif";

/** Título portada Helecho — Killing mide visualmente más pequeño que Cinzel a igual px */
export const HELECHO_TITLE_FONT_SIZE = "clamp(90px, 16.5vw, 265px)";

/** Estilo título MORVO — mayúsculas, kerning apretado como en la serie */
export const HELECHO_TITLE_STYLE = {
  fontFamily: HELECHO_TITLE_FONT,
  letterSpacing: "0.02em",
  fontWeight: 400,
  lineHeight: 1,
  textTransform: "uppercase" as const,
};

/** Raíz Selva — crédito portada (subtítulo «Naz Montés» en todas las paletas) */
export const SELVA_CREDIT_FONT = "'Bodoni Moda', serif";

/** Tamaño y compresión del subtítulo (referencia Selva) */
export const DROP_CREDIT_FONT_SIZE = "clamp(15px, 2vw, 42px)";
export const DROP_CREDIT_SCALE_X = { mobile: 0.78, desktop: 0.86 } as const;

export function dropCreditLetterSpacing(mobile: boolean) {
  return mobile ? "0.03em" : "0.05em";
}

export function dropCreditScaleX(mobile: boolean) {
  return mobile ? DROP_CREDIT_SCALE_X.mobile : DROP_CREDIT_SCALE_X.desktop;
}

/** Raíz Pino — estiramiento horizontal compartido con Niebla (valor histórico) */
export const PINO_TITLE_SCALE_X = 1.14;

/** Raíz Niebla — más presencia en portada, cercano a Esmeralda */
export const NIEBLA_TITLE_SCALE_X = 1.38;
export const NIEBLA_TITLE_LETTER_GAP = "0.07em";
/** Killing condensada: px mayor que Helecho para compensar Cinzel 900 de Esmeralda */
export const NIEBLA_TITLE_FONT_SIZE = "clamp(105px, 18.5vw, 295px)";

/** Raíz Esmeralda — referencia de presencia del título MORVO en portada */
export const ESMERALDA_TITLE_FONT_SIZE = "clamp(60px, 11vw, 170px)";
export const ESMERALDA_TITLE_LETTER_GAP = "0.18em";

/** Raíz Petróleo — Killing compensada para igualar huella visual de Esmeralda (Cinzel 900) */
export const PETROLEO_TITLE_FONT_SIZE = "clamp(75px, 13.75vw, 212px)";
export const PETROLEO_TITLE_SCALE_X = 1.08;

/** Raíz Selva — un poco más ancho que Niebla/Pino */
export const SELVA_TITLE_SCALE_X = 1.34;

/** Raíz Helecho — estiramiento horizontal del título MORVO */
export const HELECHO_TITLE_SCALE_X = 1.26;

type ThemeWithFonts = { fonts?: PaletteFonts };

export function paletteFonts(theme: ThemeWithFonts): PaletteFonts {
  return theme.fonts ?? DEFAULT_FONTS;
}

export function fontDisplay(theme: ThemeWithFonts): string {
  return paletteFonts(theme).display;
}

export function fontBody(theme: ThemeWithFonts): string {
  return paletteFonts(theme).body;
}
