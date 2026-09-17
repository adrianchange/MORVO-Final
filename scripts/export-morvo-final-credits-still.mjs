/**
 * Captura PNG 1920×1080 de la tarjeta de créditos MORVO-Final
 * (fondo morvo-final-paris-bilal + título + reparto).
 *
 * Uso: node scripts/export-morvo-final-credits-still.mjs
 * Requiere: vite en http://localhost:5175/
 */
import { chromium } from "playwright";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const BASE =
  process.env.TEASER_URL ??
  "http://localhost:5175/?record=v09-credits&bg=morvo-final";
const OUT = path.join(
  os.homedir(),
  "Downloads",
  "MORVO-Final-creditos-titulo.png",
);

async function main() {
  const browser = await chromium.launch({
    headless: true,
    channel: "chrome",
    args: ["--disable-web-security"],
  });
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  page.setDefaultTimeout(120_000);

  console.log(`Abriendo ${BASE}`);
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForSelector('[data-record-ready="1"]');
  // Esperar entrada de créditos (stagger ~2.5 s) + un frame de flicker
  await page.waitForTimeout(3_200);

  await page.screenshot({ path: OUT, type: "png" });
  await browser.close();

  const st = fs.statSync(OUT);
  console.log(`Listo: ${OUT} (${Math.round(st.size / 1024)} KB)`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
