import { TeaserVideo } from "./TeaserVideo";
import { PALETTES, slideText } from "../theme/palettes";
import { fontDisplay } from "../theme/typography";

/** Vista solo teaser 16:9 — para exportar MP4 sin dossier */
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
        paletteId="raiz_petroleo"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}
