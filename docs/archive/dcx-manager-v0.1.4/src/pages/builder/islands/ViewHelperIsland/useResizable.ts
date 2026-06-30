import { useState } from "react";
import type React from "react";

export function useResizable(initialWidth: number, initialHeight: number) {
  const [width, setWidth] = useState(initialWidth);
  const [height, setHeight] = useState(initialHeight);

  const resizeHandleProps = {
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      const startX = e.clientX;
      const startY = e.clientY;
      const startWidth = width;
      const startHeight = height;

      const onMove = (move: PointerEvent) => {
        setWidth(Math.max(420, startWidth - (move.clientX - startX)));
        setHeight(Math.max(300, startHeight - (move.clientY - startY)));
      };
      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
  };

  return { width, height, resizeHandleProps };
}
