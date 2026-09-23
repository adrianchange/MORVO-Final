import type { CSSProperties, ReactNode } from "react";
import type { PaletteTheme } from "../../theme/palettes";
import { slideText } from "../../theme/palettes";
import { fontBody, fontDisplay, slideShellStyle } from "./slideStyles";

export function slideRootStyle(theme: PaletteTheme, allowScroll = false): CSSProperties {
  return {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    overflow: allowScroll ? "auto" : "hidden",
    display: allowScroll ? "flex" : undefined,
    flexDirection: allowScroll ? "column" : undefined,
    ...slideShellStyle(theme),
  };
}

export function SlideIndex({
  theme,
  index,
}: {
  theme: PaletteTheme;
  index: string;
}) {
  const text = slideText(theme);
  return (
    <div
      style={{
        position: "absolute",
        top: "clamp(20px, 3vh, 32px)",
        left: "clamp(24px, 4vw, 48px)",
        zIndex: 20,
        fontFamily: fontDisplay(theme),
        color: text,
        opacity: theme.bg ? 0.65 : 0.5,
        fontSize: "clamp(10px, 1vw, 14px)",
        letterSpacing: "0.3em",
      }}
    >
      {index}
    </div>
  );
}

export function MediaFrame({
  theme,
  label,
  style,
}: {
  theme: PaletteTheme;
  label: string;
  style?: CSSProperties;
}) {
  const text = slideText(theme);
  return (
    <div
      style={{
        border: `1px solid ${text}44`,
        background: `${text}0A`,
        boxSizing: "border-box",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "clamp(16px, 2vw, 28px)",
        ...style,
      }}
    >
      <span
        style={{
          fontFamily: fontBody(theme),
          fontStyle: "italic",
          fontSize: "clamp(12px, 1.2vw, 18px)",
          color: text,
          opacity: 0.45,
          letterSpacing: "0.08em",
          maxWidth: "85%",
        }}
      >
        {label}
      </span>
    </div>
  );
}

export function SlideShell({
  theme,
  index,
  children,
  scrollable = false,
  background,
}: {
  theme: PaletteTheme;
  index: string;
  children: ReactNode;
  scrollable?: boolean;
  background?: string;
}) {
  const root = slideRootStyle(theme, scrollable);
  return (
    <div
      style={
        background
          ? {
              ...root,
              background,
              backgroundColor: background,
              backgroundImage: "none",
            }
          : root
      }
    >
      {children}
    </div>
  );
}
