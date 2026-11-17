import React from 'react';
import { RESTAURANT_CONFIG } from '../config/restaurantConfig';
import { CinematicReveal } from './CinematicMotion';
import { CrownIcon } from './CrownEmblem';

export function FooterSection() {
  return (
    <footer className="bg-gradient-to-b from-[#3A0909] to-[#1D0404] pt-16 pb-10 text-center overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 flex flex-col items-center">
        <CinematicReveal direction="scale" className="flex flex-col items-center">
          <CrownIcon className="w-20 h-14 sm:w-24 sm:h-16 mb-3 drop-shadow-[0_6px_18px_rgba(212,175,55,0.35)]" />

          <h2
            className="font-display font-bold tracking-[0.16em] text-gold-gradient leading-none"
            style={{ fontSize: 'clamp(2.25rem, 4.5vw, 3.75rem)' }}
          >
            PIZZA
          </h2>

          <p className="mt-4 text-xs sm:text-sm md:text-base font-medium tracking-[0.22em] uppercase text-[#F7DF9C]">
            {RESTAURANT_CONFIG.motto}
          </p>
        </CinematicReveal>

        <div className="mt-12 pt-6 border-t border-[#D4AF37]/20 w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#C7BBAE]">
          <p>
            © {new Date().getFullYear()} {RESTAURANT_CONFIG.brandName} ·{' '}
            {RESTAURANT_CONFIG.cityRegion}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <a href="#hero" className="hover:text-[#F4D576] transition-colors py-1">
              Top
            </a>
            <a href="#signature" className="hover:text-[#F4D576] transition-colors py-1">
              Signature
            </a>
            <a href="#menu" className="hover:text-[#F4D576] transition-colors py-1">
              Menu
            </a>
            <a href="#reviews" className="hover:text-[#F4D576] transition-colors py-1">
              Reviews
            </a>
            <a href="#location" className="hover:text-[#F4D576] transition-colors py-1">
              Location
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
