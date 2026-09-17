import { useCallback, useEffect, useRef, useState } from "react";
import type { PaletteId } from "../theme/palettes";
import { PALETTES, slideBackground, slideText } from "../theme/palettes";
import { fontBody } from "../theme/typography";
import { useIsMobile } from "../hooks/useIsMobile";
import { SlideNav } from "./SlideNav";
import { CoverSlide } from "./slides/CoverSlide";
import { CharacterSlide } from "./slides/CharacterSlide";
import { FlyerSlide } from "./slides/FlyerSlide";
import { SynopsisSlide } from "./slides/SynopsisSlide";
import { TeaserSlide } from "./slides/TeaserSlide";
import { preloadTeaserCoverImages } from "./TeaserVideo";
import { PETROLEO_PHOTOS, PETROLEO_SLIDE_BG } from "../assets/petroleoPhotos";

type Props = {
  paletteId: PaletteId;
  onBack?: () => void;
};

const SLIDE_COUNT = 8;

export function Dossier({ paletteId, onBack }: Props) {
  const [index, setIndex] = useState(0);
  const theme = PALETTES[paletteId];
  const mobile = useIsMobile();
  const touchRef = useRef<{ x: number; y: number } | null>(null);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % SLIDE_COUNT);
  }, []);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + SLIDE_COUNT) % SLIDE_COUNT);
  }, []);

  useEffect(() => {
    void preloadTeaserCoverImages();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        next();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
      if (e.key === "Escape" && onBack) onBack();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, onBack]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const t = e.touches[0];
    touchRef.current = { x: t.clientX, y: t.clientY };
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchRef.current) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - touchRef.current.x;
      const dy = t.clientY - touchRef.current.y;
      touchRef.current = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) next();
        else prev();
      }
    },
    [next, prev]
  );

  const isPetroleo = paletteId === "raiz_petroleo";
  const isHelecho = paletteId === "raiz_helecho";

  const slides = [
    <CoverSlide key="cover" theme={theme} />,
    <FlyerSlide key="photo" theme={theme} />,
    <SynopsisSlide key="synopsis" theme={theme} />,
    <CharacterSlide
      key="char1"
      theme={theme}
      data={{
        index: "04",
        characterName: "Mario",
        actorName: "Javier Estevez Permuy",
        photoLabel: "[Foto del personaje]",
        photoUrl: isPetroleo
          ? PETROLEO_PHOTOS.mario
          : "https://images.unsplash.com/photo-1516944486937-aca8e1c5cfce?w=1200&h=800&fit=crop&auto=format",
        description:
          "Mario creció como cuidador de su familia y amigos —con maltrato y abuso normalizados hacia él, y la ausencia de la madre—: curaba heridas ajenas y gritaba las injusticias. La vida adulta le romperá la brújula moral al trabajar en una empresa sanitaria y descubrir verdades monstruosas —poder, trata, manipulación— hasta adaptarse, resignado, a su fachada psicótica. Será la «visita al bosque» la que le haga tomar conciencia de todo su lado oscuro, de su MORVO, y darse cuenta de que la comunidad es la única salvación.",
      }}
    />,
    <CharacterSlide
      key="char2"
      theme={theme}
      data={{
        index: "05",
        characterName: "Cristian",
        actorName: "Ciprian Gheorghe",
        photoLabel: "[Foto del personaje]",
        photoUrl: isPetroleo
          ? PETROLEO_PHOTOS.cristian
          : "https://images.unsplash.com/photo-1771980590254-cbe347e4003e?w=1200&h=800&fit=crop&auto=format",
        description:
          "Cristian es un hombre de costumbres hogareñas que pasa de relación a relación con cierta naturalidad. En la sociedad actual su inestabilidad afectiva pasa desapercibida en la vida moderna, pero también sabemos que es una tirita pequeña para una herida profunda: su extrema necesidad de complacer. El punto de quiebra será la «visita al bosque», que, fuera de la máscara social, podrá despertar una manera de desear por sí mismo.",
      }}
    />,
    <CharacterSlide
      key="char3"
      theme={theme}
      data={{
        index: "06",
        characterName: "Víctor",
        actorName: "Adrian Popovici",
        photoLabel: "[Foto del personaje]",
        photoUrl: isPetroleo
          ? PETROLEO_PHOTOS.victor
          : isHelecho
            ? undefined
            : "https://images.unsplash.com/photo-1724380597255-944485791d3d?w=1200&h=800&fit=crop&auto=format",
        hidePhoto: isHelecho,
        description:
          "Víctor, marcado por el maltrato psicológico de su padre, se perderá en una vida de excesos, fiestas y alcohol, como vía de escape. Líder por naturaleza, su luz quedará tapada por los traumas, pero encontrará una redención tras el apoyo del amor incondicional de sus hermanos y el regalo de la «visita al bosque». Esta revelación transformará su energía en un proyecto para salvar a personas sin objetivos y almas perdidas.",
      }}
    />,
    <CharacterSlide
      key="director"
      theme={theme}
      data={{
        index: "07",
        characterName: "El Equipo",
        actorName: "",
        roleLabel: "Compañía OBSCENA TEATRAL",
        photoLabel: "[Foto del equipo]",
        hidePhoto: true,
        description:
          "Fundada en Barcelona en 2015 por el actor Javier Estévez, Compañía Obscena Teatral es un colectivo multidisciplinario e independiente del circuito alternativo de la ciudad. Nace como espacio de agitación cultural para debatir y cuestionar las dinámicas contemporáneas, con la mirada puesta en lo cercano: la familia, el trabajo y las normas no escritas de lo cotidiano.\nMediante un cruce de lenguajes escénicos y una firme independencia creativa, utiliza la escena como herramienta política, crítica y constructiva. Su línea artística se apoya en el absurdo y la comedia negra —incisiva y reflexiva— para destapar las contradicciones del sistema y confrontar al espectador con sus propias servidumbres.\nRepertorio: Obscena familiar, Absurda como la vida misma, Efectos secundarios, Consentidos, una comedia sin sentidos y Morvo.",
      }}
    />,
    <TeaserSlide key="teaser" theme={theme} />,
  ];

  const text = slideText(theme);
  /** Petróleo: negro en actores; teal (como teaser) en equipo, 02 y teaser */
  const isActorSlide = index >= 3 && index <= 5;
  const bg = isPetroleo
    ? isActorSlide
      ? "#000000"
      : index !== 0 && index !== 2
        ? PETROLEO_SLIDE_BG
        : slideBackground(theme)
    : slideBackground(theme);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: "100dvh",
        overflow: "hidden",
        background: bg,
        backgroundColor: bg,
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {slides[index]}
      </div>

      <SlideNav theme={theme} onPrev={prev} onNext={next} />

      <div
        style={{
          position: "absolute",
          bottom: mobile ? 12 : 16,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: mobile ? 6 : 8,
          zIndex: 50,
        }}
      >
        {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Ir a slide ${i + 1}`}
            style={{
              width: i === index ? (mobile ? 20 : 24) : (mobile ? 7 : 8),
              height: mobile ? 7 : 8,
              borderRadius: 4,
              border: "none",
              padding: 0,
              background:
                i === index
                  ? theme.bg
                    ? text
                    : theme.accent
                  : theme.bg
                    ? `${text}44`
                    : "rgba(237,232,213,0.25)",
              cursor: "pointer",
              transition: "width 0.2s",
            }}
          />
        ))}
      </div>

      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="Volver al selector de paletas"
          style={{
            position: "absolute",
            top: mobile ? 10 : 14,
            left: mobile ? 10 : 14,
            zIndex: 50,
            fontFamily: fontBody(theme),
            fontSize: mobile ? 22 : 26,
            lineHeight: 1,
            color: text,
            opacity: theme.bg ? 0.65 : 0.4,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: mobile ? "6px 10px" : "8px 12px",
          }}
        >
          ←
        </button>
      )}
    </div>
  );
}
