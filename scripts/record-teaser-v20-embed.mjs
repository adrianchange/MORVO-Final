/**
 * Regraba el montaje interactivo (TeaserVideo) a proporción embebida 2:1
 * → public/video/teaser/petroleo/Teaser_v20.mp4
 *
 * Uso (con vite en 5173):
 *   node scripts/record-teaser-v20-embed.mjs
 *
 * Viewport 1920×960 ≈ caja embebida Vercel (ancha, maxHeight).
 * Las capas van en contain → no se pierde contenido (solo letterbox como en vivo).
 */
import { chromium } from "playwright";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BASE = process.env.TEASER_URL ?? "http://localhost:5173/?record=petroleo";
const OUT_MP4 = path.join(ROOT, "public", "video", "teaser", "petroleo", "Teaser_v20.mp4");
const AUDIO = path.join(ROOT, "public", "audio", "teaser-ravel-60s.m4a");

/** 2:1 — mismo espíritu que el embebido con maxHeight */
const REC_W = 1920;
const REC_H = 960;
const TEASER_MS = 60_000;
const POST_MS = 3_000;
const AUDIO_END_FADE_MS = 2_500;

function findFfmpeg() {
  const which = spawnSync("where.exe", ["ffmpeg"], { encoding: "utf8" });
  if (which.status === 0) {
    const line = which.stdout.trim().split(/\r?\n/)[0];
    if (line) return line;
  }
  const wingetRoot = path.join(
    process.env.LOCALAPPDATA ?? "",
    "Microsoft",
    "WinGet",
    "Packages",
  );
  if (fs.existsSync(wingetRoot)) {
    for (const name of fs.readdirSync(wingetRoot)) {
      if (!name.startsWith("Gyan.FFmpeg")) continue;
      const base = path.join(wingetRoot, name);
      for (const e of fs.readdirSync(base)) {
        const alt = path.join(base, e, "bin", "ffmpeg.exe");
        if (fs.existsSync(alt)) return alt;
      }
    }
  }
  return null;
}

function runFfmpeg(ffmpeg, args, label) {
  console.log(label);
  const r = spawnSync(ffmpeg, args, { encoding: "utf8" });
  if (r.status !== 0) {
    console.error(r.stderr || r.stdout);
    throw new Error(`ffmpeg falló: ${label}`);
  }
}

async function main() {
  if (!fs.existsSync(AUDIO)) throw new Error(`Falta audio: ${AUDIO}`);
  const ffmpeg = findFfmpeg();
  if (!ffmpeg) throw new Error("ffmpeg no encontrado");

  fs.mkdirSync(path.dirname(OUT_MP4), { recursive: true });
  const videoDir = fs.mkdtempSync(path.join(os.tmpdir(), "morvo-v20-"));

  console.log(`Abriendo ${BASE} @ ${REC_W}×${REC_H} (2:1)`);
  const browser = await chromium.launch({
    headless: true,
    args: ["--autoplay-policy=no-user-gesture-required", "--disable-web-security"],
  });

  const context = await browser.newContext({
    viewport: { width: REC_W, height: REC_H },
    deviceScaleFactor: 1,
    recordVideo: {
      dir: videoDir,
      size: { width: REC_W, height: REC_H },
    },
  });

  const page = await context.newPage();
  page.setDefaultTimeout(180_000);

  const tapeStart = Date.now();
  await page.goto(BASE, { waitUntil: "networkidle" });

  const playBtn = page.getByRole("button", { name: "Reproducir teaser" });
  await playBtn.waitFor({ state: "visible" });
  await page.waitForFunction(() => {
    const btn = document.querySelector('button[aria-label="Reproducir teaser"]');
    return btn instanceof HTMLButtonElement && !btn.disabled;
  });
  await page.waitForTimeout(4_000);

  const playAt = Date.now();
  const prerollSec = Math.max(0, (playAt - tapeStart) / 1000);
  await playBtn.click();
  console.log(
    `Play @ preroll ${prerollSec.toFixed(2)} s — grabando ${((TEASER_MS + POST_MS) / 1000).toFixed(1)} s…`,
  );
  await page.waitForTimeout(TEASER_MS + POST_MS);

  await context.close();
  await browser.close();

  const videos = fs.readdirSync(videoDir).filter((f) => f.endsWith(".webm"));
  if (videos.length === 0) throw new Error("No se generó WebM");
  const srcWebm = path.join(videoDir, videos[0]);

  const teaserSec = TEASER_MS / 1000;
  const fadeStartSec = Math.max(0, (TEASER_MS - AUDIO_END_FADE_MS) / 1000);
  const fadeDurSec = AUDIO_END_FADE_MS / 1000;

  const filter = [
    `[0:v]trim=start=${prerollSec.toFixed(3)}:duration=${teaserSec.toFixed(3)},setpts=PTS-STARTPTS,scale=${REC_W}:${REC_H}:force_original_aspect_ratio=decrease,pad=${REC_W}:${REC_H}:(ow-iw)/2:(oh-ih)/2,setsar=1[v]`,
    `[1:a]afade=t=out:st=${fadeStartSec}:d=${fadeDurSec},atrim=0:${teaserSec.toFixed(3)},asetpts=PTS-STARTPTS[a]`,
  ].join(";");

  const tmpOut = path.join(os.tmpdir(), `Teaser_v20_${Date.now()}.mp4`);
  runFfmpeg(
    ffmpeg,
    [
      "-y",
      "-i",
      srcWebm,
      "-i",
      AUDIO,
      "-filter_complex",
      filter,
      "-map",
      "[v]",
      "-map",
      "[a]",
      "-c:v",
      "libx264",
      "-pix_fmt",
      "yuv420p",
      "-preset",
      "medium",
      "-crf",
      "18",
      "-c:a",
      "aac",
      "-b:a",
      "192k",
      "-movflags",
      "+faststart",
      tmpOut,
    ],
    "Exportando H.264 + AAC…",
  );

  fs.copyFileSync(tmpOut, OUT_MP4);
  try {
    fs.unlinkSync(tmpOut);
  } catch {
    /* */
  }
  try {
    fs.rmSync(videoDir, { recursive: true, force: true });
  } catch {
    /* */
  }

  const sizeMb = (fs.statSync(OUT_MP4).size / (1024 * 1024)).toFixed(1);
  console.log(`Listo (${sizeMb} MB): ${OUT_MP4}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
