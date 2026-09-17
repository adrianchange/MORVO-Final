import type { PaletteTheme } from "../../theme/palettes";
import { slideText } from "../../theme/palettes";
import { mutedTextStyle, slideShellStyle } from "./slideStyles";

type Props = {
  theme: PaletteTheme;
  index: string;
  title: string;
  subtitle?: string;
};

export function PlaceholderSlide({ theme, index, title, subtitle }: Props) {
  const text = slideText(theme);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 clamp(24px, 6vw, 48px)",
        boxSizing: "border-box",
        ...slideShellStyle(theme),
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "clamp(20px, 3vh, 32px)",
          left: "clamp(24px, 4vw, 48px)",
          fontFamily: "'Cinzel', serif",
          color: theme.bg ? text : theme.accent,
          opacity: theme.bg ? 0.65 : 0.5,
          fontSize: "clamp(10px,1vw,14px)",
          letterSpacing: "0.3em",
        }}
      >
        {index}
      </div>
      <h2
        style={{
          fontFamily: "'Cinzel', serif",
          fontWeight: 700,
          fontSize: "clamp(28px,4vw,48px)",
          color: text,
          letterSpacing: "0.12em",
          margin: 0,
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontStyle: "italic",
            ...mutedTextStyle(theme, 0.7),
            fontSize: "clamp(14px,1.6vw,22px)",
            maxWidth: 600,
            textAlign: "center",
            marginTop: 16,
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
