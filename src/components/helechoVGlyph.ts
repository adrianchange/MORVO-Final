/** Glifo V extraído de KillingEve.ttf — punta en (168, -199) coords fuente */
export const HELECHO_V_PATH =
  "M6 1432H134Q140 1431 140 1426Q173 777 173 720H178Q208 1398 208 1429L214 1432H340L345 1429L168 -199L0 1429Z";

export const HELECHO_V_ADVANCE = 376;
export const HELECHO_V_UPEM = 2048;
/** Altura tinta del glifo (ymax − ymin) */
export const HELECHO_V_INK_H = 1631;
/** Vértice exterior de la V en coords SVG */
export const HELECHO_V_TIP_SVG = { x: 168, y: HELECHO_V_INK_H };
/** Junta interior — curva interna del glifo (Q173 777 173 720) */
export const HELECHO_V_INNER_JOINT = { x: 173, y: 720 };
/** matrix(1 0 0 -1 0 1432) — convierte coords fuente → SVG */
export const HELECHO_V_FLIP = "matrix(1 0 0 -1 0 1432)";
