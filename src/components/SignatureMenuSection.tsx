import React from 'react';
import { Plus, SlidersHorizontal } from 'lucide-react';
import {
  MENU_ITEMS,
  PizzaItem,
  RESTAURANT_CONFIG,
  formatCurrency,
} from '../config/restaurantConfig';
import { CinematicReveal, TiltPizzaCard } from './CinematicMotion';
import { SafeImage } from './SafeImage';

interface SignatureMenuSectionProps {
  onQuickAdd: (item: PizzaItem) => void;
  onCustomize: (item: PizzaItem) => void;
}

export function SignatureMenuSection({
  onQuickAdd,
  onCustomize,
}: SignatureMenuSectionProps) {
  const signatureItems = MENU_ITEMS.filter((item) => item.featuredInSignature);

  return (
    <section
      id="signature"
      className="bg-[#110C0A] py-16 sm:py-20 lg:py-24 border-b border-[#D4AF37]/15 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <CinematicReveal className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-xs font-semibold tracking-[0.22em] uppercase text-[#D4AF37] mb-2">
              Chef’s Wood-Fired Showcase
            </p>
            <h2
              className="font-display font-bold text-[#FAF5EB] text-balance"
              style={{ fontSize: 'clamp(1.65rem, 3.2vw, 2.75rem)' }}
            >
              Signature Experience Menu
            </h2>
          </div>
          <p className="text-sm text-[#BFB3A4] max-w-md">
            Hand-stretched dough, signature stuffed crown pockets, and blistering brick-oven crust
            baked to order.
          </p>
        </CinematicReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <CinematicReveal
            direction="scale"
            delay={0.05}
            className="lg:col-span-6 flex"
          >
            <TiltPizzaCard
              maxTilt={3.5}
              className="gold-sheen-card w-full rounded-xl overflow-hidden border border-[#D4AF37]/30 hover:border-[#D4AF37]/70 bg-[#18110E] min-h-[380px] sm:min-h-[440px] lg:min-h-[560px] flex flex-col justify-end transition-colors duration-200"
            >
              <div className="group absolute inset-0 overflow-hidden">
                <SafeImage
                  src={RESTAURANT_CONFIG.media.signatureHeroImage}
                  alt="Steaming artisan Crown Crust pizza slice with rich melted mozzarella cheese pull"
                  fallbackTitle="One Bite. Pure Magic."
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0807] via-[#0B0807]/55 to-transparent pointer-events-none" />

              <div className="relative z-10 p-6 sm:p-9">
                <p className="animate-gentle-float text-xs font-semibold tracking-[0.22em] uppercase text-[#F4D576] mb-2">
                  House Specialty · Extra Cheese Pull
                </p>
                <h3 className="font-display font-bold text-3xl sm:text-4xl lg:text-[2.75rem] leading-[1.08] text-[#FAF5EB] text-balance">
                  ONE BITE.
                  <span className="block text-gold-gradient">PURE MAGIC.</span>
                </h3>
                <p className="mt-3 text-sm sm:text-base text-[#DED5C8] max-w-md leading-relaxed">
                  Our signature slow-fermented base topped with fresh buffalo mozzarella, roasted
                  cherry tomatoes, and warm garlic marinara dipping bowl.
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const heritage = MENU_ITEMS.find((m) => m.id === 'obsidian-cheese-pull');
                      if (heritage) onCustomize(heritage);
                    }}
                    className="btn-gold px-5 py-3 min-h-[44px] rounded-md text-xs sm:text-sm font-bold tracking-wider uppercase cursor-pointer transition-all duration-150 whitespace-nowrap shrink-0"
                  >
                    Customize Signature
                  </button>
                  <span className="text-sm font-semibold text-[#F4D576] tabular-nums px-2">
                    From {formatCurrency(1750)}
                  </span>
                </div>
              </div>
            </TiltPizzaCard>
          </CinematicReveal>

          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {signatureItems.map((item, idx) => (
              <CinematicReveal key={item.id} delay={0.08 + idx * 0.06} className="flex">
                <TiltPizzaCard
                  maxTilt={4}
                  className="gold-sheen-card group w-full flex flex-col justify-between rounded-xl overflow-hidden bg-[#18110E] border border-[#D4AF37]/20 hover:border-[#D4AF37]/70 hover:shadow-[0_22px_45px_-16px_rgba(212,175,55,0.28)] p-5 transition-all duration-200"
                >
                  <div>
                    <div className="relative aspect-[4/3] w-full rounded-lg overflow-hidden bg-[#241914] mb-4">
                      <SafeImage
                        src={item.image}
                        alt={item.name}
                        fallbackTitle={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.07]"
                      />
                      <div
                        className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        aria-hidden="true"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-2 text-xs text-[#CBBFA9] mb-1">
                      <span className="uppercase tracking-wider text-[#D4AF37] font-medium">
                        {item.category}
                      </span>
                      <span className="tabular-nums">~{item.prepMinutes} min</span>
                    </div>

                    <h3 className="font-display font-semibold text-base sm:text-lg text-[#FAF5EB] leading-snug">
                      {item.name}
                    </h3>

                    <p className="mt-1.5 text-xs sm:text-sm text-[#B7AA9A] line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="relative z-20 mt-4 pt-3.5 border-t border-white/10 flex items-center justify-between gap-2">
                    <span className="text-sm sm:text-base font-bold text-[#F4D576] tabular-nums">
                      {formatCurrency(item.basePrice)}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onCustomize(item)}
                        className="min-w-[40px] min-h-[40px] p-2 rounded-md border border-[#D4AF37]/30 text-[#DED5C8] hover:text-[#F4D576] hover:border-[#D4AF37] transition-colors cursor-pointer flex items-center justify-center"
                        aria-label={`Customize ${item.name}`}
                        title="Customize Size & Crust"
                      >
                        <SlidersHorizontal className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onQuickAdd(item)}
                        className="inline-flex items-center gap-1 px-3.5 min-h-[40px] rounded-md bg-[#D4AF37]/15 hover:bg-[#D4AF37] text-[#F4D576] hover:text-[#160C06] border border-[#D4AF37]/40 text-xs font-semibold transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </TiltPizzaCard>
              </CinematicReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
