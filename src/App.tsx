import type { ReactNode } from "react";
import { Dossier } from "./components/Dossier";
import { RecordPetroleoTeaser } from "./components/RecordPetroleoTeaser";
import { RecordV09CreditsEnd } from "./components/RecordV09CreditsEnd";
import { useIsMobile } from "./hooks/useIsMobile";

function recordMode(): "petroleo" | "v09-credits" | null {
  if (typeof window === "undefined") return null;
  const v = new URLSearchParams(window.location.search).get("record");
  if (v === "petroleo") return "petroleo";
  if (v === "v09-credits") return "v09-credits";
  return null;
}

function Stage({ children }: { children: ReactNode }) {
  const mobile = useIsMobile();

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#050504",
      }}
    >
      <div
        style={{
          position: "relative",
          ...(mobile
            ? { width: "100vw", height: "100vh" }
            : {
                width: "min(100vw, 177.78vh)",
                height: "min(56.25vw, 100vh)",
                aspectRatio: "16 / 9",
              }),
          overflow: "hidden",
          boxShadow: mobile ? "none" : "0 0 80px rgba(0,0,0,0.8)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const mode = recordMode();
  const transparentCredits =
    mode === "v09-credits" &&
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("bg") === "transparent";

  if (mode === "petroleo") {
    return (
      <div style={{ position: "fixed", inset: 0, background: "#000" }}>
        <RecordPetroleoTeaser />
      </div>
    );
  }

  if (mode === "v09-credits") {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: transparentCredits ? "transparent" : "#000",
        }}
      >
        <RecordV09CreditsEnd />
      </div>
    );
  }

  return (
    <Stage>
      <Dossier paletteId="raiz_petroleo" />
    </Stage>
  );
}
