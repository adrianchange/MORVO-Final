import type { CSSProperties } from "react";
import {
  DROP_CREDIT_FONT_SIZE,
  SELVA_CREDIT_FONT,
  dropCreditLetterSpacing,
  dropCreditScaleX,
} from "../theme/typography";
import { useIsMobile } from "./useIsMobile";

/** Tipografía del subtítulo «Naz Montés» — misma referencia que Raíz Selva */
export function useCoverCreditTypography(
  color?: string,
  extra?: CSSProperties,
) {
  const mobile = useIsMobile();
  const textStyle: CSSProperties = {
    margin: 0,
    fontFamily: SELVA_CREDIT_FONT,
    fontStyle: "italic",
    fontWeight: 400,
    fontSize: DROP_CREDIT_FONT_SIZE,
    letterSpacing: dropCreditLetterSpacing(mobile),
    textTransform: "uppercase",
    whiteSpace: "nowrap",
    ...(color !== undefined ? { color } : {}),
    ...extra,
  };
  const wrapStyle: CSSProperties = {
    alignSelf: "center",
    transform: `scaleX(${dropCreditScaleX(mobile)})`,
    transformOrigin: "center center",
  };
  return { mobile, textStyle, wrapStyle };
}
