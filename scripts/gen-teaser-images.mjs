import fs from "fs";
import path from "path";

const dir = path.resolve("public/images/teaser/nuevas");
const base = "/images/teaser/nuevas";
/** Archivos excluidos del montaje (p. ej. cactus u otras imágenes fuera de tema) */
const EXCLUDE_FILES = new Set([
  "alina-bordunova-DMDnBwER9kk-unsplash.jpg",
  "engin-akyurt-Z4qyCS3ohYE-unsplash.jpg",
  "chris-yang-wHnvP5M95OE-unsplash.jpg",
  "annie-spratt-EoP0hx9bybY-unsplash.jpg",
  "nationaal-archief-Nifnvokdv_o-unsplash.jpg",
  "marcel-strauss-ZdXV79EGHFY-unsplash.jpg",
  "klara-kulikova-VfkC3fDfeHs-unsplash.jpg",
  "klara-kulikova-VfkC3fDfeHs-unsplash-kiss.jpg",
  "don-starkey-BKYK-qSKnpk-unsplash.jpg",
  "gryffyn-m-pl5B-k_Xk8Y-unsplash.jpg",
]);
const files = fs
  .readdirSync(dir)
  .filter((f) => /\.(jpg|jpeg|png|webp|gif)$/i.test(f) && !EXCLUDE_FILES.has(f))
  .sort();

const toEntry = (file) => {
  const slug = file.replace(/\.[^.]+$/, "");
  const id =
    "nueva-" +
    slug
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 50);
  const label =
    slug
      .split("-")
      .slice(0, -1)
      .join(" ")
      .replace(/\b\w/g, (c) => c.toUpperCase()) || slug;
  return { id, label, url: `${base}/${file}` };
};

const bosqueNuevas = [];
const fuegoNuevas = [];
const ritualNuevas = [];

files.forEach((file, i) => {
  const entry = toEntry(file);
  if (i % 3 === 0) bosqueNuevas.push(entry);
  else if (i % 3 === 1) fuegoNuevas.push(entry);
  else ritualNuevas.push(entry);
});

const fmt = (arr) =>
  arr
    .map(
      (e) =>
        `  { id: "${e.id}", label: "${e.label.replace(/"/g, '\\"')}", url: "${e.url}" },`,
    )
    .join("\n");

const content = `/** Auto-generado desde public/images/teaser/nuevas — no editar a mano */
import type { StockImage } from "./stockImages";

export const TEASER_NUEVAS_BOSQUE: StockImage[] = [
${fmt(bosqueNuevas)}
];

export const TEASER_NUEVAS_FUEGO: StockImage[] = [
${fmt(fuegoNuevas)}
];

export const TEASER_NUEVAS_RITUAL: StockImage[] = [
${fmt(ritualNuevas)}
];
`;

fs.writeFileSync("src/assets/teaserNuevas.generated.ts", content);
console.log(
  `Generated ${bosqueNuevas.length} bosque, ${fuegoNuevas.length} fuego, ${ritualNuevas.length} ritual`,
);
