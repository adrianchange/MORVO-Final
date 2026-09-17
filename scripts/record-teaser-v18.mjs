/**
 * Teaser_v18.mov
 * - Inicio = apertura MORVO-Final (portada + typewriter)
 * - Medio = Teaser_v14 (contenido editado)
 * - Cierre = créditos escalados, MORVO rojo #CC0000, +10px abajo
 *
 * Uso: node scripts/record-teaser-v18.mjs
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
const SRC_V14 = path.join(os.homedir(), "Downloads", "Teaser_v14.mov");
const REF_FINAL = path.join(
  os.homedir(),
  "Desktop",
  "MORVO-Teaser-Secuencia",
  "000_teaser-completo.mp4",
);
const OUT_FULL = path.join(os.homedir(), "Downloads", "Teaser_v18.mov");

/** Portada 4.5 s + typewriter 5.6 s (MORVO-Final) */
const FINAL_INTRO_END = 10.1;
/** Tras el typewriter propio de v14 empieza el montaje */
const V14_MIDDLE_START = 11.0;
const V14_CUT = 59.55;
const CREDITS_MS = 5_000;
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

async function recordCredits(ffmpeg, work) {
  const videoDir = path.join(work, "rec");
  fs.mkdirSync(videoDir);

  console.log(`Grabando créditos @ ${REC_W}x${REC_H} (rojo #CC0000, +10px)`);
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
  if (!videos.length) throw new Error("No WebM créditos");
  const srcWebm = path.join(videoDir, videos[0]);
  const creditsVid = path.join(work, "credits-vid.mov");
  const creditsAud = path.join(work, "credits-aud.wav");
  const creditsRe = path.join(work, "credits.mov");

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
    "Créditos → 1080p",
  );

  const creditsDur = CREDITS_MS / 1000;
  runFfmpeg(
    ffmpeg,
    [
      "-y",
      "-ss",
      String(V14_CUT),
      "-i",
      SRC_V14,
      "-t",
      String(creditsDur),
      "-vn",
      "-af",
      `apad=whole_dur=${creditsDur.toFixed(3)}`,
      "-acodec",
      "pcm_s24le",
      "-ar",
      "48000",
      creditsAud,
    ],
    "Audio cierre",
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
      creditsRe,
    ],
    "Mux créditos",
  );
  return creditsRe;
}

async function main() {
  if (!fs.existsSync(SRC_V14)) throw new Error(`No está ${SRC_V14}`);
  if (!fs.existsSync(REF_FINAL)) throw new Error(`No está ${REF_FINAL}`);
  const ffmpeg = findFfmpeg();
  if (!ffmpeg) throw new Error("ffmpeg no encontrado");

  const work = fs.mkdtempSync(path.join(os.tmpdir(), "v18-"));
  const intro = path.join(work, "intro.mov");
  const middle = path.join(work, "middle.mov");
  const listFile = path.join(work, "concat.txt");

  // 1) Inicio = MORVO-Final (portada + typewriter + efectos)
  runFfmpeg(
    ffmpeg,
    [
      "-y",
      "-i",
      REF_FINAL,
      "-t",
      String(FINAL_INTRO_END),
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
      intro,
    ],
    "Intro MORVO-Final",
  );

  // 2) Medio = v14 desde montaje hasta antes de créditos
  const middleDur = V14_CUT - V14_MIDDLE_START;
  runFfmpeg(
    ffmpeg,
    [
      "-y",
      "-ss",
      String(V14_MIDDLE_START),
      "-i",
      SRC_V14,
      "-t",
      String(middleDur),
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
      middle,
    ],
    "Medio Teaser_v14",
  );

  // 3) Créditos nuevos
  const credits = await recordCredits(ffmpeg, work);

  fs.writeFileSync(
    listFile,
    [
      `file '${intro.replace(/\\/g, "/")}'`,
      `file '${middle.replace(/\\/g, "/")}'`,
      `file '${credits.replace(/\\/g, "/")}'`,
    ].join("\n") + "\n",
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
