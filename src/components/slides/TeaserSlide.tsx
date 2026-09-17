import type { ReactNode } from "react";
import type { PaletteTheme } from "../../theme/palettes";
import { hasTeaserVideo, slideText } from "../../theme/palettes";
import { fontBody, fontDisplay } from "./slideStyles";
import { MediaFrame, SlideShell } from "./shared";
import { useIsMobile } from "../../hooks/useIsMobile";
import { TeaserVideo } from "../TeaserVideo";

type Props = { theme: PaletteTheme };

const TEASER_SIDE_INSET =
  "calc(clamp(12px, 2vw, 28px) + clamp(40px, 4.5vw, 56px) + 15px)";

/** Margen lateral en móvil: flecha (~40px) + separación */
const MOBILE_TEASER_SIDE_INSET = "calc(12px + 40px + 12px)";

const ELENCO_LINES = [
  "Javier Estevez Permuy",
  "Ciprian Gheorghe",
  "Adrian Popovici",
] as const;

function petroleoSlideBg(theme: PaletteTheme): string | undefined {
  return theme.id === "raiz_petroleo" ? "#000000" : undefined;
}

function InstagramIcon({ color, size = 18 }: { color: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      style={{ flexShrink: 0, transform: "translateY(1px)" }}
    >
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" stroke={color} strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4.2" stroke={color} strokeWidth="1.6" />
      <circle cx="17.4" cy="6.6" r="1.15" fill={color} />
    </svg>
  );
}

function InstagramHandle({
  text,
  handle,
  compact = false,
}: {
  text: string;
  handle: string;
  compact?: boolean;
}) {
  return (
    <>
      <InstagramIcon color={text} size={compact ? 15 : 18} />
      <span>{handle}</span>
    </>
  );
}

/** Etiquetas al estilo del título de slide, pero más pequeñas */
function CreditBlock({
  label,
  value,
  text,
  theme,
  compact = false,
  center = false,
}: {
  label: string;
  value: ReactNode;
  text: string;
  theme: PaletteTheme;
  compact?: boolean;
  center?: boolean;
}) {
  return (
    <div
      style={{
        textAlign: center ? "center" : "left",
        minWidth: 0,
      }}
    >
      <div
        style={{
          margin: 0,
          marginBottom: compact ? 4 : 6,
          fontFamily: fontDisplay(theme),
          fontWeight: 700,
          fontSize: compact ? 11 : "clamp(11px, 1.1vw, 15px)",
          color: text,
          letterSpacing: "0.12em",
          lineHeight: 1.2,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: fontBody(theme),
          fontSize: compact ? 13 : "clamp(13px, 1.15vw, 16px)",
          color: text,
          opacity: 0.85,
          letterSpacing: "0.04em",
          lineHeight: 1.35,
          display: "flex",
          alignItems: "center",
          justifyContent: center ? "center" : "flex-start",
          gap: 8,
          flexWrap: "wrap",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function CreditsRow({
  theme,
  text,
  compact = false,
  center = false,
}: {
  theme: PaletteTheme;
  text: string;
  compact?: boolean;
  center?: boolean;
}) {
  const elenco = (
    <span style={{ display: "flex", flexDirection: "column", gap: 2, lineHeight: 1.35 }}>
      {ELENCO_LINES.map((name) => (
        <span key={name}>{name}</span>
      ))}
    </span>
  );

  const fotografiaYDosier = (
    <div style={{ display: "flex", flexDirection: "column", gap: compact ? 14 : "clamp(14px, 1.8vh, 20px)" }}>
      <CreditBlock
        theme={theme}
        text={text}
        label="Fotografía"
        value={<InstagramHandle text={text} handle="dancruz_" compact={compact} />}
        compact={compact}
        center={center}
      />
      <CreditBlock
        theme={theme}
        text={text}
        label="Dosier"
        value="Adrian Popovici"
        compact={compact}
        center={center}
      />
    </div>
  );

  const items: { label: string; value: ReactNode; custom?: ReactNode }[] = [
    { label: "Texto y dirección", value: "Naz Montés" },
    {
      label: "Producción",
      value: (
        <span style={{ whiteSpace: "nowrap" }}>Compañía OBSCENA TEATRAL</span>
      ),
    },
    {
      label: "Contacto",
      value: <InstagramHandle text={text} handle="obscena.teatral" compact={compact} />,
    },
    { label: "Elenco", value: elenco },
    { label: "Fotografía", value: null, custom: fotografiaYDosier },
  ];

  if (compact || center) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: compact ? 14 : "clamp(14px, 1.8vh, 20px)",
          width: "100%",
        }}
      >
        {items.map((item) =>
          item.custom ? (
            <div key={item.label}>{item.custom}</div>
          ) : (
            <CreditBlock
              key={item.label}
              theme={theme}
              text={text}
              label={item.label}
              value={item.value}
              compact={compact}
              center
            />
          ),
        )}
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "minmax(0, 1.1fr) minmax(0, 1.55fr) minmax(0, 1fr) minmax(0, 1.25fr) minmax(0, 1.1fr)",
        gap: "clamp(16px, 2vw, 28px)",
        width: "100%",
        alignItems: "start",
      }}
    >
      {items.map((item) =>
        item.custom ? (
          <div key={item.label}>{item.custom}</div>
        ) : (
          <CreditBlock
            key={item.label}
            theme={theme}
            text={text}
            label={item.label}
            value={item.value}
          />
        ),
      )}
    </div>
  );
}

function MobileTeaser({ theme, text }: { theme: PaletteTheme; text: string }) {
  return (
    <SlideShell theme={theme} index="08" scrollable background={petroleoSlideBg(theme)}>
      <div
        style={{
          padding: `48px ${MOBILE_TEASER_SIDE_INSET} 48px`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 28,
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
            style={{ width: "100%", maxWidth: 560, aspectRatio: "16/9" }}
          />
        ) : (
          <MediaFrame
            theme={theme}
            label="[Vídeo teaser]"
            style={{ width: "100%", maxWidth: 560, aspectRatio: "16/9" }}
          />
        )}

        <CreditsRow theme={theme} text={text} compact center />
      </div>
    </SlideShell>
  );
}

function DesktopTeaser({ theme, text }: { theme: PaletteTheme; text: string }) {
  return (
    <SlideShell theme={theme} index="08" background={petroleoSlideBg(theme)}>
      <div
        style={{
          position: "absolute",
          top: 0,
          right: TEASER_SIDE_INSET,
          bottom: 0,
          left: TEASER_SIDE_INSET,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "clamp(18px, 2.4vh, 28px)",
          paddingTop: "clamp(20px, 3vh, 32px)",
          paddingBottom: "clamp(20px, 3vh, 32px)",
          boxSizing: "border-box",
          overflow: "hidden",
        }}
      >
        <h2
          style={{
            margin: 0,
            flexShrink: 0,
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

        {hasTeaserVideo(theme.id) ? (
          <TeaserVideo
            font={fontDisplay(theme)}
            accentColor={slideText(theme)}
            paletteId={theme.id}
            style={{
              width: "min(100%, 920px)",
              maxHeight: "min(52vh, 520px)",
              aspectRatio: "16/9",
              flexShrink: 1,
              minHeight: 0,
            }}
          />
        ) : (
          <MediaFrame
            theme={theme}
            label="[Vídeo teaser]"
            style={{
              width: "min(100%, 920px)",
              maxHeight: "min(52vh, 520px)",
              aspectRatio: "16/9",
            }}
          />
        )}

        <div style={{ width: "100%", maxWidth: 1100, flexShrink: 0 }}>
          <CreditsRow theme={theme} text={text} />
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
