import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowRight, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { RESTAURANT_CONFIG } from '../config/restaurantConfig';
import { CrownIcon } from './CrownEmblem';

interface CinematicIntroProps {
  isOpen: boolean;
  onFinish: () => void;
}

export function CinematicIntro({ isOpen, onFinish }: CinematicIntroProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  const prefersReduced = useReducedMotion();
  const [isMuted, setIsMuted] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState(0);

  // Non-blocking safeguard: if video fails to buffer quickly, transition smoothly to hero
  useEffect(() => {
    if (!isOpen) return;
    if (prefersReduced) {
      onFinishRef.current();
      return;
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onFinishRef.current();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const safetyTimer = window.setTimeout(() => {
      const video = videoRef.current;
      if (!video || video.readyState < 2) {
        onFinishRef.current();
      }
    }, 4500);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.clearTimeout(safetyTimer);
    };
  }, [isOpen, prefersReduced]);

  // Reset state cleanly when opened or replayed
  useEffect(() => {
    if (isOpen) {
      setProgress(0);
      const video = videoRef.current;
      if (video) {
        video.currentTime = 0;
        video.muted = isMuted;
        void video.play().catch(() => {
          // If autoplay is blocked on strict devices, finish cleanly into Hero
          onFinishRef.current();
        });
      }
    }
  }, [isOpen]);

  const handleToggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    const nextMuted = !isMuted;
    video.muted = nextMuted;
    setIsMuted(nextMuted);
  };

  const handleReplay = () => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    setProgress(0);
    void video.play();
  };

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    setProgress(Math.min(1, video.currentTime / video.duration));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="cinematic-intro-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 bg-[#070404] overflow-hidden select-none"
          role="dialog"
          aria-modal="true"
          aria-label="Crown Crust Pizza Commercial Intro"
        >
          {/* Branded poster backdrop prevents black flashes while first frame decodes */}
          <div
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-500"
            style={{
              backgroundImage: `url(${RESTAURANT_CONFIG.media.heroFlamesImage})`,
              opacity: isReady ? 0 : 0.7,
            }}
            aria-hidden="true"
          />
          {!isReady && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center bg-[#070404]/55 pointer-events-none"
              aria-hidden="true"
            >
              <CrownIcon className="w-16 h-11 mb-3 animate-pulse" />
              <p className="font-display text-xs tracking-[0.28em] uppercase text-[#F4D576]">
                {RESTAURANT_CONFIG.brandName}
              </p>
            </div>
          )}

          {/* Full-screen Commercial Video */}
          <video
            ref={videoRef}
            src={RESTAURANT_CONFIG.media.introVideoSrc}
            poster={RESTAURANT_CONFIG.media.heroFlamesImage}
            autoPlay
            muted={isMuted}
            playsInline
            preload="auto"
            onCanPlay={() => setIsReady(true)}
            onPlaying={() => setIsReady(true)}
            onTimeUpdate={handleTimeUpdate}
            onEnded={onFinish}
            onError={onFinish}
            className="w-full h-full object-cover object-center"
          />

          {/* Measured Top & Bottom Vignettes for Control Legibility */}
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/70 to-transparent"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/85 via-black/35 to-transparent"
            aria-hidden="true"
          />

          {/* Top Left Minimal Brand Wordmark */}
          <div className="absolute top-4 left-4 sm:top-6 sm:left-8 flex items-center gap-2.5 pointer-events-none">
            <CrownIcon className="w-6 h-4" />
            <span className="font-display text-xs sm:text-sm font-bold tracking-[0.18em] text-[#F4D576]">
              {RESTAURANT_CONFIG.shortBrand}
            </span>
          </div>

          {/* Cinematic Controls: Sound, Replay, Skip Intro */}
          <div className="absolute bottom-6 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 flex flex-wrap items-center justify-between gap-3 z-10">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleToggleMute}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 min-h-[44px] rounded-md bg-black/75 hover:bg-[#1C120D] border border-[#D4AF37]/45 text-xs font-semibold text-[#FAF5EB] hover:text-[#F4D576] transition-colors cursor-pointer backdrop-blur-sm"
                aria-label={isMuted ? 'Unmute commercial audio' : 'Mute commercial audio'}
              >
                {isMuted ? (
                  <>
                    <VolumeX className="w-4 h-4 text-[#E5C158]" />
                    <span>Unmute</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-4 h-4 text-[#E5C158]" />
                    <span>Sound On</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReplay}
                className="inline-flex items-center gap-2 px-3.5 py-2.5 min-h-[44px] rounded-md bg-black/75 hover:bg-[#1C120D] border border-[#D4AF37]/45 text-xs font-semibold text-[#FAF5EB] hover:text-[#F4D576] transition-colors cursor-pointer backdrop-blur-sm"
                aria-label="Replay commercial intro"
              >
                <RotateCcw className="w-4 h-4 text-[#E5C158]" />
                <span className="hidden sm:inline">Replay</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onFinish}
              className="btn-gold inline-flex items-center gap-2 px-5 py-2.5 min-h-[44px] rounded-md text-xs font-bold tracking-[0.14em] uppercase cursor-pointer transition-all duration-150"
            >
              <span>Skip Intro</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Real-time Commercial Progress Bar (compositor scaleX) */}
          <div
            className="absolute inset-x-0 bottom-0 h-1 bg-white/10"
            aria-hidden="true"
          >
            <div
              className="h-full bg-gradient-to-r from-[#A67C1E] via-[#F8E398] to-[#D4AF37] origin-left transition-transform duration-150 ease-linear"
              style={{ transform: `scaleX(${progress})` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
