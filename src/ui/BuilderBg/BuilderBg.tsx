import React from "react";
import { LightRays } from "./LightRays";

interface BuilderBgProps {
  selectedNodeIds?: string[];
}

export function BuilderBg({ selectedNodeIds }: BuilderBgProps) {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-[1]">
      {/* Top Radial Color Glow Overlay (STG-005 / Senior UI/UX enhancement) */}
      <div className="absolute inset-x-0 top-0 h-[35rem] bg-[radial-gradient(circle_at_top,_var(--theme-accent-subtle),_rgba(59,130,246,0.03)_40%,_transparent_70%)] pointer-events-none" />

      {/* Light Rays Volumetric Effect */}
      <LightRays
        raysOrigin="top-center"
        raysColor="rgb(255, 255, 255)"
        raysSpeed={0.8}
        lightSpread={1.1}
        rayLength={1.8}
        pulsating={false}
        fadeDistance={0.9}
        saturation={1.0}
        followMouse={true}
        mouseInfluence={0.06}
        selectedNodeIds={selectedNodeIds}
      />
    </div>
  );
}
