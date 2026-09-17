/**
 * Dossier interactivo (como la web): 16:9 a pantalla, flechas, portada GIF con flicker.
 *
 * Salida: ~/Downloads/MORVO-Final-dossier/
 *   index.html  — abrir en Chrome (flechas / teclado)
 *   cover.gif   — portada animada
 *   slide-02.png … slide-08.png
 *
 * Uso: node scripts/export-dossier-interactive.mjs
 */
import { chromium } from "playwright";
import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SLIDE_COUNT = 8;
const VIEW_W = 1920;
const VIEW_H = 1080;
const OUT_DIR = path.join(os.homedir(), "Downloads", "MORVO-Final-dossier");
const PORTS = [5173, 5174, 5175, 5176];
/** ~2 ciclos del flicker (1.6s + repeatDelay) */
const COVER_GIF_MS = 4200;
const COVER_FPS = 12;

function findFfmpeg() {
  const which = spawnSync("where.exe", ["ffmpeg"], { encoding: "utf8" });
  if (which.status === 0) {
    const line = which.stdout.trim().split(/\r?\n/)[0];
    if (line) return line;
  }
  return null;
}

function probe(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      res.resume();
      resolve(res.statusCode !== undefined && res.statusCode < 500);
    });
    req.on("error", () => resolve(false));
    req.setTimeout(1500, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function findBaseUrl() {
  for (const p of PORTS) {
    const url = `http://127.0.0.1:${p}/`;
    if (await probe(url)) return url;
  }
  return null;
}

function startVite() {
  return new Promise((resolve, reject) => {
    const child = spawn("npx", ["vite", "--host", "127.0.0.1", "--port", "5173"], {
      cwd: ROOT,
      shell: true,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let buf = "";
    const onData = (chunk) => {
      buf += chunk.toString();
      if (/Local:\s+http/i.test(buf) || /ready in/i.test(buf)) {
        child.stdout.off("data", onData);
        child.stderr.off("data", onData);
        resolve(child);
      }
    };
    child.stdout.on("data", onData);
    child.stderr.on("data", onData);
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code !== 0 && code !== null) reject(new Error(`Vite salió con código ${code}`));
    });
    setTimeout(() => reject(new Error("Timeout arrancando Vite")), 60_000);
  });
}

const FORCE_STAGE_CSS = `
  html, body, #root {
    width: ${VIEW_W}px !important;
    height: ${VIEW_H}px !important;
    margin: 0 !important;
    padding: 0 !important;
    overflow: hidden !important;
    background: #000 !important;
  }
  body > div {
    width: ${VIEW_W}px !important;
    height: ${VIEW_H}px !important;
    display: block !important;
    background: #000 !important;
  }
  body > div > div {
    position: relative !important;
    width: ${VIEW_W}px !important;
    height: ${VIEW_H}px !important;
    max-width: none !important;
    max-height: none !important;
    min-width: ${VIEW_W}px !important;
    min-height: ${VIEW_H}px !important;
    aspect-ratio: auto !important;
    box-shadow: none !important;
    overflow: hidden !important;
  }
  button[aria-label^="Ir a slide"],
  button[aria-label="Vista anterior"],
  button[aria-label="Vista siguiente"] { display: none !important; }
`;

function writeHtml(outDir) {
  const slides = [];
  slides.push({ type: "gif", src: "cover.gif" });
  for (let i = 2; i <= SLIDE_COUNT; i++) {
    slides.push({ type: "img", src: `slide-${String(i).padStart(2, "0")}.png` });
  }

  const html = `<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>MORVO — Dossier</title>
<style>
  * { box-sizing: border-box; }
  html, body {
    margin: 0; height: 100%; background: #050504;
    overflow: hidden; font-family: system-ui, sans-serif;
  }
  #stage-wrap {
    position: fixed; inset: 0;
    display: flex; align-items: center; justify-content: center;
  }
  #stage {
    position: relative;
    width: min(100vw, calc(100vh * 16 / 9));
    height: min(100vh, calc(100vw * 9 / 16));
    background: #000;
    overflow: hidden;
    box-shadow: 0 0 80px rgba(0,0,0,0.8);
  }
  #stage .slide {
    position: absolute; inset: 0;
    width: 100%; height: 100%;
    object-fit: contain;
    display: none;
    background: #000;
  }
  #stage .slide.on { display: block; }
  .nav {
    position: absolute; top: 50%; transform: translateY(-50%);
    z-index: 10; width: 56px; height: 56px; border-radius: 50%;
    border: 1px solid rgba(250,128,114,0.35);
    background: rgba(0,0,0,0.32); color: #FA8072;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; padding: 0;
  }
  .nav:hover { background: rgba(0,0,0,0.48); }
  .nav.prev { left: 16px; }
  .nav.next { right: 16px; }
  .nav svg { width: 22px; height: 22px; stroke: currentColor; fill: none;
    stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round; }
  #dots {
    position: absolute; bottom: 16px; left: 50%; transform: translateX(-50%);
    display: flex; gap: 8px; z-index: 10;
  }
  #dots button {
    height: 8px; border: none; padding: 0; border-radius: 4px;
    background: rgba(250,128,114,0.28); cursor: pointer;
    width: 8px; transition: width 0.2s, background 0.2s;
  }
  #dots button.on { width: 24px; background: #FA8072; }
</style>
</head>
<body>
<div id="stage-wrap">
  <div id="stage">
    ${slides
      .map((s, i) =>
        s.type === "gif"
          ? `<img class="slide${i === 0 ? " on" : ""}" data-i="${i}" src="${s.src}" alt="Portada"/>`
          : `<img class="slide${i === 0 ? " on" : ""}" data-i="${i}" src="${s.src}" alt="Vista ${i + 1}"/>`,
      )
      .join("\n    ")}
    <button type="button" class="nav prev" aria-label="Vista anterior" id="prev">
      <svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg>
    </button>
    <button type="button" class="nav next" aria-label="Vista siguiente" id="next">
      <svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>
    </button>
    <div id="dots"></div>
  </div>
</div>
<script>
  const n = ${SLIDE_COUNT};
  let i = 0;
  const slides = [...document.querySelectorAll('#stage > .slide')];
  const dots = document.getElementById('dots');
  for (let d = 0; d < n; d++) {
    const b = document.createElement('button');
    b.type = 'button';
    b.setAttribute('aria-label', 'Ir a slide ' + (d + 1));
    if (d === 0) b.classList.add('on');
    b.addEventListener('click', () => go(d));
    dots.appendChild(b);
  }
  function go(j) {
    i = (j + n) % n;
    slides.forEach((el, k) => el.classList.toggle('on', k === i));
    [...dots.children].forEach((el, k) => el.classList.toggle('on', k === i));
  }
  document.getElementById('prev').onclick = () => go(i - 1);
  document.getElementById('next').onclick = () => go(i + 1);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); go(i + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1); }
  });
  // Clic laterales (como el dossier web)
  document.getElementById('stage').addEventListener('click', (e) => {
    if (e.target.closest('.nav') || e.target.closest('#dots')) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - r.left;
    if (x < r.width * 0.22) go(i - 1);
    else if (x > r.width * 0.78) go(i + 1);
  });
</script>
</body>
</html>`;

  fs.writeFileSync(path.join(outDir, "index.html"), html, "utf8");
}

async function main() {
  const ffmpeg = findFfmpeg();
  if (!ffmpeg) throw new Error("ffmpeg no encontrado (necesario para el GIF de portada)");

  let viteProc = null;
  let base = await findBaseUrl();
  if (!base) {
    console.log("Arrancando Vite…");
    viteProc = await startVite();
    base = "http://127.0.0.1:5173/";
    await new Promise((r) => setTimeout(r, 1500));
  }
  console.log(`Base: ${base}`);

  fs.mkdirSync(OUT_DIR, { recursive: true });
  const frameDir = fs.mkdtempSync(path.join(os.tmpdir(), "morvo-cover-frames-"));

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: VIEW_W, height: VIEW_H },
    deviceScaleFactor: 1,
    screen: { width: VIEW_W, height: VIEW_H },
  });
  const page = await context.newPage();
  page.setDefaultTimeout(60_000);

  await page.goto(base, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await page.addStyleTag({ content: FORCE_STAGE_CSS });
  await page.waitForTimeout(400);

  // —— Portada GIF (flicker) ——
  console.log("Grabando portada → GIF…");
  const frameInterval = 1000 / COVER_FPS;
  const frameCount = Math.round(COVER_GIF_MS / frameInterval);
  for (let f = 0; f < frameCount; f++) {
    const fp = path.join(frameDir, `f_${String(f).padStart(3, "0")}.png`);
    await page.screenshot({ path: fp, fullPage: false, type: "png" });
    if (f < frameCount - 1) await page.waitForTimeout(frameInterval);
  }

  const coverGif = path.join(OUT_DIR, "cover.gif");
  const ff = spawnSync(
    ffmpeg,
    [
      "-y",
      "-framerate",
      String(COVER_FPS),
      "-i",
      path.join(frameDir, "f_%03d.png"),
      "-vf",
      "scale=1920:1080:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=128[p];[s1][p]paletteuse=dither=bayer",
      "-loop",
      "0",
      coverGif,
    ],
    { encoding: "utf8" },
  );
  if (ff.status !== 0) {
    console.error(ff.stderr);
    throw new Error("ffmpeg falló al crear cover.gif");
  }
  console.log(`cover.gif OK (${(fs.statSync(coverGif).size / 1024 / 1024).toFixed(1)} MB)`);

  // —— Resto de slides PNG ——
  for (let i = 1; i < SLIDE_COUNT; i++) {
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(800);
    const file = path.join(OUT_DIR, `slide-${String(i + 1).padStart(2, "0")}.png`);
    await page.screenshot({ path: file, fullPage: false, type: "png" });
    console.log(`Slide ${i + 1}/${SLIDE_COUNT}`);
  }

  await browser.close();
  writeHtml(OUT_DIR);

  try {
    fs.rmSync(frameDir, { recursive: true, force: true });
  } catch {
    /* ignore */
  }
  if (viteProc) viteProc.kill();

  console.log(`\nDossier interactivo → ${OUT_DIR}`);
  console.log("Abre index.html en Chrome (pantalla completa). Flechas + GIF de portada.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
