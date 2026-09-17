/**
 * Teaser_v14 + cierre REAL de MORVO-Final (000_teaser-completo.mp4)
 * → Teaser_v16.mov
 *
 * El overlay re-grabado no coincidía pixel a pixel; usamos el tramo
 * de créditos del teaser Final ya exportado.
 *
 * Uso: node scripts/record-teaser-v16.mjs
 */
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const SRC_MOV = path.join(os.homedir(), "Downloads", "Teaser_v14.mov");
const REF_FINAL = path.join(
  os.homedir(),
  "Desktop",
  "MORVO-Teaser-Secuencia",
  "000_teaser-completo.mp4",
);
const OUT_FULL = path.join(os.homedir(), "Downloads", "Teaser_v16.mov");

/** Final máscara v14 — antes del pasillo viejo */
const CUT_AT_SEC = 59.55;
/**
 * En el teaser Final (60 s) el beat MORVO+créditos dura PETROLEO_MORVO_FINAL_MS = 2.8 s
 * → empieza en 57.2. Cogemos un pelín antes para no cortar la entrada.
 */
const REF_CREDITS_START = 57.15;
const REF_CREDITS_DUR = 60.0 - REF_CREDITS_START;

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

function main() {
  if (!fs.existsSync(SRC_MOV)) throw new Error(`No está ${SRC_MOV}`);
  if (!fs.existsSync(REF_FINAL)) throw new Error(`No está ${REF_FINAL}`);
  const ffmpeg = findFfmpeg();
  if (!ffmpeg) throw new Error("ffmpeg no encontrado");

  const work = fs.mkdtempSync(path.join(os.tmpdir(), "v16-"));
  const headRe = path.join(work, "head.mov");
  const creditsVid = path.join(work, "credits-vid.mov");
  const creditsAud = path.join(work, "credits-aud.wav");
  const creditsRe = path.join(work, "credits.mov");
  const listFile = path.join(work, "concat.txt");

  // Cabeza v14 (recorte preciso, sin keyframe spill)
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
    "Cabeza Teaser_v14",
  );

  // Vídeo de créditos = tramo REAL del teaser MORVO-Final
  runFfmpeg(
    ffmpeg,
    [
      "-y",
      "-ss",
      String(REF_CREDITS_START),
      "-i",
      REF_FINAL,
      "-t",
      String(REF_CREDITS_DUR),
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
      creditsVid,
    ],
    "Créditos vídeo desde MORVO-Final",
  );

  // Audio: continuidad del v14 en el cierre
  runFfmpeg(
    ffmpeg,
    [
      "-y",
      "-ss",
      String(CUT_AT_SEC),
      "-i",
      SRC_MOV,
      "-t",
      String(REF_CREDITS_DUR),
      "-vn",
      "-af",
      `apad=whole_dur=${REF_CREDITS_DUR.toFixed(3)}`,
      "-acodec",
      "pcm_s24le",
      "-ar",
      "48000",
      creditsAud,
    ],
    "Audio cierre desde v14",
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

main();
