"""
Retoque Caravaggio — PortadaPosible.jpg
Chiaroscuro limpio (referencia: Caravaggio.jpg en helecho/). Rápido, sin filtros pesados.
"""
from __future__ import annotations

from collections import deque
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageFilter

MORVO = Path.home() / "Desktop" / "Morvo" / "MORVO"
ROOT = Path(__file__).resolve().parents[1]
SOURCE = MORVO / "PortadaPosible.jpg"
STYLE_REF = ROOT / "public" / "images" / "teaser" / "helecho" / "Caravaggio.jpg"
OUTPUTS = [
    MORVO / "PortadaPosible-Caravaggio.jpg",
    MORVO / "PortadaPosible-Oleo.jpg",
    ROOT / "public" / "images" / "petroleo" / "PortadaPosible-Caravaggio.jpg",
    ROOT / "public" / "images" / "petroleo" / "PortadaPosible-Oleo.jpg",
]


def load_rgb(path: Path) -> np.ndarray:
    img = cv2.imread(str(path), cv2.IMREAD_COLOR)
    if img is None:
        raise FileNotFoundError(path)
    return cv2.cvtColor(img, cv2.COLOR_BGR2RGB)


def save_rgb(path: Path, rgb: np.ndarray, quality: int = 94) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(rgb, mode="RGB").save(path, quality=quality, optimize=True)


def reference_bg(ref: np.ndarray) -> np.ndarray:
    dark = ref[ref.mean(axis=2) < 42]
    if len(dark) == 0:
        return np.array([14, 8, 4], dtype=np.float32)
    return dark.mean(axis=0).astype(np.float32)


def flood_white_bg(rgb: np.ndarray) -> np.ndarray:
    h, w = rgb.shape[:2]
    lab = cv2.cvtColor(rgb, cv2.COLOR_RGB2LAB)
    l_ch, a_ch, b_ch = cv2.split(lab)
    chroma = np.hypot(a_ch.astype(np.float32) - 128, b_ch.astype(np.float32) - 128)
    is_bg = (l_ch > 228) | ((l_ch > 198) & (chroma < 18))

    bg = np.zeros((h, w), dtype=bool)
    seen = np.zeros((h, w), dtype=bool)
    q: deque[tuple[int, int]] = deque()
    for x in range(w):
        for y in (0, h - 1):
            if is_bg[y, x]:
                q.append((y, x))
    for y in range(h):
        for x in (0, w - 1):
            if is_bg[y, x]:
                q.append((y, x))

    while q:
        y, x = q.popleft()
        if seen[y, x]:
            continue
        seen[y, x] = True
        if not is_bg[y, x]:
            continue
        bg[y, x] = True
        for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
            if 0 <= ny < h and 0 <= nx < w:
                q.append((ny, nx))

    return ~bg


def grabcut_mask(rgb: np.ndarray) -> np.ndarray:
    h, w = rgb.shape[:2]
    max_side = 960
    scale = min(1.0, max_side / max(h, w))
    if scale < 1.0:
        sw, sh = int(w * scale), int(h * scale)
        small = cv2.resize(rgb, (sw, sh), interpolation=cv2.INTER_AREA)
        subj = _grabcut_core(small, sw, sh)
        up = cv2.resize(subj.astype(np.uint8), (w, h), interpolation=cv2.INTER_LINEAR)
        return up > 127
    return _grabcut_core(rgb, w, h)


def _grabcut_core(rgb: np.ndarray, w: int, h: int) -> np.ndarray:
    bgr = cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR)
    mask = np.zeros((h, w), np.uint8)
    bgd = np.zeros((1, 65), np.float64)
    fgd = np.zeros((1, 65), np.float64)
    mx, my = int(w * 0.02), int(h * 0.015)
    rect = (mx, my, w - 2 * mx, h - 2 * my)
    cv2.grabCut(bgr, mask, rect, bgd, fgd, 3, cv2.GC_INIT_WITH_RECT)
    return (mask == cv2.GC_FGD) | (mask == cv2.GC_PR_FGD)


def subject_mask(rgb: np.ndarray) -> np.ndarray:
    h, w = rgb.shape[:2]
    flood = flood_white_bg(rgb)
    grab = grabcut_mask(rgb)
    subject = flood | grab

    # Suelo de madera (franja inferior)
    floor_y = int(h * 0.88)
    lum = rgb.mean(axis=2)
    floor = np.zeros((h, w), dtype=bool)
    floor[floor_y:, :] = True
    brown = (
        (rgb[..., 0].astype(np.float32) > rgb[..., 2].astype(np.float32) + 8)
        & (lum > 90)
        & (lum < 210)
    )
    subject &= ~(floor & brown)

    mask = subject.astype(np.uint8) * 255
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, np.ones((11, 11), np.uint8))
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))

    # Relleno sólido (evita camisa transparente / doble exposición)
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    solid = np.zeros((h, w), np.uint8)
    if contours:
        cv2.drawContours(solid, contours, -1, 255, thickness=cv2.FILLED)

    alpha = cv2.GaussianBlur(solid.astype(np.float32) / 255.0, (0, 0), 1.8)
    return np.clip(alpha, 0, 1)


def directional_light(h: int, w: int) -> np.ndarray:
    y, x = np.ogrid[:h, :w]
    light = 1.0 - np.clip(((x - w * 0.18) / w) ** 2 * 0.55 + ((y - h * 0.10) / h) ** 2 * 0.85, 0, 1) ** 1.2
    return np.clip(0.22 + light * 0.78, 0.18, 1.0).astype(np.float32)


def contrast_curve(channel: np.ndarray, lo: float = 0.06, hi: float = 0.96) -> np.ndarray:
    x = np.clip(channel.astype(np.float32) / 255.0, 0, 1)
    x = np.clip((x - lo) / max(hi - lo, 1e-3), 0, 1) ** 1.15
    return x * 255.0


def match_reference_tone(src: np.ndarray, ref: np.ndarray, alpha: np.ndarray) -> np.ndarray:
    h, w = src.shape[:2]
    ref_s = cv2.resize(ref, (w, h), interpolation=cv2.INTER_AREA)
    m = alpha > 0.35
    if m.sum() < 100:
        return src

    out = src.astype(np.float32)
    for ch in range(3):
        s = out[..., ch][m]
        r = ref_s[..., ch].astype(np.float32)[m]
        s_std, r_std = max(s.std(), 1.0), max(r.std(), 1.0)
        matched = (out[..., ch] - s.mean()) * (r_std / s_std) + r.mean()
        out[..., ch] = out[..., ch] * 0.55 + matched * 0.45
    return np.clip(out, 0, 255).astype(np.uint8)


def apply_caravaggio(rgb: np.ndarray, ref: np.ndarray, alpha: np.ndarray) -> np.ndarray:
    h, w = rgb.shape[:2]
    bg = reference_bg(ref)
    light = directional_light(h, w)
    a3 = alpha[..., None]

    styled = rgb.astype(np.float32)
    # Quitar frío de estudio
    styled[..., 0] *= 1.10
    styled[..., 1] *= 0.88
    styled[..., 2] *= 0.72

    # Camisa verde → umber apagado
    r, g, b = styled[..., 0], styled[..., 1], styled[..., 2]
    green = (g > r * 1.03) & (g > b * 1.04)
    styled[..., 0][green] = styled[..., 0][green] * 1.04 + 10
    styled[..., 1][green] *= 0.72
    styled[..., 2][green] *= 0.66

    lab = cv2.cvtColor(np.clip(styled, 0, 255).astype(np.uint8), cv2.COLOR_RGB2LAB).astype(np.float32)
    l_ch = lab[..., 0]
    l_norm = l_ch / 255.0
    l_ch = np.clip(contrast_curve(l_ch, 0.05, 0.94) * (0.38 + 0.62 * light), 0, 255)
    lab[..., 0] = l_ch
    lab[..., 1] = lab[..., 1] * 0.92 + 6
    lab[..., 2] = lab[..., 2] * 0.88 + 8
    styled = cv2.cvtColor(lab.astype(np.uint8), cv2.COLOR_LAB2RGB).astype(np.float32)

    shadow = np.clip(1.0 - l_norm, 0, 1)[..., None]
    umber = np.array([42, 24, 14], dtype=np.float32)
    styled = styled * (1 - shadow * 0.38) + umber * (shadow * 0.38)

    out = styled * a3 + bg * (1.0 - a3)
    out = np.clip(out, 0, 255).astype(np.uint8)
    out = match_reference_tone(out, ref, alpha)

    # Viñeta suave
    y, x = np.ogrid[:h, :w]
    vig = np.clip(np.sqrt(((x - w * 0.5) / (w * 0.52)) ** 2 + ((y - h * 0.5) / (h * 0.52)) ** 2) ** 1.35, 0, 1)[..., None]
    out_f = out.astype(np.float32)
    out = np.clip(out_f * (1 - vig * 0.40) + bg * (vig * 0.40), 0, 255).astype(np.uint8)

    # Toque pictórico ligero (rápido)
    pil = Image.fromarray(out, mode="RGB")
    soft = np.asarray(pil.filter(ImageFilter.SMOOTH_MORE), dtype=np.uint8)
    out = cv2.addWeighted(out, 0.78, soft, 0.22, 0)
    pil = Image.fromarray(out, mode="RGB")
    pil = pil.filter(ImageFilter.UnsharpMask(radius=1.2, percent=48, threshold=4))
    return np.asarray(pil, dtype=np.uint8)


def main() -> None:
    if not SOURCE.exists():
        raise FileNotFoundError(SOURCE)

    src = load_rgb(SOURCE)
    ref = load_rgb(STYLE_REF) if STYLE_REF.exists() else src
    alpha = subject_mask(src)
    result = apply_caravaggio(src, ref, alpha)

    for out_path in OUTPUTS:
        save_rgb(out_path, result)
        print(f"saved {out_path}")


if __name__ == "__main__":
    main()
