import React, { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowRight, Flame, Play, Sparkles } from 'lucide-react';
import { RESTAURANT_CONFIG } from '../config/restaurantConfig';
import { CrownIcon } from './CrownEmblem';
import { GoldenEmbersBackdrop, TiltPizzaCard } from './CinematicMotion';
import { SafeImage } from './SafeImage';

interface HeroSectionProps {
  onExploreMenu: () => void;
  onQuickOrder: () => void;
  onReplayIntro: () => void;
}

export function HeroSection({
  onExploreMenu,
  onQuickOrder,
  onReplayIntro,
}: HeroSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const prefersReduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  });

  const visualY = useTransform(scrollYProgress, [0, 1], [0, 48]);
  const visualScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);
  const backdropY = useTransform(scrollYProgress, [0, 1], [0, 72]);

  const fadeUp = (delay: number) =>
    prefersReduced
      ? {}
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.65, delay, ease: [0.16, 1, 0.3, 1] as const },
        };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative bg-gradient-to-b from-[#0B0807] via-[#1C0707] to-[#110C0A] border-b border-[#D4AF37]/25 overflow-hidden"
    >
      {/* Wood-Fire Brick Oven Ambiance & Depth Parallax */}
      <motion.div
        className="hidden sm:block absolute inset-0 pointer-events-none opacity-25 bg-cover bg-center"
        style={{
          backgroundImage: `url(${RESTAURANT_CONFIG.media.heroFlamesImage})`,
          y: prefersReduced ? 0 : backdropY,
        }}
        aria-hidden="true"
      />

      {/* Deep Burgundy & Obsidian Radial Vignette */}
      <div
        className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_70%_40%,rgba(212,175,55,0.11),transparent_55%),linear-gradient(180deg,rgba(11,8,7,0.72)_0%,rgba(27,7,7,0.58)_52%,rgba(17,12,10,0.98)_100%)]"
        aria-hidden="true"
      />

      {/* Subtle Floating Golden Embers */}
      <GoldenEmbersBackdrop />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-12 sm:py-16 lg:py-22">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* LEFT COLUMN: Royal Brand Typography & Primary CTAs */}
          <div className="lg:col-span-6 text-center lg:text-left flex flex-col items-center lg:items-start">
            <motion.div
              {...fadeUp(0.05)}
              className="inline-flex items-center gap-3 mb-4"
            >
              <CrownIcon className="w-8 h-6 sm:w-9 sm:h-6 drop-shadow-[0_4px_14px_rgba(212,175,55,0.4)]" />
              <span className="text-xs sm:text-sm font-semibold tracking-[0.24em] uppercase text-[#E5C97B]">
                {RESTAURANT_CONFIG.cityRegion} · Wood-Fired Pizzeria
              </span>
            </motion.div>

            <motion.h1
              {...fadeUp(0.14)}
              className="font-display font-bold tracking-[0.05em] text-[#FAF5EB] leading-[1.08] text-balance"
              style={{ fontSize: 'clamp(2rem, 4.4vw, 3.75rem)' }}
            >
              CROWN CRUST
              <span className="block text-gold-gradient uppercase mt-1">
                {RESTAURANT_CONFIG.tagline}
              </span>
            </motion.h1>

            <motion.p
              {...fadeUp(0.22)}
              className="mt-5 max-w-xl text-sm sm:text-base text-[#DED5C8] leading-relaxed"
            >
              Slow-fermented 48-hour sourdough, molten mozzarella-stuffed crown rims, and
              blistered brick-oven char prepared fresh to order.
            </motion.p>

            {/* Primary & Secondary Actions */}
            <motion.div
              {...fadeUp(0.3)}
              className="mt-8 flex flex-col sm:flex-row w-full sm:w-auto items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-3.5"
            >
              <button
                type="button"
                onClick={onExploreMenu}
                className="btn-gold inline-flex items-center justify-center gap-2 px-7 py-3.5 min-h-[46px] rounded-md text-xs sm:text-sm font-bold tracking-[0.14em] uppercase transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FCE79C]"
              >
                <span>Explore Menu</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onQuickOrder}
                className="px-7 py-3.5 min-h-[46px] rounded-md text-xs sm:text-sm font-bold tracking-[0.14em] uppercase bg-[#1A0D0A]/90 text-[#F4D576] border border-[#D4AF37]/65 hover:bg-[#D4AF37]/15 hover:border-[#F4D576] transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FCE79C]"
              >
                Order Now
              </button>

              <button
                type="button"
                onClick={onReplayIntro}
                className="inline-flex items-center justify-center gap-2 px-4 py-3.5 min-h-[46px] rounded-md text-xs font-semibold tracking-[0.12em] uppercase text-[#DED5C8] hover:text-[#F4D576] border border-white/15 hover:border-[#D4AF37]/45 bg-black/35 transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FCE79C]"
                aria-label="Replay full-screen commercial intro"
              >
                <Play className="w-3.5 h-3.5 text-[#E5C158]" />
                <span>Commercial</span>
              </button>
            </motion.div>

            {/* Provenance Highlights */}
            <motion.div
              {...fadeUp(0.38)}
              className="mt-9 pt-6 border-t border-[#D4AF37]/20 w-full flex flex-wrap items-center justify-center lg:justify-start gap-x-5 gap-y-2 text-xs sm:text-sm text-[#DED5C8]"
            >
              <span className="inline-flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-[#E5C158]" />
                <span>Brick-Oven Fired</span>
              </span>
              <span aria-hidden="true" className="text-[#D4AF37]/50">
                ·
              </span>
              <span>48-Hour Fermented Dough</span>
              <span aria-hidden="true" className="text-[#D4AF37]/50">
                ·
              </span>
              <span>Stuffed Crown Crust</span>
              <span aria-hidden="true" className="text-[#D4AF37]/50">
                ·
              </span>
              <span>Direct WhatsApp Ordering</span>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: Cinematic Interactive 3D Pizza Stage */}
          <motion.div
            initial={prefersReduced ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            style={{
              y: prefersReduced ? 0 : visualY,
              scale: prefersReduced ? 1 : visualScale,
            }}
            className="lg:col-span-6 relative"
          >
            {/* Ambient Golden Aura Behind Dish */}
            <div
              className="pointer-events-none absolute -inset-4 rounded-3xl bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.22),transparent_68%)] blur-2xl"
              aria-hidden="true"
            />

            <TiltPizzaCard
              maxTilt={5}
              className="gold-sheen-card relative rounded-2xl overflow-hidden border border-[#D4AF37]/40 bg-[#140A08] fire-glow-frame"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <SafeImage
                  src={RESTAURANT_CONFIG.media.signatureHeroImage}
                  alt="Signature Crown Crust artisan pizza slice with molten mozzarella cheese pull"
                  eager
                  fallbackTitle="Crown Crust Pizza"
                  className="w-full h-full object-cover"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0B0807] via-[#0B0807]/20 to-transparent"
                  aria-hidden="true"
                />
              </div>

              <div className="relative z-10 p-5 sm:p-6 bg-gradient-to-r from-[#120907]/95 via-[#1C0B09]/95 to-[#120907]/95 border-t border-[#D4AF37]/25 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#E5C158] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Brick-Oven Signature</span>
                  </p>
                  <p className="font-display font-bold text-lg sm:text-xl text-[#FAF5EB] mt-0.5">
                    Molten Mozzarella &amp; Stuffed Crown
                  </p>
                </div>

                <div className="animate-gentle-float text-right">
                  <span className="block text-[11px] uppercase tracking-wider text-[#C7BBAE]">
                    Baked Fresh
                  </span>
                  <span className="font-display text-sm sm:text-base font-bold text-[#F4D576]">
                    {RESTAURANT_CONFIG.motto.split('.')[0]}
                  </span>
                </div>
              </div>
            </TiltPizzaCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
