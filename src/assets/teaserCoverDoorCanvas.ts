import type { PetroleoDoorLayout } from "./teaserPetroleo";

export function doorRectFromLayout(
  viewportW: number,
  viewportH: number,
  layout: PetroleoDoorLayout,
) {
  const w = viewportW * (layout.widthPct / 100);
  const h = viewportH * (layout.heightPct / 100);
  const x = viewportW * (layout.leftPct / 100) - w / 2;
  const y = viewportH * (layout.topPct / 100) + layout.topOffsetPx;
  return { x, y, w, h };
}

/** Recorte arqueado superior — mismo perfil que border-radius en CSS */
export function clipArchPortal(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const r = w / 2;
  ctx.beginPath();
  ctx.moveTo(x, y + h);
  ctx.lineTo(x, y + r);
  ctx.arc(x + w / 2, y + r, r, Math.PI, 0);
  ctx.lineTo(x + w, y + h);
  ctx.closePath();
  ctx.clip();
}

function objectPositionOffset(
  objectPosition: string,
  areaW: number,
  areaH: number,
  imgW: number,
  imgH: number,
) {
  const parts = objectPosition.trim().split(/\s+/);
  const posX = parts[0] ?? "center";
  const posY = parts[1] ?? "center";
  const px = posX === "center" ? 0.5 : posX.endsWith("%") ? parseFloat(posX) / 100 : 0.5;
  const py = posY === "center" ? 0.5 : posY.endsWith("%") ? parseFloat(posY) / 100 : 0.5;
  return {
    x: (areaW - imgW) * px,
    y: (areaH - imgH) * py,
  };
}

export function drawImageCoverInRect(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  rx: number,
  ry: number,
  rw: number,
  rh: number,
  objectPosition: string,
) {
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;
  if (!iw || !ih) return;
  const scale = Math.max(rw / iw, rh / ih);
  const sw = iw * scale;
  const sh = ih * scale;
  const { x: ox, y: oy } = objectPositionOffset(objectPosition, rw, rh, sw, sh);
  ctx.drawImage(img, rx + ox, ry + oy, sw, sh);
}

/** PortadaMejorada dentro del vano — misma calibración que el overlay CSS */
export function drawPetroleoDoorPortada(
  ctx: CanvasRenderingContext2D,
  portada: HTMLImageElement,
  viewportW: number,
  viewportH: number,
  opacity: number,
  layout: PetroleoDoorLayout,
) {
  if (opacity <= 0) return;
  const { x, y, w, h } = doorRectFromLayout(viewportW, viewportH, layout);
  ctx.save();
  clipArchPortal(ctx, x, y, w, h);
  ctx.globalAlpha = opacity;
  drawImageCoverInRect(ctx, portada, x, y, w, h, layout.objectPosition);
  ctx.restore();
}
