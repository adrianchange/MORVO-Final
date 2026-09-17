/**
 * Teaser_v14.mov → Teaser_v15.mov
 * Cierre título + créditos idénticos al teaser MORVO-Final.
 *
 * Uso: node scripts/record-teaser-v15.mjs
 * Requiere: vite en http://localhost:5175/
 */
import { chromium } from "playwright";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const BASE =
  process.env.TEASER_URL ??
  "http://localhost:5175/?record=v09-credits&bg=morvo-final";
const SRC_MOV = path.join(os.homedir(), "Downloads", "Teaser_v14.mov");
const OUT_FULL = path.join(os.homedir(), "Downloads", "Teaser_v15.mov");
const OUT_CREDITS = path.join(os.homedir(), "Downloads", "Teaser_v15_credits-end.mov");

/** Final de la máscara — antes del pasillo con créditos quemados (~59.7 s) */
const CUT_AT_SEC = 59.55;
/** Hold créditos (mismo overlay MORVO-Final) */
const CREDITS_MS = 5_000;

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
    console.error(r.stderr?.slice(-2000) ?? r.stdout);
    throw new Error(`${label} falló`);
  }
}

async function main() {
  if (!fs.existsSync(SRC_MOV)) throw new Error(`No está ${SRC_MOV}`);
  const ffmpeg = findFfmpeg();
  if (!ffmpeg) throw new Error("ffmpeg no encontrado");

  const work = fs.mkdtempSync(path.join(os.tmpdir(), "v15-credits-"));
  const videoDir = path.join(work, "rec");
  fs.mkdirSync(videoDir);

  console.log(`Abriendo ${BASE}`);
  const browser = await chromium.launch({
    headless: true,
    channel: "chrome",
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
  page.setDefaultTimeout(120_000);
  const tapeStart = Date.now();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForSelector('[data-record-ready="1"]');
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready;
  });
  await page.waitForTimeout(1_200);
  const recordStart = Date.now();
  const prerollSec = (recordStart - tapeStart) / 1000;
  console.log(`Grabando créditos ${(CREDITS_MS / 1000).toFixed(1)} s (preroll ${prerollSec.toFixed(2)} s)…`);
  await page.waitForTimeout(CREDITS_MS);

  await context.close();
  await browser.close();

  const videos = fs.readdirSync(videoDir).filter((f) => f.endsWith(".webm"));
  if (videos.length === 0) throw new Error("No se generó WebM");
  const srcWebm = path.join(videoDir, videos[0]);

  const creditsMov = path.join(work, "credits.mov");
  const creditsAudio = path.join(work, "credits-audio.wav");
  const listFile = path.join(work, "concat.txt");
  const headRe = path.join(work, "head-re.mov");
  const tailRe = path.join(work, "tail-re.mov");

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
      "fps=24,format=yuv420p",
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
    "Export créditos H.264",
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
      creditsAudio,
    ],
    "Audio del cierre v14",
  );

  runFfmpeg(
    ffmpeg,
    [
      "-y",
      "-i",
      creditsMov,
      "-i",
      creditsAudio,
      "-c:v",
      "copy",
      "-c:a",
      "pcm_s24le",
      "-shortest",
      "-movflags",
      "+faststart",
      OUT_CREDITS,
    ],
    `Escribiendo ${OUT_CREDITS}`,
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
    "Cabeza Teaser_v14 (recorte preciso)",
  );

  runFfmpeg(
    ffmpeg,
    [
      "-y",
      "-i",
      OUT_CREDITS,
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
      tailRe,
    ],
    "Normalizar créditos",
  );

  fs.writeFileSync(
    listFile,
    `file '${headRe.replace(/\\/g, "/")}'\nfile '${tailRe.replace(/\\/g, "/")}'\n`,
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

  console.log("Listo:");
  console.log(" ", OUT_FULL);
  console.log(" ", OUT_CREDITS);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
