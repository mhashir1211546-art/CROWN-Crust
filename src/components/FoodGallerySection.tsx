import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Expand, Plus, SlidersHorizontal, X } from 'lucide-react';
import {
  MENU_ITEMS,
  MenuCategory,
  PizzaItem,
  PizzaSize,
  RESTAURANT_CONFIG,
  calculatePizzaUnitPrice,
  formatCurrency,
} from '../config/restaurantConfig';
import { CinematicReveal, TiltPizzaCard } from './CinematicMotion';
import { SafeImage } from './SafeImage';

interface FoodGallerySectionProps {
  onAddConfigured: (item: PizzaItem, size: PizzaSize) => void;
  onCustomize: (item: PizzaItem) => void;
}

const CATEGORIES: MenuCategory[] = [
  'All',
  'Crown Crust',
  'Wood-Fired',
  'Chicken & Grill',
];

const SIZES: { label: string; value: PizzaSize }[] = [
  { label: 'M · 10"', value: 'Medium 10"' },
  { label: 'L · 13"', value: 'Large 13"' },
  { label: 'XL · 16"', value: 'Royal 16"' },
];

export function FoodGallerySection({
  onAddConfigured,
  onCustomize,
}: FoodGallerySectionProps) {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('All');
  const [selectedSizes, setSelectedSizes] = useState<Record<string, PizzaSize>>({});
  const [lightboxItem, setLightboxItem] = useState<PizzaItem | null>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!lightboxItem) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxItem(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxItem]);

  const filteredItems =
    activeCategory === 'All'
      ? MENU_ITEMS
      : MENU_ITEMS.filter((item) => item.category === activeCategory);

  const getSize = (id: string): PizzaSize => selectedSizes[id] || 'Large 13"';

  return (
    <section
      id="menu"
      className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-[#170606] via-[#2B0909] to-[#1A0606] border-b border-[#D4AF37]/20 overflow-hidden"
    >
      <div id="gallery" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <CinematicReveal className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-12">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] uppercase text-[#E5C158] mb-2">
              Handcrafted Visual Menu
            </p>
            <h2
              className="font-display font-bold text-[#FAF5EB] text-balance"
              style={{ fontSize: 'clamp(1.65rem, 3.2vw, 2.75rem)' }}
            >
              Food Gallery &amp; Crown Creations
            </h2>
            {!RESTAURANT_CONFIG.pricing.isMenuPricingVerified && (
              <p className="mt-1.5 text-xs text-[#C7BBAE]">
                Sample menu pricing shown · Update exact PKR prices in{' '}
                <code className="text-[#E5C158]">src/config/restaurantConfig.ts</code>
              </p>
            )}
          </div>

          <div
            className="inline-flex flex-wrap items-center gap-1.5 p-1.5 rounded-lg bg-[#140505]/85 border border-[#D4AF37]/25"
            role="tablist"
            aria-label="Filter pizza creations by category"
          >
            {CATEGORIES.map((category) => {
              const isActive = activeCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(category)}
                  className={`px-3.5 py-2 min-h-[38px] rounded-md text-xs font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#D4AF37] text-[#160C06]'
                      : 'text-[#DED5C8] hover:text-[#FAF5EB] hover:bg-white/5'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </CinematicReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {filteredItems.map((item, idx) => {
            const currentSize = getSize(item.id);
            const computedPrice = calculatePizzaUnitPrice(
              item.basePrice,
              currentSize,
              'Classic Wood-Fired'
            );

            return (
              <CinematicReveal key={item.id} delay={idx * 0.05} className="flex">
                <TiltPizzaCard
                  maxTilt={4}
                  className="gold-sheen-card group w-full flex flex-col justify-between rounded-xl overflow-hidden bg-[#150807]/90 border border-[#D4AF37]/20 hover:border-[#D4AF37]/70 hover:shadow-[0_22px_45px_-16px_rgba(212,175,55,0.28)] transition-all duration-200"
                >
                  <div>
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#240B09]">
                      <SafeImage
                        src={item.image}
                        alt={item.name}
                        fallbackTitle={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.07]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#150807]/85 via-transparent to-transparent pointer-events-none" />
                      <div
                        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(248,227,152,0.16),transparent_65%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        aria-hidden="true"
                      />

                      <button
                        type="button"
                        onClick={() => setLightboxItem(item)}
                        className="relative z-20 absolute top-3 right-3 w-10 h-10 rounded-md bg-[#0B0807]/80 border border-[#D4AF37]/30 text-[#FAF5EB] hover:text-[#F4D576] hover:border-[#D4AF37] flex items-center justify-center transition-colors cursor-pointer"
                        aria-label={`Inspect ${item.name} photo`}
                      >
                        <Expand className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-5 sm:p-6 pb-4">
                      <div className="flex items-center justify-between gap-2 text-xs text-[#C7BBAE] mb-1.5">
                        <span className="uppercase tracking-wider text-[#E5C158] font-medium">
                          {item.category}
                          {item.isHouseFavorite ? ' · House Favorite' : ''}
                        </span>
                        <span className="tabular-nums">
                          {item.spiceLevel || 'Balanced'} · ~{item.prepMinutes} min
                        </span>
                      </div>

                      <h3 className="font-display font-semibold text-xl text-[#FAF5EB]">
                        {item.name}
                      </h3>

                      <p className="mt-2 text-sm text-[#CFC3B4] leading-relaxed">
                        {item.description}
                      </p>

                      <p className="mt-3 text-xs text-[#A89A8A] leading-relaxed">
                        {item.ingredients}
                      </p>
                    </div>
                  </div>

                  <div className="relative z-20 px-5 sm:px-6 pb-5 sm:pb-6 pt-3 border-t border-white/10">
                    <div className="flex items-center gap-1.5 mb-4">
                      {SIZES.map((s) => {
                        const selected = currentSize === s.value;
                        return (
                          <button
                            key={s.value}
                            type="button"
                            onClick={() =>
                              setSelectedSizes((prev) => ({
                                ...prev,
                                [item.id]: s.value,
                              }))
                            }
                            className={`flex-1 py-2 px-2 min-h-[38px] rounded text-[11px] font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                              selected
                                ? 'bg-[#D4AF37]/20 text-[#F4D576] border border-[#D4AF37]'
                                : 'bg-white/5 text-[#C7BBAE] border border-transparent hover:border-white/20'
                            }`}
                          >
                            {s.label}
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <span className="text-lg font-bold text-[#F4D576] tabular-nums block leading-tight">
                          {formatCurrency(computedPrice)}
                        </span>
                        <span className="text-[11px] text-[#A89A8A]">
                          Classic crust · Upgrade optional
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onCustomize(item)}
                          className="min-w-[44px] min-h-[44px] p-2.5 rounded-md border border-[#D4AF37]/30 text-[#DED5C8] hover:text-[#F4D576] hover:border-[#D4AF37] transition-colors cursor-pointer flex items-center justify-center"
                          aria-label={`Customize crust and toppings for ${item.name}`}
                          title="Customize Size, Crust & Toppings"
                        >
                          <SlidersHorizontal className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onAddConfigured(item, currentSize)}
                          className="btn-gold inline-flex items-center gap-1.5 px-4 min-h-[44px] rounded-md text-xs font-bold tracking-wider uppercase transition-all duration-150 whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </TiltPizzaCard>
              </CinematicReveal>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            key="gallery-lightbox-backdrop"
            initial={prefersReduced ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={prefersReduced ? undefined : { opacity: 0 }}
            transition={{ duration: 0.24 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label={lightboxItem.name}
            onClick={() => setLightboxItem(null)}
          >
            <motion.div
              initial={prefersReduced ? false : { opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={prefersReduced ? undefined : { opacity: 0, scale: 0.95, y: 8 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-w-3xl w-full rounded-xl overflow-hidden bg-[#150807] border border-[#D4AF37]/40 shadow-2xl max-h-[90dvh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setLightboxItem(null)}
                className="absolute top-3 right-3 z-10 w-10 h-10 rounded-md bg-black/75 text-[#FAF5EB] hover:text-[#F4D576] flex items-center justify-center cursor-pointer"
                aria-label="Close gallery preview"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="aspect-[4/3] w-full bg-[#1C0B09] overflow-hidden">
                <SafeImage
                  src={lightboxItem.image}
                  alt={lightboxItem.name}
                  fallbackTitle={lightboxItem.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-display font-bold text-xl text-[#FAF5EB]">
                    {lightboxItem.name}
                  </h3>
                  <p className="text-sm text-[#C7BBAE] mt-1">{lightboxItem.ingredients}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const item = lightboxItem;
                    setLightboxItem(null);
                    onCustomize(item);
                  }}
                  className="btn-gold px-5 py-3 min-h-[44px] rounded-md text-xs font-bold uppercase tracking-wider whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Customize &amp; Order
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
