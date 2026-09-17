import type { PaletteTheme } from "../../theme/palettes";
import { PETROLEO_PHOTOS } from "../../assets/petroleoPhotos";
import { isRaizPremium, slideText } from "../../theme/palettes";
import { GREEN_PETROLEO } from "../../theme/swap";
import { fontBody, fontDisplay } from "./slideStyles";
import { SlideShell } from "./shared";
import { useIsMobile } from "../../hooks/useIsMobile";

const SYNOPSIS_TEXT = `Tres hombres viven atrapados por una vida automática, rutinaria y correcta. La anestesia, que en su día fue su salvación, ahora gira en sentido contrario y será su quiebra. En su visita «al bosque» descubrirán nuevas puertas donde la honestidad es más feroz que las mentiras sociales: deberán abrir los ojos, silenciar el miedo y escucharse de verdad. Experiencia teatral hipnótica sobre el colapso de las estructuras que nos enseñaron y la búsqueda de la honestidad fuera de las reglas —hasta descubrir, sin máscara, tu propio MORVO.`;

const FOREST_IMG = "https://picsum.photos/id/15/1600/900";

/**
 * a = lavado petróleo denso
 * b = foto más visible + velo de lectura
 * c = fondo negro (como personajes)
 * d = foto en negativo + velo suave
 */
type SynopsisVariant = "a" | "b" | "c" | "d";

const PETROLEO_SYNOPSIS_BLACK = "#000000";

function synopsisVariant(): SynopsisVariant {
  if (typeof window === "undefined") return "d";
  const v = new URLSearchParams(window.location.search).get("synopsis");
  if (v === "a" || v === "b" || v === "c" || v === "d") return v;
  return "d";
}

type Props = { theme: PaletteTheme };

function SynopsisContent({
  theme,
  text,
  mobile,
  strongTextShadow = false,
}: {
  theme: PaletteTheme;
  text: string;
  mobile: boolean;
  strongTextShadow?: boolean;
}) {
  const shadow = strongTextShadow
    ? "0 1px 2px rgba(0,0,0,0.75), 0 2px 14px rgba(0,0,0,0.45)"
    : undefined;

  return (
    <>
      <h2
        style={{
          position: mobile ? "relative" : "absolute",
          top: 0,
          left: 0,
          right: 0,
          margin: 0,
          paddingTop: mobile ? 48 : "clamp(48px, 8vh, 72px)",
          paddingBottom: mobile ? 8 : 0,
          textAlign: "center",
          fontFamily: fontDisplay(theme),
          fontWeight: 700,
          fontSize: mobile ? 22 : "clamp(26px, 3.5vw, 44px)",
          color: text,
          letterSpacing: "0.14em",
          zIndex: 5,
          textShadow: shadow,
        }}
      >
        Sinopsis
      </h2>
      <div
        style={{
          position: mobile ? "relative" : "absolute",
          inset: mobile ? undefined : 0,
          flex: mobile ? 1 : undefined,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: mobile
            ? "16px 24px 40px"
            : "clamp(100px, 14vh, 120px) clamp(56px, 10vw, 120px) clamp(48px, 8vh, 72px)",
          boxSizing: "border-box",
          overflow: mobile ? "auto" : undefined,
          zIndex: 5,
        }}
      >
        <p
          style={{
            margin: 0,
            maxWidth: mobile ? "100%" : "min(720px, 78%)",
            fontFamily: fontBody(theme),
            fontSize: mobile ? 15 : "clamp(15px, 1.55vw, 22px)",
            lineHeight: 1.7,
            color: text,
            opacity: strongTextShadow ? 0.98 : 0.95,
            textAlign: "center",
            whiteSpace: "pre-line",
            textShadow: shadow,
          }}
        >
          {SYNOPSIS_TEXT}
        </p>
      </div>
    </>
  );
}

function PetroleoVeil({ variant }: { variant: "a" | "b" }) {
  if (variant === "a") {
    return (
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: `linear-gradient(180deg, ${GREEN_PETROLEO}e6 0%, ${GREEN_PETROLEO}d9 45%, ${GREEN_PETROLEO}e0 100%)`,
        }}
      />
    );
  }

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        background: [
          `linear-gradient(180deg, ${GREEN_PETROLEO}99 0%, ${GREEN_PETROLEO}66 40%, ${GREEN_PETROLEO}88 100%)`,
          `radial-gradient(ellipse 68% 52% at 50% 50%, ${GREEN_PETROLEO}e8 0%, ${GREEN_PETROLEO}aa 48%, transparent 76%)`,
        ].join(", "),
      }}
    />
  );
}

export function SynopsisSlide({ theme }: Props) {
  const text = slideText(theme);
  const mobile = useIsMobile();
  const isPetroleo = theme.id === "raiz_petroleo";
  const variant = isPetroleo ? synopsisVariant() : "a";

  /* C: mismo negro que CharacterSlide — texto salmón, sin foto */
  if (isPetroleo && variant === "c") {
    return (
      <SlideShell
        theme={theme}
        index="03"
        background={PETROLEO_SYNOPSIS_BLACK}
      >
        <SynopsisContent theme={theme} text={text} mobile={mobile} />
      </SlideShell>
    );
  }

  /* D: foto en negativo + velo oscuro suave para legibilidad del salmón */
  if (isPetroleo && variant === "d") {
    return (
      <SlideShell
        theme={theme}
        index="03"
        background={PETROLEO_SYNOPSIS_BLACK}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${PETROLEO_PHOTOS.sinopsis})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "invert(1) contrast(1.05)",
            opacity: 0.55,
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background: [
              "radial-gradient(ellipse 70% 55% at 50% 48%, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.2) 55%, transparent 78%)",
              "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.3) 100%)",
            ].join(", "),
          }}
        />
        <SynopsisContent
          theme={theme}
          text={text}
          mobile={mobile}
          strongTextShadow
        />
      </SlideShell>
    );
  }

  if (isRaizPremium(theme)) {
    const bg = theme.bg;
    const bgImg = isPetroleo ? PETROLEO_PHOTOS.sinopsis : FOREST_IMG;
    return (
      <SlideShell theme={theme} index="03">
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${bgImg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {isPetroleo ? (
          <PetroleoVeil variant={variant === "b" ? "b" : "a"} />
        ) : (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `${bg}cc`,
            }}
          />
        )}
        <SynopsisContent
          theme={theme}
          text={text}
          mobile={mobile}
          strongTextShadow={isPetroleo && variant === "b"}
        />
      </SlideShell>
    );
  }

  return (
    <SlideShell theme={theme} index="03">
      <SynopsisContent theme={theme} text={text} mobile={mobile} />
    </SlideShell>
  );
}
