import { TeaserVideo } from "./TeaserVideo";
import { PALETTES, slideText } from "../theme/palettes";
import { fontDisplay } from "../theme/typography";

/**
 * Vista de captura: montaje interactivo a pantalla completa.
 * Playwright fija el viewport (p. ej. 1920×960 = 2:1 embebido).
 */
export function RecordPetroleoTeaser() {
  const theme = PALETTES.raiz_petroleo;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        background: "#000",
        overflow: "hidden",
      }}
    >
      <TeaserVideo
        font={fontDisplay(theme)}
        accentColor={slideText(theme)}
        paletteId={theme.id}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          maxWidth: "none",
          maxHeight: "none",
          aspectRatio: undefined,
          borderRadius: 0,
        }}
      />
    </div>
  );
}
