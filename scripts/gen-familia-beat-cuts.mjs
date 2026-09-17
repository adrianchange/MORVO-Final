/**
 * Genera cortes del montaje familia alineados a onsets del audio (10,6 s → 30 s).
 * Uso: node scripts/gen-familia-beat-cuts.mjs
 */
import fs from "node:fs";
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ffmpeg = require("@ffmpeg-installer/ffmpeg").path;

const TEASER_COVER_MS = 5_000;
const INTRO_TYPEWRITER_MS = 5_600;
const SECOND_PHRASE_START_MS = 30_000;
const AUDIO_START_TRIM_MS = 1_000;
const AUDIO_WALL_START_MS = 1_000;

const FAMILY_MONTAGE_MS = SECOND_PHRASE_START_MS - TEASER_COVER_MS - INTRO_TYPEWRITER_MS;
const FAMILY_MONTAGE_START_MS = TEASER_COVER_MS + INTRO_TYPEWRITER_MS;

const audioStartSec = FAMILY_MONTAGE_START_MS / 1000;
const audioEndSec = SECOND_PHRASE_START_MS / 1000;

const PHOTO_COUNT = Number(process.argv[2] || 37);
const MIN_CUT_MS = 260;
const audioFile =
  process.argv[3] || "public/audio/teaser-grabacion-16-06-2026.m4a";

const tmpWav = ".tmp_familia_beats.wav";

spawnSync(
  ffmpeg,
  [
    "-y",
    "-ss",
    String(audioStartSec),
    "-t",
    String(audioEndSec - audioStartSec),
    "-i",
    audioFile,
    "-ac",
    "1",
    "-ar",
    "44100",
    "-f",
    "wav",
    tmpWav,
  ],
  { stdio: "pipe" },
);

const buf = fs.readFileSync(tmpWav);
const samples = new Int16Array(buf.buffer, buf.byteOffset + 44, (buf.length - 44) / 2);
const sr = 44100;
const hop = Math.floor(sr * 0.01);
const frameSec = hop / sr;

const energies = [];
for (let i = 0; i < samples.length - hop; i += hop) {
  let sum = 0;
  for (let j = 0; j < hop; j++) {
    const v = samples[i + j] / 32768;
    sum += v * v;
  }
  energies.push(Math.sqrt(sum / hop));
}

const smooth = energies.map((_, i) => {
  const w = 3;
  let s = 0;
  let n = 0;
  for (let k = i - w; k <= i + w; k++) {
    if (k >= 0 && k < energies.length) {
      s += energies[k];
      n++;
    }
  }
  return s / n;
});

// Autocorrelation tempo (~70–100 BPM)
const acf = [];
for (let lag = Math.floor(0.28 / frameSec); lag <= Math.floor(1.0 / frameSec); lag++) {
  let sum = 0;
  for (let i = 0; i < smooth.length - lag; i++) sum += smooth[i] * smooth[i + lag];
  acf.push({ lag, score: sum });
}
acf.sort((a, b) => b.score - a.score);
const rawBeatMs = Math.round((acf[0]?.lag ?? Math.floor(0.7 / frameSec)) * frameSec * 1000);
const beatCandidates = [rawBeatMs, rawBeatMs * 2, rawBeatMs / 2].filter((m) => m >= 520 && m <= 900);
const beatMs =
  beatCandidates.sort((a, b) => Math.abs(a - rawBeatMs) - Math.abs(b - rawBeatMs))[0] ?? 698;
const halfBeatMs = Math.round(beatMs / 2);
const bpm = Math.round(60000 / beatMs);

const mean = smooth.reduce((a, b) => a + b, 0) / smooth.length;
const std = Math.sqrt(smooth.reduce((a, b) => a + (b - mean) ** 2, 0) / smooth.length);

function collectOnsets(thresholdMul, minGapMs) {
  const th = mean + std * thresholdMul;
  const minGap = Math.floor(minGapMs / (frameSec * 1000));
  const peaks = [];
  let last = -minGap;
  for (let i = 1; i < smooth.length - 1; i++) {
    if (smooth[i] > th && smooth[i] >= smooth[i - 1] && smooth[i] >= smooth[i + 1]) {
      if (i - last >= minGap) {
        peaks.push(Math.round(i * frameSec * 1000));
        last = i;
      }
    }
  }
  return peaks;
}

// Onsets fuertes (downbeats) + débiles (subdivisiones)
const strongOnsets = collectOnsets(0.5, beatMs * 0.45);
const weakOnsets = collectOnsets(0.32, Math.max(180, beatMs * 0.22));
const allOnsets = [...new Set([...strongOnsets, ...weakOnsets])].sort((a, b) => a - b);

// Rejilla en semipulso (más cortes que beats enteros para N fotos)
const anchor = strongOnsets[0] ?? 0;
const grid = [];
for (let t = anchor; t < FAMILY_MONTAGE_MS; t += halfBeatMs) grid.push(t);
for (let t = anchor - halfBeatMs; t >= 0; t -= halfBeatMs) grid.unshift(t);
const beatGrid = [...new Set(grid)].sort((a, b) => a - b);

function snapToOnset(ms, window = 90) {
  let best = ms;
  let bestDist = window + 1;
  for (const o of allOnsets) {
    const d = Math.abs(o - ms);
    if (d < bestDist) {
      bestDist = d;
      best = o;
    }
  }
  return bestDist <= window ? best : ms;
}

const snappedGrid = beatGrid.map((t) => snapToOnset(t));

// Puntos de corte: repartir PHOTO_COUNT fotos sobre la rejilla
const cutPoints = [0];
for (let p = 1; p < PHOTO_COUNT; p++) {
  const ideal = Math.round((p / PHOTO_COUNT) * FAMILY_MONTAGE_MS);
  let best = ideal;
  let bestDist = Infinity;
  for (const g of snappedGrid) {
    if (g <= cutPoints[cutPoints.length - 1]) continue;
    const d = Math.abs(g - ideal);
    if (d < bestDist) {
      bestDist = d;
      best = g;
    }
  }
  if (best <= cutPoints[cutPoints.length - 1]) {
    best = ideal;
  }
  cutPoints.push(best);
}
cutPoints.push(FAMILY_MONTAGE_MS);

let cuts = [];
for (let i = 0; i < PHOTO_COUNT; i++) {
  cuts.push(Math.max(MIN_CUT_MS, cutPoints[i + 1] - cutPoints[i]));
}

let sum = cuts.reduce((a, b) => a + b, 0);
let diff = FAMILY_MONTAGE_MS - sum;

function redistribute(cutsArr, delta) {
  const c = [...cutsArr];
  let d = delta;
  const order = c.map((v, i) => ({ v, i })).sort((a, b) => b.v - a.v);
  let pass = 0;
  while (d !== 0 && pass < order.length * 20) {
    const idx = order[pass % order.length].i;
    const step = d > 0 ? 20 : -20;
    if (c[idx] + step >= MIN_CUT_MS) {
      c[idx] += step;
      d -= step;
    }
    pass++;
  }
  return c;
}

// Sub-mínimos: tomar de los cortes más largos
for (let i = 0; i < cuts.length; i++) {
  if (cuts[i] < MIN_CUT_MS) {
    const need = MIN_CUT_MS - cuts[i];
    let donor = cuts.indexOf(Math.max(...cuts));
    const take = Math.min(need, cuts[donor] - MIN_CUT_MS);
    cuts[i] += take;
    cuts[donor] -= take;
  }
}

cuts = redistribute(cuts, diff);

// Redondear a 20ms
cuts = cuts.map((v) => Math.round(v / 20) * 20);
for (let i = 0; i < cuts.length; i++) {
  if (cuts[i] < MIN_CUT_MS) cuts[i] = MIN_CUT_MS;
}
diff = FAMILY_MONTAGE_MS - cuts.reduce((a, b) => a + b, 0);
cuts = redistribute(cuts, diff);

console.log(
  JSON.stringify(
    {
      photoCount: PHOTO_COUNT,
      familyMontageMs: FAMILY_MONTAGE_MS,
      audioStartSec,
      audioEndSec,
      bpm,
      beatMs,
      strongOnsets: strongOnsets.length,
      allOnsets: allOnsets.length,
      sum: cuts.reduce((a, b) => a + b, 0),
      cuts,
    },
    null,
    2,
  ),
);

fs.unlinkSync(tmpWav);
