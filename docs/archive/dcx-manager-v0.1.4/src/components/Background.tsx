import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect } from "react";

interface BackgroundProps {
  isDark: boolean;
}

export function Background({ isDark }: BackgroundProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div id="app-background" className="fixed inset-0 z-[-1] overflow-hidden edge-glow">
      {/* Dark Mode Layer */}
      <motion.div 
        animate={{ opacity: isDark ? 1 : 0 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-bg-deep"
      >
        <motion.div
           className="pointer-events-none absolute h-[1000px] w-[1000px] rounded-full opacity-60"
           style={{
             x: smoothX,
             y: smoothY,
             translateX: "-50%",
             translateY: "-50%",
             background: `radial-gradient(circle, rgba(117, 226, 255, 0.35) 0%, rgba(117, 226, 255, 0.1) 40%, transparent 70%)`,
             filter: "blur(40px)",
           }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(117,226,255,0.12),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.2] scanning-lines" />
        <div className="animate-scan absolute h-px w-full bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_30px_rgba(117,226,255,0.6)]" />
      </motion.div>

      {/* Light Mode Layer */}
      <motion.div 
        animate={{ opacity: isDark ? 0 : 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 bg-bg-light"
      >
        <motion.div
           className="pointer-events-none absolute h-[1000px] w-[1000px] rounded-full opacity-40"
           style={{
             x: smoothX,
             y: smoothY,
             translateX: "-50%",
             translateY: "-50%",
             background: `radial-gradient(circle, rgba(0, 0, 0, 0.08) 0%, rgba(0, 0, 0, 0.03) 40%, transparent 70%)`,
             filter: "blur(60px)",
           }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(0,0,0,0.03),transparent_40%)]" />
      </motion.div>

      {/* Shared Noise Overlay */}
      <div className={`noise absolute inset-0 transition-opacity duration-1000 ${isDark ? 'opacity-10' : 'opacity-5'}`} />
    </div>
  );
}
