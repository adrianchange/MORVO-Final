import { motion } from "framer-motion";
import {
  MorvoTeaserTitleHeadline,
  TEASER_CREDIT_DARK_BLUE,
  TEASER_CREDIT_MATCH_RED,
  TEASER_CREDIT_MATCH_RED_DARK,
} from "./MorvoTeaserTitle";
import { useIsMobile } from "../hooks/useIsMobile";
import { PALETTES } from "../theme/palettes";
import { fontDisplay } from "../theme/typography";

/** Fondo limpio (sin texto quemado) del cierre Teaser_v09 */
export const V09_FINAL_CLEAN_BG = "/images/teaser/teaser-v09-final-clean.png";
/** Fondo del cierre del teaser MORVO-Final */
export const MORVO_FINAL_CREDITS_BG = "/images/teaser/morvo-final-paris-bilal.png";

function creditsBgUrl(): string | null {
  if (typeof window === "undefined") return V09_FINAL_CLEAN_BG;
  const bg = new URLSearchParams(window.location.search).get("bg");
  if (bg === "transparent") return null;
  return bg === "morvo-final" ? MORVO_FINAL_CREDITS_BG : V09_FINAL_CLEAN_BG;
}

const TEASER_CREDIT_BLUE_MID = "#243D5C";
const TEASER_CREDIT_BLUE_LIGHT = "#3A5A7A";

const TEASER_CAST = [
  { character: "Mario", actorLines: ["Javier", "Estévez"] as const },
  { character: "Víctor", actorLines: ["Adrian", "Popovici"] as const },
  { character: "Cristian", actorLines: ["Ciprian", "Gheorghe"] as const },
] as const;

const CAST_ROW_OPACITY = [0.86, 1, 0.9, 1, 0.88, 1] as const;

const castRowFlickerTransition = (delay: number) => ({
  duration: 3.4,
  repeat: Infinity,
  ease: "easeInOut" as const,
  delay,
  repeatDelay: 0.2,
});

function CastCreditColumn({
  character,
  actorLines,
  font,
  delay,
  isMobile,
}: {
  character: string;
  actorLines: readonly string[];
  font: string;
  delay: number;
  isMobile: boolean;
}) {
  const rowTransition = castRowFlickerTransition(delay);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.94, filter: "blur(5px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.9, delay: delay - 0.35, ease: [0.16, 1, 0.3, 1] }}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        gap: "clamp(2px, 0.45cqh, 5px)",
        textAlign: "center",
        minWidth: 0,
        width: "100%",
        height: "100%",
      }}
    >
      <motion.div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "inherit",
          width: "100%",
        }}
        animate={{ opacity: [...CAST_ROW_OPACITY] }}
        transition={rowTransition}
      >
        <motion.span
          style={{
            fontFamily: font,
            fontSize: isMobile
              ? "clamp(7px, min(3.5cqw, 5cqh), 14px)"
              : "clamp(8px, min(3.6cqw, 5.2cqh), 17px)",
            fontWeight: 600,
            letterSpacing: "0.03em",
            color: TEASER_CREDIT_DARK_BLUE,
            lineHeight: 1.15,
            minHeight: "1.15em",
          }}
          animate={{
            textShadow: [
              `0 0 8px ${TEASER_CREDIT_DARK_BLUE}66`,
              `0 0 16px ${TEASER_CREDIT_BLUE_MID}cc, 0 0 28px ${TEASER_CREDIT_BLUE_LIGHT}55`,
              `0 0 6px ${TEASER_CREDIT_DARK_BLUE}55`,
              `0 0 14px ${TEASER_CREDIT_BLUE_MID}bb, 0 0 24px ${TEASER_CREDIT_BLUE_LIGHT}44`,
              `0 0 8px ${TEASER_CREDIT_DARK_BLUE}77`,
              `0 0 12px ${TEASER_CREDIT_BLUE_MID}aa, 0 0 20px ${TEASER_CREDIT_BLUE_LIGHT}33`,
            ],
          }}
          transition={rowTransition}
        >
          {character}
        </motion.span>
        <motion.span
          aria-hidden
          style={{
            fontFamily: font,
            fontSize: "clamp(4px, min(1.2cqw, 1.8cqh), 8px)",
            lineHeight: 1,
            letterSpacing: "0.08em",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
          animate={{
            color: [
              `${TEASER_CREDIT_BLUE_MID}59`,
              `${TEASER_CREDIT_BLUE_LIGHT}d9`,
              `${TEASER_CREDIT_BLUE_MID}66`,
              `${TEASER_CREDIT_BLUE_LIGHT}e6`,
              `${TEASER_CREDIT_BLUE_MID}61`,
              `${TEASER_CREDIT_BLUE_LIGHT}c4`,
            ],
          }}
          transition={rowTransition}
        >
          <span>·</span>
          <span>·</span>
          <span>·</span>
        </motion.span>
        <motion.span
          style={{
            fontFamily: font,
            fontSize: isMobile
              ? "clamp(6px, min(2.8cqw, 4cqh), 11px)"
              : "clamp(7px, min(3.2cqw, 4.6cqh), 15px)",
            fontWeight: 700,
            letterSpacing: isMobile ? "0.05em" : "0.08em",
            textTransform: "uppercase",
            lineHeight: 1.2,
            maxWidth: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0,
            minHeight: "2.4em",
            color: TEASER_CREDIT_DARK_BLUE,
          }}
          animate={{
            color: [
              `${TEASER_CREDIT_DARK_BLUE}d1`,
              TEASER_CREDIT_BLUE_LIGHT,
              `${TEASER_CREDIT_DARK_BLUE}db`,
              TEASER_CREDIT_BLUE_MID,
              `${TEASER_CREDIT_DARK_BLUE}cc`,
              `${TEASER_CREDIT_BLUE_LIGHT}f2`,
            ],
            textShadow: [
              `0 0 6px ${TEASER_CREDIT_DARK_BLUE}33`,
              `0 0 14px ${TEASER_CREDIT_BLUE_MID}aa, 0 0 26px ${TEASER_CREDIT_BLUE_LIGHT}66`,
              `0 0 4px ${TEASER_CREDIT_DARK_BLUE}22`,
              `0 0 12px ${TEASER_CREDIT_BLUE_MID}99, 0 0 22px ${TEASER_CREDIT_BLUE_LIGHT}55`,
              `0 0 5px ${TEASER_CREDIT_DARK_BLUE}28`,
              `0 0 10px ${TEASER_CREDIT_BLUE_MID}77`,
            ],
          }}
          transition={rowTransition}
        >
          {actorLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </motion.span>
      </motion.div>
    </motion.div>
  );
}

/** Mismos título + créditos animados que el cierre del teaser MORVO-Final (Petróleo). */
export function FinalCreditsOverlay({
  font,
  transparentBg = false,
}: {
  font: string;
  transparentBg?: boolean;
}) {
  const isMobile = useIsMobile();

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 2,
        containerType: "size",
        padding: isMobile
          ? "clamp(6px, 2cqh, 14px) clamp(8px, 3cqw, 20px) clamp(14%, 18cqh, 26%)"
          : "clamp(8px, 3cqh, 20px) clamp(10px, 4cqw, 28px) clamp(16%, 20cqh, 28%)",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: isMobile ? "clamp(10px, 3.5cqh, 18px)" : "clamp(12px, 4cqh, 28px)",
        overflow: "hidden",
        transform: "translateY(10px)",
      }}
    >
      {!transparentBg ? (
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.18)",
            pointerEvents: "none",
          }}
        />
      ) : null}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          flex: "0 0 auto",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MorvoTeaserTitleHeadline
          font={font}
          sizeUnit="cq"
          titleColor={TEASER_CREDIT_MATCH_RED}
          titleDarkColor={TEASER_CREDIT_MATCH_RED_DARK}
          titleFlicker="default"
          centerCredit
        />
      </div>
      <div
        style={{
          position: "relative",
          zIndex: 1,
          flex: "0 0 auto",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: isMobile ? "clamp(2px, 1.2cqw, 6px)" : "clamp(8px, 3.2cqw, 22px)",
            width: isMobile ? "min(96%, 320px)" : "min(88%, 520px)",
            marginLeft: 0,
            alignItems: "start",
            transform: "translateY(5px)",
            paddingBottom: 0,
          }}
        >
          {TEASER_CAST.map(({ character, actorLines }, i) => (
            <CastCreditColumn
              key={character}
              character={character}
              actorLines={actorLines}
              font={font}
              delay={0.55 + i * 0.48}
              isMobile={isMobile}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

/** Vista fija 16:9 — placa final Teaser_v09 + créditos animados (export MOV). */
export function RecordV09CreditsEnd() {
  const theme = PALETTES.raiz_petroleo;
  const font = fontDisplay(theme);
  const bgSrc = creditsBgUrl();
  const transparent = bgSrc === null;

  return (
    <div
      data-record-ready="1"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        background: transparent ? "transparent" : "#000",
        overflow: "hidden",
        containerType: "size",
      }}
    >
      {bgSrc ? (
        <img
          src={bgSrc}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
      ) : null}
      <FinalCreditsOverlay font={font} transparentBg={transparent} />
    </div>
  );
}
