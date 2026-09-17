/**
 * Graba el teaser MORVO-Final completo (60 s) → Desktop/MORVO-Teaser-Secuencia.
 * Recorta el preroll (espera antes del play) para no cortar créditos/final.
 *
 * Uso: node scripts/record-teaser-mp4.mjs
 * Requiere: vite en http://localhost:5175/
 */
import { chromium } from "playwright";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BASE = process.env.TEASER_URL ?? "http://localhost:5175/?record=petroleo";
const OUT_DIR = path.join(os.homedir(), "Desktop", "MORVO-Teaser-Secuencia");
const MP4_OUT = path.join(OUT_DIR, "000_teaser-completo.mp4");
const AUDIO = path.join(ROOT, "public", "audio", "teaser-ravel-60s.m4a");
/** Duración del montaje + audio */
const TEASER_MS = 60_000;
/** Margen tras el final para no cortar créditos */
const POST_MS = 4_000;
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

async function main() {
  if (!fs.existsSync(AUDIO)) throw new Error(`Falta audio: ${AUDIO}`);
  const ffmpeg = findFfmpeg();
  if (!ffmpeg) throw new Error("ffmpeg no encontrado");

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const videoDir = fs.mkdtempSync(path.join(os.tmpdir(), "morvo-final-rec-"));

  console.log(`Abriendo ${BASE}`);
  const browser = await chromium.launch({
    headless: true,
    args: ["--autoplay-policy=no-user-gesture-required", "--disable-web-security"],
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    recordVideo: {
      dir: videoDir,
      size: { width: 1920, height: 1080 },
    },
  });

  const page = await context.newPage();
  page.setDefaultTimeout(180_000);

  /** Inicio de la cinta WebM ≈ creación de página */
  const tapeStart = Date.now();
  await page.goto(BASE, { waitUntil: "networkidle" });

  const playBtn = page.getByRole("button", { name: "Reproducir teaser" });
  await playBtn.waitFor({ state: "visible" });
  await page.waitForFunction(() => {
    const btn = document.querySelector('button[aria-label="Reproducir teaser"]');
    return btn instanceof HTMLButtonElement && !btn.disabled;
  });
  // Asentar preload (imágenes / blobs)
  await page.waitForTimeout(3_000);

  const playAt = Date.now();
  const prerollSec = Math.max(0, (playAt - tapeStart) / 1000);
  await playBtn.click();
  console.log(`Play @ preroll ${prerollSec.toFixed(2)} s — grabando ${((TEASER_MS + POST_MS) / 1000).toFixed(1)} s…`);
  await page.waitForTimeout(TEASER_MS + POST_MS);

  await context.close();
  await browser.close();

  const videos = fs.readdirSync(videoDir).filter((f) => f.endsWith(".webm"));
  if (videos.length === 0) throw new Error("No se generó WebM");
  const srcWebm = path.join(videoDir, videos[0]);

  const teaserSec = TEASER_MS / 1000;
  const fadeStartSec = Math.max(0, (TEASER_MS - AUDIO_END_FADE_MS) / 1000);
  const fadeDurSec = AUDIO_END_FADE_MS / 1000;

  /**
   * Recorta el preroll del vídeo y toma exactamente TEASER_MS desde el play.
   * Así no se come el final (créditos) al poner -t 60 desde el inicio del WebM.
   */
  const filter = [
    `[0:v]trim=start=${prerollSec.toFixed(3)}:duration=${teaserSec.toFixed(3)},setpts=PTS-STARTPTS[v]`,
    `[1:a]afade=t=out:st=${fadeStartSec}:d=${fadeDurSec},atrim=0:${teaserSec.toFixed(3)},asetpts=PTS-STARTPTS[a]`,
  ].join(";");

  console.log("Exportando MP4 completo (H.264 + AAC)…");
  const conv = spawnSync(
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
      MP4_OUT,
    ],
    { encoding: "utf8" },
  );

  if (conv.status !== 0) {
    console.error(conv.stderr || conv.stdout);
    throw new Error("Falló la conversión a MP4");
  }

  try {
    fs.rmSync(videoDir, { recursive: true, force: true });
  } catch {
    /* */
  }

  const sizeMb = (fs.statSync(MP4_OUT).size / (1024 * 1024)).toFixed(1);
  console.log(`MP4 completo (${sizeMb} MB): ${MP4_OUT}`);

  const indexPath = path.join(OUT_DIR, "_INDICE.txt");
  if (fs.existsSync(indexPath)) {
    fs.appendFileSync(
      indexPath,
      `\n000  video  teaser completo 60 s (regrabado)  →  000_teaser-completo.mp4 (${sizeMb} MB)\n`,
      "utf8",
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
