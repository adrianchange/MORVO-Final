import {
  HELECHO_V_ADVANCE,
  HELECHO_V_FLIP,
  HELECHO_V_INK_H,
  HELECHO_V_INNER_JOINT,
  HELECHO_V_PATH,
  HELECHO_V_UPEM,
} from "./helechoVGlyph";
import { motion } from "motion/react";
import { isSelvaStyle, PALETTES, type PaletteId, type PaletteTheme } from "../theme/palettes";
import { type CSSProperties, type ReactNode } from "react";
import { useIsMobile } from "../hooks/useIsMobile";
import { useCoverCreditTypography } from "../hooks/useCoverCreditTypography";
import { ESMERALDA_TITLE_LETTER_GAP, fontDisplay, HELECHO_TITLE_FONT_SIZE, HELECHO_TITLE_STYLE, HELECHO_TITLE_SCALE_X, NIEBLA_TITLE_LETTER_GAP, NIEBLA_TITLE_SCALE_X, PETROLEO_TITLE_SCALE_X, PINO_TITLE_SCALE_X, SELVA_TITLE_SCALE_X } from "../theme/typography";
import {
  GREEN_PINO,
  GREEN_PINO_LIGHT,
  GREEN_RAIZ_BOSQUE,
  HELECHO_CYAN,
  HELECHO_BG,
  MEZCLA_RED,
  NIEBLA_BLACK,
  RAIZ_OXIDO,
  swapColorTransition,
} from "../theme/swap";

const BG = "#0A0A08";

const LIT_LETTERS = "#2A1F35";
const LIT_V = "#E6E0EC";

const POD_RED = "#6B1020";
const POD_LIT = "#E6E0EC";

const INV_LETTERS = "#6B1020";

const moroColorTransition = swapColorTransition;
const vColorTransition = swapColorTransition;

const vBlinkTransition = {
  duration: 2.2,
  repeat: Infinity,
  ease: "easeInOut" as const,
  times: [0, 0.06, 0.12, 0.2, 0.28, 0.42, 0.5, 0.66, 0.74, 0.9, 1],
  repeatDelay: 0.6,
};

/** Parpadeo por resplandor; opacidad nunca baja de ~0.78 */
const invertidaVBlinkAnimate = {
  opacity: [1, 0.88, 1, 0.82, 1, 0.86, 1, 0.9, 1, 0.84, 1],
  textShadow: [
    "0 0 10px rgba(237,232,213,0.28)",
    "0 0 38px rgba(237,232,213,0.7)",
    "0 0 12px rgba(237,232,213,0.22)",
    "0 0 30px rgba(107,16,32,0.5)",
    "0 0 10px rgba(237,232,213,0.26)",
    "0 0 34px rgba(237,232,213,0.65)",
    "0 0 12px rgba(237,232,213,0.24)",
    "0 0 26px rgba(107,16,32,0.42)",
    "0 0 10px rgba(237,232,213,0.28)",
    "0 0 32px rgba(237,232,213,0.58)",
    "0 0 10px rgba(237,232,213,0.28)",
  ],
};

const TIERRA_GLOW_LIGHT = "rgba(230,224,236,0.8)";
const TIERRA_GLOW_DARK = "rgba(107,16,32,0.45)";

const RAIZ_GLOW_SOFT = "rgba(125,90,74,0.38)";
const RAIZ_GLOW_DIM = "rgba(27,61,46,0.28)";

const raizVTransition = {
  duration: 2.2,
  repeat: Infinity,
  ease: "easeInOut" as const,
  times: [0, 0.14, 0.28, 0.38, 0.52, 0.68, 1],
  repeatDelay: 0.35,
};

function raizVAnimate(greenDark: string) {
  return {
    opacity: [1, 0.9, 1, 0.88, 1, 0.92, 1, 0.9, 1, 0.91, 1],
    color: [greenDark, greenDark, RAIZ_OXIDO, "#6B5042", greenDark, RAIZ_OXIDO, greenDark],
    textShadow: [
      `0 0 12px ${RAIZ_GLOW_SOFT}, 0 0 5px ${RAIZ_GLOW_DIM}`,
      `0 0 4px ${RAIZ_GLOW_DIM}`,
      `0 0 14px ${RAIZ_GLOW_SOFT}, 0 0 6px ${RAIZ_GLOW_DIM}`,
      `0 0 5px ${RAIZ_GLOW_DIM}`,
      `0 0 12px ${RAIZ_GLOW_SOFT}, 0 0 5px ${RAIZ_GLOW_DIM}`,
      `0 0 4px ${RAIZ_GLOW_DIM}`,
      `0 0 13px ${RAIZ_GLOW_SOFT}, 0 0 5px ${RAIZ_GLOW_DIM}`,
    ],
  };
}

/** Crédito portada Raíz: verde claro ↔ verde oscuro, sin desaparecer */
export function RaizCredit({
  greenDark,
  greenLight,
}: {
  greenDark: string;
  greenLight: string;
}) {
  const { textStyle } = useCoverCreditTypography(greenLight, { textAlign: "center" });
  return (
    <CoverCreditWrap>
      <motion.p
        style={textStyle}
        initial={{ opacity: 0.88 }}
        animate={{
          opacity: [1, 0.9, 1, 0.88, 1, 0.92, 1, 0.9, 1, 0.91, 1],
          color: [greenLight, greenDark, greenLight, greenDark, greenLight, greenDark, greenLight],
          textShadow: [
            `0 0 12px ${RAIZ_GLOW_SOFT}, 0 0 5px ${RAIZ_GLOW_DIM}`,
            `0 0 4px ${RAIZ_GLOW_DIM}`,
            `0 0 14px ${RAIZ_GLOW_SOFT}, 0 0 6px ${RAIZ_GLOW_DIM}`,
            `0 0 5px ${RAIZ_GLOW_DIM}`,
            `0 0 12px ${RAIZ_GLOW_SOFT}, 0 0 5px ${RAIZ_GLOW_DIM}`,
            `0 0 4px ${RAIZ_GLOW_DIM}`,
            `0 0 13px ${RAIZ_GLOW_SOFT}, 0 0 5px ${RAIZ_GLOW_DIM}`,
          ],
        }}
        transition={{
          opacity: { ...vBlinkTransition, delay: 0.5 },
          color: raizVTransition,
          textShadow: raizVTransition,
        }}
      >
        Naz Montés
      </motion.p>
    </CoverCreditWrap>
  );
}

const SALMON = "#FA8072";
export function EsmeraldaSalmonCredit() {
  const { textStyle } = useCoverCreditTypography(SALMON, { textAlign: "center" });
  return (
    <CoverCreditWrap>
      <p style={textStyle}>Naz Montés</p>
    </CoverCreditWrap>
  );
}

function RaizBlinkV({ greenDark }: { greenDark: string }) {
  return (
    <motion.span
      style={{ display: "inline-block", color: greenDark }}
      animate={raizVAnimate(greenDark)}
      transition={{
        opacity: { ...vBlinkTransition },
        color: raizVTransition,
        textShadow: raizVTransition,
      }}
    >
      V
    </motion.span>
  );
}

import { GREEN_ESMERALDA } from "../theme/swap";

const SALMON_NEON = "rgba(250,128,114,0.9)";
const SALMON_NEON_MID = "rgba(230,100,90,0.7)";
const SALMON_NEON_DIM = "rgba(200,102,91,0.3)";

const esmeraldaNeonTransition = {
  duration: 2.18,
  repeat: Infinity,
  ease: "easeInOut" as const,
  times: [0, 0.05, 0.1, 0.18, 0.26, 0.36, 0.46, 0.58, 0.7, 0.84, 0.92, 1],
  repeatDelay: 0.12,
};

function esmeraldaVAnimate() {
  return {
    opacity: [1, 0.12, 1, 0.3, 1, 0.06, 1, 0.45, 1, 0.1, 1],
    color: [
      SALMON,
      "#FFFFFF",
      SALMON,
      "#FFFFFF",
      SALMON,
      "#FFFFFF",
      SALMON,
    ],
    textShadow: [
      `0 0 24px ${SALMON_NEON}, 0 0 52px ${SALMON_NEON_MID}, 0 0 90px ${SALMON_NEON_MID}, 0 0 130px rgba(230,100,90,0.25)`,
      `0 0 6px ${SALMON_NEON_DIM}`,
      `0 0 36px ${SALMON_NEON}, 0 0 70px ${SALMON_NEON_MID}, 0 0 110px rgba(230,100,90,0.5), 0 0 160px rgba(230,100,90,0.2)`,
      `0 0 8px ${SALMON_NEON_DIM}`,
      `0 0 30px ${SALMON_NEON}, 0 0 58px ${SALMON_NEON_MID}, 0 0 100px ${SALMON_NEON_MID}`,
      `0 0 7px ${SALMON_NEON_DIM}`,
      `0 0 42px ${SALMON_NEON}, 0 0 80px ${SALMON_NEON_MID}, 0 0 120px rgba(230,100,90,0.45), 0 0 170px rgba(230,100,90,0.18)`,
      `0 0 10px ${SALMON_NEON_DIM}`,
      `0 0 20px ${SALMON_NEON}, 0 0 42px ${SALMON_NEON_MID}`,
      `0 0 6px ${SALMON_NEON_DIM}`,
      `0 0 25px ${SALMON_NEON}, 0 0 48px ${SALMON_NEON_MID}`,
    ],
  };
}

export function EsmeraldaNeonV() {
  return (
    <motion.span
      style={{ display: "inline-block", color: SALMON }}
      animate={esmeraldaVAnimate()}
      transition={{
        opacity: esmeraldaNeonTransition,
        color: esmeraldaNeonTransition,
        textShadow: esmeraldaNeonTransition,
      }}
    >
      V
    </motion.span>
  );
}

const CYAN_NEON = "rgba(0,206,209,0.92)";
const CYAN_NEON_MID = "rgba(0,210,255,0.75)";
const CYAN_NEON_DIM = "rgba(0,206,209,0.28)";

function helechoVAnimate() {
  return {
    opacity: [1, 0.12, 1, 0.3, 1, 0.06, 1, 0.45, 1, 0.1, 1],
    textShadow: [
      `0 0 24px ${CYAN_NEON}, 0 0 52px ${CYAN_NEON_MID}, 0 0 90px ${CYAN_NEON_MID}, 0 0 130px rgba(0,210,255,0.25)`,
      `0 0 6px ${CYAN_NEON_DIM}`,
      `0 0 36px ${CYAN_NEON}, 0 0 70px ${CYAN_NEON_MID}, 0 0 110px rgba(0,210,255,0.5), 0 0 160px rgba(0,210,255,0.2)`,
      `0 0 8px ${CYAN_NEON_DIM}`,
      `0 0 30px ${CYAN_NEON}, 0 0 58px ${CYAN_NEON_MID}, 0 0 100px ${CYAN_NEON_MID}`,
      `0 0 7px ${CYAN_NEON_DIM}`,
      `0 0 42px ${CYAN_NEON}, 0 0 80px ${CYAN_NEON_MID}, 0 0 120px rgba(0,210,255,0.45), 0 0 170px rgba(0,210,255,0.18)`,
      `0 0 10px ${CYAN_NEON_DIM}`,
      `0 0 20px ${CYAN_NEON}, 0 0 42px ${CYAN_NEON_MID}`,
      `0 0 6px ${CYAN_NEON_DIM}`,
      `0 0 25px ${CYAN_NEON}, 0 0 48px ${CYAN_NEON_MID}`,
    ],
  };
}

function petroleoVBlinkFill(baseColor: string) {
  return [
    baseColor,
    "#FFFFFF",
    "#FFFFFF",
    "#FFFFFF",
    baseColor,
    baseColor,
    "#FFFFFF",
    "#FFFFFF",
    "#FFFFFF",
    baseColor,
    baseColor,
  ] as const;
}

const petroleoVBlinkTransition = {
  duration: 2.8,
  repeat: Infinity,
  ease: "easeInOut" as const,
  times: [0, 0.05, 0.12, 0.22, 0.34, 0.46, 0.52, 0.6, 0.7, 0.84, 1],
  repeatDelay: 0.15,
};

const HALO_CYAN_STRONG = `drop-shadow(0 0 24px ${CYAN_NEON}) drop-shadow(0 0 52px ${CYAN_NEON_MID}) drop-shadow(0 0 96px rgba(0,210,255,0.35))`;
const HALO_CYAN_DIM = `drop-shadow(0 0 8px ${CYAN_NEON_DIM})`;
const HALO_WHITE_GLOW_CYAN = `drop-shadow(0 0 32px rgba(255,255,255,0.92)) drop-shadow(0 0 64px ${CYAN_NEON_MID}) drop-shadow(0 0 110px rgba(0,210,255,0.5))`;

const BLACK_NEON = "rgba(10,10,8,0.88)";
const BLACK_NEON_MID = "rgba(10,10,8,0.58)";
const BLACK_NEON_DIM = "rgba(10,10,8,0.22)";
const HALO_BLACK_STRONG = `drop-shadow(0 0 24px ${BLACK_NEON}) drop-shadow(0 0 52px ${BLACK_NEON_MID}) drop-shadow(0 0 96px rgba(10,10,8,0.35))`;
const HALO_BLACK_DIM = `drop-shadow(0 0 8px ${BLACK_NEON_DIM})`;
const HALO_WHITE_GLOW_BLACK = `drop-shadow(0 0 32px rgba(255,255,255,0.92)) drop-shadow(0 0 64px ${BLACK_NEON_MID}) drop-shadow(0 0 110px rgba(10,10,8,0.45))`;

function premiumVBlinkSvgAnimate(halo: "cyan" | "black") {
  const strong = halo === "cyan" ? HALO_CYAN_STRONG : HALO_BLACK_STRONG;
  const dim = halo === "cyan" ? HALO_CYAN_DIM : HALO_BLACK_DIM;
  const white = halo === "cyan" ? HALO_WHITE_GLOW_CYAN : HALO_WHITE_GLOW_BLACK;

  return {
    opacity: [1, 0.12, 1, 0.3, 1, 0.06, 1, 0.45, 1, 0.1, 1],
    filter: [
      strong,
      dim,
      white,
      white,
      white,
      dim,
      strong,
      white,
      white,
      white,
      dim,
    ],
  };
}

/** Chorreo — hilo + gota; el hilo va detrás de la V y emerge por la punta */
const DRIP_LEN = 300;
const DRIP_LINE_W = 6;
const DRIP_DROP_R = 9;
const FONT_TIP_X = 168;
const FONT_TIP_Y = -199;
/** Arranca dentro del relleno de la V para salir sin hueco por la punta */
const DRIP_ORIGIN_Y = FONT_TIP_Y + 50;

const dripLineEndFont = (len: number) => FONT_TIP_Y - len + DRIP_DROP_R;

const dripStrokePath = (endY: number) =>
  `M${FONT_TIP_X},${DRIP_ORIGIN_Y} L${FONT_TIP_X},${endY}`;

const DRIP_PATHS = [
  dripStrokePath(DRIP_ORIGIN_Y),
  dripStrokePath(dripLineEndFont(90)),
  dripStrokePath(dripLineEndFont(200)),
  dripStrokePath(dripLineEndFont(DRIP_LEN)),
  dripStrokePath(dripLineEndFont(DRIP_LEN)),
  dripStrokePath(DRIP_ORIGIN_Y),
] as const;

const DRIP_DROP_CY = [
  FONT_TIP_Y,
  FONT_TIP_Y - 90 + DRIP_DROP_R * 0.35,
  FONT_TIP_Y - 200 + DRIP_DROP_R * 0.2,
  FONT_TIP_Y - DRIP_LEN,
  FONT_TIP_Y - DRIP_LEN,
  FONT_TIP_Y,
] as const;

const DRIP_DROP_R_ANIM = [0, DRIP_DROP_R * 0.55, DRIP_DROP_R * 0.85, DRIP_DROP_R, DRIP_DROP_R, 0] as const;

/** Niebla — rayo junta interior → punta exterior (V asimétrica: 173 → 168) */
const NIEBLA_TEAR_H = 36;
const NIEBLA_TEAR_W = 14;
const NIEBLA_DRIP_DY = FONT_TIP_Y - HELECHO_V_INNER_JOINT.y;

const nieblaDripXOnRay = (y: number) => {
  const j = HELECHO_V_INNER_JOINT;
  if (y >= j.y) return j.x;
  const t = (y - j.y) / NIEBLA_DRIP_DY;
  return j.x + (FONT_TIP_X - j.x) * t;
};

const nieblaDripLead = (endY: number) => {
  const j = HELECHO_V_INNER_JOINT;
  if (endY >= j.y) return { x: j.x, y: j.y };
  return { x: nieblaDripXOnRay(endY), y: endY };
};

const nieblaTearAttachY = (endY: number, scale: number) => endY + NIEBLA_TEAR_H * scale;

const NIEBLA_DRIP_END_Y = dripLineEndFont(DRIP_LEN);
const NIEBLA_DRIP_FULL = HELECHO_V_INNER_JOINT.y - NIEBLA_DRIP_END_Y;

const nieblaDripEndAt = (dripProgress: number) =>
  HELECHO_V_INNER_JOINT.y - (dripProgress / DRIP_LEN) * NIEBLA_DRIP_FULL;

/** Niebla — 0-3 junta · 4-5 baja · 6-7 abajo (3 s) · 8 reset */
const NIEBLA_HOLD_S = 3;
const NIEBLA_RESET_S = 0.35;
const NIEBLA_FALL_S = 5.5;
const NIEBLA_DRIP_DURATION = NIEBLA_FALL_S + NIEBLA_HOLD_S + NIEBLA_RESET_S;
const NIEBLA_T_ARRIVE = NIEBLA_FALL_S / NIEBLA_DRIP_DURATION;
const NIEBLA_T_HOLD_END = (NIEBLA_FALL_S + NIEBLA_HOLD_S) / NIEBLA_DRIP_DURATION;

const NIEBLA_DRIP_KEY_END_Y = [
  HELECHO_V_INNER_JOINT.y,
  HELECHO_V_INNER_JOINT.y,
  HELECHO_V_INNER_JOINT.y,
  HELECHO_V_INNER_JOINT.y - 32,
  HELECHO_V_INNER_JOINT.y - 95,
  nieblaDripEndAt(85),
  NIEBLA_DRIP_END_Y,
  NIEBLA_DRIP_END_Y,
  HELECHO_V_INNER_JOINT.y,
] as const;

const NIEBLA_TEAR_SCALES = [0, 0.82, 0.88, 0.88, 0.92, 0.96, 1, 1, 0] as const;
const NIEBLA_TEAR_OPACITY = [0, 1, 1, 1, 1, 1, 1, 1, 0] as const;
const NIEBLA_LINE_OPACITY = [0, 0, 0, 0.55, 1, 1, 1, 1, 0] as const;
const NIEBLA_DRIP_LINE_W = 7;
const NIEBLA_TEAR_STROKE = "#4A0A10";

const NIEBLA_TEAR_LOCAL = (() => {
  const h = NIEBLA_TEAR_H;
  const w = NIEBLA_TEAR_W;
  return [
    `M0,0`,
    `C${w * 0.95},${h * 0.36}`,
    ` ${w * 0.75},${h * 0.86}`,
    ` ${w * 0.4},${h}`,
    `C${w * 0.14},${h * 1.05}`,
    ` ${-w * 0.14},${h * 1.05}`,
    ` ${-w * 0.4},${h}`,
    `C${-w * 0.75},${h * 0.86}`,
    ` ${-w * 0.95},${h * 0.36}`,
    ` 0,0 Z`,
  ].join("");
})();

const nieblaDripPathWithTear = (endY: number, scale: number) => {
  const j = HELECHO_V_INNER_JOINT;
  if (scale <= 0 || endY >= j.y) return `M${j.x},${j.y} L${j.x},${j.y}`;
  const attachY = nieblaTearAttachY(endY, scale);
  if (attachY >= j.y) return `M${j.x},${j.y} L${j.x},${j.y}`;
  const attachX = nieblaDripXOnRay(attachY);
  return `M${j.x},${j.y} L${attachX},${attachY}`;
};

const NIEBLA_DRIP_PATHS = NIEBLA_DRIP_KEY_END_Y.map((endY, i) =>
  nieblaDripPathWithTear(endY, NIEBLA_TEAR_SCALES[i]),
);

const NIEBLA_TEAR_X = NIEBLA_DRIP_KEY_END_Y.map((endY) => nieblaDripLead(endY).x);
const NIEBLA_TEAR_Y = [...NIEBLA_DRIP_KEY_END_Y];

const nieblaDripTimes = [
  0,
  0.06,
  0.12,
  0.18,
  0.28,
  0.42,
  NIEBLA_T_ARRIVE,
  NIEBLA_T_HOLD_END,
  1,
] as const;

const nieblaDripTransition = {
  duration: NIEBLA_DRIP_DURATION,
  repeat: Infinity,
  ease: "easeInOut" as const,
  times: [...nieblaDripTimes],
  repeatDelay: 0.5,
};

/** Pino — Killing Eve: hilo fino + gota colgante */
const PINO_DRIP_LINE_W = 4;
const PINO_DROP_H = 68;
const PINO_DROP_W = 28;
/** Pino — recorrido más largo que Niebla para que la gota llegue al nivel del crédito */
const PINO_DRIP_LEN = DRIP_LEN + 110;
const PINO_DRIP_FULL = HELECHO_V_INNER_JOINT.y - dripLineEndFont(PINO_DRIP_LEN);
const pinoDripEndAt = (progress: number) =>
  HELECHO_V_INNER_JOINT.y - (progress / PINO_DRIP_LEN) * PINO_DRIP_FULL;
const PINO_BOTTOM_Y = pinoDripEndAt(PINO_DRIP_LEN);
const PINO_MID_Y_EXTENDED = pinoDripEndAt(PINO_DRIP_LEN / 2);
/** Cuánto sobresale la gota bajo el cajón del glifo V (→ marginTop del crédito) */
const PINO_DROP_BELOW_V_EM =
  (1432 - PINO_BOTTOM_Y - 12 - HELECHO_V_INK_H) / HELECHO_V_UPEM;
const PINO_CREDIT_MARGIN_TOP = `calc(10px + ${PINO_DROP_BELOW_V_EM} * ${HELECHO_TITLE_FONT_SIZE} + clamp(2px, 0.35vh, 8px) - 0.2em)`;
/** Alinear la «e» bajo la gota al impactar (coords SVG del vértice de caída) */
const PINO_DROP_LAND = nieblaDripLead(PINO_BOTTOM_Y);
const PINO_JOINT = HELECHO_V_INNER_JOINT;

/** Gota — (0,0) punta delantera; cuerpo +y hacia la junta (cola = fin del hilo) */
const PINO_DROP_LOCAL = (() => {
  const h = PINO_DROP_H;
  const w = PINO_DROP_W;
  return [
    `M0,0`,
    `C${w * 0.22},${h * 0.07}`,
    ` ${w * 0.88},${h * 0.44}`,
    ` ${w * 0.44},${h * 0.82}`,
    `C${w * 0.16},${h * 0.97}`,
    ` ${-w * 0.16},${h * 0.97}`,
    ` ${-w * 0.44},${h * 0.82}`,
    `C${-w * 0.88},${h * 0.44}`,
    ` ${-w * 0.22},${h * 0.07}`,
    ` 0,0 Z`,
  ].join("");
})();

/** Cola de la gota (hacia junta) — ahí se une el hilo */
const pinoDropBackY = (leadY: number, scale: number) =>
  leadY >= PINO_JOINT.y ? PINO_JOINT.y : Math.min(leadY + PINO_DROP_H * scale, PINO_JOINT.y);

const pinoTrailEnd = (leadY: number, scale: number) => {
  const backY = pinoDropBackY(leadY, scale);
  return { x: nieblaDripXOnRay(backY), y: backY };
};

/** Punta delantera; en junta la cola (+y local) queda en (173,720) */
const pinoDropPos = (leadY: number, scale: number) => {
  if (leadY >= PINO_JOINT.y) {
    if (scale <= 0) return { x: PINO_JOINT.x, y: PINO_JOINT.y };
    return { x: PINO_JOINT.x, y: PINO_JOINT.y - PINO_DROP_H * scale };
  }
  return nieblaDripLead(leadY);
};

/** Timeline Pino — 13 keyframes (0-12) · formación en junta · arranque lento */
const PINO_HOLD_S = 3;
const PINO_FADE_S = 0.35;
const PINO_FALL_S = 5;
const PINO_DRIP_DURATION = PINO_FALL_S + PINO_HOLD_S + PINO_FADE_S;

const PINO_T_ARRIVE = PINO_FALL_S / PINO_DRIP_DURATION;
const PINO_T_HOLD_END = (PINO_FALL_S + PINO_HOLD_S) / PINO_DRIP_DURATION;

const pinoDripTimes = [
  0,
  0.04,
  0.08,
  0.16,
  0.34,
  0.4,
  0.46,
  0.5,
  0.52,
  0.54,
  PINO_T_ARRIVE,
  PINO_T_HOLD_END,
  1,
] as const;

/** 0-3 junta · 4 arranque lento+rastro · 5-7 baja · 8-9 mitad · 10-11 abajo · 12 reset */
const PINO_DRIP_KEY_END_Y = [
  PINO_JOINT.y,
  PINO_JOINT.y,
  PINO_JOINT.y,
  PINO_JOINT.y,
  pinoDripEndAt(8),
  pinoDripEndAt(45),
  pinoDripEndAt(95),
  pinoDripEndAt(155),
  PINO_MID_Y_EXTENDED,
  PINO_MID_Y_EXTENDED,
  PINO_BOTTOM_Y,
  PINO_BOTTOM_Y,
  PINO_BOTTOM_Y,
] as const;

const PINO_DROP_OPACITY = [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0] as const;
const PINO_DROP_SCALE_START = 0.16;
const PINO_DROP_SCALE_MAX = 1.14;
const PINO_DROP_SCALE = [
  0,
  PINO_DROP_SCALE_START,
  0.28,
  0.38,
  0.42,
  0.52,
  0.64,
  0.74,
  0.84,
  0.92,
  1.08,
  PINO_DROP_SCALE_MAX,
  PINO_DROP_SCALE_START,
] as const;
/** Rastro kf 4–7 al bajar · kf 8 mitad → corte instantáneo · kf 9+ caída libre sin hilo */
const PINO_LINE_OPACITY = [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0] as const;

const PINO_DROP_X = PINO_DRIP_KEY_END_Y.map((leadY, i) => pinoDropPos(leadY, PINO_DROP_SCALE[i]).x);
const PINO_DROP_Y = PINO_DRIP_KEY_END_Y.map((leadY, i) => pinoDropPos(leadY, PINO_DROP_SCALE[i]).y);

/** Hilo congelado en mitad desde kf 9 — la gota cae sola; kf 8 = último frame con trazo */
const pinoMidTrailPoint = pinoTrailEnd(PINO_MID_Y_EXTENDED, PINO_DROP_SCALE[8]);
const PINO_TRAIL_X2 = PINO_DRIP_KEY_END_Y.map((leadY, i) =>
  i >= 9 ? pinoMidTrailPoint.x : pinoTrailEnd(leadY, PINO_DROP_SCALE[i]).x,
);
const PINO_TRAIL_Y2 = PINO_DRIP_KEY_END_Y.map((leadY, i) =>
  i >= 9 ? pinoMidTrailPoint.y : pinoTrailEnd(leadY, PINO_DROP_SCALE[i]).y,
);

const PINO_DRIP_CYCLE = {
  duration: PINO_DRIP_DURATION,
  repeat: Infinity,
  ease: "linear" as const,
  repeatDelay: 0.5,
} as const;

const pinoDripTransition = {
  ...PINO_DRIP_CYCLE,
  times: [...pinoDripTimes],
};

const pinoDripEaseTransition = {
  ...pinoDripTransition,
  ease: "easeInOut" as const,
};

/** Caída + rastro en lockstep (misma velocidad gota y hilo) */
const pinoFallSyncTransition = {
  ...pinoDripTransition,
  ease: "linear" as const,
};

/** Selva — círculo en junta → gota + hilo recto → suelta a mitad → caída rápida */
const SELVA_DRIP_LINE_W = 4;
const SELVA_DROP_H = 64;
/** Mitad del ancho máximo — perfil de cloud_13869263.png (Downloads) */
const SELVA_DROP_HALF_W = SELVA_DROP_H * 0.326;
const SELVA_DRIP_LEN = DRIP_LEN + 110;
const SELVA_DRIP_FULL = HELECHO_V_INNER_JOINT.y - dripLineEndFont(SELVA_DRIP_LEN);
const selvaDripEndAt = (progress: number) =>
  HELECHO_V_INNER_JOINT.y - (progress / SELVA_DRIP_LEN) * SELVA_DRIP_FULL;
const SELVA_BOTTOM_Y = selvaDripEndAt(SELVA_DRIP_LEN);
/** Extensión extra sobre el final del rayo (coords inner) */
const SELVA_DROP_LAND_Y = SELVA_BOTTOM_Y - 120;
/** px extra al impactar vía keyframes Y (unidades inner, ~10 px pantalla ≈ 85) */
const SELVA_DROP_LAND_EXTRA_Y = 85;
const SELVA_MID_Y = selvaDripEndAt(SELVA_DRIP_LEN / 2);
const SELVA_JOINT = HELECHO_V_INNER_JOINT;
const SELVA_DROP_BELOW_V_EM =
  (1432 - SELVA_BOTTOM_Y - 12 - HELECHO_V_INK_H) / HELECHO_V_UPEM;
const SELVA_CREDIT_MARGIN_TOP = `calc(10px + ${SELVA_DROP_BELOW_V_EM} * ${HELECHO_TITLE_FONT_SIZE} + clamp(2px, 0.35vh, 8px) - 0.2em)`;
/** Alinear la «e» bajo la gota al impactar (coords SVG del vértice de caída) */
const SELVA_DROP_LAND = nieblaDripLead(SELVA_DROP_LAND_Y);

/** Calibrado en Selva (scaleX 1.34) — escala con el estiramiento del título MORVO */
const DROP_CREDIT_NUDGE_EM_FACTOR = 4.8;
const DROP_CREDIT_E_OFFSET_EM = -1.05;

function dropCreditNudgeXEm(dropLandX: number, titleScaleX: number) {
  const factor = DROP_CREDIT_NUDGE_EM_FACTOR * (titleScaleX / SELVA_TITLE_SCALE_X);
  return (
    ((dropLandX - HELECHO_V_ADVANCE * 0.5) / HELECHO_V_UPEM) * factor + DROP_CREDIT_E_OFFSET_EM
  );
}

function dropCreditNudgePx(mobile: boolean, titleScaleX: number) {
  const base = mobile ? 20 : 22;
  return base * (titleScaleX / SELVA_TITLE_SCALE_X);
}

/** Envuelve crédito con compresión horizontal Selva */
export function CoverCreditWrap({
  wrapStyle,
  children,
}: {
  wrapStyle?: CSSProperties;
  children: ReactNode;
}) {
  const { wrapStyle: baseWrap } = useCoverCreditTypography();
  return <div style={{ ...baseWrap, ...wrapStyle }}>{children}</div>;
}

/** Encabezado superior — misma tipografía que el subtítulo «Naz Montés» */
export function ObscenaTeatralHeader({ color }: { color: string }) {
  const { textStyle, wrapStyle } = useCoverCreditTypography(color, { textAlign: "center" });
  return (
    <div
      style={{
        position: "absolute",
        top: "clamp(20px, 4vh, 40px)",
        left: 0,
        right: 0,
        zIndex: 30,
        display: "flex",
        justifyContent: "center",
        ...wrapStyle,
        alignSelf: "unset",
      }}
    >
      <p style={textStyle}>Compañía OBSCENA Teatral</p>
    </div>
  );
}

/** Path SVG trazado desde cloud_13869263.png — punta (0,0) · bulbo +y */
const SELVA_DROP_LOCAL = (() => {
  const h = SELVA_DROP_H;
  const w = SELVA_DROP_HALF_W;
  return [
    `M0,0`,
    `C${w * 0.34},${h * 0.07}`,
    ` ${w * 0.77},${h * 0.28}`,
    ` ${w * 0.98},${h * 0.41}`,
    `C${w * 0.94},${h * 0.51}`,
    ` ${w * 0.79},${h * 0.63}`,
    ` ${w * 0.67},${h * 0.72}`,
    `C${w * 0.53},${h * 0.85}`,
    ` ${w * 0.32},${h * 0.95}`,
    ` ${w * 0.19},${h * 0.99}`,
    `C0,${h}`,
    ` ${-w * 0.19},${h * 0.99}`,
    ` ${-w * 0.32},${h * 0.95}`,
    `C${-w * 0.53},${h * 0.85}`,
    ` ${-w * 0.67},${h * 0.72}`,
    ` ${-w * 0.79},${h * 0.63}`,
    `C${-w * 0.94},${h * 0.51}`,
    ` ${-w * 0.98},${h * 0.41}`,
    ` ${-w * 0.77},${h * 0.28}`,
    `C${-w * 0.34},${h * 0.07}`,
    ` 0,0 Z`,
  ].join("");
})();

const SELVA_INRAY_LEN = Math.hypot(FONT_TIP_X - SELVA_JOINT.x, NIEBLA_DRIP_DY);
/** Punta en la junta, sobre el rayo interior (ligero paso hacia la punta exterior) */
const SELVA_DRIP_ANCHOR = {
  x: nieblaDripXOnRay(SELVA_JOINT.y - 2),
  y: SELVA_JOINT.y - 2,
};

/** Cola de la gota en el rayo — el hilo NUNCA pasa por delante de la punta */
const selvaDropAttach = (leadY: number, scaleY: number) => {
  if (leadY >= SELVA_JOINT.y) {
    return { x: SELVA_JOINT.x, y: SELVA_JOINT.y };
  }
  const extend = SELVA_DROP_H * scaleY;
  const tipT = (leadY - SELVA_JOINT.y) / NIEBLA_DRIP_DY;
  const backT = Math.max(tipT - extend / SELVA_INRAY_LEN, 0);
  const backY = SELVA_JOINT.y + NIEBLA_DRIP_DY * backT;
  return { x: nieblaDripXOnRay(backY), y: backY };
};

const selvaTrailLerp = (
  from: { x: number; y: number },
  to: { x: number; y: number },
  t: number,
) => ({
  x: from.x + (to.x - from.x) * t,
  y: from.y + (to.y - from.y) * t,
});

const selvaDropPos = (leadY: number) => {
  if (leadY >= SELVA_JOINT.y) return { ...SELVA_DRIP_ANCHOR };
  return nieblaDripLead(leadY);
};

/** Misma orientación siempre: cola (+y local) hacia la junta — sin giro al salir */
const selvaDropAngle = (leadY: number) => {
  const tipY = leadY >= SELVA_JOINT.y ? SELVA_DRIP_ANCHOR.y : leadY;
  const tipX =
    leadY >= SELVA_JOINT.y ? SELVA_DRIP_ANCHOR.x : nieblaDripXOnRay(tipY);
  const dx = SELVA_JOINT.x - tipX;
  const dy = SELVA_JOINT.y - tipY;
  return (Math.atan2(dx, dy) * 180) / Math.PI;
};

/** Verde bosque dentro de la V · negro al pasar la punta exterior */
const SELVA_CAMOUFLAGE = GREEN_RAIZ_BOSQUE;
const SELVA_DROP_INK = NIEBLA_BLACK;

const SELVA_HOLD_S = 5;
const SELVA_FADE_S = 0.35;
const SELVA_FALL_S = 8.5;
const SELVA_DRIP_DURATION = SELVA_FALL_S + SELVA_HOLD_S + SELVA_FADE_S;

const SELVA_T_ARRIVE = SELVA_FALL_S / SELVA_DRIP_DURATION;
const SELVA_T_HOLD_END = (SELVA_FALL_S + SELVA_HOLD_S) / SELVA_DRIP_DURATION;
/** Instante exacto en que la gota toca el suelo (kf 11) */
const SELVA_T_BOTTOM = SELVA_T_ARRIVE;

const selvaDripTimes = [
  0,
  0.05,
  0.1,
  0.16,
  0.24,
  0.3,
  0.35,
  0.39,
  0.43,
  0.48,
  0.53,
  SELVA_T_BOTTOM,
  SELVA_T_HOLD_END,
  1,
] as const;

/** 0-3 junta · 4-10 caída · 11-12 abajo · 13 reset */
const SELVA_DRIP_KEY_END_Y = [
  SELVA_JOINT.y,
  SELVA_JOINT.y,
  SELVA_JOINT.y,
  SELVA_JOINT.y,
  selvaDripEndAt(10),
  selvaDripEndAt(50),
  selvaDripEndAt(100),
  selvaDripEndAt(160),
  SELVA_MID_Y,
  selvaDripEndAt(SELVA_DRIP_LEN * 0.56),
  selvaDripEndAt(SELVA_DRIP_LEN * 0.64),
  SELVA_DROP_LAND_Y,
  SELVA_DROP_LAND_Y,
  SELVA_DROP_LAND_Y,
] as const;

const SELVA_DROP_OPACITY = [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0] as const;
/** Crecimiento continuo: punta en junta → estira → hincha al soltar → sigue creciendo */
const SELVA_SCALE_X = [
  0,
  0.05,
  0.1,
  0.16,
  0.22,
  0.3,
  0.38,
  0.46,
  1.05,
  1.2,
  1.3,
  1.38,
  1.44,
  0.2,
] as const;
const SELVA_SCALE_Y = [
  0,
  0.06,
  0.13,
  0.21,
  0.3,
  0.42,
  0.56,
  0.7,
  1.75,
  1.92,
  2.05,
  2.14,
  2.2,
  0.2,
] as const;
/** Hilo desde kf 5 · retracción kf 8-10 */
const SELVA_LINE_OPACITY = [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0] as const;
const SELVA_PATH_OPACITY = [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0] as const;

const selvaDripFillKeyframes = (
  letterInk: string,
  camoInk: string,
  dropInk: string,
) =>
  SELVA_DRIP_KEY_END_Y.map((leadY, i) => {
    if (i >= 13) return camoInk;
    if (i >= 11) return letterInk;
    return leadY > FONT_TIP_Y ? camoInk : dropInk;
  });

const SELVA_DROP_X = SELVA_DRIP_KEY_END_Y.map((leadY) => selvaDropPos(leadY).x);
const selvaDropYKeyframes = (landExtraY: number) =>
  SELVA_DRIP_KEY_END_Y.map((leadY, i) => {
    const y = selvaDropPos(leadY).y;
    return i >= 11 && i <= 12 ? y - landExtraY : y;
  });
const SELVA_DROP_ROTATE = SELVA_DRIP_KEY_END_Y.map((leadY) => selvaDropAngle(leadY));

const HELECHO_V_HEIGHT_EM = HELECHO_V_INK_H / HELECHO_V_UPEM;
const HELECHO_V_WIDTH_EM = HELECHO_V_ADVANCE / HELECHO_V_UPEM;

const selvaReleaseAttach = selvaDropAttach(SELVA_MID_Y, SELVA_SCALE_Y[8]);
const SELVA_TRAIL_X2 = SELVA_DRIP_KEY_END_Y.map((leadY, i) => {
  if (i >= 10) return SELVA_JOINT.x;
  if (i === 9) return selvaTrailLerp(selvaReleaseAttach, SELVA_JOINT, 0.42).x;
  if (i <= 3) return SELVA_JOINT.x;
  return selvaDropAttach(leadY, SELVA_SCALE_Y[i]).x;
});
const SELVA_TRAIL_Y2 = SELVA_DRIP_KEY_END_Y.map((leadY, i) => {
  if (i >= 10) return SELVA_JOINT.y;
  if (i === 9) return selvaTrailLerp(selvaReleaseAttach, SELVA_JOINT, 0.42).y;
  if (i <= 3) return SELVA_JOINT.y;
  return selvaDropAttach(leadY, SELVA_SCALE_Y[i]).y;
});

const selvaDripTransition = {
  duration: SELVA_DRIP_DURATION,
  repeat: Infinity,
  ease: "linear" as const,
  times: [...selvaDripTimes],
  repeatDelay: 0.5,
};

const selvaDripEaseTransition = {
  ...selvaDripTransition,
  ease: "easeInOut" as const,
};

const selvaScaleGrowTransition = {
  ...selvaDripTransition,
  ease: "easeOut" as const,
};

const selvaFallSyncTransition = {
  ...selvaDripTransition,
  ease: "linear" as const,
};

const selvaTrailLineTransition = {
  duration: SELVA_DRIP_DURATION,
  repeat: Infinity,
  ease: [
    "linear",
    "linear",
    "linear",
    "linear",
    "linear",
    "linear",
    "linear",
    "linear",
    "easeIn",
    "easeIn",
    "linear",
    "linear",
    "linear",
  ] as ("linear" | "easeIn")[],
  times: [...selvaDripTimes],
  repeatDelay: 0.5,
};

const helechoDripTransition = {
  duration: 4,
  repeat: Infinity,
  ease: "easeInOut" as const,
  times: [0, 0.12, 0.28, 0.42, 0.78, 1],
  repeatDelay: 0.25,
};

/** Petróleo — mismo chorreo helecho + 3 s congelado abajo (mismos keyframes de caída) */
const PETROLEO_HOLD_S = 3;
const PETROLEO_FALL_S = helechoDripTransition.duration;
const PETROLEO_RESET_S = (1 - 0.78) * PETROLEO_FALL_S;
const PETROLEO_DRIP_DURATION = PETROLEO_FALL_S + PETROLEO_HOLD_S + PETROLEO_RESET_S;
const PETROLEO_T_ARRIVE = PETROLEO_FALL_S / PETROLEO_DRIP_DURATION;
const PETROLEO_T_HOLD_END = (PETROLEO_FALL_S + PETROLEO_HOLD_S) / PETROLEO_DRIP_DURATION;

const scalePetroleoFallTime = (t: number) => (t / 0.78) * PETROLEO_T_ARRIVE;

const petroleoDripTimes = [
  0,
  scalePetroleoFallTime(0.12),
  scalePetroleoFallTime(0.28),
  scalePetroleoFallTime(0.42),
  PETROLEO_T_ARRIVE,
  PETROLEO_T_HOLD_END,
  1,
] as const;

/** Extensión de DRIP_* — caída idéntica · pausa abajo · reset */
const PETROLEO_DRIP_PATHS = [
  DRIP_PATHS[0],
  DRIP_PATHS[1],
  DRIP_PATHS[2],
  DRIP_PATHS[3],
  DRIP_PATHS[4],
  DRIP_PATHS[4],
  DRIP_PATHS[5],
] as const;

const PETROLEO_DRIP_DROP_CY = [
  DRIP_DROP_CY[0],
  DRIP_DROP_CY[1],
  DRIP_DROP_CY[2],
  DRIP_DROP_CY[3],
  DRIP_DROP_CY[4],
  DRIP_DROP_CY[4],
  DRIP_DROP_CY[5],
] as const;

const PETROLEO_DRIP_DROP_R_ANIM = [
  DRIP_DROP_R_ANIM[0],
  DRIP_DROP_R_ANIM[1],
  DRIP_DROP_R_ANIM[2],
  DRIP_DROP_R_ANIM[3],
  DRIP_DROP_R_ANIM[4],
  DRIP_DROP_R_ANIM[4],
  DRIP_DROP_R_ANIM[5],
] as const;

const PETROLEO_DRIP_LINE_OPACITY = [0, 1, 1, 1, 1, 1, 0] as const;
const PETROLEO_DRIP_DROP_OPACITY = [0, 1, 1, 1, 1, 1, 0] as const;
const PETROLEO_CREDIT_OPACITY = [0, 0, 0, 0, 1, 1, 0] as const;

const petroleoDripTransition = {
  duration: PETROLEO_DRIP_DURATION,
  repeat: Infinity,
  ease: helechoDripTransition.ease,
  times: [...petroleoDripTimes],
  repeatDelay: helechoDripTransition.repeatDelay,
};

function HelechoTitleRow({
  letterColor,
  whiteBlink = false,
  vColor = HELECHO_CYAN,
  halo = "cyan",
  dripVariant = "helecho",
  scaleX,
  jointTearColor,
  jointTearStroke,
  selvaCamoInk,
  selvaDropInk,
  letterGap,
}: {
  letterColor: string;
  whiteBlink?: boolean;
  vColor?: string;
  halo?: "cyan" | "black";
  dripVariant?: "helecho" | "niebla" | "pino" | "petroleo" | "selva";
  scaleX?: number;
  jointTearColor?: string;
  jointTearStroke?: string;
  selvaCamoInk?: string;
  selvaDropInk?: string;
  letterGap?: string;
}) {
  const letters = ["M", "O", "R", "V", "O"] as const;
  const titleLetterGap = letterGap ?? HELECHO_TITLE_STYLE.letterSpacing;
  return (
    <span
      style={{
        ...HELECHO_TITLE_STYLE,
        letterSpacing: 0,
        gap: titleLetterGap,
        display: "inline-flex",
        alignItems: "baseline",
        flexWrap: "nowrap",
        whiteSpace: "nowrap",
        ...(scaleX && scaleX !== 1
          ? { transform: `scaleX(${scaleX})`, transformOrigin: "center center" }
          : {}),
      }}
    >
      {letters.map((ch, i) =>
        ch === "V" ? (
          <HelechoNeonV
            key={`helecho-${i}`}
            color={vColor}
            whiteBlink={whiteBlink}
            halo={halo}
            dripVariant={dripVariant}
            jointTearColor={jointTearColor}
            jointTearStroke={jointTearStroke}
            selvaCamoInk={selvaCamoInk}
            selvaDropInk={selvaDropInk}
          />
        ) : (
          <span
            key={`helecho-${i}`}
            style={{
              color: letterColor,
              fontFamily: HELECHO_TITLE_STYLE.fontFamily,
              fontWeight: HELECHO_TITLE_STYLE.fontWeight,
              letterSpacing: 0,
            }}
          >
            {ch}
          </span>
        ),
      )}
    </span>
  );
}

export function HelechoNeonV({
  color = HELECHO_CYAN,
  whiteBlink = false,
  halo = "cyan",
  dripVariant = "helecho",
  jointTearColor,
  jointTearStroke,
  selvaCamoInk,
  selvaDropInk,
}: {
  color?: string;
  whiteBlink?: boolean;
  halo?: "cyan" | "black";
  dripVariant?: "helecho" | "niebla" | "pino" | "petroleo" | "selva";
  jointTearColor?: string;
  jointTearStroke?: string;
  selvaCamoInk?: string;
  selvaDropInk?: string;
}) {
  const mobile = useIsMobile();
  const selvaDropYAnim = selvaDropYKeyframes(SELVA_DROP_LAND_EXTRA_Y);
  const blinkFill = petroleoVBlinkFill(color);
  const isJointTearDrip =
    dripVariant === "niebla" || dripVariant === "pino" || dripVariant === "selva";
  const isPetroleoDrip = dripVariant === "petroleo";
  const isPinoDrip = dripVariant === "pino";
  const isSelvaDrip = dripVariant === "selva";
  const isLineDrip = isPinoDrip || isSelvaDrip;
  const camoInk = selvaCamoInk ?? SELVA_CAMOUFLAGE;
  const dropInk = selvaDropInk ?? SELVA_DROP_INK;
  const selvaDripFill = selvaDripFillKeyframes(color, camoInk, dropInk);
  const dripPaths = isLineDrip
    ? []
    : isPetroleoDrip
      ? PETROLEO_DRIP_PATHS
      : isJointTearDrip
        ? NIEBLA_DRIP_PATHS
        : DRIP_PATHS;
  const dripTransition = isPinoDrip
    ? pinoDripEaseTransition
    : isSelvaDrip
      ? selvaDripEaseTransition
      : isPetroleoDrip
        ? petroleoDripTransition
        : isJointTearDrip
          ? nieblaDripTransition
          : helechoDripTransition;
  const lineOpacityTransition = isPinoDrip
    ? pinoDripTransition
    : isSelvaDrip
      ? selvaDripTransition
      : dripTransition;
  const dripColor = isJointTearDrip ? (jointTearColor ?? MEZCLA_RED) : color;
  const tearStroke = jointTearStroke ?? NIEBLA_TEAR_STROKE;
  const jointLineOpacity = isPinoDrip
    ? PINO_LINE_OPACITY
    : isSelvaDrip
      ? SELVA_LINE_OPACITY
      : NIEBLA_LINE_OPACITY;
  const jointLineWidth = isLineDrip
    ? isSelvaDrip
      ? SELVA_DRIP_LINE_W
      : PINO_DRIP_LINE_W
    : NIEBLA_DRIP_LINE_W;
  const jointLineCap = "butt";
  const lineJoint = isSelvaDrip ? SELVA_JOINT : PINO_JOINT;
  const lineTrailX2 = isSelvaDrip ? SELVA_TRAIL_X2 : PINO_TRAIL_X2;
  const lineTrailY2 = isSelvaDrip ? SELVA_TRAIL_Y2 : PINO_TRAIL_Y2;
  const lineFallSync = isSelvaDrip ? selvaFallSyncTransition : pinoFallSyncTransition;
  const lineRetractSync = isSelvaDrip ? selvaTrailLineTransition : lineFallSync;

  const dripLineAnimate = isJointTearDrip
    ? { opacity: [...jointLineOpacity] }
    : isPetroleoDrip
      ? {
          opacity: [...PETROLEO_DRIP_LINE_OPACITY],
          ...(whiteBlink ? { stroke: [...blinkFill] } : {}),
        }
      : {
          opacity: [0, 1, 1, 1, 1, 0],
          ...(whiteBlink ? { stroke: [...blinkFill] } : {}),
        };

  const dripLineTransition = isJointTearDrip
    ? {
        opacity: isLineDrip ? lineOpacityTransition : dripTransition,
        ...(isLineDrip
          ? { x2: lineRetractSync, y2: lineRetractSync }
          : { d: dripTransition }),
      }
    : {
        opacity: dripTransition,
        stroke: whiteBlink ? petroleoVBlinkTransition : dripTransition,
      };

  const dripLine = isLineDrip ? (
    <motion.line
      x1={lineJoint.x}
      y1={lineJoint.y}
      stroke={isSelvaDrip ? camoInk : dripColor}
      strokeWidth={jointLineWidth}
      strokeLinecap={jointLineCap}
      shapeRendering="geometricPrecision"
      animate={{
        x2: [...lineTrailX2],
        y2: [...lineTrailY2],
        opacity: [...jointLineOpacity],
        ...(isSelvaDrip ? { stroke: [...selvaDripFill] } : {}),
      }}
      transition={{
        ...dripLineTransition,
        ...(isSelvaDrip ? { stroke: selvaDripTransition } : {}),
      }}
    />
  ) : (
    <motion.path
      fill="none"
      stroke={whiteBlink && !isJointTearDrip ? undefined : dripColor}
      strokeWidth={isJointTearDrip ? jointLineWidth : DRIP_LINE_W}
      strokeLinecap={isJointTearDrip ? jointLineCap : "round"}
      shapeRendering="geometricPrecision"
      animate={{
        d: [...dripPaths],
        ...dripLineAnimate,
      }}
      transition={{
        d: dripTransition,
        ...dripLineTransition,
      }}
    />
  );

  const dripDrop = isSelvaDrip ? (
    <motion.g
      style={{ transformOrigin: "0px 0px" }}
      animate={{
        x: [...SELVA_DROP_X],
        y: [...selvaDropYAnim],
        rotate: [...SELVA_DROP_ROTATE],
        scaleX: [...SELVA_SCALE_X],
        scaleY: [...SELVA_SCALE_Y],
        opacity: [...SELVA_DROP_OPACITY],
      }}
      transition={{
        x: selvaFallSyncTransition,
        y: selvaFallSyncTransition,
        rotate: selvaDripEaseTransition,
        scaleX: selvaScaleGrowTransition,
        scaleY: selvaScaleGrowTransition,
        opacity: selvaDripTransition,
      }}
    >
      <motion.path
        d={SELVA_DROP_LOCAL}
        fill={dropInk}
        shapeRendering="geometricPrecision"
        animate={{
          opacity: [...SELVA_PATH_OPACITY],
          fill: [...selvaDripFill],
        }}
        transition={{ opacity: selvaDripTransition, fill: selvaDripTransition }}
      />
    </motion.g>
  ) : isPinoDrip ? (
    <motion.g
      style={{ transformOrigin: "0 0", transformBox: "fill-box" as const }}
      animate={{
        x: [...PINO_DROP_X],
        y: [...PINO_DROP_Y],
        scale: [...PINO_DROP_SCALE],
        opacity: [...PINO_DROP_OPACITY],
      }}
      transition={{
        x: pinoFallSyncTransition,
        y: pinoFallSyncTransition,
        scale: dripTransition,
        opacity: lineOpacityTransition,
      }}
    >
      <path d={PINO_DROP_LOCAL} fill={dripColor} shapeRendering="geometricPrecision" />
    </motion.g>
  ) : dripVariant === "niebla" ? (
    <motion.g
      style={{ transformOrigin: "0 0", transformBox: "fill-box" as const }}
      animate={{
        x: [...NIEBLA_TEAR_X],
        y: [...NIEBLA_TEAR_Y],
        scale: [...NIEBLA_TEAR_SCALES],
        opacity: [...NIEBLA_TEAR_OPACITY],
      }}
      transition={{
        x: dripTransition,
        y: dripTransition,
        scale: dripTransition,
        opacity: dripTransition,
      }}
    >
      <path
        d={NIEBLA_TEAR_LOCAL}
        fill={dripColor}
        stroke={tearStroke}
        strokeWidth={1.5}
        shapeRendering="geometricPrecision"
      />
    </motion.g>
  ) : (
    <motion.circle
      cx={FONT_TIP_X}
      cy={(isPetroleoDrip ? PETROLEO_DRIP_DROP_CY : DRIP_DROP_CY)[0]}
      r={(isPetroleoDrip ? PETROLEO_DRIP_DROP_R_ANIM : DRIP_DROP_R_ANIM)[0]}
      fill={whiteBlink ? undefined : dripColor}
      animate={{
        cy: [...(isPetroleoDrip ? PETROLEO_DRIP_DROP_CY : DRIP_DROP_CY)],
        r: [...(isPetroleoDrip ? PETROLEO_DRIP_DROP_R_ANIM : DRIP_DROP_R_ANIM)],
        opacity: [...(isPetroleoDrip ? PETROLEO_DRIP_DROP_OPACITY : [0, 1, 1, 1, 1, 0])],
        ...(whiteBlink ? { fill: [...blinkFill] } : {}),
      }}
      transition={{
        cy: dripTransition,
        r: dripTransition,
        opacity: dripTransition,
        fill: whiteBlink ? petroleoVBlinkTransition : dripTransition,
      }}
    />
  );

  return (
    <motion.svg
      viewBox={`0 0 ${HELECHO_V_ADVANCE} ${HELECHO_V_INK_H}`}
      aria-hidden
      style={{
        display: "inline-block",
        width: `${HELECHO_V_WIDTH_EM}em`,
        height: `${HELECHO_V_HEIGHT_EM}em`,
        verticalAlign: "baseline",
        overflow: "visible",
        transform: mobile ? "translateY(5px)" : "translateY(10px)",
      }}
      animate={whiteBlink ? premiumVBlinkSvgAnimate(halo) : helechoVAnimate()}
      transition={
        whiteBlink
          ? {
              opacity: petroleoVBlinkTransition,
              filter: petroleoVBlinkTransition,
            }
          : {
              opacity: esmeraldaNeonTransition,
              textShadow: esmeraldaNeonTransition,
            }
      }
    >
      <g transform={`translate(0, -12) ${HELECHO_V_FLIP}`}>
        {!isJointTearDrip && dripLine}
        <motion.path
          d={HELECHO_V_PATH}
          fill={whiteBlink ? undefined : color}
          shapeRendering="geometricPrecision"
          animate={whiteBlink ? { fill: [...blinkFill] } : undefined}
          transition={whiteBlink ? { fill: petroleoVBlinkTransition } : undefined}
        />
        {isJointTearDrip && dripLine}
        {dripDrop}
      </g>
    </motion.svg>
  );
}

export function HelechoChartreuseCredit({ color = HELECHO_CYAN }: { color?: string }) {
  const { textStyle } = useCoverCreditTypography(color, { textAlign: "center" });
  return (
    <CoverCreditWrap>
      <p style={textStyle}>Naz Montés</p>
    </CoverCreditWrap>
  );
}

/** Desplazamiento del subtítulo Petróleo (px pantalla, vía translate) */
const PETROLEO_CREDIT_NUDGE_X_PX = 14;
const PETROLEO_CREDIT_NUDGE_Y_PX = 0;

/** Raíz Petróleo — subtítulo al terminar el chorreo, 3 s visible, oculto al reiniciar */
export function PetroleoCredit({ color = HELECHO_CYAN }: { color?: string }) {
  const { textStyle, wrapStyle } = useCoverCreditTypography(color, { textAlign: "center" });
  return (
    <CoverCreditWrap
      wrapStyle={{
        ...wrapStyle,
        position: "relative",
        transform: `translate(${PETROLEO_CREDIT_NUDGE_X_PX}px, ${PETROLEO_CREDIT_NUDGE_Y_PX}px) ${wrapStyle.transform ?? ""}`,
      }}
    >
      <motion.p
        style={textStyle}
        animate={{ opacity: [...PETROLEO_CREDIT_OPACITY] }}
        transition={petroleoDripTransition}
      >
        Naz Montes
      </motion.p>
    </CoverCreditWrap>
  );
}

/** Desplazamiento del subtítulo Niebla (px pantalla) */
const NIEBLA_CREDIT_NUDGE_X_PX = 27;
const NIEBLA_CREDIT_NUDGE_Y_PX = -2;

/** Raíz Niebla — subtítulo al terminar el chorreo, 3 s visible, oculto al reiniciar */
export function NieblaDropCredit({ color }: { color?: string }) {
  const { textStyle, wrapStyle } = useCoverCreditTypography(color, { textAlign: "center" });
  return (
    <CoverCreditWrap
      wrapStyle={{
        ...wrapStyle,
        position: "relative",
        left: NIEBLA_CREDIT_NUDGE_X_PX,
        top: NIEBLA_CREDIT_NUDGE_Y_PX,
      }}
    >
      <motion.p
        style={textStyle}
        animate={{ opacity: [0, 0, 1, 1, 0] }}
        transition={{
          duration: NIEBLA_DRIP_DURATION,
          repeat: Infinity,
          repeatDelay: 0.5,
          ease: "linear",
          times: [0, NIEBLA_T_ARRIVE - 0.0001, NIEBLA_T_ARRIVE, NIEBLA_T_HOLD_END, 1],
        }}
      >
        Naz Montes
      </motion.p>
    </CoverCreditWrap>
  );
}

/** Crédito sincronizado con la gota (tipografía Selva; color vía prop) */
export function SelvaDropCredit({
  color = RAIZ_OXIDO,
  titleScaleX = SELVA_TITLE_SCALE_X,
}: {
  color?: string;
  titleScaleX?: number;
}) {
  const mobile = useIsMobile();
  const { textStyle, wrapStyle } = useCoverCreditTypography(color, { textAlign: "center" });
  const creditNudgeXEm = dropCreditNudgeXEm(SELVA_DROP_LAND.x, titleScaleX);
  const creditNudgeXPx = dropCreditNudgePx(mobile, titleScaleX);
  const creditNudgeX = mobile
    ? `calc(${creditNudgeXEm}em + ${creditNudgeXPx}px - 0.36em)`
    : `calc(${creditNudgeXEm}em + ${creditNudgeXPx}px)`;
  const creditNudgeY = mobile ? "calc(-1.12em - 1px)" : "calc(-1.12em - 5px)";

  return (
    <div
      style={{
        ...wrapStyle,
        marginTop: SELVA_CREDIT_MARGIN_TOP,
        transform: `translate(${creditNudgeX}, ${creditNudgeY}) ${wrapStyle.transform ?? ""}`,
        position: "relative",
        zIndex: 1,
      }}
    >
      <motion.p
        style={textStyle}
        animate={{ opacity: [0, 0, 1, 1, 0] }}
        transition={{
          duration: SELVA_DRIP_DURATION,
          repeat: Infinity,
          repeatDelay: 0.5,
          ease: "linear",
          times: [0, SELVA_T_BOTTOM, SELVA_T_BOTTOM, SELVA_T_HOLD_END, 1],
        }}
      >
        Naz Mont
        <span
          aria-label="e"
          style={{
            position: "relative",
            display: "inline-block",
            paddingTop: "0.32em",
          }}
        >
          e
        </span>
        s
      </motion.p>
    </div>
  );
}

/** Ajuste fino portada Pino — subtítulo bajo la gota */
const PINO_CREDIT_FINE_X_PX = -2;
const PINO_CREDIT_FINE_Y_PX = -16;

/** Raíz Pino (Helecho · negro · lágrima cian) — gota sobre la «e» */
export function PinoDropCredit({ color = HELECHO_CYAN }: { color?: string }) {
  const mobile = useIsMobile();
  const { textStyle, wrapStyle } = useCoverCreditTypography(color, { textAlign: "center" });
  const creditNudgeXEm = dropCreditNudgeXEm(PINO_DROP_LAND.x, PINO_TITLE_SCALE_X);
  const creditNudgeXPx = dropCreditNudgePx(mobile, PINO_TITLE_SCALE_X) + PINO_CREDIT_FINE_X_PX;
  const creditNudgeX = mobile
    ? `calc(${creditNudgeXEm}em + ${creditNudgeXPx}px - 0.36em)`
    : `calc(${creditNudgeXEm}em + ${creditNudgeXPx}px)`;
  const creditNudgeY = mobile
    ? `calc(-1.12em - 1px + ${PINO_CREDIT_FINE_Y_PX}px)`
    : `calc(-1.12em - 5px + ${PINO_CREDIT_FINE_Y_PX}px)`;

  return (
    <div
      style={{
        ...wrapStyle,
        marginTop: PINO_CREDIT_MARGIN_TOP,
        transform: `translate(${creditNudgeX}, ${creditNudgeY}) ${wrapStyle.transform ?? ""}`,
        position: "relative",
        zIndex: 1,
      }}
    >
      <motion.p
        style={textStyle}
        animate={{ opacity: [0, 0, 1, 1, 0] }}
        transition={{
          duration: PINO_DRIP_DURATION,
          repeat: Infinity,
          repeatDelay: 0.5,
          ease: "linear",
          times: [0, PINO_T_ARRIVE - 0.0001, PINO_T_ARRIVE, PINO_T_HOLD_END, 1],
        }}
      >
        Naz Mont
        <span
          aria-label="e"
          style={{
            position: "relative",
            display: "inline-block",
            paddingTop: "0.32em",
          }}
        >
          e
        </span>
        s
      </motion.p>
    </div>
  );
}

export function EsmeraldaNeonCredit() {
  const { textStyle } = useCoverCreditTypography(GREEN_ESMERALDA);
  return (
    <CoverCreditWrap>
      <motion.p
        style={textStyle}
        initial={{ opacity: 0 }}
        animate={esmeraldaVAnimate()}
        transition={{
          opacity: { ...esmeraldaNeonTransition, delay: 0.6 },
          color: esmeraldaNeonTransition,
          textShadow: esmeraldaNeonTransition,
        }}
      >
        Naz Montés
      </motion.p>
    </CoverCreditWrap>
  );
}

/** Crédito portada Podredumbre: mismo alternado rojo ↔ lavanda que la V */
export function TierraCredit() {
  const { textStyle } = useCoverCreditTypography(POD_RED);
  return (
    <CoverCreditWrap>
      <motion.p
        style={textStyle}
        initial={{ opacity: 0 }}
        animate={{
          color: [POD_LIT, POD_LIT, POD_RED, POD_RED, POD_LIT, POD_RED, POD_LIT],
          opacity: [1, 0.15, 1, 0.7, 1, 0.05, 1, 0.85, 1],
          textShadow: [
            `0 0 40px ${TIERRA_GLOW_LIGHT}`,
            `0 0 4px ${TIERRA_GLOW_DARK}`,
            `0 0 55px ${TIERRA_GLOW_LIGHT}`,
            `0 0 8px ${TIERRA_GLOW_DARK}`,
            `0 0 45px ${TIERRA_GLOW_LIGHT}`,
          ],
        }}
        transition={{
          color: vColorTransition,
          opacity: { ...vBlinkTransition, delay: 0.8 },
          textShadow: vBlinkTransition,
        }}
      >
        Naz Montés
      </motion.p>
    </CoverCreditWrap>
  );
}

/** Crédito portada Invertida: mismo color y parpadeo que la V */
export function InvertidaCredit({ theme }: { theme: PaletteTheme }) {
  const vColor = theme.titleV ?? BG;
  const { textStyle } = useCoverCreditTypography(vColor);
  return (
    <CoverCreditWrap>
      <motion.p
        style={textStyle}
        initial={{ opacity: 0.85, textShadow: "0 0 10px rgba(237,232,213,0.28)" }}
        animate={invertidaVBlinkAnimate}
        transition={{
          opacity: { ...vBlinkTransition, delay: 0.5 },
          textShadow: vBlinkTransition,
        }}
      >
        Naz Montés
      </motion.p>
    </CoverCreditWrap>
  );
}

function BlinkLetter({
  letter,
  color,
  glowLight = "rgba(230,224,236,0.8)",
  glowDark = "rgba(230,224,236,0.2)",
}: {
  letter: string;
  color: string;
  glowLight?: string;
  glowDark?: string;
}) {
  return (
    <motion.span
      style={{ display: "inline-block", color }}
      animate={{
        color,
        opacity: [1, 0.15, 1, 0.7, 1, 0.05, 1, 0.85, 1],
        textShadow: [
          `0 0 40px ${glowLight}`,
          `0 0 4px ${glowDark}`,
          `0 0 55px ${glowLight}`,
          `0 0 8px ${glowDark}`,
          `0 0 45px ${glowLight}`,
        ],
      }}
      transition={vBlinkTransition}
    >
      {letter}
    </motion.span>
  );
}

function BlinkV({
  color,
  glowLight,
  glowDark,
}: {
  color: string;
  glowLight?: string;
  glowDark?: string;
}) {
  return (
    <BlinkLetter
      letter="V"
      color={color}
      glowLight={glowLight}
      glowDark={glowDark}
    />
  );
}

/** Resplandor rojo vino + toque blanco neón en la V */
const HOSPITAL_V_GLOW_LIGHT = "rgba(138,30,45,0.75)";
const HOSPITAL_V_GLOW_DARK = "rgba(107,16,32,0.35)";
const HOSPITAL_V_GLOW_WHITE = "rgba(255,248,242,0.8)";

const LIT_V_GLOW_BRIGHT = "rgba(216,232,230,0.95)";
const LIT_V_GLOW_MID = "rgba(120,180,175,0.88)";
const LIT_V_GLOW_DIM = "rgba(30,58,44,0.28)";

const MEZCLA_V_BLACK = "#0A0A08";
const MEZCLA_V_GLOW_DARK = "rgba(0,0,0,0.9)";
const MEZCLA_V_GLOW_MID = "rgba(10,10,8,0.55)";

const mezclaVBlinkTransition = {
  duration: 1.5,
  repeat: Infinity,
  ease: "easeInOut" as const,
  times: [0, 0.05, 0.1, 0.16, 0.24, 0.34, 0.44, 0.58, 0.68, 0.82, 0.92, 1],
  repeatDelay: 0.2,
};

/** V en Hospital: rojo + destello blanco neón */
function HospitalBlinkV() {
  return (
    <motion.span
      style={{ display: "inline-block", color: POD_RED }}
      animate={{
        color: [POD_RED, "#B84858", POD_RED, "#9E2838", POD_RED, "#D06070", POD_RED],
        opacity: [1, 0.05, 1, 0.2, 1, 0.02, 1, 0.35, 1, 0.08, 1],
        textShadow: [
          `0 0 20px ${HOSPITAL_V_GLOW_WHITE}, 0 0 50px ${HOSPITAL_V_GLOW_LIGHT}, 0 0 8px ${HOSPITAL_V_GLOW_DARK}`,
          `0 0 6px ${HOSPITAL_V_GLOW_DARK}`,
          `0 0 35px ${HOSPITAL_V_GLOW_WHITE}, 0 0 65px ${HOSPITAL_V_GLOW_LIGHT}`,
          `0 0 10px ${HOSPITAL_V_GLOW_DARK}`,
          `0 0 28px ${HOSPITAL_V_GLOW_WHITE}, 0 0 55px ${HOSPITAL_V_GLOW_LIGHT}`,
          `0 0 8px ${HOSPITAL_V_GLOW_DARK}`,
          `0 0 40px ${HOSPITAL_V_GLOW_WHITE}, 0 0 70px ${HOSPITAL_V_GLOW_LIGHT}`,
          `0 0 12px ${HOSPITAL_V_GLOW_DARK}`,
          `0 0 32px ${HOSPITAL_V_GLOW_WHITE}, 0 0 60px ${HOSPITAL_V_GLOW_LIGHT}`,
        ],
      }}
      transition={{
        color: mezclaVBlinkTransition,
        opacity: mezclaVBlinkTransition,
        textShadow: mezclaVBlinkTransition,
      }}
    >
      V
    </motion.span>
  );
}

/** V en Litúrgico: alterna verde oscuro ↔ claro (mismo ritmo que Mezcla) */
function LiturgicoBlinkV() {
  return (
    <motion.span
      style={{ display: "inline-block", color: GREEN_PINO }}
      animate={{
        color: [
          GREEN_PINO,
          GREEN_PINO_LIGHT,
          GREEN_PINO,
          GREEN_PINO_LIGHT,
          GREEN_PINO,
          GREEN_PINO_LIGHT,
        ],
        opacity: [1, 0.05, 1, 0.2, 1, 0.02, 1, 0.35, 1, 0.08, 1],
        textShadow: [
          `0 0 55px ${LIT_V_GLOW_BRIGHT}`,
          `0 0 6px ${LIT_V_GLOW_DIM}`,
          `0 0 75px ${LIT_V_GLOW_MID}`,
          `0 0 10px ${LIT_V_GLOW_DIM}`,
          `0 0 60px ${LIT_V_GLOW_BRIGHT}`,
          `0 0 4px ${LIT_V_GLOW_DIM}`,
          `0 0 80px ${LIT_V_GLOW_MID}`,
          `0 0 8px ${LIT_V_GLOW_DIM}`,
          `0 0 65px ${LIT_V_GLOW_BRIGHT}`,
          `0 0 12px ${LIT_V_GLOW_DIM}`,
          `0 0 70px ${LIT_V_GLOW_MID}`,
        ],
      }}
      transition={{
        color: mezclaVBlinkTransition,
        opacity: mezclaVBlinkTransition,
        textShadow: mezclaVBlinkTransition,
      }}
    >
      V
    </motion.span>
  );
}

/** V en Mezcla: parpadeo intenso en negro */
function MezclaBlinkV() {
  return (
    <motion.span
      style={{ display: "inline-block", color: MEZCLA_V_BLACK }}
      animate={{
        color: [MEZCLA_V_BLACK, "#1A1A16", MEZCLA_V_BLACK, "#141412", MEZCLA_V_BLACK],
        opacity: [1, 0.05, 1, 0.2, 1, 0.02, 1, 0.35, 1, 0.08, 1],
        textShadow: [
          `0 0 50px ${MEZCLA_V_GLOW_DARK}, 0 0 25px ${MEZCLA_V_GLOW_MID}`,
          `0 0 6px rgba(0,0,0,0.3)`,
          `0 0 65px ${MEZCLA_V_GLOW_DARK}, 0 0 35px ${MEZCLA_V_GLOW_MID}`,
          `0 0 8px rgba(0,0,0,0.25)`,
          `0 0 55px ${MEZCLA_V_GLOW_DARK}, 0 0 30px ${MEZCLA_V_GLOW_MID}`,
          `0 0 5px rgba(0,0,0,0.2)`,
          `0 0 70px ${MEZCLA_V_GLOW_DARK}, 0 0 40px ${MEZCLA_V_GLOW_MID}`,
          `0 0 10px rgba(0,0,0,0.3)`,
          `0 0 60px ${MEZCLA_V_GLOW_DARK}, 0 0 32px ${MEZCLA_V_GLOW_MID}`,
        ],
      }}
      transition={{
        color: mezclaVBlinkTransition,
        opacity: mezclaVBlinkTransition,
        textShadow: mezclaVBlinkTransition,
      }}
    >
      V
    </motion.span>
  );
}

function titleLetterSpacing(compact?: boolean) {
  return compact ? "0.07em" : "0.18em";
}

function MezclaBlinkTitle({
  fontFamily,
  letterSpacing = "0.18em",
}: {
  fontFamily: string;
  letterSpacing?: string;
}) {
  const letters = ["M", "O", "R", "V", "O"] as const;
  return (
    <span
      style={{
        fontFamily,
        display: "inline-flex",
        alignItems: "baseline",
        flexWrap: "nowrap",
        whiteSpace: "nowrap",
        letterSpacing,
      }}
    >
      {letters.map((ch, i) =>
        ch === "V" ? (
          <MezclaBlinkV key={`${ch}-${i}`} />
        ) : (
          <BlinkLetter
            key={`${ch}-${i}`}
            letter={ch}
            color={POD_RED}
            glowLight={HOSPITAL_V_GLOW_LIGHT}
            glowDark={HOSPITAL_V_GLOW_DARK}
          />
        )
      )}
    </span>
  );
}

function TitleAlternating({
  moroColors,
  vColors,
  glowLight,
  glowDark,
  fontFamily,
  letterSpacing = "0.18em",
}: {
  moroColors: string[];
  vColors: string[];
  glowLight: string;
  glowDark: string;
  fontFamily: string;
  letterSpacing?: string;
}) {
  return (
    <span
      style={{
        fontFamily,
        display: "inline-flex",
        alignItems: "baseline",
        flexWrap: "nowrap",
        whiteSpace: "nowrap",
        letterSpacing,
      }}
    >
      <motion.span animate={{ color: moroColors }} transition={moroColorTransition}>
        MOR
      </motion.span>
      <motion.span
        style={{ display: "inline-block" }}
        animate={{
          color: vColors,
          opacity: [1, 0.15, 1, 0.7, 1, 0.05, 1, 0.85, 1],
          textShadow: [
            `0 0 40px ${glowLight}`,
            `0 0 4px ${glowDark}`,
            `0 0 55px ${glowLight}`,
            `0 0 8px ${glowDark}`,
            `0 0 45px ${glowLight}`,
          ],
        }}
        transition={{
          color: vColorTransition,
          opacity: vBlinkTransition,
          textShadow: vBlinkTransition,
        }}
      >
        V
      </motion.span>
      <motion.span animate={{ color: moroColors }} transition={moroColorTransition}>
        O
      </motion.span>
    </span>
  );
}

function TitleRow({
  letterColor,
  v,
  fontFamily,
  letterSpacing = "0.18em",
}: {
  letterColor: string;
  v: ReactNode;
  fontFamily: string;
  letterSpacing?: string;
}) {
  return (
    <span
      style={{
        fontFamily,
        display: "inline-flex",
        alignItems: "baseline",
        flexWrap: "nowrap",
        whiteSpace: "nowrap",
        letterSpacing,
      }}
    >
      <span style={{ color: letterColor }}>MOR</span>
      {v}
      <span style={{ color: letterColor }}>O</span>
    </span>
  );
}

export function CoverTitle({
  palette,
  compact,
}: {
  palette: string;
  compact?: boolean;
}) {
  const theme = PALETTES[palette as PaletteId] ?? PALETTES.liturgico;
  const display = fontDisplay(theme);
  const ls = titleLetterSpacing(compact);

  switch (palette) {
    case "liturgico": {
      const lit = PALETTES.liturgico;
      if (lit.titleLetters && lit.titleV) {
        return (
          <TitleRow
            fontFamily={display}
            letterColor={lit.titleLetters}
            letterSpacing={ls}
            v={<LiturgicoBlinkV />}
          />
        );
      }
      return (
        <TitleRow
          fontFamily={display}
          letterColor={LIT_LETTERS}
          letterSpacing={ls}
          v={<BlinkV color={LIT_V} />}
        />
      );
    }
    case "hospital": {
      const hosp = PALETTES.hospital;
      return (
        <TitleRow
          fontFamily={display}
          letterColor={hosp.titleLetters ?? hosp.greenDark}
          letterSpacing={ls}
          v={<HospitalBlinkV />}
        />
      );
    }
    case "tierra":
      return (
        <TitleAlternating
          fontFamily={display}
          letterSpacing={ls}
          moroColors={[POD_RED, POD_RED, POD_LIT, POD_LIT, POD_RED]}
          vColors={[POD_LIT, POD_LIT, POD_RED, POD_RED, POD_LIT]}
          glowLight="rgba(230,224,236,0.8)"
          glowDark="rgba(107,16,32,0.45)"
        />
      );
    case "mezcla":
      return <MezclaBlinkTitle fontFamily={display} letterSpacing={ls} />;
    case "invertida": {
      const inv = PALETTES.invertida;
      const letters = inv.titleLetters ?? INV_LETTERS;
      const vColor = inv.titleV ?? BG;
      return (
        <span
          style={{
            fontFamily: display,
            display: "inline-flex",
            alignItems: "baseline",
            flexWrap: "nowrap",
            whiteSpace: "nowrap",
            letterSpacing: ls,
          }}
        >
          {["M", "O", "R"].map((ch) => (
            <span key={ch} style={{ color: letters }}>
              {ch}
            </span>
          ))}
          <motion.span
            style={{ display: "inline-block", color: vColor }}
            animate={invertidaVBlinkAnimate}
            transition={vBlinkTransition}
          >
            V
          </motion.span>
          <span style={{ color: letters }}>O</span>
        </span>
      );
    }
    default: {
      if (palette === "raiz_esmeralda") {
        return (
          <TitleRow
            fontFamily={display}
            letterColor={theme.titleLetters ?? theme.greenLight}
            letterSpacing={ls}
            v={<EsmeraldaNeonV />}
          />
        );
      }
      if (
        isSelvaStyle(palette as PaletteId) ||
        palette === "raiz_helecho" ||
        palette === "raiz_petroleo" ||
        palette === "raiz_niebla" ||
        palette === "raiz_pino"
      ) {
        const isSelva = isSelvaStyle(palette as PaletteId);
        const isPetroleo = palette === "raiz_petroleo";
        const isHelechoPalette = palette === "raiz_helecho";
        const isNiebla = palette === "raiz_niebla";
        const isPino = palette === "raiz_pino";
        const jointTear = isNiebla || isPino || isSelva;
        const useSelvaDrip = isSelva || isHelechoPalette;
        const darkTitle = isNiebla || isPino;
        const titleInk = theme.titleLetters ?? theme.text ?? NIEBLA_BLACK;
        const selvaInk = theme.titleLetters ?? theme.accent ?? RAIZ_OXIDO;
        const selvaJointStroke =
          palette === "raiz_black" ? "#050504" : palette === "raiz_forest" ? "#7A4A32" : "#3D2E24";
        return (
          <HelechoTitleRow
            letterColor={darkTitle ? titleInk : selvaInk}
            whiteBlink={palette === "raiz_petroleo" || (jointTear && !isHelechoPalette)}
            vColor={darkTitle ? titleInk : selvaInk}
            halo={darkTitle || isSelva ? "black" : "cyan"}
            dripVariant={
              isPino
                ? "pino"
                : useSelvaDrip
                  ? "selva"
                  : isPetroleo
                    ? "petroleo"
                    : jointTear
                      ? "niebla"
                      : "helecho"
            }
            scaleX={
              isSelva
                ? SELVA_TITLE_SCALE_X
                : isPetroleo
                  ? PETROLEO_TITLE_SCALE_X
                  : isHelechoPalette
                    ? HELECHO_TITLE_SCALE_X
                    : isNiebla
                      ? NIEBLA_TITLE_SCALE_X
                      : jointTear
                        ? PINO_TITLE_SCALE_X
                        : undefined
            }
            letterGap={
              isPetroleo
                ? ESMERALDA_TITLE_LETTER_GAP
                : isNiebla
                  ? NIEBLA_TITLE_LETTER_GAP
                  : undefined
            }
            jointTearColor={
              isPino
                ? NIEBLA_BLACK
                : isNiebla
                  ? MEZCLA_RED
                  : isSelva
                    ? (theme.accent ?? selvaInk)
                    : undefined
            }
            jointTearStroke={isPino ? "#052525" : isSelva ? selvaJointStroke : undefined}
            selvaCamoInk={isHelechoPalette ? HELECHO_BG : isSelva ? theme.bg : undefined}
            selvaDropInk={isHelechoPalette ? HELECHO_CYAN : undefined}
          />
        );
      }
      if (palette.startsWith("raiz")) {
        return (
          <TitleRow
            fontFamily={display}
            letterColor={theme.titleLetters ?? theme.greenLight}
            letterSpacing={ls}
            v={<RaizBlinkV greenDark={theme.greenDark} />}
          />
        );
      }
      return (
        <TitleRow
          fontFamily={display}
          letterColor={LIT_LETTERS}
          letterSpacing={ls}
          v={<BlinkV color={LIT_V} />}
        />
      );
    }
  }
}
