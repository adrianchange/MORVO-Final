import type { PaletteTheme } from "../../theme/palettes";
import { hasTeaserVideo, slideText } from "../../theme/palettes";
import { PETROLEO_SLIDE_BG } from "../../assets/petroleoPhotos";
import { fontBody, fontDisplay } from "./slideStyles";
import { MediaFrame, SlideShell } from "./shared";
import { useIsMobile } from "../../hooks/useIsMobile";
import { TeaserVideo } from "../TeaserVideo";

type Props = { theme: PaletteTheme };

const TEASER_SIDE_INSET =
  "calc(clamp(12px, 2vw, 28px) + clamp(40px, 4.5vw, 56px) + 15px)";

/** Margen lateral en móvil: flecha (~40px) + separación */
const MOBILE_TEASER_SIDE_INSET = "calc(12px + 40px + 12px)";

function petroleoTrialBg(theme: PaletteTheme): string | undefined {
  return theme.id === "raiz_petroleo" ? PETROLEO_SLIDE_BG : undefined;
}

function ContactBlock({
  label,
  value,
  text,
  theme,
  compact = false,
}: {
  label: string;
  value: string;
  text: string;
  theme: PaletteTheme;
  compact?: boolean;
}) {
  return (
    <div style={{ marginBottom: compact ? 10 : "clamp(14px, 2vh, 22px)" }}>
      <div
        style={{
          fontFamily: fontDisplay(theme),
          fontSize: compact ? 9 : "clamp(9px, 0.85vw, 11px)",
          letterSpacing: "0.28em",
          color: text,
          opacity: 0.55,
          marginBottom: 3,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: fontBody(theme),
          fontSize: compact ? 13 : "clamp(13px, 1.2vw, 17px)",
          color: text,
          opacity: 0.85,
          letterSpacing: "0.04em",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function SectionLabel({
  children,
  theme,
  text,
  compact = false,
}: {
  children: string;
  theme: PaletteTheme;
  text: string;
  compact?: boolean;
}) {
  return (
    <div
      style={{
        fontFamily: fontDisplay(theme),
        fontSize: compact ? 10 : "clamp(10px, 0.95vw, 12px)",
        letterSpacing: "0.32em",
        color: text,
        opacity: 0.6,
        marginBottom: compact ? 8 : "clamp(12px, 2vh, 18px)",
        textTransform: "uppercase",
      }}
    >
      {children}
    </div>
  );
}

function MobileTeaser({ theme, text }: { theme: PaletteTheme; text: string }) {
  const contactSectionStyle = {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    width: "100%",
    textAlign: "center" as const,
    gap: 0,
  };

  return (
    <SlideShell theme={theme} index="08" scrollable background={petroleoTrialBg(theme)}>
      <div
        style={{
          padding: `48px ${MOBILE_TEASER_SIDE_INSET} 48px`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 24,
        }}
      >
        <h2
          style={{
            margin: 0,
            textAlign: "center",
            fontFamily: fontDisplay(theme),
            fontWeight: 700,
            fontSize: 22,
            color: text,
            letterSpacing: "0.12em",
          }}
        >
          Teaser y Contacto
        </h2>

        {hasTeaserVideo(theme.id) ? (
          <TeaserVideo
            font={fontDisplay(theme)}
            accentColor={slideText(theme)}
            paletteId={theme.id}
            style={{ width: "100%", maxWidth: 480, aspectRatio: "16/9" }}
          />
        ) : (
          <MediaFrame
            theme={theme}
            label="[Vídeo teaser]"
            style={{ width: "100%", maxWidth: 480, aspectRatio: "16/9" }}
          />
        )}

        <div style={contactSectionStyle}>
          <SectionLabel theme={theme} text={text} compact>
            Contacto
          </SectionLabel>
          <ContactBlock compact theme={theme} label="DIRECCIÓN" value="Naz Montés" text={text} />
          <ContactBlock compact theme={theme} label="PRODUCCIÓN" value="Compañía OBSCENA Teatral" text={text} />
          <ContactBlock compact theme={theme} label="CONTACTO" value="[email@compañia.com]" text={text} />
          <ContactBlock compact theme={theme} label="WEB" value="[www.compañia.com]" text={text} />
        </div>

        <div
          style={{
            width: "60%",
            maxWidth: 220,
            height: 1,
            background: `linear-gradient(90deg, transparent, ${text}33, transparent)`,
          }}
        />

        <div style={contactSectionStyle}>
          <SectionLabel theme={theme} text={text} compact>
            Ficha técnica
          </SectionLabel>
          <ContactBlock compact theme={theme} label="ESPACIO" value="[Aforo / Tipo de sala]" text={text} />
          <ContactBlock compact theme={theme} label="ESTRENO" value="[Ciudad, mes año]" text={text} />
          <ContactBlock compact theme={theme} label="IDIOMA" value="[Idioma]" text={text} />
          <ContactBlock compact theme={theme} label="DURACIÓN" value="[XX min sin intermedio]" text={text} />
        </div>
      </div>
    </SlideShell>
  );
}

function DesktopTeaser({ theme, text }: { theme: PaletteTheme; text: string }) {
  return (
    <SlideShell theme={theme} index="08" background={petroleoTrialBg(theme)}>
      <h2
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          margin: 0,
          paddingTop: "clamp(28px, 4vh, 48px)",
          paddingBottom: "clamp(10px, 1.5vh, 18px)",
          textAlign: "center",
          fontFamily: fontDisplay(theme),
          fontWeight: 700,
          fontSize: "clamp(20px, 2.4vw, 32px)",
          color: text,
          letterSpacing: "0.12em",
        }}
      >
        Teaser y Contacto
      </h2>
      <div
        style={{
          position: "absolute",
          top: "clamp(72px, 10vh, 100px)",
          right: TEASER_SIDE_INSET,
          bottom: "clamp(28px, 4vh, 44px)",
          left: TEASER_SIDE_INSET,
          display: "flex",
          flexWrap: "wrap",
          alignItems: "stretch",
          alignContent: "stretch",
          gap: "clamp(20px, 2.5vw, 56px)",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        {hasTeaserVideo(theme.id) ? (
          <TeaserVideo
            font={fontDisplay(theme)}
            accentColor={slideText(theme)}
            paletteId={theme.id}
            style={{
              flex: "1 1 320px",
              width: "min(100%, 42%)",
              maxWidth: "min(100%, 520px)",
              minWidth: 0,
              minHeight: 0,
              alignSelf: "center",
            }}
          />
        ) : (
          <MediaFrame
            theme={theme}
            label="[Vídeo teaser]"
            style={{
              flex: "1 1 320px",
              width: "min(100%, 42%)",
              maxWidth: "min(100%, 520px)",
              minWidth: 0,
              minHeight: 0,
            }}
          />
        )}
        <div
          style={{
            flex: "1 1 280px",
            minWidth: 0,
            display: "flex",
            flexWrap: "wrap",
            gap: "clamp(20px, 2.5vw, 48px)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              flex: "1 1 160px",
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <SectionLabel theme={theme} text={text}>
              Contacto
            </SectionLabel>
            <ContactBlock theme={theme} label="DIRECCIÓN" value="Naz Montés" text={text} />
            <ContactBlock theme={theme} label="PRODUCCIÓN" value="Compañía OBSCENA Teatral" text={text} />
            <ContactBlock theme={theme} label="CONTACTO" value="[email@compañia.com]" text={text} />
            <ContactBlock theme={theme} label="WEB" value="[www.compañia.com]" text={text} />
          </div>
          <div
            style={{
              flex: "1 1 160px",
              minWidth: 0,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <SectionLabel theme={theme} text={text}>
              Ficha técnica
            </SectionLabel>
            <ContactBlock theme={theme} label="ESPACIO" value="[Aforo / Tipo de sala]" text={text} />
            <ContactBlock theme={theme} label="ESTRENO" value="[Ciudad, mes año]" text={text} />
            <ContactBlock theme={theme} label="IDIOMA" value="[Idioma]" text={text} />
            <ContactBlock theme={theme} label="DURACIÓN" value="[XX min sin intermedio]" text={text} />
          </div>
        </div>
      </div>
    </SlideShell>
  );
}

export function TeaserSlide({ theme }: Props) {
  const text = slideText(theme);
  const mobile = useIsMobile();

  return mobile
    ? <MobileTeaser theme={theme} text={text} />
    : <DesktopTeaser theme={theme} text={text} />;
}
