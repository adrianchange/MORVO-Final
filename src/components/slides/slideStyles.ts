import type { CSSProperties } from "react";
import type { PaletteTheme } from "../../theme/palettes";
import { slideBackground, slideText } from "../../theme/palettes";
import { fontBody, fontDisplay } from "../../theme/typography";

export { fontBody, fontDisplay };

export function slideShellStyle(theme: PaletteTheme): CSSProperties {
  return {
    background: slideBackground(theme),
    color: slideText(theme),
  };
}

export function mutedTextStyle(
  theme: PaletteTheme,
  opacity = 0.55
): CSSProperties {
  return {
    color: slideText(theme),
    opacity,
  };
}
