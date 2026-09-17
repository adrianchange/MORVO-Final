/**
 * Exporta el teaser Petróleo de MORVO-Final imagen a imagen (orden del montaje).
 * Coletillas: _primerplano / _fondo (+ texto en el nombre si hay título).
 *
 * Uso: node scripts/export-teaser-secuencia.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import os from "node:os";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const OUT = path.join(os.homedir(), "Desktop", "MORVO-Teaser-Secuencia");

const P = "/images/teaser/petroleo";
const N = "/images/teaser/nuevas";
const B = "/images/teaser/bosque";

const COVER = "/images/teaser/teaser-cover-paris-bilal-arches.jpg";
const TYPEWRITER_BG = "/images/teaser/teaser-cover-mainak-bose.jpg";
const MORVO_FINAL = "/images/teaser/morvo-final-paris-bilal.png";

const TYPEWRITER_TEXT = "UNA VEZ NOS CONTARON UN CUENTO...";
const SECOND_PHRASE = "Hoy te han traído aquí para que lo cambies";
const COVER_TEXT = "Compañía OBSCENA TEATRAL PRESENTA";
const CREDITS_TEXT = "Mario Javier-Estevez · Víctor Adrian-Popovici · Cristian Ciprian-Gheorghe";

/** Misma secuencia que teaserPetroleoBeat.ts (parte 1 + 2) */
const BEATS = [
  {
    id: "cristian-pequeno",
    kind: "image",
    front: `${P}/cristian-pequeno.png`,
    back: `${P}/CristianMadre.jpg`,
  },
  {
    id: "cristian-madre",
    kind: "image",
    front: `${P}/CristianMadre.jpg`,
    back: `${N}/christian-harb-DXOM4iEVHZg-unsplash.jpg`,
  },
  {
    id: "cristian-play",
    kind: "video",
    front: "/video/teaser/petroleo/CristianPlay.mp4",
    back: `${P}/CristianFondo.jpg`,
    titleLines: ["Cristian", "el cowboy"],
  },
  {
    id: "victors-bike",
    kind: "image",
    front: `${P}/VictorsBike.jpg`,
    back: `${P}/jardinero.png`,
  },
  {
    id: "jardinero",
    kind: "image",
    front: `${P}/jardinero.png`,
    back: `${P}/eugenia-pan-kiv-PLka1OBImFw-unsplash.jpg`,
  },
  {
    id: "victors-light",
    kind: "image",
    front: `${P}/VictorsLight.jpg`,
    back: `${P}/VictorsParty.jpg`,
  },
  {
    id: "victor-calienta",
    kind: "video",
    front: "/video/teaser/petroleo/VictorCalientaBueno.mp4",
    back: `${P}/VictorsLight.jpg`,
    titleLines: ["Victor", "La Caren"],
  },
  {
    id: "ardian-lumi",
    kind: "image",
    front: `${N}/ardian-lumi-72uqWSqAiWg-unsplash.jpg`,
    back: `${P}/hans-ott-YG2rJQvs-bc-unsplash.jpg`,
  },
  {
    id: "hayley-clues",
    kind: "image",
    front: `${P}/hayley-clues-4KGH5Qzoddk-unsplash.jpg`,
    back: `${P}/eugenia-pan-kiv-PLka1OBImFw-unsplash.jpg`,
  },
  {
    id: "mario-gordo",
    kind: "image",
    front: `${P}/mario-gordo.png`,
    back: `${P}/Barrotes.jpg`,
  },
  {
    id: "compagnie-robinson",
    kind: "image",
    front: `${N}/la-compagnie-robinson-KGQlg-K4VWA-unsplash.jpg`,
    back: `${N}/cesar-cabrera-aZqloZH2dzk-unsplash.jpg`,
  },
  {
    id: "diane-pilkington",
    kind: "image",
    front: `${N}/diane-pilkington-yWjAV_X-msw-unsplash.jpg`,
    back: `${N}/tiago-ferreira-iNOcuqaR-js-unsplash.jpg`,
  },
  {
    id: "name-gravity",
    kind: "image",
    front: `${N}/name_-gravity-vStkVmrfTrw-unsplash.jpg`,
    back: `${N}/mert-kahveci-YGoT2ok6jRQ-unsplash.jpg`,
  },
  {
    id: "mario-el-santo-final",
    kind: "image",
    front: `${P}/MarioElSantoFinal.png`,
    back: `${P}/MariosJob.jpg`,
    titleLines: ["Mario", "El Santo", "de los Milagros"],
  },
  // --- 2.ª frase ---
  {
    id: "luis-villasmil",
    kind: "image",
    front: `${B}/luis-villasmil-a0AxJutn5RQ-unsplash.jpg`,
    back: `${N}/alec-krum-NG7r_1NlIg0-unsplash.jpg`,
  },
  {
    id: "jeffrey-keenan",
    kind: "image",
    front: `${N}/jeffrey-keenan-w_QxS8ZfFhk-unsplash.jpg`,
    back: `${N}/margo-evardson-sfDLrGeM8H8-unsplash.jpg`,
    titleLines: ["¿Y tú,", "quién eres?"],
  },
  {
    id: "evgeni-tcherkasski",
    kind: "image",
    front: `${B}/evgeni-tcherkasski-c659bBmJpw0.jpg`,
    back: `${N}/elena-mozhvilo-hmcF-Lx9jig-unsplash.jpg`,
    titleLines: ["¿Quién eres de verdad?"],
  },
  {
    id: "sergey-vinogradov",
    kind: "image",
    front: `${N}/sergey-vinogradov-VjcUuHNidgo-unsplash.jpg`,
    back: `${N}/jr-korpa-NDUjrvZKMeE-unsplash.jpg`,
    titleLines: ["¡Abre los ojos!"],
  },
  {
    id: "mario-oso",
    kind: "image",
    front: `${P}/MarioOso.jpg`,
    back: `${P}/MarioFondo.jpg`,
    titleLines: ["Silencia el miedo"],
  },
  {
    id: "igor-rand",
    kind: "image",
    front: `${N}/igor-rand-vYFfSPfdsWE-unsplash.jpg`,
    back: `${N}/vidar-nordli-mathisen-f4OmS_SluJc-unsplash.jpg`,
    titleLines: ["Empieza", "aquí", "y ahora"],
  },
  {
    id: "cristian-orejas",
    kind: "image",
    front: `${P}/CristianOrejas.jpg`,
    back: `${N}/cole-parks-V0od6_EwShM-unsplash.jpg`,
    titleLines: ["Escúchate…"],
  },
  {
    id: "seungwon-park",
    kind: "image",
    front: `${N}/seungwon-park-ntbjVxhffmo-unsplash.jpg`,
    back: `${N}/pavel-okrema-FYMurZs34jA-unsplash.jpg`,
    titleLines: ["Déjate llevar…"],
  },
  {
    id: "ed-stone",
    kind: "image",
    front: `${N}/ed-stone-78U6V0mBdgw-unsplash.jpg`,
    back: `${N}/chris-yang-wHnvP5M95OE-unsplash.jpg`,
    titleLines: ["Entra en el bosque"],
  },
  {
    id: "alex-shuper",
    kind: "image",
    front: `${N}/alex-shuper-SNliMkZHVig-unsplash.jpg`,
    back: `${N}/manyu-varma-ef3A5EDR7Jk-unsplash.jpg`,
    titleLines: ["Y…"],
  },
  {
    id: "sinopsis1",
    kind: "image",
    front: `${P}/Sinopsis1.jpg`,
    back: `${P}/MarioEnelBosque.jpg`,
    titleLines: ["Quítate la máscara"],
  },
  {
    id: "poney",
    kind: "image",
    front: `${P}/Poney.jpg`,
    back: `${N}/minh-tran-xL86g_rz28M-unsplash.jpg`,
  },
  {
    id: "cole-parks",
    kind: "image",
    front: `${N}/cole-parks-V0od6_EwShM-unsplash.jpg`,
    back: `${N}/pranav-ck-g1dKoyNCUPU-unsplash.jpg`,
  },
  {
    id: "victor-after-bosque",
    kind: "image",
    front: `${P}/victor-after-bosque.png`,
    back: `${N}/tommaso-ubezio-4c2aeV4gsGE-unsplash.jpg`,
    titleLines: ["Y sabrás"],
  },
  {
    id: "morvo-video",
    kind: "video",
    front: "/video/teaser/petroleo/MorvoVideo.mp4",
    back: `${N}/moreno-matkovic-A1S_sEWdgRU-unsplash.jpg`,
    titleLines: ["TU MORVO"],
  },
  {
    id: "alex-shuper-zj407",
    kind: "image",
    front: `${N}/alex-shuper-Zj4O7gGT-uw-unsplash.jpg`,
    back: `${N}/polina-FDApO0QiXGQ-unsplash.jpg`,
  },
  {
    id: "cristiano-valadar",
    kind: "image",
    front: `${N}/cristiano-valadar-pxdhDlA1B50-unsplash.jpg`,
    back: `${N}/dmytro-koplyk-rfPA05CKCu4-unsplash.jpg`,
  },
];

function slugText(lines) {
  if (!lines?.length) return "";
  return lines
    .join("-")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[¿?¡!"""'…,.;:]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9_-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function publicPath(url) {
  return path.join(PUBLIC, url.replace(/^\//, "").replace(/\//g, path.sep));
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyAs(srcUrl, destPath) {
  const src = publicPath(srcUrl);
  if (!fs.existsSync(src)) {
    console.warn(`FALTA: ${srcUrl}`);
    return false;
  }
  fs.copyFileSync(src, destPath);
  return true;
}

function pad(n) {
  return String(n).padStart(3, "0");
}

ensureDir(OUT);

const indexLines = [
  "MORVO-Final — Teaser Petróleo (secuencia para edición)",
  "Coletillas: _1-primerplano = capa frontal | _2-fondo = capa de fondo",
  "Si hay texto en pantalla, va en el nombre del primerplano (y en _texto.txt).",
  "Audio: 000_audio-teaser-60s.m4a",
  "",
];

let n = 1;
let copied = 0;
let missing = 0;

// Audio del teaser (~60 s)
{
  const audioSrc = path.join(PUBLIC, "audio", "teaser-ravel-60s.m4a");
  const audioDest = path.join(OUT, "000_audio-teaser-60s.m4a");
  if (fs.existsSync(audioSrc)) {
    fs.copyFileSync(audioSrc, audioDest);
    copied++;
    indexLines.push(`000  audio  teaser Ravel 60 s  →  000_audio-teaser-60s.m4a`);
  } else {
    missing++;
    console.warn("FALTA: /audio/teaser-ravel-60s.m4a");
  }
}

function exportSingle({ id, url, role, textLines }) {
  const ext = path.extname(publicPath(url)) || ".jpg";
  const textSlug = slugText(textLines);
  /** 1-primerplano antes que 2-fondo al ordenar por nombre */
  const roleTag = role === "primerplano" ? "1-primerplano" : "2-fondo";
  const base = textSlug
    ? `${pad(n)}_${id}_${roleTag}_${textSlug}${ext}`
    : `${pad(n)}_${id}_${roleTag}${ext}`;
  const dest = path.join(OUT, base);
  const ok = copyAs(url, dest);
  if (ok) copied++;
  else missing++;

  if (textLines?.length) {
    const txtName = `${pad(n)}_${id}_texto.txt`;
    fs.writeFileSync(path.join(OUT, txtName), textLines.join("\n") + "\n", "utf8");
  }

  indexLines.push(
    `${pad(n)}  ${id}  [${role}]${textLines?.length ? `  «${textLines.join(" / ")}»` : ""}  →  ${base}`,
  );
}

// 001 portada
exportSingle({
  id: "portada",
  url: COVER,
  role: "fondo",
  textLines: [COVER_TEXT],
});
n++;

// 002 1ª frase
exportSingle({
  id: "frase-1",
  url: TYPEWRITER_BG,
  role: "fondo",
  textLines: [TYPEWRITER_TEXT],
});
n++;

// Beats parte 1 (hasta mario) — luego 2ª frase insertada manualmente en el índice
for (const beat of BEATS) {
  // Insertar 2ª frase justo después de mario-el-santo-final
  if (beat.id === "luis-villasmil") {
    exportSingle({
      id: "frase-2",
      url: TYPEWRITER_BG,
      role: "fondo",
      textLines: [SECOND_PHRASE],
    });
    n++;
  }

  exportSingle({
    id: beat.id,
    url: beat.front,
    role: "primerplano",
    textLines: beat.titleLines,
  });
  exportSingle({
    id: beat.id,
    url: beat.back,
    role: "fondo",
  });
  n++;
}

// créditos
exportSingle({
  id: "creditos",
  url: MORVO_FINAL,
  role: "fondo",
  textLines: [CREDITS_TEXT],
});

indexLines.push("");
indexLines.push(`Copiados: ${copied}  |  Faltantes: ${missing}`);
indexLines.push(`Carpeta: ${OUT}`);

fs.writeFileSync(path.join(OUT, "_INDICE.txt"), indexLines.join("\n") + "\n", "utf8");

console.log(`Listo → ${OUT}`);
console.log(`Archivos copiados: ${copied}, faltantes: ${missing}`);
