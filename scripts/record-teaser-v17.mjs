/**
 * Teaser_v14 → Teaser_v17.mov
 *
 * Cierre de créditos con el MISMO tamaño visual que MORVO-Final en ventana
 * (~1024×576): se graba a ese viewport y se escala a 1920×1080.
 * Así el bloque de créditos no queda “enano” por el tope de 520px / clamp.
 *
 * Uso: node scripts/record-teaser-v17.mjs
 * Requiere: vite en http://localhost:5175/
 */
import { chromium } from "playwright";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const BASE =
  process.env.TEASER_URL ??
  "http://localhost:5175/?record=v09-credits&bg=morvo-final";
const SRC_MOV = path.join(os.homedir(), "Downloads", "Teaser_v14.mov");
const OUT_FULL = path.join(os.homedir(), "Downloads", "Teaser_v17.mov");

const CUT_AT_SEC = 59.55;
const CREDITS_MS = 5_000;

/** Tamaño de visionado típico del teaser Final (como tu captura) */
const REC_W = 1024;
const REC_H = 576;

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
    console.error(r.stderr?.slice(-2500) ?? r.stdout);
    throw new Error(`${label} falló`);
  }
}

async function main() {
  if (!fs.existsSync(SRC_MOV)) throw new Error(`No está ${SRC_MOV}`);
  const ffmpeg = findFfmpeg();
  if (!ffmpeg) throw new Error("ffmpeg no encontrado");

  const work = fs.mkdtempSync(path.join(os.tmpdir(), "v17-"));
  const videoDir = path.join(work, "rec");
  fs.mkdirSync(videoDir);

  console.log(`Abriendo ${BASE} @ ${REC_W}x${REC_H}`);
  const browser = await chromium.launch({
    headless: true,
    channel: "chrome",
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
  page.setDefaultTimeout(120_000);
  const tapeStart = Date.now();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForSelector('[data-record-ready="1"]');
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
  });
  await page.waitForTimeout(1_200);
  const prerollSec = (Date.now() - tapeStart) / 1000;
  console.log(`Grabando ${(CREDITS_MS / 1000).toFixed(1)} s (preroll ${prerollSec.toFixed(2)} s)…`);
  await page.waitForTimeout(CREDITS_MS);

  await context.close();
  await browser.close();

  const videos = fs.readdirSync(videoDir).filter((f) => f.endsWith(".webm"));
  if (videos.length === 0) throw new Error("No se generó WebM");
  const srcWebm = path.join(videoDir, videos[0]);

  const creditsMov = path.join(work, "credits.mov");
  const creditsAud = path.join(work, "credits-aud.wav");
  const creditsRe = path.join(work, "credits-re.mov");
  const headRe = path.join(work, "head.mov");
  const listFile = path.join(work, "concat.txt");

  // Créditos: trim + UPSCALE a 1920×1080 (mantiene proporción visual de ventana Final)
  runFfmpeg(
    ffmpeg,
    [
      "-y",
      "-i",
      srcWebm,
      "-ss",
      prerollSec.toFixed(3),
      "-t",
      String(CREDITS_MS / 1000),
      "-an",
      "-vf",
      "fps=24,scale=1920:1080:flags=lanczos,format=yuv420p",
      "-c:v",
      "libx264",
      "-preset",
      "slow",
      "-crf",
      "16",
      "-pix_fmt",
      "yuv420p",
      creditsMov,
    ],
    "Créditos escalados a 1080p",
  );

  runFfmpeg(
    ffmpeg,
    [
      "-y",
      "-ss",
      String(CUT_AT_SEC),
      "-i",
      SRC_MOV,
      "-t",
      String(CREDITS_MS / 1000),
      "-vn",
      "-af",
      `apad=whole_dur=${(CREDITS_MS / 1000).toFixed(3)}`,
      "-acodec",
      "pcm_s24le",
      "-ar",
      "48000",
      creditsAud,
    ],
    "Audio cierre v14",
  );

  runFfmpeg(
    ffmpeg,
    [
      "-y",
      "-i",
      creditsMov,
      "-i",
      creditsAud,
      "-c:v",
      "copy",
      "-c:a",
      "pcm_s24le",
      "-shortest",
      creditsRe,
    ],
    "Mux créditos",
  );

  runFfmpeg(
    ffmpeg,
    [
      "-y",
      "-i",
      SRC_MOV,
      "-t",
      String(CUT_AT_SEC),
      "-vf",
      "fps=24,format=yuv420p",
      "-c:v",
      "libx264",
      "-preset",
      "slow",
      "-crf",
      "16",
      "-c:a",
      "pcm_s24le",
      "-ar",
      "48000",
      headRe,
    ],
    "Cabeza v14",
  );

  fs.writeFileSync(
    listFile,
    `file '${headRe.replace(/\\/g, "/")}'\nfile '${creditsRe.replace(/\\/g, "/")}'\n`,
  );

  runFfmpeg(
    ffmpeg,
    [
      "-y",
      "-f",
      "concat",
      "-safe",
      "0",
      "-i",
      listFile,
      "-c",
      "copy",
      "-movflags",
      "+faststart",
      OUT_FULL,
    ],
    `Escribiendo ${OUT_FULL}`,
  );

  console.log("Listo:", OUT_FULL);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
