/** Ciclo compartido: 5s estado A + 5s estado B */

export const SWAP_CYCLE = 10;



export const swapColorTransition = {

  duration: SWAP_CYCLE,

  repeat: Infinity,

  ease: "easeInOut" as const,

  times: [0, 0.49, 0.5, 0.99, 1],

};



/** Verdes bosque — un tono por paleta */

export const GREEN_PETROLEO = "#1A3A3F";

export const GREEN_PETROLEO_LIGHT = "#D8E8E6";



export const GREEN_MUSGO = "#2A4535";

export const GREEN_MUSGO_LIGHT = "#C8D4C0";

/** Mezcla: esmeralda joya (más saturado que musgo) */
export const GREEN_ESMERALDA = "#186B52";

export const GREEN_ESMERALDA_LIGHT = "#B8E6D4";

/** Salmón esmeralda — portada y texto del dossier */
export const ESMERALDA_SALMON = "#FA8072";

/** Mint arcos Paris Bilal — fondo Raíz Esmeralda (muestreado de portada) */
export const GREEN_ESMERALDA_MINT = "#C8E0D0";

/** Sombras / verde más profundo en la misma imagen */
export const GREEN_ESMERALDA_MINT_DARK = "#90C8A0";

export const GREEN_PINO = "#1E3A2C";

export const GREEN_PINO_LIGHT = "#D4E0D0";

export const GREEN_HELECHO = "#3A5A42";

export const GREEN_HELECHO_LIGHT = "#D8E4D4";

/** Raíz Helecho — cian/turquesa (títulos Killing Eve, Matt Willey) */
export const HELECHO_BG = "#0E1520";

/** Turquesa principal (pantalla / location cards) */
export const HELECHO_CYAN = "#00CED1";

/** Cian eléctrico más brillante */
export const HELECHO_CYAN_BRIGHT = "#00D2FF";



export const GREEN_NIEBLA = "#4A5D52";

export const GREEN_NIEBLA_LIGHT = "#C8D4C0";

/** Raíz: bosque salvaje + vínculo óxido */
export const GREEN_RAIZ_BOSQUE = "#1B3D2E";

export const RAIZ_OXIDO = "#7D5A4A";

export const RAIZ_TEXT_LIGHT = "#C4A892";

/** Forest green terroso — bosque caducifolio (referencia Figma) */
export const GREEN_FOREST_TERROSO = "#2E6F40";

/** Forest terroso negro — verde del pasillo Mainak Bose (resto del dossier) */
export const GREEN_FOREST_TERROSO_NEGRO = "#365935";

/** Cobre hoja otoñal — letras sobre verde bosque */
export const COPPER_AUTUMN_LEAF = "#C67B4E";



/** Alias legacy (petróleo) */

export const MEZCLA_DARK = GREEN_PETROLEO;

export const MEZCLA_LIGHT = GREEN_PETROLEO_LIGHT;

/** Rojo vino (letras Mezcla portada) */

export const MEZCLA_RED = "#6B1020";

/** Raíz Niebla — fondo rojo, texto negro */
export const NIEBLA_RED = "#B84848";
export const NIEBLA_BLACK = "#0A0A08";

/** Sincronizado con MOR·O oscuro → fondo claro; MOR·O claro → fondo oscuro */

export const mezclaBgKeyframes = [

  GREEN_ESMERALDA_LIGHT,

  GREEN_ESMERALDA_LIGHT,

  GREEN_ESMERALDA,

  GREEN_ESMERALDA,

  GREEN_ESMERALDA_LIGHT,

];



export const mezclaFgKeyframes = [

  GREEN_ESMERALDA,

  GREEN_ESMERALDA,

  GREEN_ESMERALDA_LIGHT,

  GREEN_ESMERALDA_LIGHT,

  GREEN_ESMERALDA,

];



/** Fondo del rectángulo detrás del título (variante band) */

export const MEZCLA_TITLE_BAND_BG = "#0A0A08";

