/**
 * Exporta dossier MORVO-Final a PDF interactivo landscape 16:9 (1:1 con la web).
 * Flechas / laterales = página anterior/siguiente.
 *
 * Uso: node scripts/export-dossier-pdf.mjs
 */
import { chromium } from "playwright";
import { PDFDocument, PDFName } from "pdf-lib";
import { spawn } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SLIDE_COUNT = 8;
/** Misma resolución que el stage web a pantalla completa */
const VIEW_W = 1920;
const VIEW_H = 1080;
const OUT_PDF = path.join(os.homedir(), "Downloads", "MORVO-Final-dossier.pdf");
const PORTS = [5173, 5174, 5175, 5176];
const ARROW = { size: 72, inset: 16 };

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

function cssRectToPdf(x, y, w, h, pageH) {
  return { x, y: pageH - y - h, width: w, height: h };
}

function addGoToLink(pdf, pdfPage, rect, targetPage) {
  const { x, y, width, height } = rect;
  const linkRef = pdf.context.register(
    pdf.context.obj({
      Type: "Annot",
      Subtype: "Link",
      Rect: [x, y, x + width, y + height],
      Border: [0, 0, 0],
      A: {
        Type: "Action",
        S: "GoTo",
        D: [targetPage.ref, "Fit"],
      },
    }),
  );

  const annotsKey = PDFName.of("Annots");
  const existing = pdfPage.node.lookup(annotsKey);
  if (existing) existing.push(linkRef);
  else pdfPage.node.set(annotsKey, pdf.context.obj([linkRef]));
}

function readPngSize(file) {
  const buf = fs.readFileSync(file);
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

async function main() {
  let viteProc = null;
  let base = await findBaseUrl();
  if (!base) {
    console.log("Arrancando Vite…");
    viteProc = await startVite();
    base = "http://127.0.0.1:5173/";
    await new Promise((r) => setTimeout(r, 1500));
  }
  console.log(`Base: ${base}`);

  const work = fs.mkdtempSync(path.join(os.tmpdir(), "morvo-dossier-pdf-"));
  const shots = [];

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: VIEW_W, height: VIEW_H },
    deviceScaleFactor: 1,
    screen: { width: VIEW_W, height: VIEW_H },
  });
  const page = await context.newPage();
  page.setDefaultTimeout(60_000);

  await page.goto(base, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);

  // Stage a sangre: 1920×1080 exactos (= tipografía idéntica a la web a fullscreen)
  await page.addStyleTag({
    content: `
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
      button[aria-label^="Ir a slide"] { display: none !important; }
    `,
  });
  await page.waitForTimeout(300);

  for (let i = 0; i < SLIDE_COUNT; i++) {
    if (i > 0) {
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(800);
    } else {
      await page.waitForTimeout(400);
    }
    const file = path.join(work, `slide-${String(i + 1).padStart(2, "0")}.png`);
    // Captura viewport completo (ya es el stage 16:9)
    await page.screenshot({ path: file, fullPage: false, type: "png" });
    const size = readPngSize(file);
    console.log(`Slide ${i + 1}/${SLIDE_COUNT} → ${size.width}×${size.height}`);
    if (size.width < size.height) {
      throw new Error(`Captura en vertical (${size.width}×${size.height}); se esperaba landscape`);
    }
    shots.push(file);
  }

  await browser.close();

  const pdf = await PDFDocument.create();
  pdf.setTitle("MORVO — Dossier");
  pdf.setAuthor("Compañía Obscena Teatral");

  // Una sola página a la vez (como el dossier), no scroll vertical de varias
  pdf.catalog.set(PDFName.of("PageLayout"), PDFName.of("SinglePage"));
  pdf.catalog.set(PDFName.of("PageMode"), PDFName.of("UseNone"));

  const pageRefs = [];

  for (const file of shots) {
    const bytes = fs.readFileSync(file);
    const png = await pdf.embedPng(bytes);
    // Página landscape: ancho > alto (1920×1080)
    const pdfPage = pdf.addPage([VIEW_W, VIEW_H]);
    // Imagen 1:1 — sin reescalar tipografía
    pdfPage.drawImage(png, {
      x: 0,
      y: 0,
      width: png.width,
      height: png.height,
    });
    if (png.width !== VIEW_W || png.height !== VIEW_H) {
      pdfPage.setSize(png.width, png.height);
    }
    pageRefs.push(pdfPage);
  }

  const pageW = pageRefs[0].getWidth();
  const pageH = pageRefs[0].getHeight();
  console.log(`PDF página: ${pageW}×${pageH} (landscape=${pageW > pageH})`);

  for (let i = 0; i < SLIDE_COUNT; i++) {
    const pdfPage = pageRefs[i];
    const prev = (i - 1 + SLIDE_COUNT) % SLIDE_COUNT;
    const next = (i + 1) % SLIDE_COUNT;
    const midY = (pageH - ARROW.size) / 2;
    const w = pdfPage.getWidth();
    const h = pdfPage.getHeight();

    for (const rect of [
      cssRectToPdf(0, 0, 120, h, h),
      cssRectToPdf(ARROW.inset, midY, ARROW.size, ARROW.size, h),
    ]) {
      addGoToLink(pdf, pdfPage, rect, pageRefs[prev]);
    }
    for (const rect of [
      cssRectToPdf(w - 120, 0, 120, h, h),
      cssRectToPdf(w - ARROW.inset - ARROW.size, midY, ARROW.size, ARROW.size, h),
    ]) {
      addGoToLink(pdf, pdfPage, rect, pageRefs[next]);
    }
  }

  // Abrir ajustado a la página (horizontal completa)
  const first = pageRefs[0].ref;
  pdf.catalog.set(
    PDFName.of("OpenAction"),
    pdf.context.obj({
      Type: "Action",
      S: "GoTo",
      D: [first, "Fit"],
    }),
  );

  fs.writeFileSync(OUT_PDF, await pdf.save());
  if (viteProc) viteProc.kill();

  console.log(`\nPDF → ${OUT_PDF}`);
  console.log("Abre a pantalla completa / «Ajustar a página». Flechas o laterales = cambiar vista.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
