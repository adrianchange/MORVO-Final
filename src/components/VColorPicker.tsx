import { motion } from "motion/react";
import type { PaletteId } from "../theme/palettes";
import { PALETTES } from "../theme/palettes";
import { CoverTitle } from "./CoverTitle";
import { useIsMobile } from "../hooks/useIsMobile";

const BG = "#0A0A08";
const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`;

const ORIGINALS: {
  id: PaletteId;
  label: string;
  description: string;
}[] = [
  { id: "liturgico", label: "LITÚRGICO", description: `Verde ${PALETTES.liturgico.greenLabel} · fondo rojo` },
  { id: "hospital", label: "HOSPITAL", description: `Verde ${PALETTES.hospital.greenLabel} · V roja` },
  { id: "tierra", label: "PODREDUMBRE", description: `Verde ${PALETTES.tierra.greenLabel} · rojo ↔ lavanda` },
  { id: "invertida", label: "INVERTIDA", description: `Verde ${PALETTES.invertida.greenLabel} · MOR·O vino` },
  { id: "mezcla", label: "MEZCLA", description: `Verde ${PALETTES.mezcla.greenLabel} · fondo fijo` },
];

const RAIZ_OPTIONS: {
  id: PaletteId;
  label: string;
  description: string;
}[] = [
  { id: "raiz", label: "RAÍZ SELVA", description: "Selva · vínculo óxido" },
  { id: "raiz_forest", label: "RAÍZ FOREST", description: "Forest terroso · hoja otoñal" },
  { id: "raiz_black", label: "RAÍZ BLACK", description: "Forest terroso · negro" },
  { id: "raiz_pino", label: "RAÍZ PINO", description: "Helecho · negro · lágrima cian" },
  { id: "raiz_petroleo", label: "RAÍZ PETRÓLEO", description: "Cinzel · salmón Esmeralda" },
  { id: "raiz_helecho", label: "RAÍZ HELECHO", description: "Cian Killing Eve · título serie" },
  { id: "raiz_niebla", label: "RAÍZ NIEBLA", description: "Rojo · negro Killing Eve" },
  { id: "raiz_esmeralda", label: "RAÍZ ESMERALDA", description: "Esmeralda · vínculo óxido" },
];

type Props = {
  onSelect: (id: PaletteId) => void;
};

export function VColorPicker({ onSelect }: Props) {
  const mobile = useIsMobile();

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        background: BG,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          backgroundImage: GRAIN_SVG,
          backgroundRepeat: "repeat",
          backgroundSize: "256px 256px",
          opacity: 0.06,
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 10,
          flex: 1,
          minHeight: 0,
          width: "100%",
          overflowY: "auto",
          overflowX: "hidden",
          WebkitOverflowScrolling: "touch",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: mobile
            ? "24px 16px"
            : "clamp(20px, 4vh, 40px) clamp(12px, 2vw, 28px)",
          gap: mobile ? "16px" : "clamp(16px, 2.5vh, 28px)",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              fontFamily: "'Cinzel', serif",
              color: "#EDE8D5",
              fontSize: mobile ? 11 : "clamp(8px, 0.75vw, 11px)",
              letterSpacing: "0.6em",
              opacity: 0.8,
            }}
          >
            ELIGE LA PALETA
          </div>
          <div
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontStyle: "italic",
              color: "#EDE8D5",
              opacity: 0.35,
              fontSize: mobile ? 12 : "clamp(9px, 0.85vw, 13px)",
              textAlign: "center",
            }}
          >
            Versiones originales + Raíz en ocho verdes
          </div>
        </div>

        {renderSection("ORIGINALES", ORIGINALS, onSelect, mobile)}
        {renderSection("RAÍZ · ELIGE VERDE", RAIZ_OPTIONS, onSelect, mobile)}
      </div>
    </div>
  );
}

function renderSection(
  title: string,
  items: { id: PaletteId; label: string; description: string }[],
  onSelect: (id: PaletteId) => void,
  mobile: boolean,
) {
  return (
    <>
      <div
        style={{
          fontFamily: "'Cinzel', serif",
          color: "#EDE8D5",
          fontSize: mobile ? 9 : "clamp(7px, 0.65vw, 9px)",
          letterSpacing: "0.45em",
          opacity: 0.5,
          flexShrink: 0,
        }}
      >
        {title}
      </div>
      <div
        style={{
          width: "100%",
          maxWidth: 1100,
          display: "grid",
          gridTemplateColumns: mobile
            ? "repeat(2, 1fr)"
            : `repeat(${Math.min(items.length, 6)}, 1fr)`,
          gap: mobile ? 10 : "clamp(6px, 1vw, 14px)",
          paddingBottom: mobile ? 8 : "clamp(8px, 1.5vh, 16px)",
        }}
      >
        {items.map((opt) => {
          const palette = PALETTES[opt.id];
          const accent = palette.accent;

          return (
            <motion.button
              key={opt.id}
              type="button"
              onClick={() => onSelect(opt.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                minWidth: 0,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                background: "rgba(255,255,255,0.015)",
                border: `1px solid ${accent}33`,
                padding: mobile
                  ? "12px 8px"
                  : "clamp(10px, 1.8vh, 18px) clamp(6px, 1vw, 14px)",
                gap: mobile ? 6 : "clamp(5px, 0.8vh, 10px)",
                cursor: "pointer",
                boxSizing: "border-box",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: 4,
                  borderRadius: 1,
                  background: palette.greenDark,
                  opacity: 0.9,
                  flexShrink: 0,
                }}
              />

              <div
                style={{
                  width: "100%",
                  overflow: "hidden",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: mobile ? 28 : "clamp(24px, 3.5vh, 38px)",
                }}
              >
                <div
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontWeight: 900,
                    fontSize: mobile ? 14 : "clamp(10px, 1.2vw, 18px)",
                    lineHeight: 1,
                    maxWidth: "100%",
                    transform: mobile ? "scale(0.92)" : "scale(0.88)",
                    transformOrigin: "center center",
                  }}
                >
                  <CoverTitle palette={opt.id} compact />
                </div>
              </div>

              <div
                style={{
                  width: "100%",
                  height: 1,
                  flexShrink: 0,
                  background: `linear-gradient(90deg, transparent, ${accent}66, transparent)`,
                }}
              />

              <div
                style={{
                  fontFamily: "'Cinzel', serif",
                  color: accent,
                  fontSize: mobile ? 8 : "clamp(6px, 0.55vw, 9px)",
                  letterSpacing: "0.3em",
                  flexShrink: 0,
                }}
              >
                {opt.label}
              </div>

              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontStyle: "italic",
                  color: "#EDE8D5",
                  opacity: 0.45,
                  fontSize: mobile ? 9 : "clamp(6px, 0.65vw, 10px)",
                  textAlign: "center",
                  lineHeight: 1.35,
                  flexShrink: 0,
                }}
              >
                {opt.description}
              </div>
            </motion.button>
          );
        })}
      </div>
    </>
  );
}
