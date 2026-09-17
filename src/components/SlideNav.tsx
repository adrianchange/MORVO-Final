import type { CSSProperties } from "react";
import type { PaletteTheme } from "../theme/palettes";
import { isRaizPremium } from "../theme/palettes";
import { slideText } from "../theme/palettes";
import { useIsMobile } from "../hooks/useIsMobile";

type Props = {
  theme: PaletteTheme;
  onPrev: () => void;
  onNext: () => void;
};

function Chevron({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {direction === "left" ? (
        <path d="M15 6l-6 6 6 6" />
      ) : (
        <path d="M9 6l6 6-6 6" />
      )}
    </svg>
  );
}

const arrowBase: CSSProperties = {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 60,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "clamp(40px,4.5vw,56px)",
  height: "clamp(40px,4.5vw,56px)",
  borderRadius: "50%",
  border: "none",
  cursor: "pointer",
  transition: "background 0.2s, border-color 0.2s",
};

function NavArrow({
  side,
  theme,
  onClick,
  label,
  bottom,
}: {
  side: "left" | "right";
  theme: PaletteTheme;
  onClick: () => void;
  label: string;
  bottom?: boolean;
}) {
  const accent = theme.accent;
  const fg = theme.bg ? slideText(theme) : accent;
  const navBg = theme.bg ? "rgba(0,0,0,0.32)" : "rgba(10,10,8,0.72)";
  const navBgHover = theme.bg ? "rgba(0,0,0,0.48)" : `${accent}18`;

  const posStyle: CSSProperties = bottom
    ? {
        bottom: 48,
        ...(side === "left" ? { left: 16 } : { right: 16 }),
        top: "auto",
        transform: "none",
        width: 40,
        height: 40,
      }
    : {
        ...arrowBase,
        ...(side === "left"
          ? { left: "clamp(12px,2vw,28px)" }
          : { right: "clamp(12px,2vw,28px)" }),
      };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      style={{
        position: "absolute",
        zIndex: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        cursor: "pointer",
        transition: "background 0.2s, border-color 0.2s",
        ...posStyle,
        color: fg,
        background: navBg,
        border: `1px solid ${fg}55`,
        boxShadow: `0 0 24px ${fg}22`,
        outline: "none",
        WebkitTapHighlightColor: "transparent",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = navBgHover;
        e.currentTarget.style.borderColor = `${fg}99`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = navBg;
        e.currentTarget.style.borderColor = `${fg}55`;
      }}
    >
      <Chevron direction={side} />
    </button>
  );
}

export function SlideNav({ theme, onPrev, onNext }: Props) {
  const mobile = useIsMobile();
  const bottom =
    mobile &&
    isRaizPremium(theme) &&
    theme.id !== "raiz_petroleo" &&
    theme.id !== "raiz_black" &&
    theme.id !== "raiz_esmeralda";

  return (
    <>
      <NavArrow
        side="left"
        theme={theme}
        onClick={onPrev}
        label="Vista anterior"
        bottom={bottom}
      />
      <NavArrow
        side="right"
        theme={theme}
        onClick={onNext}
        label="Vista siguiente"
        bottom={bottom}
      />
    </>
  );
}
