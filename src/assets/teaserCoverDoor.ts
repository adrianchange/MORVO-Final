/** Geometría de la puerta — píxeles en teaser-cover-paris-bilal-arches.jpg (4000×6000) */
export const TEASER_COVER_IMAGE = { w: 4000, h: 6000 } as const;

/**
 * Vano calibrado en vista embebida (16×17 %, top 44 %, −3 px) — invertido con cover.
 * Misma transformación que drawCoverImage / TeaserMontageSurface → fullscreen = embebida.
 */
export const TEASER_COVER_DOOR = {
  x: 1680,
  y: 2840,
  w: 640,
  h: 382,
} as const;

/** Encuadre PortadaMejorada (832×1248) — halo + tres personajes + foco */
export const PETROLEO_PORTADA_OBJECT_POSITION = "center 12%";

export type CoverViewportRect = {
  leftPct: number;
  topPct: number;
  widthPct: number;
  heightPct: number;
  archRadiusPx: number;
};

/** Misma lógica que drawCoverImage en TeaserVideo */
export function coverImageTransform(
  viewportW: number,
  viewportH: number,
  imgW: number,
  imgH: number,
) {
  const ir = imgW / imgH;
  const cr = viewportW / viewportH;
  let dw: number;
  let dh: number;
  let dx: number;
  let dy: number;
  if (ir > cr) {
    dh = viewportH;
    dw = viewportH * ir;
    dx = (viewportW - dw) / 2;
    dy = 0;
  } else {
    dw = viewportW;
    dh = viewportW / ir;
    dx = 0;
    dy = (viewportH - dh) / 2;
  }
  const scale = dw / imgW;
  return { scale, offsetX: dx, offsetY: dy };
}

/** Convierte un rectángulo de la imagen fuente a % del viewport 16:9 con cover */
export function coverImageRectToViewport(
  rect: { x: number; y: number; w: number; h: number },
  viewportW: number,
  viewportH: number,
  imgW = TEASER_COVER_IMAGE.w,
  imgH = TEASER_COVER_IMAGE.h,
): CoverViewportRect {
  const { scale, offsetX, offsetY } = coverImageTransform(viewportW, viewportH, imgW, imgH);
  const left = rect.x * scale + offsetX;
  const top = rect.y * scale + offsetY;
  const width = rect.w * scale;
  const height = rect.h * scale;
  return {
    leftPct: (left / viewportW) * 100,
    topPct: (top / viewportH) * 100,
    widthPct: (width / viewportW) * 100,
    heightPct: (height / viewportH) * 100,
    archRadiusPx: width / 2,
  };
}

export function getTeaserCoverDoorViewport(
  viewportW: number,
  viewportH: number,
): CoverViewportRect {
  return coverImageRectToViewport(TEASER_COVER_DOOR, viewportW, viewportH);
}
