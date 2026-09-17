import { motion } from "motion/react";

import type { PaletteTheme } from "../../theme/palettes";

import { isHelechoStyle, isSelvaStyle, slideText } from "../../theme/palettes";
import {
  ESMERALDA_TITLE_FONT_SIZE,
  HELECHO_TITLE_FONT,
  HELECHO_TITLE_FONT_SIZE,
  HELECHO_TITLE_SCALE_X,
  HELECHO_TITLE_STYLE,
  NIEBLA_TITLE_FONT_SIZE,
  PETROLEO_TITLE_FONT_SIZE,
  SELVA_TITLE_SCALE_X,
} from "../../theme/typography";
import { useCoverCreditTypography } from "../../hooks/useCoverCreditTypography";

import {
  GREEN_PINO,
  GREEN_PINO_LIGHT,
  MEZCLA_RED,
  MEZCLA_TITLE_BAND_BG,
} from "../../theme/swap";

import {
  CoverTitle,
  CoverCreditWrap,
  EsmeraldaSalmonCredit,
  HelechoChartreuseCredit,
  NieblaDropCredit,
  ObscenaTeatralHeader,
  PinoDropCredit,
  SelvaDropCredit,
  InvertidaCredit,
  RaizCredit,
  TierraCredit,
} from "../CoverTitle";
import { MorvoTeaserTitleHeadline, ESMERALDA_SALMON, ESMERALDA_SALMON_DARK, MORVO_RED } from "../MorvoTeaserTitle";

import { fontBody, fontDisplay, mutedTextStyle } from "./slideStyles";
import { slideRootStyle } from "./shared";



const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`;


/** Pasillo verde Mainak Bose — portada Forest terroso negro y frases del teaser */
const TEASER_MAINAK_BOSE_COVER = "/images/teaser/teaser-cover-mainak-bose.jpg";

/** Arcos mint Paris Bilal — portada Raíz Petróleo/Esmeralda y teaser */
const TEASER_PARIS_BILAL_COVER = "/images/teaser/teaser-cover-paris-bilal-arches.jpg";



function Grain({ light }: { light?: boolean }) {

  return (

    <div

      className="absolute inset-0 pointer-events-none z-10"

      style={{

        backgroundImage: GRAIN_SVG,

        backgroundRepeat: "repeat",

        backgroundSize: "256px 256px",

        opacity: light ? 0.04 : 0.07,

        mixBlendMode: light ? "multiply" : "overlay",

      }}

    />

  );

}



type CoverSlideProps = {

  theme: PaletteTheme;

};



/**

 * MEZCLA portada: fondo verde esmeralda fijo (igual que slides 02–07), sin alternar.

 */

function MezclaCoverSwap({ theme }: CoverSlideProps) {
  const fg = slideText(theme);
  const lineGrad = `linear-gradient(90deg, transparent, ${fg} 30%, ${fg} 70%, transparent)`;
  return (
    <div style={slideRootStyle(theme)}>
      <Grain light />
      <ObscenaTeatralHeader color={fg} />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: 1,
          zIndex: 20,
          background: lineGrad,
          opacity: 0.45,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: 1,
          zIndex: 20,
          background: lineGrad,
          opacity: 0.35,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 20,
          display: "flex",
          width: "100%",
          height: "100%",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(24px, 6vh, 88px) clamp(20px, 6vw, 140px)",
          boxSizing: "border-box",
          gap: "clamp(20px, 3.5vh, 40px)",
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
          style={{
            display: "flex",
            justifyContent: "center",
            fontFamily: fontDisplay(theme),
            fontWeight: 900,
            fontSize: "clamp(60px, 11vw, 170px)",
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          <CoverTitle palette={theme.id} />
        </motion.div>
        <MezclaBlackCredit />
      </div>
    </div>
  );

}



function MezclaCoverBand({ theme }: CoverSlideProps) {
  const text = slideText(theme);

  const line = theme.line;



  return (
    <div style={slideRootStyle(theme)}>
      <Grain light />
      <ObscenaTeatralHeader color={text} />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: 1,
          zIndex: 20,
          background: `linear-gradient(90deg, transparent, ${line} 30%, ${line} 70%, transparent)`,
          opacity: 0.45,
        }}
      />

      <div

        className="absolute bottom-0 left-0 w-full h-px z-20"

        style={{

          background: `linear-gradient(90deg, transparent, ${line} 30%, ${line} 70%, transparent)`,

          opacity: 0.35,

        }}

      />

      <div

        className="absolute top-6 left-8 z-20"

        style={{

          fontFamily: fontDisplay(theme),

          color: text,

          opacity: 0.7,

          fontSize: "clamp(10px,1vw,14px)",

          letterSpacing: "0.3em",

        }}

      >

        01

      </div>

      <div

        className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"

        style={{

          padding: "clamp(24px, 6vh, 88px) clamp(20px, 6vw, 140px)",

          boxSizing: "border-box",

        }}

      >

        <div

          className="flex flex-col items-center pointer-events-auto"

          style={{ gap: "clamp(8px,2vh,28px)", width: "100%", textAlign: "center" }}

        >

          <motion.div

            initial={{ opacity: 0, y: -10 }}

            animate={{ opacity: 1, y: 0 }}

            transition={{ duration: 1.2, delay: 0.3 }}

            style={{

              fontFamily: fontBody(theme),

              color: text,

              opacity: 0.55,

              fontSize: "clamp(9px,1vw,14px)",

              letterSpacing: "0.5em",

              textTransform: "uppercase",

            }}

          >

            una obra de teatro

          </motion.div>

          <motion.div

            initial={{ opacity: 0, scale: 0.96 }}

            animate={{ opacity: 1, scale: 1 }}

            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}

            style={{

              background: MEZCLA_TITLE_BAND_BG,

              padding:

                "clamp(16px,2.5vh,32px) clamp(24px,5vw,72px) clamp(18px,2.8vh,36px)",

              display: "flex",

              justifyContent: "center",

              width: "min(100%, clamp(320px,72vw,920px))",

              boxShadow: "0 8px 48px rgba(0,0,0,0.45)",

            }}

          >

            <div

              style={{

                fontFamily: fontDisplay(theme),

                fontWeight: 900,

                fontSize: "clamp(60px,11vw,170px)",

                lineHeight: 1,

              }}

            >

              <CoverTitle palette={theme.id} />

            </div>

          </motion.div>

          <motion.div

            initial={{ scaleX: 0 }}

            animate={{ scaleX: 1 }}

            transition={{ duration: 1.2, delay: 1.0 }}

            style={{

              width: "clamp(120px,18vw,280px)",

              height: 1,

              background: `linear-gradient(90deg, transparent, ${line}, transparent)`,

              opacity: 0.5,

              transformOrigin: "center",

            }}

          />

          <motion.div

            initial={{ opacity: 0, y: 10 }}

            animate={{ opacity: 1, y: 0 }}

            transition={{ duration: 1.2, delay: 1.2 }}

            className="text-center px-8"

            style={{

              fontFamily: fontBody(theme),

              fontStyle: "italic",

              color: text,

              opacity: 0.75,

              fontSize: "clamp(11px,1.4vw,20px)",

              letterSpacing: "0.12em",

              maxWidth: "clamp(280px,40vw,600px)",

            }}

          >

            [TAGLINE DE LA OBRA — breve, ritual, perturbadora]

          </motion.div>

        </div>

      </div>

      <div

        className="absolute bottom-6 left-8 z-20"

        style={{

          fontFamily: fontDisplay(theme),

          color: text,

          opacity: 0.65,

          fontSize: "clamp(9px,0.85vw,12px)",

          letterSpacing: "0.3em",

        }}

      >

        2026

      </div>

      <div

        className="absolute bottom-6 right-8 z-20"

        style={{

          fontFamily: fontBody(theme),

          color: text,

          opacity: 0.45,

          fontSize: "clamp(9px,0.85vw,12px)",

          letterSpacing: "0.2em",

        }}

      >

        [DURACIÓN] min

      </div>

    </div>

  );

}



const litNeonBlinkTransition = {
  duration: 1.1,
  repeat: Infinity,
  ease: "easeInOut" as const,
  times: [0, 0.06, 0.12, 0.2, 0.3, 0.42, 0.52, 0.65, 0.75, 0.88, 1],
  repeatDelay: 0.08,
};

const LIT_NEON_BRIGHT = "rgba(160,255,220,1)";
const LIT_NEON_MID = "rgba(100,255,190,0.95)";
const LIT_NEON_DIM = "rgba(26,58,63,0.35)";

function LiturgicoNeonCredit() {
  const { textStyle } = useCoverCreditTypography(GREEN_PINO_LIGHT);
  return (
    <CoverCreditWrap>
      <motion.p
        style={textStyle}
        initial={{ opacity: 0 }}
        animate={{
          opacity: [1, 0.1, 1, 0.2, 1, 0.04, 1, 0.35, 1, 0.08, 1],
          color: [
            GREEN_PINO_LIGHT,
            "#E8F2E8",
            GREEN_PINO,
            GREEN_PINO_LIGHT,
            "#D4E0D0",
            GREEN_PINO_LIGHT,
            "#B8D4C4",
            GREEN_PINO_LIGHT,
          ],
          textShadow: [
            `0 0 14px ${LIT_NEON_BRIGHT}, 0 0 30px ${LIT_NEON_MID}, 0 0 55px ${LIT_NEON_MID}`,
            `0 0 4px ${LIT_NEON_DIM}`,
            `0 0 22px ${LIT_NEON_BRIGHT}, 0 0 44px ${LIT_NEON_MID}, 0 0 75px rgba(100,255,190,0.65)`,
            `0 0 6px ${LIT_NEON_DIM}`,
            `0 0 18px ${LIT_NEON_BRIGHT}, 0 0 36px ${LIT_NEON_MID}, 0 0 60px ${LIT_NEON_MID}`,
            `0 0 5px ${LIT_NEON_DIM}`,
            `0 0 26px ${LIT_NEON_BRIGHT}, 0 0 50px ${LIT_NEON_MID}`,
            `0 0 8px ${LIT_NEON_DIM}`,
            `0 0 16px ${LIT_NEON_BRIGHT}, 0 0 38px ${LIT_NEON_MID}`,
            `0 0 6px ${LIT_NEON_DIM}`,
            `0 0 20px ${LIT_NEON_BRIGHT}, 0 0 42px ${LIT_NEON_MID}`,
          ],
        }}
        transition={{
          opacity: { ...litNeonBlinkTransition, delay: 0.8 },
          color: litNeonBlinkTransition,
          textShadow: litNeonBlinkTransition,
        }}
      >
        Naz Montés
      </motion.p>
    </CoverCreditWrap>
  );
}

const HOSP_NEON_BRIGHT = "rgba(255,200,200,0.95)";
const HOSP_NEON_MID = "rgba(200,80,100,0.9)";
const HOSP_NEON_DIM = "rgba(107,16,32,0.35)";

const MEZ_BLACK = "#0A0A08";
const MEZ_BLACK_GLOW = "rgba(0,0,0,0.85)";
const MEZ_BLACK_GLOW_MID = "rgba(10,10,8,0.5)";

function MezclaBlackCredit() {
  const { textStyle } = useCoverCreditTypography(MEZ_BLACK);
  return (
    <CoverCreditWrap>
      <motion.p
        style={textStyle}
        initial={{ opacity: 0 }}
        animate={{
          opacity: [1, 0.1, 1, 0.2, 1, 0.04, 1, 0.35, 1, 0.08, 1],
          color: [MEZ_BLACK, "#1A1A16", MEZ_BLACK, "#121210", MEZ_BLACK, "#222220", MEZ_BLACK],
          textShadow: [
            `0 0 16px ${MEZ_BLACK_GLOW}, 0 0 32px ${MEZ_BLACK_GLOW_MID}`,
            `0 0 4px rgba(0,0,0,0.25)`,
            `0 0 24px ${MEZ_BLACK_GLOW}, 0 0 44px ${MEZ_BLACK_GLOW_MID}`,
            `0 0 6px rgba(0,0,0,0.2)`,
            `0 0 20px ${MEZ_BLACK_GLOW}, 0 0 38px ${MEZ_BLACK_GLOW_MID}`,
            `0 0 5px rgba(0,0,0,0.2)`,
            `0 0 28px ${MEZ_BLACK_GLOW}, 0 0 48px ${MEZ_BLACK_GLOW_MID}`,
          ],
        }}
        transition={{
          opacity: { ...litNeonBlinkTransition, delay: 0.8 },
          color: litNeonBlinkTransition,
          textShadow: litNeonBlinkTransition,
        }}
      >
        Naz Montés
      </motion.p>
    </CoverCreditWrap>
  );
}

function HospitalRedNeonCredit() {
  const { textStyle } = useCoverCreditTypography(MEZCLA_RED);
  return (
    <CoverCreditWrap>
      <motion.p
        style={textStyle}
        initial={{ opacity: 0 }}
        animate={{
          opacity: [1, 0.1, 1, 0.2, 1, 0.04, 1, 0.35, 1, 0.08, 1],
          color: [
            MEZCLA_RED,
            "#C44A58",
            MEZCLA_RED,
            "#9E2838",
            MEZCLA_RED,
            "#D45A6A",
            MEZCLA_RED,
          ],
          textShadow: [
            `0 0 14px ${HOSP_NEON_BRIGHT}, 0 0 30px ${HOSP_NEON_MID}, 0 0 50px ${HOSP_NEON_MID}`,
            `0 0 4px ${HOSP_NEON_DIM}`,
            `0 0 22px ${HOSP_NEON_BRIGHT}, 0 0 42px ${HOSP_NEON_MID}`,
            `0 0 6px ${HOSP_NEON_DIM}`,
            `0 0 18px ${HOSP_NEON_BRIGHT}, 0 0 36px ${HOSP_NEON_MID}`,
            `0 0 5px ${HOSP_NEON_DIM}`,
            `0 0 26px ${HOSP_NEON_BRIGHT}, 0 0 48px ${HOSP_NEON_MID}`,
            `0 0 8px ${HOSP_NEON_DIM}`,
            `0 0 20px ${HOSP_NEON_BRIGHT}, 0 0 40px ${HOSP_NEON_MID}`,
          ],
        }}
        transition={{
          opacity: { ...litNeonBlinkTransition, delay: 0.8 },
          color: litNeonBlinkTransition,
          textShadow: litNeonBlinkTransition,
        }}
      >
        Naz Montés
      </motion.p>
    </CoverCreditWrap>
  );
}

/** Portada Hospital: solo MORVO + crédito, centrado */
function HospitalCover({ theme }: CoverSlideProps) {
  const line = theme.line;
  const fg = slideText(theme);

  return (
    <div style={slideRootStyle(theme)}>
      <Grain />
      <ObscenaTeatralHeader color={fg} />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: 1,
          zIndex: 20,
          background: `linear-gradient(90deg, transparent, ${line} 30%, ${line} 70%, transparent)`,
          opacity: 0.35,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: 1,
          zIndex: 20,
          background: `linear-gradient(90deg, transparent, ${line} 30%, ${line} 70%, transparent)`,
          opacity: 0.25,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 20,
          display: "flex",
          width: "100%",
          height: "100%",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(24px, 6vh, 88px) clamp(20px, 6vw, 140px)",
          boxSizing: "border-box",
          gap: "clamp(20px, 3.5vh, 40px)",
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
          style={{
            display: "flex",
            justifyContent: "center",
            fontFamily: fontDisplay(theme),
            fontWeight: 900,
            fontSize: "clamp(60px, 11vw, 170px)",
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          <CoverTitle palette={theme.id} />
        </motion.div>
        <HospitalRedNeonCredit />
      </div>
    </div>
  );
}

/** Portada Raíz: bosque salvaje + crédito óxido, centrado */
function RaizCover({ theme }: CoverSlideProps) {
  const fg = slideText(theme);

  const isHelecho = isHelechoStyle(theme);
  const isSelva = isSelvaStyle(theme.id);
  const isPetroleo = theme.id === "raiz_petroleo";
  const isRaizBlack = theme.id === "raiz_black";
  const isEsmeralda = theme.id === "raiz_esmeralda";
  const isMorvoPhotoCover = isPetroleo || isRaizBlack || isEsmeralda;
  const coverBgImage =
    isPetroleo || isEsmeralda ? TEASER_PARIS_BILAL_COVER : TEASER_MAINAK_BOSE_COVER;
  const coverAccent = isRaizBlack ? MORVO_RED : isEsmeralda || isPetroleo ? ESMERALDA_SALMON : fg;
  /** Portada esmeralda: velo verde pino (no el mint del resto del dossier) */
  const coverOverlayBg = isEsmeralda ? GREEN_PINO : theme.bg;
  const isHelechoPalette = theme.id === "raiz_helecho";
  const isNiebla = theme.id === "raiz_niebla";
  const isPino = theme.id === "raiz_pino";
  const useSelvaDropCredit = isSelva || isHelechoPalette;
  const usesEsmeraldaTitleSize = isPetroleo;
  const titleCreditGap =
    isPino || isNiebla || isMorvoPhotoCover || useSelvaDropCredit
      ? 0
      : "clamp(20px, 3.5vh, 40px)";
  const lineGrad = `linear-gradient(90deg, transparent, ${isMorvoPhotoCover ? coverAccent : fg} 30%, ${isMorvoPhotoCover ? coverAccent : fg} 70%, transparent)`;

  return (
    <div
      style={{
        ...slideRootStyle(theme),
        overflow: isHelecho ? "visible" : undefined,
        ...(isMorvoPhotoCover ? { background: "transparent" } : {}),
      }}
    >
      {isMorvoPhotoCover && (
        <>
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${coverBgImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background: `${coverOverlayBg}88`,
            }}
          />
        </>
      )}
      <Grain light />
      <ObscenaTeatralHeader color={isMorvoPhotoCover ? coverAccent : fg} />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: 1,
          zIndex: 20,
          background: lineGrad,
          opacity: 0.4,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: 1,
          zIndex: 20,
          background: lineGrad,
          opacity: 0.3,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 20,
          display: "flex",
          width: "100%",
          height: "100%",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(24px, 6vh, 88px) clamp(20px, 6vw, 140px)",
          boxSizing: "border-box",
          gap: titleCreditGap,
          textAlign: "center",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: titleCreditGap,
            width: isSelva ? "100%" : "min(100%, 820px)",
            overflow: isHelecho ? "visible" : undefined,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              userSelect: "none",
              overflow: "visible",
              ...(isMorvoPhotoCover
                ? { position: "relative", zIndex: 2 }
                : isSelva || isHelechoPalette || isPino
                  ? { position: "relative", zIndex: 2 }
                  : {}),
              ...(!isMorvoPhotoCover
                ? {
                    fontFamily: fontDisplay(theme),
                    fontSize: usesEsmeraldaTitleSize
                      ? PETROLEO_TITLE_FONT_SIZE
                      : isHelecho
                        ? isNiebla
                          ? NIEBLA_TITLE_FONT_SIZE
                          : HELECHO_TITLE_FONT_SIZE
                        : ESMERALDA_TITLE_FONT_SIZE,
                    ...(usesEsmeraldaTitleSize
                      ? {
                          fontFamily: HELECHO_TITLE_FONT,
                          fontWeight: 900,
                          lineHeight: 1,
                          textTransform: "uppercase" as const,
                        }
                      : isHelecho
                        ? HELECHO_TITLE_STYLE
                        : { fontWeight: 900, lineHeight: 1 }),
                  }
                : {}),
            }}
          >
            {isMorvoPhotoCover ? (
              <MorvoTeaserTitleHeadline
                font={fontDisplay(theme)}
                sizeUnit="vw"
                creditColor={coverAccent}
                titleColor={
                  isEsmeralda || isPetroleo ? ESMERALDA_SALMON : undefined
                }
                titleDarkColor={
                  isEsmeralda || isPetroleo ? ESMERALDA_SALMON_DARK : undefined
                }
                titleFlicker="default"
                centerCredit
                creditDesktopOffsetY={-6}
              />
            ) : (
              <CoverTitle palette={theme.id} />
            )}
          </motion.div>
          {!isMorvoPhotoCover &&
            (theme.id === "raiz_esmeralda" ? (
              <EsmeraldaSalmonCredit />
            ) : theme.id === "raiz_pino" ? (
              <PinoDropCredit color={fg} />
            ) : isNiebla ? (
              <NieblaDropCredit color={fg} />
            ) : useSelvaDropCredit ? (
              <SelvaDropCredit
                color={isSelva ? (theme.titleLetters ?? fg) : fg}
                titleScaleX={isHelechoPalette ? HELECHO_TITLE_SCALE_X : SELVA_TITLE_SCALE_X}
              />
            ) : isHelecho ? (
              <HelechoChartreuseCredit color={fg} />
            ) : (
              <RaizCredit greenDark={theme.greenDark} greenLight={theme.greenLight} />
            ))}
        </div>
      </div>
    </div>
  );
}

/** Portada Podredumbre: solo MORVO + crédito (efecto V), centrado */
function TierraCover({ theme }: CoverSlideProps) {
  const line = theme.line;
  const fg = slideText(theme);

  return (
    <div style={slideRootStyle(theme)}>
      <Grain />
      <ObscenaTeatralHeader color={fg} />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: 1,
          zIndex: 20,
          background: `linear-gradient(90deg, transparent, ${line} 30%, ${line} 70%, transparent)`,
          opacity: 0.35,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: 1,
          zIndex: 20,
          background: `linear-gradient(90deg, transparent, ${line} 30%, ${line} 70%, transparent)`,
          opacity: 0.25,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 20,
          display: "flex",
          width: "100%",
          height: "100%",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(24px, 6vh, 88px) clamp(20px, 6vw, 140px)",
          boxSizing: "border-box",
          gap: "clamp(20px, 3.5vh, 40px)",
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
          style={{
            display: "flex",
            justifyContent: "center",
            fontFamily: fontDisplay(theme),
            fontWeight: 900,
            fontSize: "clamp(60px, 11vw, 170px)",
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          <CoverTitle palette={theme.id} />
        </motion.div>
        <TierraCredit />
      </div>
    </div>
  );
}

/** Portada Invertida: solo MORVO + crédito (efecto V), centrado */
function InvertidaCover({ theme }: CoverSlideProps) {
  const line = theme.line;
  const fg = slideText(theme);

  return (
    <div style={slideRootStyle(theme)}>
      <Grain />
      <ObscenaTeatralHeader color={fg} />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: 1,
          zIndex: 20,
          background: `linear-gradient(90deg, transparent, ${line} 30%, ${line} 70%, transparent)`,
          opacity: 0.35,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: 1,
          zIndex: 20,
          background: `linear-gradient(90deg, transparent, ${line} 30%, ${line} 70%, transparent)`,
          opacity: 0.35,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 20,
          display: "flex",
          width: "100%",
          height: "100%",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(24px, 6vh, 88px) clamp(20px, 6vw, 140px)",
          boxSizing: "border-box",
          gap: "clamp(20px, 3.5vh, 40px)",
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
          style={{
            display: "flex",
            justifyContent: "center",
            fontFamily: fontDisplay(theme),
            fontWeight: 700,
            fontSize: "clamp(60px, 11vw, 170px)",
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          <CoverTitle palette={theme.id} />
        </motion.div>
        <InvertidaCredit theme={theme} />
      </div>
    </div>
  );
}

/** Portada Litúrgico: solo MORVO + crédito, centrado como Mezcla */
function LiturgicoCover({ theme }: CoverSlideProps) {
  const fg = slideText(theme);
  const lineGrad = `linear-gradient(90deg, transparent, ${fg} 30%, ${fg} 70%, transparent)`;

  return (
    <div style={slideRootStyle(theme)}>
      <Grain light />
      <ObscenaTeatralHeader color={fg} />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: 1,
          zIndex: 20,
          background: lineGrad,
          opacity: 0.45,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: 1,
          zIndex: 20,
          background: lineGrad,
          opacity: 0.35,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 20,
          display: "flex",
          width: "100%",
          height: "100%",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "clamp(24px, 6vh, 88px) clamp(20px, 6vw, 140px)",
          boxSizing: "border-box",
          gap: "clamp(20px, 3.5vh, 40px)",
          textAlign: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
          style={{
            display: "flex",
            justifyContent: "center",
            fontFamily: fontDisplay(theme),
            fontWeight: 900,
            fontSize: "clamp(60px, 11vw, 170px)",
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          <CoverTitle palette={theme.id} />
        </motion.div>
        <LiturgicoNeonCredit />
      </div>
    </div>
  );
}

function StandardCover({ theme }: CoverSlideProps) {

  const text = slideText(theme);

  const titleShadow =

    theme.id === "invertida"

      ? "0 2px 40px rgba(107,16,32,0.45)"

      : theme.bg

        ? "0 2px 32px rgba(42,31,53,0.35)"

        : theme.id === "liturgico"

          ? "0 2px 40px rgba(42,31,53,0.5)"

          : "0 2px 40px rgba(0,0,0,0.4)";



  return (
    <div style={slideRootStyle(theme)}>
      <Grain light={Boolean(theme.bg)} />
      <ObscenaTeatralHeader color={text} />

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: 1,
          zIndex: 20,
          background: `linear-gradient(90deg, transparent, ${theme.line} 30%, ${theme.line} 70%, transparent)`,
          opacity: theme.id === "invertida" ? 0.35 : 1,
        }}
      />

      <div

        className="absolute bottom-0 left-0 w-full h-px z-20"

        style={{

          background: `linear-gradient(90deg, transparent, ${theme.line} 30%, ${theme.line} 70%, transparent)`,

          opacity: theme.id === "invertida" ? 0.35 : 0.5,

        }}

      />

      <div

        className="absolute top-6 left-8 z-20"

        style={{

          fontFamily: fontDisplay(theme),

          color: theme.bg ? text : theme.accent,

          opacity: theme.id === "invertida" ? 0.25 : theme.bg ? 0.7 : 0.5,

          fontSize: "clamp(10px,1vw,14px)",

          letterSpacing: "0.3em",

        }}

      >

        01

      </div>

      <div

        className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"

        style={{

          padding: "clamp(24px, 6vh, 88px) clamp(20px, 6vw, 140px)",

          boxSizing: "border-box",

        }}

      >

        <div

          className="flex flex-col items-center justify-center pointer-events-auto"

          style={{ gap: "clamp(8px,2vh,28px)", width: "100%", textAlign: "center" }}

        >

          <motion.div

            initial={{ opacity: 0, y: -10 }}

            animate={{ opacity: 1, y: 0 }}

            transition={{ duration: 1.2, delay: 0.3 }}

            style={{

              fontFamily: fontBody(theme),

              ...mutedTextStyle(theme, 0.55),

              fontSize: "clamp(9px,1vw,14px)",

              letterSpacing: "0.5em",

              textTransform: "uppercase",

            }}

          >

            una obra de teatro

          </motion.div>

          <motion.div

            initial={{ opacity: 0, scale: 0.96 }}

            animate={{ opacity: 1, scale: 1 }}

            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}

            style={{

              width: "100%",

              display: "flex",

              justifyContent: "center",

              fontFamily: fontDisplay(theme),

              fontWeight: 900,

              fontSize: "clamp(60px,11vw,170px)",

              lineHeight: 1,

              textShadow: titleShadow,

              userSelect: "none",

            }}

          >

            <CoverTitle palette={theme.id} />

          </motion.div>

          <motion.div

            initial={{ scaleX: 0 }}

            animate={{ scaleX: 1 }}

            transition={{ duration: 1.2, delay: 1.0 }}

            style={{

              width: "clamp(120px,18vw,280px)",

              height: 1,

              background: `linear-gradient(90deg, transparent, ${theme.line}, transparent)`,

              opacity: theme.id === "invertida" ? 0.35 : 1,

              transformOrigin: "center",

            }}

          />

          <motion.div

            initial={{ opacity: 0, y: 10 }}

            animate={{ opacity: 1, y: 0 }}

            transition={{ duration: 1.2, delay: 1.2 }}

            className="text-center px-8"

            style={{

              fontFamily: fontBody(theme),

              fontStyle: "italic",

              ...mutedTextStyle(theme, 0.75),

              fontSize: "clamp(11px,1.4vw,20px)",

              letterSpacing: "0.12em",

              maxWidth: "clamp(280px,40vw,600px)",

            }}

          >

            [TAGLINE DE LA OBRA — breve, ritual, perturbadora]

          </motion.div>

        </div>

      </div>

      <div

        className="absolute bottom-6 left-8 z-20"

        style={{

          fontFamily: fontDisplay(theme),

          color: theme.bg ? text : theme.accent,

          opacity: theme.id === "invertida" ? 0.25 : theme.bg ? 0.65 : 0.4,

          fontSize: "clamp(9px,0.85vw,12px)",

          letterSpacing: "0.3em",

        }}

      >

        2026

      </div>

      <div

        className="absolute bottom-6 right-8 z-20"

        style={{

          fontFamily: fontBody(theme),

          ...mutedTextStyle(theme, 0.45),

          fontSize: "clamp(9px,0.85vw,12px)",

          letterSpacing: "0.2em",

        }}

      >

        [DURACIÓN] min

      </div>

    </div>

  );

}



export function CoverSlide({ theme }: CoverSlideProps) {

  if (theme.id === "mezcla") {
    const mode = theme.mezclaCoverMode ?? "swap";
    return mode === "band" ? (
      <MezclaCoverBand key="mezcla-band" theme={theme} />
    ) : (
      <MezclaCoverSwap key="mezcla-swap" theme={theme} />
    );
  }

  if (theme.id === "liturgico") {
    return <LiturgicoCover key="liturgico-cover" theme={theme} />;
  }

  if (theme.id === "hospital") {
    return <HospitalCover key="hospital-cover" theme={theme} />;
  }

  if (theme.id === "tierra") {
    return <TierraCover key="tierra-cover" theme={theme} />;
  }

  if (theme.id === "invertida") {
    return <InvertidaCover key="invertida-cover" theme={theme} />;
  }

  if (theme.id.startsWith("raiz")) {
    return <RaizCover key={`${theme.id}-cover`} theme={theme} />;
  }

  return <StandardCover theme={theme} />;

}


