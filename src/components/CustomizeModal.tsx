import React, { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Check, X } from 'lucide-react';
import {
  CrustOption,
  PizzaItem,
  PizzaSize,
  RESTAURANT_CONFIG,
  calculatePizzaUnitPrice,
  formatCurrency,
  getDefaultCrustForPizza,
} from '../config/restaurantConfig';
import { SafeImage } from './SafeImage';

export interface ConfiguredCartPayload {
  pizza: PizzaItem;
  size: PizzaSize;
  crust: CrustOption;
  extras: string[];
  unitPrice: number;
}

interface CustomizeModalProps {
  pizza: PizzaItem;
  onClose: () => void;
  onConfirmAdd: (payload: ConfiguredCartPayload) => void;
}

const SIZES: PizzaSize[] = ['Medium 10"', 'Large 13"', 'Royal 16"'];
const CRUSTS: CrustOption[] = [
  'Cheese-Stuffed Crown',
  'Kebab-Stuffed Crown',
  'Classic Wood-Fired',
];

export function CustomizeModal({
  pizza,
  onClose,
  onConfirmAdd,
}: CustomizeModalProps) {
  const prefersReduced = useReducedMotion();
  const [size, setSize] = useState<PizzaSize>('Large 13"');
  const [crust, setCrust] = useState<CrustOption>(getDefaultCrustForPizza(pizza));
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const toggleExtra = (extraId: string) => {
    setSelectedExtras((prev) =>
      prev.includes(extraId)
        ? prev.filter((id) => id !== extraId)
        : [...prev, extraId]
    );
  };

  const unitPrice = calculatePizzaUnitPrice(
    pizza.basePrice,
    size,
    crust,
    selectedExtras
  );

  const extraNames: string[] = selectedExtras.flatMap((id) => {
    const found = RESTAURANT_CONFIG.pricing.extraToppings.find((t) => t.id === id);
    return found ? [found.name] : [];
  });

  return (
    <motion.div
      initial={prefersReduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={prefersReduced ? undefined : { opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="customize-modal-title"
      onClick={onClose}
    >
      <motion.div
        initial={prefersReduced ? false : { opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={prefersReduced ? undefined : { opacity: 0, y: 20, scale: 0.98 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-xl rounded-t-2xl sm:rounded-xl bg-[#150A08] border border-[#D4AF37]/40 overflow-hidden shadow-2xl max-h-[92dvh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-40 sm:h-52 w-full shrink-0 bg-[#210D0A] overflow-hidden">
          <SafeImage
            src={pizza.image}
            alt={pizza.name}
            fallbackTitle={pizza.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#150A08] via-[#150A08]/45 to-transparent pointer-events-none" />
          <button
            type="button"
            onClick={onClose}
            className="absolute top-3 right-3 w-11 h-11 rounded-md bg-black/75 text-[#FAF5EB] hover:text-[#F4D576] flex items-center justify-center cursor-pointer"
            aria-label="Close pizza customizer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="absolute bottom-3 left-5 right-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#E5C158]">
              {pizza.category}
            </p>
            <h3
              id="customize-modal-title"
              className="font-display font-bold text-xl sm:text-2xl text-[#FAF5EB]"
            >
              {pizza.name}
            </h3>
          </div>
        </div>

        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#D4AF37] mb-2.5">
              1. Select Size
            </p>
            <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
              {SIZES.map((s) => {
                const selected = size === s;
                const sizePrice = calculatePizzaUnitPrice(
                  pizza.basePrice,
                  s,
                  'Classic Wood-Fired'
                );
                return (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSize(s)}
                    className={`p-3 min-h-[56px] rounded-lg text-left border transition-colors cursor-pointer ${
                      selected
                        ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-[#FAF5EB]'
                        : 'bg-white/5 border-white/10 text-[#C7BBAE] hover:border-white/25'
                    }`}
                  >
                    <span className="block text-xs font-semibold">{s}</span>
                    <span className="block text-xs text-[#F4D576] mt-0.5 tabular-nums">
                      {formatCurrency(sizePrice)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#D4AF37] mb-2.5">
              2. Crown Crust Edge
            </p>
            <div className="space-y-2">
              {CRUSTS.map((c) => {
                const selected = crust === c;
                const surcharge = RESTAURANT_CONFIG.pricing.crustSurcharge[c];
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCrust(c)}
                    className={`w-full px-4 py-3 min-h-[46px] rounded-lg border flex items-center justify-between text-xs sm:text-sm transition-colors cursor-pointer ${
                      selected
                        ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-[#FAF5EB]'
                        : 'bg-white/5 border-white/10 text-[#C7BBAE] hover:border-white/25'
                    }`}
                  >
                    <span className="font-medium">{c}</span>
                    <span className="font-semibold text-[#F4D576] tabular-nums">
                      {surcharge === 0 ? 'Included' : `+ ${formatCurrency(surcharge)}`}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#D4AF37] mb-2.5">
              3. Optional Extras &amp; Dips
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {RESTAURANT_CONFIG.pricing.extraToppings.map((topping) => {
                const checked = selectedExtras.includes(topping.id);
                return (
                  <button
                    key={topping.id}
                    type="button"
                    onClick={() => toggleExtra(topping.id)}
                    className={`px-3.5 py-2.5 min-h-[44px] rounded-lg border flex items-center justify-between gap-2 text-xs transition-colors cursor-pointer ${
                      checked
                        ? 'bg-[#D4AF37]/15 border-[#D4AF37] text-[#FAF5EB]'
                        : 'bg-white/5 border-white/10 text-[#C7BBAE] hover:border-white/25'
                    }`}
                  >
                    <span className="flex items-center gap-2 text-left">
                      <span
                        className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
                          checked
                            ? 'bg-[#D4AF37] border-[#D4AF37] text-[#160C06]'
                            : 'border-white/30'
                        }`}
                      >
                        {checked && <Check className="w-3 h-3" />}
                      </span>
                      <span>{topping.name}</span>
                    </span>
                    <span className="text-[#F4D576] tabular-nums shrink-0">
                      +{formatCurrency(topping.price)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 border-t border-[#D4AF37]/25 bg-[#100605] flex items-center justify-between gap-4 shrink-0">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-[#B8A99A]">
              Item Total
            </p>
            <p className="text-lg font-bold text-[#F4D576] tabular-nums">
              {formatCurrency(unitPrice)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              onConfirmAdd({
                pizza,
                size,
                crust,
                extras: extraNames,
                unitPrice,
              });
              onClose();
            }}
            className="btn-gold px-5 sm:px-6 py-3 min-h-[44px] rounded-md text-xs sm:text-sm font-bold uppercase tracking-wider cursor-pointer transition-all duration-150 whitespace-nowrap shrink-0"
          >
            Add Customized Pizza
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
