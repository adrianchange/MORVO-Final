"""Alinea negro y blanco de Mario y Victor a la referencia Cristian."""
from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1] / "public" / "images" / "petroleo"
DESKTOP = Path.home() / "Desktop" / "Morvo" / "MORVO"
REFERENCE = "Cristian.jpg"
TARGETS = ("Mario.jpg", "Victor.jpg")

BLACK_PCT = 1.0
WHITE_PCT = 99.0


def luminance(img: Image.Image) -> np.ndarray:
    return np.asarray(img.convert("L"), dtype=np.uint8)


def black_white_points(gray: np.ndarray) -> tuple[float, float]:
    lo = float(np.percentile(gray, BLACK_PCT))
    hi = float(np.percentile(gray, WHITE_PCT))
    if hi <= lo + 1:
        hi = lo + 1
    return lo, hi


def align_black_white(gray: np.ndarray, src_lo: float, src_hi: float, dst_lo: float, dst_hi: float) -> np.ndarray:
    out = (gray.astype(np.float32) - src_lo) / (src_hi - src_lo)
    out = out * (dst_hi - dst_lo) + dst_lo
    return np.clip(out, 0, 255).astype(np.uint8)


def match_midtones(source: np.ndarray, template: np.ndarray, strength: float = 0.55) -> np.ndarray:
    src = source.ravel()
    tpl = template.ravel()

    s_values, bin_idx, s_counts = np.unique(src, return_inverse=True, return_counts=True)
    t_values, t_counts = np.unique(tpl, return_counts=True)

    s_cdf = np.cumsum(s_counts).astype(np.float64)
    s_cdf /= s_cdf[-1]
    t_cdf = np.cumsum(t_counts).astype(np.float64)
    t_cdf /= t_cdf[-1]

    matched = np.interp(s_cdf, t_cdf, t_values)
    matched = matched[bin_idx].reshape(source.shape).astype(np.float32)
    base = source.astype(np.float32)
    return np.clip(matched * strength + base * (1 - strength), 0, 255).astype(np.uint8)


def restore_from_desktop(name: str) -> None:
    src = DESKTOP / name
    dst = ROOT / name
    if src.exists():
        dst.write_bytes(src.read_bytes())
        print(f"restored {name} from desktop")


def harmonize(name: str, ref_gray: np.ndarray, ref_lo: float, ref_hi: float) -> None:
    path = ROOT / name
    gray = luminance(Image.open(path))
    src_lo, src_hi = black_white_points(gray)

    aligned = align_black_white(gray, src_lo, src_hi, ref_lo, ref_hi)
    out_gray = match_midtones(aligned, ref_gray, strength=0.55)
    out_gray = align_black_white(out_gray, *black_white_points(out_gray), ref_lo, ref_hi)

    Image.fromarray(out_gray, mode="L").convert("RGB").save(path, quality=92, optimize=True)
    out_lo, out_hi = black_white_points(out_gray)
    print(f"{name}: black={out_lo:.1f} white={out_hi:.1f} (ref {ref_lo:.1f}/{ref_hi:.1f})")


def main() -> None:
    for name in TARGETS:
        restore_from_desktop(name)

    ref_path = ROOT / REFERENCE
    ref_gray = luminance(Image.open(ref_path))
    ref_lo, ref_hi = black_white_points(ref_gray)
    print(f"reference {REFERENCE}: black={ref_lo:.1f} white={ref_hi:.1f}")

    for name in TARGETS:
        harmonize(name, ref_gray, ref_lo, ref_hi)

    print("done")


if __name__ == "__main__":
    main()
