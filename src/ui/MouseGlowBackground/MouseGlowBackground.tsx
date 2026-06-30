import { motion, useMotionValue, useSpring } from 'motion/react';
import { useEffect } from 'react';

export function MouseGlowBackground() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const x = useSpring(mouseX, { damping: 25, stiffness: 150 });
  const y = useSpring(mouseY, { damping: 25, stiffness: 150 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [mouseX, mouseY]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-[1]" aria-hidden>
      {/* Static corner accent glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,var(--theme-accent-soft),transparent_60%)]" />
      {/* Cursor-following soft radial spotlight */}
      <motion.div
        className="absolute h-[1000px] w-[1000px] rounded-full opacity-60"
        style={{
          x,
          y,
          translateX: '-50%',
          translateY: '-50%',
          filter: 'blur(40px)',
          background:
            'radial-gradient(circle, color-mix(in srgb, var(--theme-accent) 32%, transparent) 0%, ' +
            'color-mix(in srgb, var(--theme-accent) 10%, transparent) 40%, transparent 70%)',
        }}
      />
    </div>
  );
}
