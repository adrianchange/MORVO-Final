/**
 * Secuencias Petróleo layered (frente contain + fondo cover).
 * Parte 1 tras la 1.ª frase; parte 2 tras la 2.ª frase → créditos.
 */

const P = "/images/teaser/petroleo";
const N = "/images/teaser/nuevas";
const B = "/images/teaser/bosque";

export const PETROLEO_CRISTIAN_PLAY_URL = "/video/teaser/petroleo/CristianPlay.mp4";
export const PETROLEO_CRISTIAN_PLAY_VOLUME = 0.12;
export const PETROLEO_CRISTIAN_PLAY_FALLBACK_MS = 6_042;
export const PETROLEO_CRISTIAN_COWBOY_TITLE_LINES = ["Cristian", "el cowboy"] as const;
/** Escala relativa por línea — «el cowboy» más pequeño */
export const PETROLEO_CRISTIAN_COWBOY_TITLE_SCALES = [1, 0.72] as const;

export const PETROLEO_VICTOR_CALIENTA_BUENO_URL = "/video/teaser/petroleo/VictorCalientaBueno.mp4";
export const PETROLEO_VICTOR_CALIENTA_BUENO_VOLUME = 0.12;
export const PETROLEO_VICTOR_CALIENTA_BUENO_FALLBACK_MS = 3_200;
export const PETROLEO_VICTOR_LA_CAREN_TITLE_LINES = ["Victor", '"La Caren"'] as const;

export const PETROLEO_MARIO_EL_SANTO_FINAL_URL = `${P}/MarioElSantoFinal.png`;
export const PETROLEO_MARIO_SANTO_TITLE_LINES = ["Mario", "El Santo", "de los Milagros"] as const;
/** Nombre grande; epíteto en dos líneas más pequeñas */
export const PETROLEO_MARIO_SANTO_TITLE_SCALES = [1, 0.72, 0.72] as const;

/** @deprecated Sustituido por MarioElSantoFinal (foto) */
export const PETROLEO_MARIO_PSIQUIATRICO_BUENO_URL = "/video/teaser/petroleo/MarioPsiquiatricoBueno.mp4";
/** @deprecated */
export const PETROLEO_MARIO_PSIQUIATRICO_BUENO_VOLUME = 0;
/** @deprecated */
export const PETROLEO_MARIO_PSIQUIATRICO_BUENO_FALLBACK_MS = 3_042;

export const PETROLEO_MORVO_VIDEO_URL = "/video/teaser/petroleo/MorvoVideo.mp4";
/** Sin audio propio — solo banda del teaser */
export const PETROLEO_MORVO_VIDEO_VOLUME = 0;
export const PETROLEO_MORVO_VIDEO_FALLBACK_MS = 6_042;

/** Duración fija de cada beat de foto (frente + fondo) — se reescala al audio Ravel */
export const PETROLEO_BEAT_STILL_MS = 2_200;

/** Objetivo de duración del teaser ≈ 1:00 (audio Ravel recortado) */
export const PETROLEO_TEASER_AUDIO_TARGET_MS = 60_000;

export type PetroleoBeatKind = "video" | "image";

export type PetroleoBeat = {
  id: string;
  kind: PetroleoBeatKind;
  /** Capa frontal (vídeo o foto contain) */
  front: string;
  /** Fondo cover detrás */
  back: string;
  /** Zoom extra del fondo cover (1 = normal; >1 acerca el centro) */
  backZoom?: number;
  titleLines?: readonly string[];
  /** Escala de fuente por línea (1 = base) */
  titleLineScales?: readonly number[];
  /** Ancla del título: abajo (clips) o arriba (p. ej. Sinopsis1) */
  titleAnchor?: "bottom" | "top";
  /** Desplazamiento vertical del título en px (negativo = hacia arriba) */
  titleOffsetY?: number;
  volume?: number;
  fallbackMs?: number;
};

/**
 * Orden tras la 1.ª frase.
 * Fotos de Cristian/Víctor/Mario antes de (o en lugar de) sus clips;
 * clip Mario al final, justo antes de la 2.ª frase.
 */
export const PETROLEO_BEAT_SEQUENCE: readonly PetroleoBeat[] = [
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
    front: PETROLEO_CRISTIAN_PLAY_URL,
    back: `${P}/CristianFondo.jpg`,
    titleLines: PETROLEO_CRISTIAN_COWBOY_TITLE_LINES,
    titleLineScales: PETROLEO_CRISTIAN_COWBOY_TITLE_SCALES,
    volume: PETROLEO_CRISTIAN_PLAY_VOLUME,
    fallbackMs: PETROLEO_CRISTIAN_PLAY_FALLBACK_MS,
  },
  {
    id: "victors-bike",
    kind: "image",
    front: `${P}/VictorsBike.jpg`,
    /** Como pediste: jardinero detrás de la bici */
    back: `${P}/jardinero.png`,
  },
  {
    id: "jardinero",
    kind: "image",
    front: `${P}/jardinero.png`,
    /** Sin victor-pequeno — fondo escena (herramientas jardín), no otro personaje */
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
    front: PETROLEO_VICTOR_CALIENTA_BUENO_URL,
    back: `${P}/VictorsLight.jpg`,
    titleLines: PETROLEO_VICTOR_LA_CAREN_TITLE_LINES,
    volume: PETROLEO_VICTOR_CALIENTA_BUENO_VOLUME,
    fallbackMs: PETROLEO_VICTOR_CALIENTA_BUENO_FALLBACK_MS,
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
    /** Barrotes ampliada (centro) */
    back: `${P}/Barrotes.jpg`,
    backZoom: 1.55,
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
    front: PETROLEO_MARIO_EL_SANTO_FINAL_URL,
    /** Fondo detrás de MarioElSantoFinal */
    back: `${P}/MariosJob.jpg`,
    titleLines: PETROLEO_MARIO_SANTO_TITLE_LINES,
    titleLineScales: PETROLEO_MARIO_SANTO_TITLE_SCALES,
  },
];

/** Orden tras la 2.ª frase → créditos */
export const PETROLEO_BEAT_SEQUENCE_PART2: readonly PetroleoBeat[] = [
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
    titleOffsetY: -20,
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
    /** Fondo pedido: cole-parks ampliado (cover) */
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
    titleOffsetY: -5,
  },
  {
    id: "alex-shuper",
    kind: "image",
    front: `${N}/alex-shuper-SNliMkZHVig-unsplash.jpg`,
    back: `${N}/manyu-varma-ef3A5EDR7Jk-unsplash.jpg`,
    titleLines: ["Y…"],
    titleOffsetY: -5,
  },
  {
    id: "sinopsis1",
    kind: "image",
    front: `${P}/Sinopsis1.jpg`,
    back: `${P}/MarioEnelBosque.jpg`,
    titleLines: ["Quítate la máscara"],
    titleAnchor: "bottom",
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
    front: PETROLEO_MORVO_VIDEO_URL,
    back: `${N}/moreno-matkovic-A1S_sEWdgRU-unsplash.jpg`,
    titleLines: ["TU MORVO"],
    volume: PETROLEO_MORVO_VIDEO_VOLUME,
    fallbackMs: PETROLEO_MORVO_VIDEO_FALLBACK_MS,
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

function collectBeatImageUrls(sequences: readonly (readonly PetroleoBeat[])[]): string[] {
  const urls = new Set<string>();
  for (const seq of sequences) {
    for (const b of seq) {
      if (b.kind === "image") urls.add(b.front);
      urls.add(b.back);
    }
  }
  return [...urls];
}

function collectBeatVideoUrls(sequences: readonly (readonly PetroleoBeat[])[]): string[] {
  const urls: string[] = [];
  for (const seq of sequences) {
    for (const b of seq) {
      if (b.kind === "video") urls.push(b.front);
    }
  }
  return urls;
}

export function petroleoBeatImageUrls(): string[] {
  return collectBeatImageUrls([PETROLEO_BEAT_SEQUENCE, PETROLEO_BEAT_SEQUENCE_PART2]);
}

export function petroleoBeatVideoUrls(): string[] {
  return collectBeatVideoUrls([PETROLEO_BEAT_SEQUENCE, PETROLEO_BEAT_SEQUENCE_PART2]);
}
