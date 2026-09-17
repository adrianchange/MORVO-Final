"""Build clean 16:9 lavender plate from Paris Bilal arches (no baked text)."""
from pathlib import Path

import cv2
import numpy as np

src = Path(r"C:\Users\adria\Downloads\morvo-teaser\images\teaser\teaser-cover-paris-bilal-arches.jpg")
ref = Path(r"C:\Users\adria\AppData\Local\Temp\teaser_v09_last\last.png")
out = Path(r"C:\Users\adria\MORVO-Final\public\images\teaser\teaser-v09-final-clean.png")

im = cv2.imread(str(src))
ref_im = cv2.imread(str(ref))
if im is None or ref_im is None:
    raise SystemExit("missing src/ref")

h, w = im.shape[:2]
# Center-crop to 16:9
target_aspect = 16 / 9
cur = w / h
if cur > target_aspect:
    nw = int(h * target_aspect)
    x0 = (w - nw) // 2
    im = im[:, x0 : x0 + nw]
else:
    nh = int(w / target_aspect)
    y0 = (h - nh) // 2
    im = im[y0 : y0 + nh, :]

im = cv2.resize(im, (1920, 1080), interpolation=cv2.INTER_AREA)

# Match color stats of reference (lavender grade from v09)
def match_mean_std(src_bgr: np.ndarray, ref_bgr: np.ndarray) -> np.ndarray:
    # Exclude center text band from ref stats
    rh, rw = ref_bgr.shape[:2]
    band = np.ones((rh, rw), dtype=bool)
    band[int(rh * 0.25) : int(rh * 0.75), int(rw * 0.2) : int(rw * 0.8)] = False
    ref_px = ref_bgr[band]
    out = src_bgr.astype(np.float32)
    for c in range(3):
        s = out[:, :, c]
        r = ref_px[:, c].astype(np.float32)
        s_mean, s_std = float(s.mean()), float(s.std()) + 1e-6
        r_mean, r_std = float(r.mean()), float(r.std()) + 1e-6
        out[:, :, c] = (s - s_mean) * (r_std / s_std) + r_mean
    return np.clip(out, 0, 255).astype(np.uint8)

graded = match_mean_std(im, ref_im)
# Soft vignette similar to credits end
yy, xx = np.mgrid[0:1080, 0:1920]
cy, cx = 540, 960
r = np.sqrt(((yy - cy) / 540) ** 2 + ((xx - cx) / 960) ** 2)
vignette = np.clip(1.0 - 0.12 * np.maximum(r - 0.55, 0) ** 1.5, 0.82, 1.0)
graded = (graded.astype(np.float32) * vignette[:, :, None]).astype(np.uint8)

cv2.imwrite(str(out), graded, [cv2.IMWRITE_PNG_COMPRESSION, 3])
print("wrote", out, graded.shape)
