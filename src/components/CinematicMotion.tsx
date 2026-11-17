import React, { useRef } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from 'motion/react';

interface CinematicRevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  direction?: 'up' | 'scale';
}

export function CinematicReveal({
  children,
  delay = 0,
  className = '',
  direction = 'up',
}: CinematicRevealProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  const initial =
    direction === 'scale'
      ? { opacity: 0, scale: 0.97 }
      : { opacity: 0, y: 20 };
  const target =
    direction === 'scale' ? { opacity: 1, scale: 1 } : { opacity: 1, y: 0 };

  return (
    <motion.div
      initial={initial}
      whileInView={target}
      viewport={{ once: true, amount: 0.14 }}
      transition={{
        duration: 0.62,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface TiltPizzaCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}

export function TiltPizzaCard({
  children,
  className = '',
  maxTilt = 4.5,
}: TiltPizzaCardProps) {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const prefersReduced = useReducedMotion();

  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rawGlowX = useMotionValue(50);
  const rawGlowY = useMotionValue(50);

  const rotateX = useSpring(rawRotateX, { stiffness: 220, damping: 24 });
  const rotateY = useSpring(rawRotateY, { stiffness: 220, damping: 24 });
  const glowBackground = useMotionTemplate`radial-gradient(280px circle at ${rawGlowX}% ${rawGlowY}%, rgba(248, 227, 152, 0.14), transparent 72%)`;

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReduced || e.pointerType !== 'mouse') return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rawRotateY.set((px - 0.5) * maxTilt * 2);
    rawRotateX.set(-(py - 0.5) * maxTilt * 2);
    rawGlowX.set(px * 100);
    rawGlowY.set(py * 100);
  };

  const handlePointerLeave = () => {
    rawRotateX.set(0);
    rawRotateY.set(0);
    rawGlowX.set(50);
    rawGlowY.set(50);
  };

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 950,
      }}
      className={`relative will-change-transform ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[inherit] z-10 opacity-0 hover:opacity-100 transition-opacity duration-300"
        style={{ background: glowBackground }}
        aria-hidden="true"
      />
      {children}
    </motion.div>
  );
}

const EMBER_SEEDS = [
  { left: '8%', bottom: '12%', size: 4, duration: '6.8s', delay: '0s' },
  { left: '17%', bottom: '22%', size: 3, duration: '8.2s', delay: '1.1s' },
  { left: '29%', bottom: '8%', size: 5, duration: '7.4s', delay: '2.4s' },
  { left: '42%', bottom: '18%', size: 3, duration: '9.1s', delay: '0.6s' },
  { left: '54%', bottom: '10%', size: 4, duration: '7.1s', delay: '1.8s' },
  { left: '66%', bottom: '25%', size: 5, duration: '8.5s', delay: '0.3s' },
  { left: '78%', bottom: '14%', size: 3, duration: '6.6s', delay: '2.9s' },
  { left: '89%', bottom: '20%', size: 4, duration: '7.8s', delay: '1.4s' },
];

export function GoldenEmbersBackdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {EMBER_SEEDS.map((ember, idx) => (
        <span
          key={idx}
          className="animate-ember absolute rounded-full bg-[#F8E398]"
          style={
            {
              left: ember.left,
              bottom: ember.bottom,
              width: `${ember.size}px`,
              height: `${ember.size}px`,
              boxShadow: '0 0 10px 1px rgba(212, 175, 55, 0.65)',
              '--ember-duration': ember.duration,
              '--ember-delay': ember.delay,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
