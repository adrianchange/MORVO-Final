import type { PaletteId } from "../theme/palettes";
import { PETROLEO_TEASER_URL_REPLACEMENTS, TEASER_PETROLEO_FAMILIA_URLS } from "./petroleoPhotos";
import {
  TEASER_NUEVAS_BOSQUE,
  TEASER_NUEVAS_FUEGO,
  TEASER_NUEVAS_RITUAL,
} from "./teaserNuevas.generated";

/**
 * Banco de imágenes stock para MORVO. *
 * Lorem Picsum no permite buscar por temática (solo IDs aleatorios).
 * Para estas categorías usamos URLs fijas de Unsplash — la misma fuente
 * que alimenta Picsum — con `stockImage()`.
 * Para placeholders genéricos sigue disponible `picsum()`.
 */

export type StockImage = {
  id: string;
  label: string;
  url: string;
};

export type ImageCategory = {
  id: string;
  label: string;
  images: StockImage[];
};

/** Placeholder genérico vía Lorem Picsum */
export function picsum(id: number, width = 1200, height = 800): string {
  return `https://picsum.photos/id/${id}/${width}/${height}`;
}

/** Imagen temática fija vía Unsplash (misma librería que Picsum) */
export function stockImage(
  photoPath: string,
  width = 1200,
  height = 800,
): string {
  return `https://images.unsplash.com/${photoPath}?w=${width}&h=${height}&fit=crop&auto=format`;
}

/** Inyecciones / jeringas — clínica estética */
export const INYECCIONES_CLINICA: StockImage[] = [
  {
    id: "inyeccion-1",
    label: "Jeringas y viales sobre superficie verde",
    url: stockImage("photo-1579684270320-dbe2a2eed886"),
  },
  {
    id: "inyeccion-2",
    label: "Jeringa y medicación, estética clínica",
    url: stockImage("photo-1584308666744-24d5c474f2ae"),
  },
  {
    id: "inyeccion-3",
    label: "Material de inyección y botox, still life",
    url: stockImage("photo-1631815589750-d645253112a2"),
  },
];

/** Charlas de coaching / dinámicas de grupo tipo secta */
export const CHARLAS_COACHING: StockImage[] = [
  {
    id: "coaching-1",
    label: "Grupo sentado en círculo al aire libre",
    url: stockImage("photo-1529156069898-49953db96173"),
  },
  {
    id: "coaching-2",
    label: "Taller grupal — orador y audiencia",
    url: stockImage("photo-1556761175-b413da4baf72"),
  },
  {
    id: "coaching-3",
    label: "Conferencia / multitud escuchando",
    url: stockImage("photo-1475721027880-d7718a47ac6b"),
  },
];

/** Imagen local del proyecto (public/) */
function localImage(path: string): string {
  return path;
}

/** Bosques frondosos — fotos propias (Descargas / Unsplash) */
const BOSQUE_LOCAL = "/images/teaser/bosque";

export const BOSQUE_FRONDOSO: StockImage[] = [
  {
    id: "bosque-luis-villasmil",
    label: "Bosque frondoso — Luis Villasmil",
    url: localImage(`${BOSQUE_LOCAL}/luis-villasmil-a0AxJutn5RQ-unsplash.jpg`),
  },
  {
    id: "bosque-marco-grosso",
    label: "Bosque denso — Marco Grosso",
    url: localImage(`${BOSQUE_LOCAL}/marco-grosso-gqG2ZLVzCqc.jpg`),
  },
  {
    id: "bosque-eugene-golovesov",
    label: "Sendero entre árboles — Eugene Golovesov",
    url: localImage(`${BOSQUE_LOCAL}/eugene-golovesov-SuqwElNGgnA.jpg`),
  },
  {
    id: "bosque-ingmar",
    label: "Interior de bosque — Ingmar",
    url: localImage(`${BOSQUE_LOCAL}/ingmar-qGzd3axRSF4.jpg`),
  },
  {
    id: "bosque-anita-austvika",
    label: "Helechos y troncos — Anita Austvika",
    url: localImage(`${BOSQUE_LOCAL}/anita-austvika-RfSMtI-KeMo.jpg`),
  },
  {
    id: "bosque-pascal-debrunner-nvERY",
    label: "Bosque vertical — Pascal Debrunner",
    url: localImage(`${BOSQUE_LOCAL}/pascal-debrunner-nvERYppV3SM-unsplash.jpg`),
  },
  {
    id: "bosque-wes-hicks",
    label: "Árboles altos — Wes Hicks",
    url: localImage(`${BOSQUE_LOCAL}/wes-hicks-dx6sXOrmzE.jpg`),
  },
  {
    id: "bosque-evgeni-tcherkasski",
    label: "Musgo y troncos — Evgeni Tcherkasski",
    url: localImage(`${BOSQUE_LOCAL}/evgeni-tcherkasski-c659bBmJpw0.jpg`),
  },
  {
    id: "bosque-pascal-debrunner",
    label: "Camino en el bosque — Pascal Debrunner",
    url: localImage(`${BOSQUE_LOCAL}/pascal-debrunner-5kFW8UdXTz0.jpg`),
  },
  {
    id: "bosque-renee-nicole",
    label: "Interior frondoso — Renee Nicole",
    url: localImage(`${BOSQUE_LOCAL}/renee-nicole-bMnw9uuQzDg.jpg`),
  },
  ...TEASER_NUEVAS_BOSQUE,
];

/** Rituales — gente alrededor del fuego (fotos locales Descargas) */
export const RITUAL_FUEGO_NORDICO: StockImage[] = [...TEASER_NUEVAS_FUEGO];

/** Rituales de gente en el bosque (fotos locales Descargas) */
export const RITUALES_BOSQUE: StockImage[] = [
  {
    id: "ritual-1",
    label: "Mujer con máscara con cuernos en el bosque",
    url: stockImage("photo-1736507020688-414d0f88f6b5"),
  },
  {
    id: "ritual-2",
    label: "Figura enmascarada en bosque, atmósfera ritual",
    url: stockImage("photo-1726962083545-235ea66eb340"),
  },
  {
    id: "ritual-3",
    label: "Figura encapuchada caminando por el bosque",
    url: stockImage("photo-1726968317549-78819e56deef"),
  },
  ...TEASER_NUEVAS_RITUAL,
];

export const IMAGE_BANK: ImageCategory[] = [
  {
    id: "bosque-frondoso",
    label: "Bosques frondosos",
    images: BOSQUE_FRONDOSO,
  },
  {
    id: "ritual-fuego-nordico",
    label: "Rituales nórdicos / fuego",
    images: RITUAL_FUEGO_NORDICO,
  },
  {
    id: "inyecciones",
    label: "Inyecciones / clínica estética",
    images: INYECCIONES_CLINICA,
  },
  {
    id: "coaching",
    label: "Charlas coaching / sectas",
    images: CHARLAS_COACHING,
  },
  {
    id: "rituales-bosque",
    label: "Rituales en el bosque",
    images: RITUALES_BOSQUE,
  },
];

/** Todas las imágenes del banco en un solo array */
export const ALL_STOCK_IMAGES: StockImage[] = IMAGE_BANK.flatMap((c) => c.images);

/** Imagen temática en tamaño teaser (16:9 pequeño) */
export function stockTeaserUrl(stock: StockImage): string {
  if (stock.url.startsWith("/")) return stock.url;
  return stock.url.replace("w=1200&h=800", "w=800&h=450");
}

/** URLs teaser de cada categoría */
export const INYECCIONES_TEASER = INYECCIONES_CLINICA.map(stockTeaserUrl);
export const COACHING_TEASER = CHARLAS_COACHING.map(stockTeaserUrl);
export const RITUALES_TEASER = RITUALES_BOSQUE.map(stockTeaserUrl);
export const BOSQUE_FRONDOSO_TEASER = BOSQUE_FRONDOSO.map(stockTeaserUrl);
export const RITUAL_FUEGO_NORDICO_TEASER = RITUAL_FUEGO_NORDICO.map(stockTeaserUrl);
export const ALL_STOCK_TEASER = ALL_STOCK_IMAGES.map(stockTeaserUrl);

/** Intercala bosque, fuego y rituales para el montaje del teaser */
export function interleaveTeaserPools(...pools: string[][]): string[] {
  const max = Math.max(0, ...pools.map((p) => p.length));
  const out: string[] = [];
  for (let i = 0; i < max; i++) {
    for (const pool of pools) {
      if (i < pool.length) out.push(pool[i]);
    }
  }
  return out;
}

export const TEASER_MONTAGE_POOL = interleaveTeaserPools(
  BOSQUE_FRONDOSO_TEASER,
  RITUAL_FUEGO_NORDICO_TEASER,
  RITUALES_TEASER,
);

/** Solo antes del pitido — familia, niños, cumpleaños (selección fija) */
const TEASER_FAMILIA_BASE_URLS: string[] = [
  "/images/teaser/nuevas/annie-spratt-77Faqk66Ixc-unsplash.jpg",
  "/images/teaser/nuevas/annie-spratt-nG7vuM7SBm8-unsplash.jpg",
  "/images/teaser/nuevas/annie-spratt-swg5qZkNtX0-unsplash.jpg",
  "/images/teaser/nuevas/annie-spratt-wSJyJxTGJTc-unsplash.jpg",
  "/images/teaser/nuevas/ardian-lumi-72uqWSqAiWg-unsplash.jpg",
  "/images/teaser/nuevas/cesar-cabrera-aZqloZH2dzk-unsplash.jpg",
  "/images/teaser/nuevas/christelle-hayek-IdD7HB87CdA-unsplash.jpg",
  "/images/teaser/nuevas/davidson-l-u-n-a-XWFwjRHjS54-unsplash.jpg",
  "/images/teaser/nuevas/diane-pilkington-yWjAV_X-msw-unsplash.jpg",
  "/images/teaser/nuevas/gabriel-tovar-sENNT-UJ4Xc-unsplash.jpg",
  "/images/teaser/nuevas/ian-dooley-VDLQUgkr3S4-unsplash.jpg",
  "/images/teaser/nuevas/j-lopez-DW2202YZkr4-unsplash.jpg",
  "/images/teaser/nuevas/joaquin-toro-td_NflhYdQc-unsplash.jpg",
  "/images/teaser/nuevas/juan-saav-iFBXPq6opqE-unsplash.jpg",
  "/images/teaser/nuevas/la-compagnie-robinson-KGQlg-K4VWA-unsplash.jpg",
  "/images/teaser/nuevas/lifetime-leather-X875kk9-rnU-unsplash.jpg",
  "/images/teaser/nuevas/o-kunh-o0hLQIh8QhU-unsplash.jpg",
  "/images/teaser/nuevas/pablo-hernandez-YXyYCw8ioXA-unsplash.jpg",
  "/images/teaser/nuevas/pavel-neznanov-d4JTUfFfFKs-unsplash.jpg",
  "/images/teaser/nuevas/ranurte-Vft5FphFtRI-unsplash.jpg",
  "/images/teaser/nuevas/rick-lobs-RuOmNZ9iM3I-unsplash.jpg",
  "/images/teaser/nuevas/terren-hurst-mf1Mb9mNCFg-unsplash.jpg",
  "/images/teaser/nuevas/tiago-ferreira-iNOcuqaR-js-unsplash.jpg",
  "/images/teaser/nuevas/sandy-millar-KhStXRVhfog-unsplash.jpg",
  "/images/teaser/nuevas/zoshua-colah-CUka1SutO5Q-unsplash.jpg",
];

const TEASER_FAMILIA_INSERT_URLS: string[] = [
  "/images/teaser/nuevas/christian-harb-DXOM4iEVHZg-unsplash.jpg",
  "/images/teaser/nuevas/jr-korpa-NDUjrvZKMeE-unsplash.jpg",
  "/images/teaser/nuevas/cole-parks-V0od6_EwShM-unsplash.jpg",
  "/images/teaser/nuevas/sebastian-schuster-RCeQ1SrBOGs-unsplash.jpg",
  "/images/teaser/nuevas/elena-mozhvilo-S1maLp-w81o-unsplash.jpg",
  "/images/teaser/nuevas/anton-pavlov-BCazFs7jWF8-unsplash.jpg",
  "/images/teaser/nuevas/gravity-vStkVmrfTrw-unsplash.jpg",
  "/images/teaser/nuevas/federica-giusti-my6gx6s_Fr8-unsplash.jpg",
  "/images/teaser/nuevas/jr-korpa-AK7rrIAldDg-unsplash.jpg",
];

/** Inserta fotos nuevas entre bloques del montaje (sin seguidas) */
function interleaveMontageInserts(base: readonly string[], inserts: readonly string[]): string[] {
  if (inserts.length === 0) return [...base];

  const chunkSize = Math.ceil(base.length / inserts.length);
  const out: string[] = [];
  let baseIdx = 0;

  for (let i = 0; i < inserts.length; i++) {
    const chunkEnd = i === inserts.length - 1 ? base.length : Math.min(base.length, (i + 1) * chunkSize);
    while (baseIdx < chunkEnd) {
      out.push(base[baseIdx++]);
    }
    out.push(inserts[i]);
  }

  while (baseIdx < base.length) out.push(base[baseIdx++]);
  return out;
}

export const TEASER_FAMILIA_URLS: string[] = interleaveMontageInserts(
  TEASER_FAMILIA_BASE_URLS,
  TEASER_FAMILIA_INSERT_URLS,
);

/** Fuera del teaser — solo paleta Raíz Petróleo */
const TEASER_PETROLEO_EXCLUDED_URLS = new Set<string>([
  "/images/teaser/nuevas/annie-spratt-77Faqk66Ixc-unsplash.jpg",
  "/images/teaser/nuevas/annie-spratt-nG7vuM7SBm8-unsplash.jpg",
  "/images/teaser/nuevas/annie-spratt-wSJyJxTGJTc-unsplash.jpg",
  "/images/teaser/nuevas/amir-maleky-s0Qdp5g_OJ4-unsplash.jpg",
  "/images/teaser/nuevas/amir-maleky-JYgoITTxgNg-unsplash.jpg",
  "/images/teaser/nuevas/christelle-hayek-IdD7HB87CdA-unsplash.jpg",
  "/images/teaser/nuevas/sebastian-schuster-RCeQ1SrBOGs-unsplash.jpg",
  "/images/teaser/nuevas/terren-hurst-mf1Mb9mNCFg-unsplash.jpg",
  "/images/teaser/nuevas/zoshua-colah-CUka1SutO5Q-unsplash.jpg",
  "/images/teaser/nuevas/pavel-neznanov-d4JTUfFfFKs-unsplash.jpg",
  "/images/teaser/nuevas/davidson-l-u-n-a-XWFwjRHjS54-unsplash.jpg",
  "/images/teaser/nuevas/jr-korpa-NDUjrvZKMeE-unsplash.jpg",
  "/images/teaser/nuevas/annie-spratt-swg5qZkNtX0-unsplash.jpg",
  "/images/teaser/nuevas/gabriel-tovar-sENNT-UJ4Xc-unsplash.jpg",
  "/images/teaser/nuevas/pablo-hernandez-YXyYCw8ioXA-unsplash.jpg",
  "/images/teaser/nuevas/joaquin-toro-td_NflhYdQc-unsplash.jpg",
  "/images/teaser/nuevas/anton-pavlov-BCazFs7jWF8-unsplash.jpg",
  "/images/teaser/nuevas/o-kunh-o0hLQIh8QhU-unsplash.jpg",
  "/images/teaser/nuevas/james-adams-BSHgWMV9WgE-unsplash.jpg",
  "/images/teaser/nuevas/stephane-hurbe-uoQAz5EWwTo-unsplash.jpg",
  "/images/teaser/nuevas/jesse-barker-4na9_syVpcs-unsplash.jpg",
  "/images/teaser/nuevas/sonu-agvan-icxw9r1SrtE-unsplash.jpg",
  "/images/teaser/nuevas/laura-louise-grimsley-Wp3WpF7fivc-unsplash.jpg",
]);

export function filterPetroleoTeaserUrls(urls: readonly string[], paletteId?: PaletteId): string[] {
  if (paletteId !== "raiz_petroleo") return [...urls];
  return urls
    .filter((url) => !TEASER_PETROLEO_EXCLUDED_URLS.has(url))
    .map((url) => PETROLEO_TEASER_URL_REPLACEMENTS[url] ?? url);
}

export function getTeaserFamiliaUrls(paletteId?: PaletteId): string[] {
  const base = filterPetroleoTeaserUrls(TEASER_FAMILIA_URLS, paletteId);
  if (paletteId === "raiz_petroleo") {
    return [...TEASER_PETROLEO_FAMILIA_URLS, ...base];
  }
  return base;
}

const TEASER_FAMILIA_SET = new Set(TEASER_FAMILIA_URLS);

/** Nuevas fotos intercaladas en el 2.º montaje (ritual, fuego, surreal…) */
const TEASER_REST_INSERT_URLS: string[] = [
  "/images/teaser/nuevas/sergey-vinogradov-TI-eDUB8P7U-unsplash.jpg",
  "/images/teaser/nuevas/pranav-ck-g1dKoyNCUPU-unsplash.jpg",
  "/images/teaser/nuevas/mikita-karasiou-dSbPtJHukVE-unsplash.jpg",
  "/images/teaser/nuevas/joey-nicotra-jaWsWDzCXSQ-unsplash.jpg",
  "/images/teaser/nuevas/tommaso-ubezio-4c2aeV4gsGE-unsplash.jpg",
  "/images/teaser/nuevas/manyu-varma-ef3A5EDR7Jk-unsplash.jpg",
  "/images/teaser/nuevas/luka-peters-tD2HNVUtxc8-unsplash.jpg",
  "/images/teaser/nuevas/jeffrey-keenan-w_QxS8ZfFhk-unsplash.jpg",
  "/images/teaser/nuevas/alex-shuper-SNliMkZHVig-unsplash.jpg",
  "/images/teaser/nuevas/alex-shuper-Zj4O7gGT-uw-unsplash.jpg",
  "/images/teaser/nuevas/nahid-hatami-tUXjhvLxmYk-unsplash.jpg",
];

/** URLs que no deben entrar en el montaje */
const TEASER_EXCLUDED_URLS = new Set([
  "/images/teaser/nuevas/alina-bordunova-DMDnBwER9kk-unsplash.jpg",
  "/images/teaser/nuevas/chris-yang-wHnvP5M95OE-unsplash.jpg",
  "/images/teaser/nuevas/annie-spratt-EoP0hx9bybY-unsplash.jpg",
  "/images/teaser/nuevas/nationaal-archief-Nifnvokdv_o-unsplash.jpg",
  "/images/teaser/nuevas/wolfgang-hasselmann-qqaxfqr_jss-unsplash.jpg",
  "/images/teaser/nuevas/marcel-strauss-ZdXV79EGHFY-unsplash.jpg",
  "/images/teaser/nuevas/klara-kulikova-VfkC3fDfeHs-unsplash.jpg",
  "/images/teaser/nuevas/klara-kulikova-VfkC3fDfeHs-unsplash-kiss.jpg",
  "/images/teaser/nuevas/don-starkey-BKYK-qSKnpk-unsplash.jpg",
  "/images/teaser/nuevas/gryffyn-m-pl5B-k_Xk8Y-unsplash.jpg",
]);

/** Imágenes del montaje que no se usan en el primer tramo */
export function teaserRestPool(montagePool: string[], extra: string[] = []): string[] {
  const all = [...montagePool, ...extra];
  return all.filter((url) => !TEASER_FAMILIA_SET.has(url) && !TEASER_EXCLUDED_URLS.has(url));
}

/** 2.ª parte del teaser — pool base + inserts intercalados */
export function buildTeaserRestImages(extra: string[] = []): string[] {
  const base = teaserRestPool(TEASER_MONTAGE_POOL, extra);
  return interleaveMontageInserts(base, TEASER_REST_INSERT_URLS);
}

/** Buscar por id dentro del banco */
export function getStockImage(id: string): StockImage | undefined {
  return ALL_STOCK_IMAGES.find((img) => img.id === id);
}
