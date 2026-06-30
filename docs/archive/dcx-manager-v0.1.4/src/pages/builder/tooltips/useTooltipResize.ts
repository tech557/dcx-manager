import { useState } from "react";
import type React from "react";

type ResizeSide = "r" | "tr" | "tl";

export function useTooltipResize(defaultSize: { width: number; height: number }) {
  const [size, setSize] = useState(defaultSize);

  const startResize = (e: React.PointerEvent, side: ResizeSide) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const start = { ...size };

    const onMove = (move: PointerEvent) => {
      const dx = move.clientX - startX;
      const dy = move.clientY - startY;
      setSize({
        width: Math.max(260, start.width + (side === "tl" ? -dx : dx)),
        height: Math.max(160, start.height + (side === "tr" ? -dy : dy)),
      });
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return { size, startResize };
}
