import type { CSSProperties } from "react";
import type { PaletteTheme } from "../../theme/palettes";
import { getPetroleoPortraitFilter, PETROLEO_PHOTOS, PETROLEO_SLIDE_BG } from "../../assets/petroleoPhotos";
import { slideText } from "../../theme/palettes";
import { fontBody, fontDisplay } from "./slideStyles";
import { SlideShell } from "./shared";
import { useIsMobile } from "../../hooks/useIsMobile";

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

export function CharacterSlide({ theme, data }: Props) {
  const mobile = useIsMobile();
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
          backgroundImage: `url(${fullBleedBg})`,
          backgroundSize: "contain",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background: [
            "linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.22) 28%, rgba(0,0,0,0.12) 50%, rgba(0,0,0,0.22) 72%, rgba(0,0,0,0.55) 100%)",
            "linear-gradient(180deg, rgba(0,0,0,0.25) 0%, transparent 22%, transparent 78%, rgba(0,0,0,0.3) 100%)",
          ].join(", "),
          pointerEvents: "none",
        }}
      />
    </>
  ) : null;

  if (mobile) {
    return (
      <SlideShell theme={theme} index={data.index} background={isPetroleo ? bg : undefined}>
        {fullBleedLayer}
        {showPhoto &&
          (isPetroleo ? (
            <div
              style={{
                position: "absolute",
                left: "50%",
                bottom: "4%",
                transform: "translateX(-50%)",
                width: "min(58vw, 240px)",
                height: "min(46vh, 340px)",
                overflow: "hidden",
                background: bg,
              }}
            >
              <img src={bgUrl} alt="" draggable={false} style={petroleoPhotoStyle} />
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(to top, ${bg} 0%, transparent 16%)`,
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
            justifyContent: "center",
            padding: showPhoto ? "48px 24px 20px" : "48px 24px 40px",
            boxSizing: "border-box",
            maxHeight: showPhoto ? (isPetroleo ? "48%" : "50%") : undefined,
            bottom: showPhoto ? undefined : 0,
            overflow: "hidden",
            gap: 10,
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
              right: 0,
              bottom: 0,
              width: PETROLEO_PHOTO_WIDTH,
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
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingTop: "clamp(48px, 8vh, 72px)",
            paddingRight: "clamp(48px, 8vw, 96px)",
            paddingBottom: "clamp(40px, 6vh, 56px)",
            paddingLeft: CHAR_ACTOR_LEFT_CLEARANCE,
            boxSizing: "border-box",
            maxWidth: isPetroleo ? "56%" : "50%",
            gap: "clamp(12px, 2vh, 20px)",
          }}
        >
          <CharacterCopy theme={theme} data={data} text={text} />
        </div>
      ) : (
        /* Equipo: dos columnas — título a la izquierda, cuerpo a la derecha */
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: "clamp(36px, 4.5vw, 72px)",
            paddingTop: "clamp(48px, 7vh, 64px)",
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
}: {
  theme: PaletteTheme;
  data: CharacterSlideData;
  text: string;
  compact?: boolean;
  /** Equipo: misma intensidad de color que el título */
  fullStrength?: boolean;
}) {
  const roleOpacity = fullStrength ? 1 : 0.7;
  const bodyOpacity = fullStrength ? 1 : 0.78;
  return (
    <>
      <h2
        style={{
          margin: 0,
          fontFamily: fontDisplay(theme),
          fontWeight: 700,
          fontSize: compact ? 22 : "clamp(22px, 2.8vw, 36px)",
          color: text,
          letterSpacing: "0.1em",
          lineHeight: 1.2,
        }}
      >
        {data.characterName}
      </h2>
      <p
        style={{
          margin: 0,
          fontFamily: fontBody(theme),
          fontStyle: "italic",
          fontSize: compact ? 14 : "clamp(14px, 1.35vw, 20px)",
          color: text,
          opacity: roleOpacity,
          letterSpacing: "0.06em",
        }}
      >
        {data.roleLabel ?? "interpretado por"} {data.actorName}
      </p>
      <p
        style={{
          margin: 0,
          fontFamily: fontBody(theme),
          fontSize: compact ? 13 : "clamp(14px, 1.3vw, 19px)",
          lineHeight: compact ? 1.5 : 1.6,
          color: text,
          opacity: bodyOpacity,
          whiteSpace: "pre-line",
        }}
      >
        {data.description ?? CHAR_DESC}
      </p>
    </>
  );
}
