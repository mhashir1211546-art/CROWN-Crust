import React, { useCallback, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Check } from 'lucide-react';
import { CinematicIntro } from './components/CinematicIntro';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { SignatureMenuSection } from './components/SignatureMenuSection';
import { FoodGallerySection } from './components/FoodGallerySection';
import { ReviewsAndLocationSection } from './components/ReviewsAndLocationSection';
import { FooterSection } from './components/FooterSection';
import {
  ConfiguredCartPayload,
  CustomizeModal,
} from './components/CustomizeModal';
import { CartDrawer, CartEntry } from './components/CartDrawer';
import {
  CrustOption,
  PizzaItem,
  PizzaSize,
  calculatePizzaUnitPrice,
} from './config/restaurantConfig';

const INTRO_SESSION_KEY = 'crown_intro_seen';

export default function App() {
  const prefersReduced = useReducedMotion();
  const [showIntro, setShowIntro] = useState<boolean>(() => {
    try {
      return !sessionStorage.getItem(INTRO_SESSION_KEY);
    } catch {
      return true;
    }
  });

  const handleIntroFinish = useCallback(() => {
    try {
      sessionStorage.setItem(INTRO_SESSION_KEY, '1');
    } catch {
      // Ignore storage access restrictions in private mode
    }
    setShowIntro(false);
  }, []);

  const [cartItems, setCartItems] = useState<CartEntry[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [customizingPizza, setCustomizingPizza] = useState<PizzaItem | null>(
    null
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const triggerToast = (message: string) => {
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
    }
    setToastMessage(message);
    toastTimerRef.current = window.setTimeout(() => {
      setToastMessage(null);
      toastTimerRef.current = null;
    }, 2600);
  };

  const addEntryToCart = (
    pizza: PizzaItem,
    size: PizzaSize,
    crust: CrustOption,
    extras: string[],
    unitPrice: number
  ) => {
    const key = `${pizza.id}__${size}__${crust}__${[...extras].sort().join(',')}`;
    setCartItems((prev) => {
      const existing = prev.find((entry) => entry.key === key);
      if (existing) {
        return prev.map((entry) =>
          entry.key === key
            ? { ...entry, quantity: entry.quantity + 1 }
            : entry
        );
      }
      return [
        ...prev,
        { key, pizza, size, crust, extras, unitPrice, quantity: 1 },
      ];
    });
    triggerToast(`${pizza.name} (${size}) added to your order`);
  };

  const handleQuickAdd = (item: PizzaItem) => {
    const size: PizzaSize = 'Medium 10"';
    const crust: CrustOption = 'Classic Wood-Fired';
    const unitPrice = calculatePizzaUnitPrice(item.basePrice, size, crust);
    addEntryToCart(item, size, crust, [], unitPrice);
  };

  const handleAddConfiguredSize = (item: PizzaItem, size: PizzaSize) => {
    const crust: CrustOption = 'Classic Wood-Fired';
    const unitPrice = calculatePizzaUnitPrice(item.basePrice, size, crust);
    addEntryToCart(item, size, crust, [], unitPrice);
  };

  const handleConfirmCustomized = (payload: ConfiguredCartPayload) => {
    addEntryToCart(
      payload.pizza,
      payload.size,
      payload.crust,
      payload.extras,
      payload.unitPrice
    );
  };

  const handleUpdateQuantity = (key: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) =>
          item.key === key
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (key: string) => {
    setCartItems((prev) => prev.filter((item) => item.key !== key));
  };

  const scrollToMenu = () => {
    const el = document.getElementById('menu');
    el?.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
  };

  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-[#0B0807] text-[#FAF5EB] overflow-x-hidden">
      <CinematicIntro isOpen={showIntro} onFinish={handleIntroFinish} />

      <Navbar
        cartCount={totalCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main>
        <HeroSection
          onExploreMenu={scrollToMenu}
          onQuickOrder={() => {
            if (cartItems.length > 0) {
              setIsCartOpen(true);
            } else {
              scrollToMenu();
            }
          }}
          onReplayIntro={() => setShowIntro(true)}
        />

        <SignatureMenuSection
          onQuickAdd={handleQuickAdd}
          onCustomize={(item) => setCustomizingPizza(item)}
        />

        <FoodGallerySection
          onAddConfigured={handleAddConfiguredSize}
          onCustomize={(item) => setCustomizingPizza(item)}
        />

        <ReviewsAndLocationSection
          onStartOrder={() => {
            if (cartItems.length > 0) {
              setIsCartOpen(true);
            } else {
              scrollToMenu();
            }
          }}
        />
      </main>

      <FooterSection />

      <AnimatePresence>
        {customizingPizza && (
          <CustomizeModal
            key={customizingPizza.id}
            pizza={customizingPizza}
            onClose={() => setCustomizingPizza(null)}
            onConfirmAdd={handleConfirmCustomized}
          />
        )}
      </AnimatePresence>

      <CartDrawer
        isOpen={isCartOpen}
        items={cartItems}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => setCartItems([])}
      />

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            key="cart-toast"
            initial={prefersReduced ? false : { opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={prefersReduced ? undefined : { opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            role="status"
            aria-live="polite"
            className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-5 sm:bottom-5 z-40 flex items-center justify-between sm:justify-start gap-2.5 px-4 py-3 rounded-lg bg-[#1C110C] border border-[#D4AF37]/55 shadow-xl text-xs sm:text-sm text-[#FAF5EB]"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-5 h-5 rounded-full bg-[#D4AF37] text-[#160C06] flex items-center justify-center shrink-0">
                <Check className="w-3.5 h-3.5" />
              </span>
              <span className="truncate">{toastMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="ml-2 text-xs font-bold uppercase tracking-wider text-[#F4D576] hover:underline shrink-0 cursor-pointer"
            >
              View Bag
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
