import React, { useEffect, useRef, useState } from "react";

export interface LightRaysProps {
  raysOrigin?: "top-center" | "top-left" | "top-right";
  raysColor?: string;
  raysSpeed?: number;
  lightSpread?: number;
  rayLength?: number;
  pulsating?: boolean;
  fadeDistance?: number;
  saturation?: number;
  followMouse?: boolean;
  mouseInfluence?: number;
  noiseAmount?: number;
  distortion?: number;
  selectedNodeIds?: string[];
}

export function LightRays({
  raysOrigin = "top-center",
  raysColor = "rgb(255, 255, 255)",
  raysSpeed = 1,
  lightSpread = 1,
  rayLength = 2,
  pulsating = false,
  fadeDistance = 1,
  saturation = 1,
  followMouse = true,
  mouseInfluence = 0.1,
  selectedNodeIds = [],
}: LightRaysProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.2 });

  // Monitor mouse movements in the container to drive followMouse effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!followMouse) return;
      const width = window.innerWidth;
      const height = window.innerHeight;
      setMousePos({
        x: e.clientX / width,
        y: e.clientY / height,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [followMouse]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const accentSubtle = getComputedStyle(document.documentElement)
      .getPropertyValue("--theme-accent-subtle")
      .trim() || "rgba(117, 226, 255, 0.08)";

    let animationFrameId: number;
    let time = 0;

    // Build unique characteristics for 6 beautiful overlapping light rays
    const rays = [
      { baseAngle: Math.PI / 2, widthCoeff: 0.18, speedCoeff: 0.6, phase: 0, opacityMultiplier: 1.0 },
      { baseAngle: Math.PI / 2 - 0.18, widthCoeff: 0.12, speedCoeff: 0.4, phase: 1.5, opacityMultiplier: 0.7 },
      { baseAngle: Math.PI / 2 + 0.18, widthCoeff: 0.14, speedCoeff: 0.5, phase: 3.1, opacityMultiplier: 0.8 },
      { baseAngle: Math.PI / 2 - 0.35, widthCoeff: 0.08, speedCoeff: 0.3, phase: 4.8, opacityMultiplier: 0.4 },
      { baseAngle: Math.PI / 2 + 0.35, widthCoeff: 0.09, speedCoeff: 0.35, phase: 2.2, opacityMultiplier: 0.5 },
      { baseAngle: Math.PI / 2, widthCoeff: 0.25, speedCoeff: 0.2, phase: 0.5, opacityMultiplier: 0.3 }, // wide back glow
    ];

    const resizeCanvas = () => {
      const parent = containerRef.current;
      if (!parent) return;
      canvas.width = parent.clientWidth;
      canvas.height = parent.clientHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Main animation draw loop
    const render = () => {
      time += 1 * raysSpeed;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Determine starting origin of rays
      let originX = canvas.width / 2;
      const originY = 0;

      if (raysOrigin === "top-left") {
        originX = 0;
      } else if (raysOrigin === "top-right") {
        originX = canvas.width;
      }

      // followMouse horizontal displacement for origin
      if (followMouse) {
        const centerShift = (mousePos.x - 0.5) * canvas.width * mouseInfluence;
        originX += centerShift;
      }

      // Check card selection to change lighting dynamics
      const hasSelection = selectedNodeIds && selectedNodeIds.length > 0;
      // Fade/pulsing brightness logic
      const baseOpacityMultiplier = hasSelection ? 1.7 : 1.0;
      const pulsingFactor = pulsating 
        ? 0.7 + Math.sin(time * 0.015) * 0.3
        : 1.0;

      // Draw each volumetric light ray
      rays.forEach((ray) => {
        ctx.save();
        ctx.globalCompositeOperation = "screen";

        // Dynamic angle oscillation + target cursor influence
        let currentAngle = ray.baseAngle + Math.sin(time * 0.004 * ray.speedCoeff + ray.phase) * 0.08;

        if (followMouse) {
          // Tilt the rays gently toward the mouse
          const dx = mousePos.x * canvas.width - originX;
          const dy = mousePos.y * canvas.height - originY;
          const angleToMouse = Math.atan2(dy, dx);
          // Blended offset
          const angleDiff = angleToMouse - ray.baseAngle;
          currentAngle += angleDiff * mouseInfluence * 0.5;
        }

        const spread = ray.widthCoeff * lightSpread;
        const length = canvas.height * rayLength;

        // Create volumetric path (light cone segment)
        ctx.beginPath();
        ctx.moveTo(originX, originY);
        
        const x1 = originX + Math.cos(currentAngle - spread) * length;
        const y1 = originY + Math.sin(currentAngle - spread) * length;
        const x2 = originX + Math.cos(currentAngle + spread) * length;
        const y2 = originY + Math.sin(currentAngle + spread) * length;

        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.closePath();

        // Create linear color gradient along the ray's main direction
        const midAngle = currentAngle;
        const targetX = originX + Math.cos(midAngle) * length;
        const targetY = originY + Math.sin(midAngle) * length;

        const grad = ctx.createLinearGradient(originX, originY, targetX, targetY * fadeDistance);

        // Convert hex/string selection to formatted rgba with varying alpha stops
        let rgb = "255, 255, 255";
        if (raysColor.startsWith("#")) {
          const hex = raysColor.replace("#", "");
          const r = parseInt(hex.substring(0, 2), 16);
          const g = parseInt(hex.substring(2, 4), 16);
          const b = parseInt(hex.substring(4, 6), 16);
          if (!isNaN(r) && !isNaN(g) && !isNaN(b)) {
            rgb = `${r}, ${g}, ${b}`;
          }
        }

        const intensity = 0.09 * ray.opacityMultiplier * baseOpacityMultiplier * pulsingFactor * saturation;

        grad.addColorStop(0, `rgba(${rgb}, ${intensity * 1.5})`);
        grad.addColorStop(0.12, `rgba(${rgb}, ${intensity})`);
        grad.addColorStop(0.4, `rgba(${rgb}, ${intensity * 0.4})`);
        grad.addColorStop(0.75, `rgba(${rgb}, ${intensity * 0.08})`);
        grad.addColorStop(1.0, `rgba(${rgb}, 0)`);

        ctx.fillStyle = grad;
        ctx.fill();
        ctx.restore();
      });

      // Optional extra focal highlight when card is selected
      if (hasSelection) {
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        const focalGrad = ctx.createRadialGradient(
          originX, originY, 0,
          originX, originY, canvas.height * 0.35
        );
        focalGrad.addColorStop(0, "rgba(255, 255, 255, 0.08)");
        focalGrad.addColorStop(0.5, accentSubtle);
        focalGrad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = focalGrad;
        ctx.beginPath();
        ctx.arc(originX, originY, canvas.height * 0.35, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [raysOrigin, raysColor, raysSpeed, lightSpread, rayLength, pulsating, fadeDistance, saturation, followMouse, mouseInfluence, selectedNodeIds, mousePos]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
      <canvas
        ref={canvasRef}
        className="w-full h-full mix-blend-screen scale-110 translate-y-[-5%] blur-[48px] opacity-[0.92]"
      />
    </div>
  );
}
