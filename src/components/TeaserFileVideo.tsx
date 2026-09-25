import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { useIsLandscape, useIsMobile, useIsMobileUi } from "../hooks/useIsMobile";

const TEASER_COVER_BG = "/images/teaser/teaser-cover-paris-bilal-arches.jpg";
const COVER_LINE_TOP = "Compañía OBSCENA TEATRAL";
const COVER_LINE_BOTTOM = "PRESENTA";

type Props = {
  src: string;
  accentColor: string;
  font: string;
  style?: CSSProperties;
};

function formatTime(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
}

/**
 * MP4 (Teaser_v17) con la misma shell UI que TeaserVideo en Vercel:
 * portada cover + Compañía/PRESENTA, play, fullscreen, barra al hover.
 */
export function TeaserFileVideo({ src, accentColor, font, style }: Props) {
  const rootRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const hideTimerRef = useRef<number | null>(null);
  const mobile = useIsMobile();
  const mobileUi = useIsMobileUi();
  const landscape = useIsLandscape();

  const [started, setStarted] = useState(false);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [totalMs, setTotalMs] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(false);
  /** Intención de reproducción (sobrevive a pause forzada por el navegador al girar) */
  const wantPlayingRef = useRef(false);

  const needsRotate = isFullscreen && mobileUi && !landscape;

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    const syncMeta = () => {
      if (Number.isFinite(v.duration) && v.duration > 0) setTotalMs(v.duration * 1000);
      setReady(true);
    };
    const onTime = () => setElapsedMs(v.currentTime * 1000);
    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onEnded = () => {
      setPlaying(false);
      wantPlayingRef.current = false;
      setStarted(false);
      setControlsVisible(false);
      setElapsedMs(0);
      v.currentTime = 0;
    };

    v.addEventListener("loadedmetadata", syncMeta);
    v.addEventListener("durationchange", syncMeta);
    v.addEventListener("canplay", syncMeta);
    v.addEventListener("timeupdate", onTime);
    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("ended", onEnded);
    if (v.readyState >= 1) syncMeta();

    return () => {
      v.removeEventListener("loadedmetadata", syncMeta);
      v.removeEventListener("durationchange", syncMeta);
      v.removeEventListener("canplay", syncMeta);
      v.removeEventListener("timeupdate", onTime);
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("ended", onEnded);
    };
  }, [src]);

  useEffect(() => {
    const onFs = () => {
      setIsFullscreen(Boolean(rootRef.current && document.fullscreenElement === rootRef.current));
    };
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !isFullscreen) return;
    if (needsRotate) {
      v.pause();
      return;
    }
    if (started && v.paused && !v.ended) void v.play().catch(() => {});
  }, [needsRotate, isFullscreen, started]);

  /** Tras girar el móvil el navegador a veces pausa el <video>; reanudar si seguíamos en marcha */
  useEffect(() => {
    const v = videoRef.current;
    if (!v || !started || needsRotate) return;
    if (wantPlayingRef.current && v.paused && !v.ended) void v.play().catch(() => {});
  }, [landscape, started, needsRotate]);

  const clearHide = useCallback(() => {
    if (hideTimerRef.current != null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const revealControls = useCallback(() => {
    clearHide();
    setControlsVisible(true);
  }, [clearHide]);

  const scheduleHideControls = useCallback(
    (delayMs = 900) => {
      clearHide();
      hideTimerRef.current = window.setTimeout(() => {
        setControlsVisible(false);
        hideTimerRef.current = null;
      }, delayMs);
    },
    [clearHide],
  );

  useEffect(() => () => clearHide(), [clearHide]);

  /** Igual que TeaserVideo: al pausar se muestran; al play se ocultan tras un momento */
  useEffect(() => {
    if (!started) {
      setControlsVisible(false);
      return;
    }
    if (needsRotate) {
      setControlsVisible(false);
      return;
    }
    revealControls();
    if (playing) scheduleHideControls(1000);
  }, [playing, started, needsRotate, revealControls, scheduleHideControls]);

  const play = () => {
    const v = videoRef.current;
    if (!v) return;
    setStarted(true);
    wantPlayingRef.current = true;
    void v.play().catch(() => {});
  };

  const pause = () => {
    wantPlayingRef.current = false;
    videoRef.current?.pause();
  };

  const seekMs = (ms: number) => {
    const v = videoRef.current;
    if (!v || !Number.isFinite(v.duration)) return;
    v.currentTime = Math.max(0, Math.min(v.duration, ms / 1000));
    setElapsedMs(v.currentTime * 1000);
  };

  const seekFromClientX = (clientX: number) => {
    const bar = barRef.current;
    if (!bar || totalMs <= 0) return;
    const rect = bar.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    seekMs(ratio * totalMs);
  };

  const toggleFullscreen = () => {
    const el = rootRef.current;
    if (!el) return;
    if (document.fullscreenElement === el) {
      void document.exitFullscreen().catch(() => {});
    } else {
      void el.requestFullscreen().catch(() => {});
    }
  };

  const pct = totalMs > 0 ? Math.min(100, (elapsedMs / totalMs) * 100) : 0;
  const mobileFullscreen = mobile && isFullscreen;
  const shortFrame = landscape && (mobile || mobileUi);
  const sidePad = "clamp(10px, 4cqw, 32px)";
  /* En landscape corto, menos margen para que Compañía/PRESENTA no se corten */
  const baseTop = shortFrame
    ? "clamp(8px, 5cqh, 28px)"
    : "clamp(24px, 8cqh, 56px)";
  const baseBottom = shortFrame
    ? "clamp(8px, 5cqh, 28px)"
    : "clamp(24px, 8cqh, 56px)";
  const top = mobileFullscreen
    ? `calc(${baseTop} + 6px)`
    : mobile
      ? baseTop
      : shortFrame
        ? baseTop
        : `calc(${baseTop} + 20px)`;
  const bottom = mobile || shortFrame ? baseBottom : `calc(${baseBottom} + 10px)`;

  return (
    <div
      ref={rootRef}
      onClick={() => {
        if (needsRotate || !started) return;
        if (playing) pause();
        else play();
      }}
      onMouseEnter={() => {
        if (!started || needsRotate) return;
        revealControls();
      }}
      onMouseMove={() => {
        if (!started || needsRotate) return;
        revealControls();
        if (playing) scheduleHideControls(1000);
      }}
      onMouseLeave={() => {
        if (!started || needsRotate) return;
        if (playing) scheduleHideControls(200);
        else setControlsVisible(false);
      }}
      style={{
        position: "relative",
        background: "#000",
        overflow: "hidden",
        borderRadius: isFullscreen ? 0 : 4,
        cursor: started && !needsRotate ? "pointer" : undefined,
        ...style,
        ...(isFullscreen
          ? {
              width: "100vw",
              height: "100vh",
              maxWidth: "none",
              maxHeight: "none",
              aspectRatio: undefined,
            }
          : null),
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          containerType: "size",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#000",
        }}
      >
        {/* Llena la caja; el padre garantiza 16:9 = MP4 → contain no letterboxea ni recorta */}
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            containerType: "size",
            background: "#000",
            width: isFullscreen
              ? "min(100vw, calc(100vh * 16 / 9))"
              : "100%",
            height: isFullscreen
              ? "min(100vh, calc(100vw * 9 / 16))"
              : "100%",
            maxWidth: "100%",
            maxHeight: "100%",
            flexShrink: 0,
          }}
        >
        <video
          ref={videoRef}
          src={src}
          playsInline
          preload="auto"
          controls={false}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            objectPosition: "center",
            background: "#000",
            opacity: started && !needsRotate ? 1 : 0,
            pointerEvents: "none",
          }}
        />

        {!started && !needsRotate && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              backgroundColor: "#000",
              zIndex: 5,
              containerType: "size",
              overflow: "hidden",
            }}
          >
            <img
              src={TEASER_COVER_BG}
              alt=""
              draggable={false}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "center",
                pointerEvents: "none",
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 2,
                containerType: "size",
                pointerEvents: "none",
              }}
            >
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "rgba(0,0,0,0.22)",
                }}
              />
              <p
                style={{
                  position: "absolute",
                  top,
                  left: sidePad,
                  right: sidePad,
                  margin: 0,
                  fontFamily: font,
                  fontSize: "clamp(9px, min(4.2cqw, 5.5cqh), 28px)",
                  fontWeight: 700,
                  letterSpacing: "clamp(0.04em, 0.65cqw, 0.12em)",
                  lineHeight: 1.3,
                  textAlign: "center",
                  textTransform: "uppercase",
                  color: accentColor,
                  maxWidth: "100%",
                  boxSizing: "border-box",
                }}
              >
                {mobileFullscreen ? (
                  <>
                    <span style={{ display: "block" }}>Compañía</span>
                    <span style={{ display: "block" }}>OBSCENA TEATRAL</span>
                  </>
                ) : (
                  COVER_LINE_TOP
                )}
              </p>
              <p
                style={{
                  position: "absolute",
                  bottom,
                  left: sidePad,
                  right: sidePad,
                  margin: 0,
                  fontFamily: font,
                  fontSize: "clamp(14px, min(7cqw, 10cqh), 44px)",
                  fontWeight: 700,
                  letterSpacing: "clamp(0.08em, 1.4cqw, 0.18em)",
                  lineHeight: 1.1,
                  textAlign: "center",
                  textTransform: "uppercase",
                  color: accentColor,
                  maxWidth: "100%",
                  boxSizing: "border-box",
                }}
              >
                {COVER_LINE_BOTTOM}
              </p>
            </div>

            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  play();
                }}
                disabled={!ready}
                aria-label="Reproducir teaser"
                style={{
                  pointerEvents: "auto",
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  border: `2px solid ${accentColor}`,
                  background: "rgba(0,0,0,0.45)",
                  cursor: ready ? "pointer" : "wait",
                  opacity: ready ? 1 : 0.55,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                }}
              >
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: `22px solid ${accentColor}`,
                    borderTop: "14px solid transparent",
                    borderBottom: "14px solid transparent",
                    marginLeft: 6,
                  }}
                />
              </button>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                toggleFullscreen();
              }}
              aria-label={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
              style={{
                position: "absolute",
                right: 10,
                bottom: 10,
                zIndex: 6,
                width: 34,
                height: 34,
                borderRadius: "50%",
                border: `1.5px solid ${accentColor}`,
                background: "rgba(0,0,0,0.55)",
                color: accentColor,
                cursor: "pointer",
                fontSize: 15,
                lineHeight: 1,
                padding: 0,
              }}
            >
              {isFullscreen ? "⤡" : "⤢"}
            </button>
          </div>
        )}

        {started && !needsRotate && (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 20,
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "8px 10px",
              background:
                "linear-gradient(to top, rgba(0,0,0,0.82), rgba(0,0,0,0.35), transparent)",
              opacity: controlsVisible ? 1 : 0,
              pointerEvents: controlsVisible ? "auto" : "none",
              transition: "opacity 0.22s ease",
            }}
          >
            <button
              type="button"
              onClick={playing ? pause : play}
              aria-label={playing ? "Pausar teaser" : "Reproducir teaser"}
              style={{
                flexShrink: 0,
                width: 34,
                height: 34,
                borderRadius: "50%",
                border: `1.5px solid ${accentColor}`,
                background: "rgba(0,0,0,0.55)",
                color: accentColor,
                cursor: "pointer",
                fontSize: 14,
                lineHeight: 1,
                padding: 0,
              }}
            >
              {playing ? "❚❚" : "▶"}
            </button>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                ref={barRef}
                role="slider"
                aria-valuemin={0}
                aria-valuemax={totalMs}
                aria-valuenow={elapsedMs}
                tabIndex={0}
                onClick={(e) => seekFromClientX(e.clientX)}
                onKeyDown={(e) => {
                  if (e.key === "ArrowRight") seekMs(Math.min(totalMs, elapsedMs + 2000));
                  if (e.key === "ArrowLeft") seekMs(Math.max(0, elapsedMs - 2000));
                }}
                style={{
                  height: 6,
                  borderRadius: 3,
                  background: "rgba(255,255,255,0.18)",
                  cursor: "pointer",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${pct}%`,
                    borderRadius: 3,
                    background: accentColor,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: `${pct}%`,
                    transform: "translate(-50%, -50%)",
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: accentColor,
                    boxShadow: "0 0 6px rgba(0,0,0,0.5)",
                  }}
                />
              </div>
              <div
                style={{
                  marginTop: 4,
                  fontFamily: font,
                  fontSize: 11,
                  color: accentColor,
                  opacity: 0.85,
                  letterSpacing: "0.04em",
                }}
              >
                {formatTime(elapsedMs)} / {formatTime(totalMs)}
              </div>
            </div>
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
              style={{
                flexShrink: 0,
                width: 34,
                height: 34,
                borderRadius: "50%",
                border: `1.5px solid ${accentColor}`,
                background: "rgba(0,0,0,0.55)",
                color: accentColor,
                cursor: "pointer",
                fontSize: 15,
                lineHeight: 1,
                padding: 0,
              }}
            >
              {isFullscreen ? "⤡" : "⤢"}
            </button>
          </div>
        )}
        </div>
      </div>

      {needsRotate && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 30,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            background: "#000",
            padding: 24,
            boxSizing: "border-box",
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: font,
              fontSize: "clamp(14px, 4.2vw, 22px)",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textAlign: "center",
              textTransform: "uppercase",
              color: accentColor,
              lineHeight: 1.35,
            }}
          >
            Gira el teléfono a horizontal
          </p>
          <p
            style={{
              margin: 0,
              fontFamily: font,
              fontSize: "clamp(11px, 3.2vw, 15px)",
              letterSpacing: "0.06em",
              textAlign: "center",
              color: accentColor,
              opacity: 0.75,
            }}
          >
            El teaser se ve en apaisado
          </p>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleFullscreen();
            }}
            aria-label="Salir de pantalla completa"
            style={{
              position: "absolute",
              right: 10,
              bottom: 10,
              width: 34,
              height: 34,
              borderRadius: "50%",
              border: `1.5px solid ${accentColor}`,
              background: "rgba(0,0,0,0.55)",
              color: accentColor,
              cursor: "pointer",
              fontSize: 15,
              lineHeight: 1,
              padding: 0,
            }}
          >
            ⤡
          </button>
        </div>
      )}
    </div>
  );
}
