"""
Quita marcas de agua tipo rejilla stock de PosiblePortada.png.
Enfoque: detectar trazos claros semi-transparentes y revertir la mezcla.
"""
from __future__ import annotations

from pathlib import Path

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public" / "images" / "petroleo" / "PosiblePortada.png"
BACKUP = ROOT / "public" / "images" / "petroleo" / "PosiblePortada-original.png"
OUTPUT = SOURCE


def load_bgr(path: Path) -> np.ndarray:
    img = cv2.imread(str(path), cv2.IMREAD_COLOR)
    if img is None:
        raise FileNotFoundError(path)
    return img


def watermark_strength_map(img: np.ndarray, sensitivity: float = 1.0) -> np.ndarray:
    """Mapa 0–1: probabilidad de píxel perteneciente a la rejilla."""
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY).astype(np.float32)
    lab = cv2.cvtColor(img, cv2.COLOR_BGR2LAB).astype(np.float32)
    l_ch = lab[..., 0]

    k3 = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (3, 3))
    k5 = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5))
    k7 = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))
    k11 = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (11, 11))

    th3 = cv2.morphologyEx(gray.astype(np.uint8), cv2.MORPH_TOPHAT, k3).astype(np.float32)
    th5 = cv2.morphologyEx(gray.astype(np.uint8), cv2.MORPH_TOPHAT, k5).astype(np.float32)
    th7 = cv2.morphologyEx(gray.astype(np.uint8), cv2.MORPH_TOPHAT, k7).astype(np.float32)
    th11 = cv2.morphologyEx(gray.astype(np.uint8), cv2.MORPH_TOPHAT, k11).astype(np.float32)

    smooth_l = cv2.GaussianBlur(l_ch, (0, 0), 5.0)
    res_l = np.clip(l_ch - smooth_l, 0, None)

    score = np.maximum(th3, th5 * 0.85)
    score = np.maximum(score, th7 * 0.65)
    score = np.maximum(score, th11 * 0.45)
    score = np.maximum(score, res_l * 0.55)

    lo = 3.5 / sensitivity
    hi = 16.0 / sensitivity
    s = np.clip((score - lo) / hi, 0, 1)
    s = cv2.GaussianBlur(s, (0, 0), 1.1)
    return s


def deblend_watermark(img: np.ndarray, strength: np.ndarray, alpha: float = 0.42) -> np.ndarray:
    """
    Revierte mezcla tipo stock: I ≈ (1-α)·J + α·255 en trazos claros.
    """
    out = img.astype(np.float32)
    inv = 1.0 - alpha
    w = strength[..., None]

    # Solo corregir donde hay marca; transición suave
    corrected = (out - alpha * 255.0) / inv
    out = out * (1 - w) + corrected * w
    return np.clip(out, 0, 255).astype(np.uint8)


def inpaint_residual(img: np.ndarray, strength: np.ndarray) -> np.ndarray:
    mask = (strength > 0.38).astype(np.uint8) * 255
    if mask.max() == 0:
        return img
    mask = cv2.dilate(mask, np.ones((2, 2), np.uint8), iterations=1)
    inpainted = cv2.inpaint(img, mask, 2, cv2.INPAINT_TELEA)
    w = cv2.GaussianBlur(strength, (0, 0), 1.0)[..., None]
    w = np.clip(w * 0.65, 0, 1)
    out = img.astype(np.float32) * (1 - w) + inpainted.astype(np.float32) * w
    return np.clip(out, 0, 255).astype(np.uint8)


def polish(img: np.ndarray, strength: np.ndarray) -> np.ndarray:
    """Suaviza micro-artefactos de rejilla sin perder expresión."""
    w = cv2.GaussianBlur(strength, (0, 0), 1.4)[..., None]
    w = np.clip(w * 0.45, 0, 1)

    smooth = cv2.bilateralFilter(img, d=5, sigmaColor=14, sigmaSpace=14)
    merged = img.astype(np.float32) * (1 - w) + smooth.astype(np.float32) * w

    # Recuperar detalle global (no de la marca)
    blur = cv2.GaussianBlur(merged.astype(np.uint8), (0, 0), 1.8)
    detail = img.astype(np.float32) - blur.astype(np.float32)
    detail_mask = np.clip(1.0 - strength[..., None] * 1.2, 0.15, 1.0)
    out = merged + detail * 0.18 * detail_mask
    return np.clip(out, 0, 255).astype(np.uint8)


def clean(img: np.ndarray) -> np.ndarray:
    strength = watermark_strength_map(img, sensitivity=1.0)
    step1 = deblend_watermark(img, strength, alpha=0.36)
    step2 = inpaint_residual(step1, strength)

    # Denoise global suave + fuerte donde quedó patrón
    light = cv2.fastNlMeansDenoisingColored(step2, None, 3, 3, 7, 15)
    strong = cv2.fastNlMeansDenoisingColored(step2, None, 7, 7, 9, 19)
    w = cv2.GaussianBlur(strength, (0, 0), 2.2)[..., None]
    w_strong = np.clip(w * 0.75, 0, 1)
    step3 = step2.astype(np.float32) * (1 - w_strong) + strong.astype(np.float32) * w_strong
    step3 = step3 * 0.82 + light.astype(np.float32) * 0.18
    step3 = np.clip(step3, 0, 255).astype(np.uint8)

    # Segunda pasada sobre restos
    strength2 = watermark_strength_map(step3, sensitivity=1.35)
    step4 = deblend_watermark(step3, strength2, alpha=0.28)
    step5 = polish(step4, strength2 * 0.55)

    # Suavizado edge-preserving final (quita granulado sin perder halo/expresión)
    smooth = cv2.edgePreservingFilter(step5, flags=cv2.RECURS_FILTER, sigma_s=24, sigma_r=0.35)
    out = cv2.addWeighted(step5, 0.62, smooth, 0.38, 0)
    return out


def main() -> None:
    src_path = BACKUP if BACKUP.exists() else SOURCE
    img = load_bgr(src_path)
    if not BACKUP.exists():
        cv2.imwrite(str(BACKUP), img)

    result = clean(img)
    cv2.imwrite(str(OUTPUT), result, [int(cv2.IMWRITE_PNG_COMPRESSION), 3])
    print(f"saved {OUTPUT} (from {src_path.name})")


if __name__ == "__main__":
    main()
