import React, { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Menu, ShoppingBag, X } from 'lucide-react';
import { RESTAURANT_CONFIG } from '../config/restaurantConfig';
import { CrownIcon } from './CrownEmblem';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
}

const NAV_LINKS = [
  { label: 'Signature', href: '#signature' },
  { label: 'Menu', href: '#menu' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'Location', href: '#location' },
];

export function Navbar({ cartCount, onOpenCart }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const prefersReduced = useReducedMotion();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0B0807]/90 backdrop-blur-md border-b border-[#D4AF37]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-4 sm:gap-8">
        <a
          href="#hero"
          className="flex items-center gap-2 text-base sm:text-xl font-display font-bold tracking-[0.12em] sm:tracking-[0.14em] text-gold-gradient whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]"
        >
          <CrownIcon className="w-6 h-4 shrink-0" />
          <span>{RESTAURANT_CONFIG.shortBrand}</span>
        </a>

        <nav
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#DED5C8]"
          aria-label="Primary Navigation"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-[#F4D576] transition-colors duration-150 whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#D4AF37]/70 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenCart}
            className="btn-gold inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 min-h-[40px] rounded-md text-xs sm:text-sm font-semibold tracking-wide transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FCE79C]"
            aria-label={`Open order bag (${cartCount} items)`}
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span>Order Now</span>
            {cartCount > 0 && (
              <motion.span
                key={cartCount}
                initial={prefersReduced ? false : { scale: 0.7, opacity: 0.6 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 450, damping: 22 }}
                className="ml-0.5 px-1.5 py-0.5 text-[11px] font-bold bg-[#160C06] text-[#F4D576] rounded tabular-nums"
              >
                {cartCount}
              </motion.span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-md border border-[#D4AF37]/30 text-[#FAF5EB] hover:bg-[#D4AF37]/10 transition-colors cursor-pointer"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            key="mobile-nav-drawer"
            initial={prefersReduced ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReduced ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden bg-[#120D0B] border-t border-[#D4AF37]/20 px-6 py-4 flex flex-col gap-1"
            aria-label="Mobile Navigation"
          >
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="py-3 text-sm font-medium text-[#FAF5EB] hover:text-[#F4D576] border-b border-white/5 last:border-b-0"
              >
                {link.label}
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
