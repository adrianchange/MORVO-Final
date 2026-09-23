import type { CSSProperties } from "react";
import type { PaletteTheme } from "../../theme/palettes";
import { getPetroleoPortraitFilter, PETROLEO_PHOTOS, PETROLEO_SLIDE_BG } from "../../assets/petroleoPhotos";
import { slideText } from "../../theme/palettes";
import { fontBody, fontDisplay } from "./slideStyles";
import { SlideShell } from "./shared";
import { useIsMobile, useIsLandscape, useIsMobileUi } from "../../hooks/useIsMobile";

const CHAR_DESC = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent commodo cursus magna, vel scelerisque nisl consectetur. Donec sed odio dui. Cras mattis consectetur purus sit amet fermentum.`;

/** Fondo negro — integra mejor los retratos B/N */
const PETROLEO_CHARACTER_BG = "#000000";

/**
 * Dimensiones tipo captura Figma: columna vertical cerrada (~42 %),
 * no foto abierta a media pantalla. Se mantiene a la derecha.
 */
const PETROLEO_PHOTO_WIDTH = "42%";

/** Hueco para flecha nav + aire (mismo criterio que TeaserSlide) */
const CHAR_ARROW_CLEARANCE =
  "calc(clamp(12px, 2vw, 28px) + clamp(40px, 4.5vw, 56px) + 24px)";
/** Actores: un poco más de aire a la izquierda de la flecha */
const CHAR_ACTOR_LEFT_CLEARANCE =
  "calc(clamp(12px, 2vw, 28px) + clamp(40px, 4.5vw, 56px) + 44px)";

const PICSUM_IDS = [1025, 1074, 1005];
let picIdx = 0;
function nextPicsumUrl() {
  const id = PICSUM_IDS[picIdx % PICSUM_IDS.length];
  picIdx++;
  return `https://picsum.photos/id/${id}/1200/800`;
}

export type CharacterSlideData = {
  index: string;
  characterName: string;
  actorName: string;
  photoLabel: string;
  photoUrl?: string;
  roleLabel?: string;
  /** Sin foto de columna (actores); si hay backgroundUrl se usa a sangre */
  hidePhoto?: boolean;
  /** Fondo a sangre (p. ej. vista equipo) */
  backgroundUrl?: string;
  /** Texto de personaje (si no, placeholder) */
  description?: string;
};

type Props = {
  theme: PaletteTheme;
  data: CharacterSlideData;
};

function petroleoFacePosition(photoUrl?: string): string {
  if (photoUrl === PETROLEO_PHOTOS.victor) return "center 28%";
  if (photoUrl === PETROLEO_PHOTOS.mario) return "center 26%";
  if (photoUrl === PETROLEO_PHOTOS.cristian) return "center 30%";
  return "center 28%";
}

/** Móvil vertical: bajar el encuadre para que no se corte la parte baja de la foto */
function petroleoPortraitMobileFacePosition(photoUrl?: string): string {
  if (photoUrl === PETROLEO_PHOTOS.victor) return "center 68%";
  if (photoUrl === PETROLEO_PHOTOS.cristian) return "center 50%";
  return petroleoFacePosition(photoUrl);
}

export function CharacterSlide({ theme, data }: Props) {
  const mobile = useIsMobile();
  const landscape = useIsLandscape();
  const mobileUi = useIsMobileUi();
  const phoneLandscape = mobileUi && landscape;
  const text = slideText(theme);
  const showPhoto = !data.hidePhoto;
  const fullBleedBg = data.backgroundUrl;
  const bgUrl = data.photoUrl ?? nextPicsumUrl();
  const isPetroleo = theme.id === "raiz_petroleo";
  /** Equipo con foto a sangre: negro bajo la imagen; sin foto: verde; actores: negro */
  const bg = isPetroleo
    ? fullBleedBg
      ? "#000000"
      : data.hidePhoto
        ? PETROLEO_SLIDE_BG
        : PETROLEO_CHARACTER_BG
    : theme.bg;
  const portraitFilter = isPetroleo ? getPetroleoPortraitFilter(data.photoUrl) : undefined;
  const facePos = petroleoFacePosition(data.photoUrl);

  const petroleoPhotoStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: facePos,
    filter: portraitFilter,
    pointerEvents: "none",
    userSelect: "none",
  };

  const fullBleedLayer = fullBleedBg ? (
    <>
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${fullBleedBg})`,
            /* Intermedio: contain + zoom leve — casi toda la foto, bordes menos visibles */
            backgroundSize: "contain",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
            transform: "scale(1.12)",
            transformOrigin: "center center",
          }}
        />
      </div>
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: [
            "radial-gradient(ellipse 78% 72% at 50% 48%, transparent 0%, transparent 42%, rgba(0,0,0,0.28) 68%, rgba(0,0,0,0.78) 100%)",
            "linear-gradient(90deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.2) 16%, transparent 36%, transparent 64%, rgba(0,0,0,0.2) 84%, rgba(0,0,0,0.72) 100%)",
            "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 16%, transparent 80%, rgba(0,0,0,0.58) 100%)",
          ].join(", "),
          pointerEvents: "none",
        }}
      />
    </>
  ) : null;

  /** Layout apilado solo en móvil vertical */
  const usePortraitMobileLayout = mobile && !landscape;

  if (usePortraitMobileLayout) {
    const isTeam = Boolean(fullBleedBg);

    /* Equipo en vertical: sin scroll, foto grande, aire abajo y hueco para flechas */
    if (isTeam) {
      return (
        <SlideShell theme={theme} index={data.index} background={isPetroleo ? bg : undefined}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "stretch",
              gap: 14,
              paddingTop: 44,
              paddingBottom: "max(44px, calc(env(safe-area-inset-bottom, 0px) + 32px))",
              paddingLeft: "max(56px, calc(env(safe-area-inset-left, 0px) + 48px))",
              paddingRight: "max(56px, calc(env(safe-area-inset-right, 0px) + 48px))",
              boxSizing: "border-box",
              overflow: "hidden",
            }}
          >
            <CharacterCopy theme={theme} data={data} text={text} compact fullStrength titleOnly />
            {fullBleedBg && (
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  maxHeight: "38vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  overflow: "hidden",
                  flexShrink: 0,
                  borderRadius: 2,
                }}
              >
                <img
                  src={fullBleedBg}
                  alt=""
                  draggable={false}
                  style={{
                    width: "100%",
                    maxHeight: "38vh",
                    objectFit: "contain",
                    objectPosition: "center",
                    display: "block",
                    transform: "scale(1.1)",
                    transformOrigin: "center center",
                  }}
                />
                <div
                  aria-hidden
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: [
                      "radial-gradient(ellipse 75% 70% at 50% 48%, transparent 0%, transparent 45%, rgba(0,0,0,0.35) 72%, rgba(0,0,0,0.85) 100%)",
                      "linear-gradient(90deg, rgba(0,0,0,0.65) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.65) 100%)",
                      "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, transparent 18%, transparent 78%, rgba(0,0,0,0.5) 100%)",
                    ].join(", "),
                    pointerEvents: "none",
                  }}
                />
              </div>
            )}
            <div
              style={{
                flex: "1 1 auto",
                minHeight: 0,
                overflow: "hidden",
              }}
            >
              <CharacterCopy
                theme={theme}
                data={data}
                text={text}
                compact
                fullStrength
                bodyOnly
                tight
              />
            </div>
          </div>
        </SlideShell>
      );
    }

    return (
      <SlideShell theme={theme} index={data.index} background={isPetroleo ? bg : undefined}>
        {showPhoto &&
          (isPetroleo ? (
            /* Vertical: banda inferior a ancho completo (integrada), no tarjeta flotante */
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: "54%",
                overflow: "hidden",
                background: bg,
              }}
            >
              <img
                src={bgUrl}
                alt=""
                draggable={false}
                style={{
                  ...petroleoPhotoStyle,
                  objectPosition: petroleoPortraitMobileFacePosition(data.photoUrl),
                }}
              />
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(to bottom, ${bg} 0%, ${bg}cc 18%, ${bg}66 38%, transparent 62%)`,
                  pointerEvents: "none",
                }}
              />
            </div>
          ) : (
            <>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: "55%",
                  backgroundImage: `url(${bgUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: "55%",
                  background: `linear-gradient(to bottom, ${bg} 0%, ${bg}99 25%, transparent 70%)`,
                }}
              />
            </>
          ))}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            /* Bajar un poco nombre + descripción solo en vertical móvil */
            padding: showPhoto ? "72px 24px 24px" : "56px 24px 48px",
            boxSizing: "border-box",
            maxHeight: showPhoto ? (isPetroleo ? "48%" : "50%") : undefined,
            bottom: showPhoto ? undefined : 0,
            overflow: "hidden",
            gap: 12,
            zIndex: 2,
          }}
        >
          <CharacterCopy theme={theme} data={data} text={text} compact fullStrength={!showPhoto} />
        </div>
      </SlideShell>
    );
  }

  return (
    <SlideShell theme={theme} index={data.index} background={isPetroleo ? bg : undefined}>
      {fullBleedLayer}
      {showPhoto &&
        (isPetroleo ? (
          <div
            style={{
              position: "absolute",
              top: 0,
              /* Teléfono horizontal: hueco a la derecha para que la flecha no tape la cara */
              right: phoneLandscape ? 52 : 0,
              bottom: 0,
              width: phoneLandscape ? "36%" : PETROLEO_PHOTO_WIDTH,
              overflow: "hidden",
              background: bg,
            }}
          >
            <img src={bgUrl} alt="" draggable={false} style={petroleoPhotoStyle} />
            {/* Fundido suave hacia el texto (izquierda del panel) */}
            <div
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                background: `linear-gradient(to left, transparent 58%, ${bg}99 82%, ${bg} 100%)`,
                pointerEvents: "none",
              }}
            />
          </div>
        ) : (
          <>
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                width: "55%",
                backgroundImage: `url(${bgUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                bottom: 0,
                width: "55%",
                background: `linear-gradient(to right, ${bg} 0%, ${bg}99 25%, transparent 70%)`,
              }}
            />
          </>
        ))}
      {showPhoto ? (
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            /* Columna un poco más estrecha → ~2 líneas más; más aire a la flecha izq. */
            right: phoneLandscape ? (isPetroleo ? "44%" : "50%") : undefined,
            width: phoneLandscape ? undefined : "100%",
            maxWidth: phoneLandscape ? undefined : isPetroleo ? "56%" : "50%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingTop: phoneLandscape
              ? "max(16px, calc(env(safe-area-inset-top, 0px) + 8px))"
              : "clamp(48px, 8vh, 72px)",
            paddingRight: phoneLandscape ? 12 : "clamp(48px, 8vw, 96px)",
            paddingBottom: phoneLandscape ? 10 : "clamp(40px, 6vh, 56px)",
            paddingLeft: phoneLandscape
              ? "max(76px, calc(env(safe-area-inset-left, 0px) + 68px))"
              : CHAR_ACTOR_LEFT_CLEARANCE,
            boxSizing: "border-box",
            gap: phoneLandscape ? 4 : "clamp(12px, 2vh, 20px)",
            overflow: "hidden",
            zIndex: 2,
            minWidth: 0,
          }}
        >
          <CharacterCopy
            theme={theme}
            data={data}
            text={text}
            compact={phoneLandscape}
            tight={phoneLandscape}
          />
        </div>
      ) : phoneLandscape ? (
        /* Equipo horizontal: mismo esquema PC (2 columnas), título/compañía +20px arriba */
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 28,
            paddingTop: 28,
            paddingBottom: 24,
            paddingLeft: "max(52px, calc(env(safe-area-inset-left, 0px) + 44px))",
            paddingRight: "max(52px, calc(env(safe-area-inset-right, 0px) + 44px))",
            boxSizing: "border-box",
            overflow: "hidden",
            zIndex: 2,
          }}
        >
          <div
            style={{
              flex: "0 1 34%",
              minWidth: 0,
              maxWidth: 320,
              display: "flex",
              flexDirection: "column",
              gap: 8,
              transform: "translate(-10px, -86px)",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontFamily: fontDisplay(theme),
                fontWeight: 700,
                fontSize: 22,
                color: text,
                letterSpacing: "0.08em",
                lineHeight: 1.15,
              }}
            >
              {data.characterName}
            </h2>
            <p
              style={{
                margin: 0,
                fontFamily: fontBody(theme),
                fontStyle: "italic",
                fontSize: 12,
                color: text,
                letterSpacing: "0.04em",
              }}
            >
              {data.roleLabel ?? "interpretado por"} {data.actorName}
            </p>
          </div>
          <p
            style={{
              flex: "1 1 52%",
              margin: 0,
              minWidth: 0,
              maxHeight: "100%",
              overflow: "hidden",
              fontFamily: fontBody(theme),
              fontSize: 12,
              lineHeight: 1.4,
              color: text,
              whiteSpace: "pre-line",
            }}
          >
            {data.description ?? CHAR_DESC}
          </p>
        </div>
      ) : (
        /* Equipo PC: título un poco más arriba; cuerpo +30px */
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(36px, 4.5vw, 72px)",
            paddingTop: "clamp(40px, 6vh, 56px)",
            paddingBottom: "clamp(40px, 6vh, 56px)",
            paddingLeft: CHAR_ARROW_CLEARANCE,
            paddingRight: CHAR_ARROW_CLEARANCE,
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              flex: "0 1 34%",
              minWidth: 200,
              maxWidth: 380,
              display: "flex",
              flexDirection: "column",
              gap: "clamp(10px, 1.5vh, 16px)",
              transform: "translate(-10px, -78px)",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontFamily: fontDisplay(theme),
                fontWeight: 700,
                fontSize: "clamp(26px, 3.2vw, 42px)",
                color: text,
                letterSpacing: "0.1em",
                lineHeight: 1.15,
              }}
            >
              {data.characterName}
            </h2>
            <p
              style={{
                margin: 0,
                fontFamily: fontBody(theme),
                fontStyle: "italic",
                fontSize: "clamp(14px, 1.35vw, 20px)",
                color: text,
                opacity: 1,
                letterSpacing: "0.06em",
              }}
            >
              {data.roleLabel ?? "interpretado por"} {data.actorName}
            </p>
          </div>
          <p
            style={{
              flex: "1 1 52%",
              margin: 0,
              maxWidth: 620,
              fontFamily: fontBody(theme),
              fontSize: "clamp(14px, 1.25vw, 18px)",
              lineHeight: 1.55,
              color: text,
              opacity: 1,
              whiteSpace: "pre-line",
              transform: "translateY(-30px)",
            }}
          >
            {data.description ?? CHAR_DESC}
          </p>
        </div>
      )}
    </SlideShell>
  );
}

function CharacterCopy({
  theme,
  data,
  text,
  compact = false,
  fullStrength = false,
  titleOnly = false,
  bodyOnly = false,
  tight = false,
}: {
  theme: PaletteTheme;
  data: CharacterSlideData;
  text: string;
  compact?: boolean;
  /** Equipo: misma intensidad de color que el título */
  fullStrength?: boolean;
  /** Solo título + rol (móvil equipo) */
  titleOnly?: boolean;
  /** Solo descripción (móvil equipo) */
  bodyOnly?: boolean;
  /** Cuerpo un poco más compacto (equipo vertical sin scroll) */
  tight?: boolean;
}) {
  const roleOpacity = fullStrength ? 1 : 0.7;
  const bodyOpacity = fullStrength ? 1 : 0.78;
  const bodySize = tight ? 11 : compact ? 13 : "clamp(14px, 1.3vw, 19px)";
  const bodyLine = tight ? 1.35 : compact ? 1.5 : 1.6;
  const titleSize = tight && compact ? 15 : compact ? 22 : "clamp(22px, 2.8vw, 36px)";
  const roleSize = tight && compact ? 11 : compact ? 14 : "clamp(14px, 1.35vw, 20px)";
  return (
    <>
      {!bodyOnly && (
        <>
          <h2
            style={{
              margin: 0,
              fontFamily: fontDisplay(theme),
              fontWeight: 700,
              fontSize: titleSize,
              color: text,
              letterSpacing: tight ? "0.06em" : "0.1em",
              lineHeight: 1.15,
              minWidth: 0,
              overflowWrap: "anywhere",
            }}
          >
            {data.characterName}
          </h2>
          <p
            style={{
              margin: 0,
              fontFamily: fontBody(theme),
              fontStyle: "italic",
              fontSize: roleSize,
              color: text,
              opacity: roleOpacity,
              letterSpacing: tight ? "0.03em" : "0.06em",
              minWidth: 0,
              overflowWrap: "anywhere",
            }}
          >
            {data.roleLabel ?? "interpretado por"} {data.actorName}
          </p>
        </>
      )}
      {!titleOnly && (
        <p
          style={{
            margin: 0,
            fontFamily: fontBody(theme),
            fontSize: bodySize,
            lineHeight: bodyLine,
            color: text,
            opacity: bodyOpacity,
            whiteSpace: "pre-line",
          }}
        >
          {data.description ?? CHAR_DESC}
        </p>
      )}
    </>
  );
}
