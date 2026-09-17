/**
 * Teaser_v19 = Teaser_v17 + créditos 10px más abajo. Nada más.
 *
 * Uso: node scripts/record-teaser-v19.mjs
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
const SRC_V17 = path.join(os.homedir(), "Downloads", "Teaser_v17.mov");
const OUT_FULL = path.join(os.homedir(), "Downloads", "Teaser_v19.mov");

const CREDITS_MS = 5_000;
/** v17 = cabeza hasta 59.55 + 5 s créditos */
const CUT_AT_SEC = 59.55;
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
  if (!fs.existsSync(SRC_V17)) throw new Error(`No está ${SRC_V17}`);
  const ffmpeg = findFfmpeg();
  if (!ffmpeg) throw new Error("ffmpeg no encontrado");

  const work = fs.mkdtempSync(path.join(os.tmpdir(), "v19-"));
  const videoDir = path.join(work, "rec");
  fs.mkdirSync(videoDir);

  console.log(`Créditos = v17 + 10px abajo @ ${REC_W}x${REC_H}`);
  const browser = await chromium.launch({
    headless: true,
    channel: "chrome",
    args: ["--autoplay-policy=no-user-gesture-required", "--disable-web-security"],
  });
  const context = await browser.newContext({
    viewport: { width: REC_W, height: REC_H },
    deviceScaleFactor: 1,
    recordVideo: { dir: videoDir, size: { width: REC_W, height: REC_H } },
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
  await page.waitForTimeout(CREDITS_MS);
  await context.close();
  await browser.close();

  const videos = fs.readdirSync(videoDir).filter((f) => f.endsWith(".webm"));
  if (!videos.length) throw new Error("No WebM");
  const srcWebm = path.join(videoDir, videos[0]);

  const head = path.join(work, "head.mov");
  const creditsVid = path.join(work, "credits-vid.mov");
  const creditsAud = path.join(work, "credits-aud.wav");
  const credits = path.join(work, "credits.mov");
  const listFile = path.join(work, "concat.txt");

  // Cabeza exacta de v17 (sin tocar inicio/medio)
  runFfmpeg(
    ffmpeg,
    [
      "-y",
      "-i",
      SRC_V17,
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
      head,
    ],
    "Cabeza Teaser_v17",
  );

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
      creditsVid,
    ],
    "Créditos +10px → 1080p",
  );

  // Audio del cierre de v17 (mismo tramo)
  runFfmpeg(
    ffmpeg,
    [
      "-y",
      "-ss",
      String(CUT_AT_SEC),
      "-i",
      SRC_V17,
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
    "Audio cierre v17",
  );

  runFfmpeg(
    ffmpeg,
    [
      "-y",
      "-i",
      creditsVid,
      "-i",
      creditsAud,
      "-c:v",
      "copy",
      "-c:a",
      "pcm_s24le",
      "-shortest",
      credits,
    ],
    "Mux créditos",
  );

  fs.writeFileSync(
    listFile,
    `file '${head.replace(/\\/g, "/")}'\nfile '${credits.replace(/\\/g, "/")}'\n`,
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
