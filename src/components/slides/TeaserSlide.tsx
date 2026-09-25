import type { CSSProperties, ReactNode } from "react";
import type { PaletteTheme } from "../../theme/palettes";
import { hasTeaserVideo, slideText } from "../../theme/palettes";
import { PETROLEO_TEASER_FILE_URL } from "../../assets/teaserFile";
import { fontBody, fontDisplay } from "./slideStyles";
import { MediaFrame, SlideShell } from "./shared";
import { useIsMobileUi, useIsLandscape } from "../../hooks/useIsMobile";
import { TeaserVideo } from "../TeaserVideo";
import { TeaserFileVideo } from "../TeaserFileVideo";

type Props = { theme: PaletteTheme };

/** Petróleo: MP4 v17 (efectos ya grabados) + shell UI como Vercel */
function TeaserPlayer({
  theme,
  style,
}: {
  theme: PaletteTheme;
  style?: CSSProperties;
}) {
  const accent = slideText(theme);
  const font = fontDisplay(theme);
  if (theme.id === "raiz_petroleo") {
    return (
      <TeaserFileVideo
        src={PETROLEO_TEASER_FILE_URL}
        accentColor={accent}
        font={font}
        style={style}
      />
    );
  }
  if (hasTeaserVideo(theme.id)) {
    return (
      <TeaserVideo
        font={font}
        accentColor={accent}
        paletteId={theme.id}
        style={style}
      />
    );
  }
  return <MediaFrame theme={theme} label="[Vídeo teaser]" style={style} />;
}

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

function CreditBlock({
  label,
  value,
  text,
  theme,
  compact = false,
  dense = false,
  center = false,
}: {
  label: string;
  value: ReactNode;
  text: string;
  theme: PaletteTheme;
  compact?: boolean;
  dense?: boolean;
  center?: boolean;
}) {
  const tight = dense || compact;
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
          marginBottom: dense ? 2 : tight ? 4 : 6,
          fontFamily: fontDisplay(theme),
          fontWeight: 700,
          fontSize: dense ? 9 : compact ? 11 : "clamp(11px, 1.1vw, 15px)",
          color: text,
          letterSpacing: "0.1em",
          lineHeight: 1.15,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: fontBody(theme),
          fontSize: dense ? 11 : compact ? 13 : "clamp(13px, 1.15vw, 16px)",
          color: text,
          opacity: 0.85,
          letterSpacing: "0.03em",
          lineHeight: dense ? 1.25 : 1.35,
          display: "flex",
          alignItems: "center",
          justifyContent: center ? "center" : "flex-start",
          gap: dense ? 5 : 8,
          flexWrap: "wrap",
        }}
      >
        {value}
      </div>
    </div>
  );
}

type CreditsMode = "portrait" | "landscape" | "desktop";

/**
 * Créditos por modo:
 * - portrait: columna centrada, aire vertical
 * - landscape: 3 columnas compactas (quepan en altura)
 * - desktop: 3 columnas
 */
function CreditsRow({
  theme,
  text,
  mode,
}: {
  theme: PaletteTheme;
  text: string;
  mode: CreditsMode;
}) {
  const elenco = (
    <span style={{ display: "flex", flexDirection: "column", gap: 2, lineHeight: 1.35 }}>
      {ELENCO_LINES.map((name) => (
        <span key={name}>{name}</span>
      ))}
    </span>
  );

  if (mode === "portrait") {
    const items: { label: string; value: ReactNode }[] = [
      { label: "Texto y dirección", value: "Naz Montés" },
      { label: "Producción", value: "Compañía OBSCENA TEATRAL" },
      {
        label: "Contacto",
        value: <InstagramHandle text={text} handle="obscena.teatral" compact />,
      },
      { label: "Elenco", value: elenco },
      {
        label: "Fotografía",
        value: <InstagramHandle text={text} handle="dancruz_" compact />,
      },
      { label: "Dosier", value: "Adrian Popovici" },
    ];
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-evenly",
          gap: 10,
          width: "100%",
          height: "100%",
          boxSizing: "border-box",
          paddingTop: 8,
          paddingBottom: 4,
        }}
      >
        {items.map((item) => (
          <CreditBlock
            key={item.label}
            theme={theme}
            text={text}
            label={item.label}
            value={item.value}
            compact
            center
          />
        ))}
      </div>
    );
  }

  if (mode === "landscape") {
    /* 2 columnas densas a la derecha — no se cortan */
    const elencoInline = ELENCO_LINES.join(" · ");
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
          columnGap: 12,
          rowGap: 5,
          width: "100%",
          alignContent: "start",
          alignItems: "start",
          boxSizing: "border-box",
        }}
      >
        <CreditBlock theme={theme} text={text} label="Texto y dirección" value="Naz Montés" dense />
        <CreditBlock
          theme={theme}
          text={text}
          label="Contacto"
          value={<InstagramHandle text={text} handle="obscena.teatral" compact />}
          dense
        />
        <CreditBlock
          theme={theme}
          text={text}
          label="Producción"
          value={<span style={{ whiteSpace: "normal" }}>Compañía OBSCENA TEATRAL</span>}
          dense
        />
        <CreditBlock
          theme={theme}
          text={text}
          label="Fotografía"
          value={<InstagramHandle text={text} handle="dancruz_" compact />}
          dense
        />
        <CreditBlock theme={theme} text={text} label="Elenco" value={elencoInline} dense />
        <CreditBlock theme={theme} text={text} label="Dosier" value="Adrian Popovici" dense />
      </div>
    );
  }

  /* desktop: 3 columnas, misma anchura que el teaser */
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
        columnGap: "clamp(20px, 2.4vw, 40px)",
        rowGap: "clamp(12px, 1.5vh, 18px)",
        width: "100%",
        alignItems: "start",
      }}
    >
      <CreditBlock theme={theme} text={text} label="Texto y dirección" value="Naz Montés" />
      <CreditBlock
        theme={theme}
        text={text}
        label="Producción"
        value={<span style={{ whiteSpace: "normal" }}>Compañía OBSCENA TEATRAL</span>}
      />
      <CreditBlock
        theme={theme}
        text={text}
        label="Contacto"
        value={<InstagramHandle text={text} handle="obscena.teatral" />}
      />
      <CreditBlock theme={theme} text={text} label="Elenco" value={elenco} />
      <CreditBlock
        theme={theme}
        text={text}
        label="Fotografía"
        value={<InstagramHandle text={text} handle="dancruz_" />}
      />
      <CreditBlock theme={theme} text={text} label="Dosier" value="Adrian Popovici" />
    </div>
  );
}

/** PC: teaser + créditos misma banda (16:9 respecto a la altura útil) */
const DESKTOP_BAND_W = "min(100%, 920px, calc(min(52vh, 520px) * 16 / 9))";

function teaserBoxStyle(mode: CreditsMode): CSSProperties {
  if (mode === "portrait") {
    return {
      width: "min(100%, 560px, calc(min(32vh, 280px) * 16 / 9))",
      maxHeight: "min(32vh, 280px)",
      aspectRatio: "16 / 9",
      height: "auto",
      flexShrink: 0,
      minWidth: 0,
      minHeight: 0,
    };
  }
  if (mode === "landscape") {
    /* Fila izq/der — un pelín más pequeño, centrado con créditos */
    return {
      height: "min(100%, 148px)",
      width: "auto",
      maxWidth: "44%",
      aspectRatio: "16 / 9",
      flexShrink: 0,
      minWidth: 0,
      minHeight: 0,
      alignSelf: "center",
    };
  }
  return {
    width: "100%",
    aspectRatio: "16 / 9",
    height: "auto",
    flexShrink: 0,
    minWidth: 0,
    minHeight: 0,
  };
}

/**
 * Un solo árbol: al girar el móvil no se desmonta el player
 * (antes MobileTeaser ↔ DesktopTeaser reiniciaba el vídeo).
 */
export function TeaserSlide({ theme }: Props) {
  const text = slideText(theme);
  const mobileUi = useIsMobileUi();
  const landscape = useIsLandscape();

  const mode: CreditsMode = mobileUi
    ? landscape
      ? "landscape"
      : "portrait"
    : "desktop";

  const sideInset =
    mode === "portrait"
      ? MOBILE_TEASER_SIDE_INSET
      : mode === "landscape"
        ? "calc(10px + 36px + 8px)"
        : TEASER_SIDE_INSET;

  return (
    <SlideShell theme={theme} index="08" background={petroleoSlideBg(theme)}>
      <div
        style={{
          position: "absolute",
          top: 0,
          right: sideInset,
          bottom: 0,
          left: sideInset,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: mode === "landscape" ? "center" : "flex-start",
          gap:
            mode === "landscape"
              ? 6
              : mode === "portrait"
                ? 18
                : "clamp(10px, 1.4vh, 16px)",
          paddingTop:
            mode === "portrait"
              ? "max(40px, calc(env(safe-area-inset-top, 0px) + 24px))"
              : mode === "landscape"
                ? "max(24px, calc(env(safe-area-inset-top, 0px) + 12px))"
                : "clamp(8px, 1.2vh, 14px)",
          paddingBottom:
            mode === "portrait"
              ? "max(28px, calc(env(safe-area-inset-bottom, 0px) + 16px))"
              : mode === "landscape"
                ? "max(12px, calc(env(safe-area-inset-bottom, 0px) + 8px))"
                : "clamp(14px, 2vh, 24px)",
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
            fontSize:
              mode === "portrait" ? 18 : mode === "landscape" ? 14 : "clamp(20px, 2.4vw, 32px)",
            color: text,
            letterSpacing: "0.12em",
            lineHeight: 1.2,
            ...(mode === "landscape" ? { transform: "translateY(-10px)" } : null),
          }}
        >
          Teaser y Contacto
        </h2>

        <div
          style={{
            width: mode === "desktop" ? DESKTOP_BAND_W : "100%",
            display: "flex",
            flexDirection: mode === "landscape" ? "row" : "column",
            alignItems: mode === "landscape" ? "center" : "stretch",
            gap:
              mode === "landscape"
                ? 14
                : mode === "portrait"
                  ? 22
                  : "clamp(14px, 1.8vh, 22px)",
            flex: mode === "desktop" ? "0 1 auto" : mode === "landscape" ? "0 1 auto" : "1 1 auto",
            minHeight: 0,
            minWidth: 0,
            justifyContent: mode === "landscape" ? "center" : undefined,
            maxWidth: mode === "landscape" ? 920 : undefined,
            ...(mode === "landscape" ? { transform: "translateX(5px)" } : null),
          }}
        >
          <TeaserPlayer
            theme={theme}
            style={{
              ...teaserBoxStyle(mode),
              ...(mode === "desktop" ? { width: "100%" } : null),
            }}
          />

          <div
            style={{
              width: mode === "landscape" ? "auto" : "100%",
              flex: mode === "landscape" ? "0 1 280px" : mode === "portrait" ? "1 1 auto" : "0 0 auto",
              minHeight: 0,
              minWidth: mode === "landscape" ? 160 : 0,
              maxWidth: mode === "landscape" ? 300 : undefined,
              overflow: mode === "portrait" ? "hidden" : "visible",
              display: "flex",
              flexDirection: "column",
              justifyContent: mode === "landscape" ? "center" : undefined,
            }}
          >
            <CreditsRow theme={theme} text={text} mode={mode} />
          </div>
        </div>
      </div>
    </SlideShell>
  );
}
