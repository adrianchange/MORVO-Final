import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 768;
/** Altura típica de teléfono en landscape (PC no suele ser tan bajo a pantalla completa) */
const PHONE_LANDSCAPE_MAX_H = 650;
const PHONE_LANDSCAPE_MAX_W = 1024;

function matchPhoneLandscape() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(orientation: landscape)").matches &&
    window.innerHeight <= PHONE_LANDSCAPE_MAX_H &&
    window.innerWidth <= PHONE_LANDSCAPE_MAX_W
  );
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < MOBILE_BREAKPOINT
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    setIsMobile(mq.matches);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return isMobile;
}

/** Landscape (útil en móvil horizontal) */
export function useIsLandscape() {
  const [landscape, setLandscape] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(orientation: landscape)").matches,
  );

  useEffect(() => {
    const mq = window.matchMedia("(orientation: landscape)");
    const handler = (e: MediaQueryListEvent) => setLandscape(e.matches);
    mq.addEventListener("change", handler);
    setLandscape(mq.matches);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return landscape;
}

/**
 * UI móvil real: ancho < 768 O teléfono en horizontal
 * (en landscape el ancho suele ser > 768 y useIsMobile falla).
 */
export function useIsMobileUi() {
  const narrow = useIsMobile();
  const [phoneLandscape, setPhoneLandscape] = useState(matchPhoneLandscape);

  useEffect(() => {
    const update = () => setPhoneLandscape(matchPhoneLandscape());
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    const mq = window.matchMedia("(orientation: landscape)");
    mq.addEventListener("change", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
      mq.removeEventListener("change", update);
    };
  }, []);

  return narrow || phoneLandscape;
}
