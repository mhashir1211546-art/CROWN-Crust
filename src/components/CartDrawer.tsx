import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  AlertTriangle,
  ArrowLeft,
  Check,
  Copy,
  ExternalLink,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import { RESTAURANT_CONFIG, formatCurrency } from '../config/restaurantConfig';
import {
  OrderCartItem,
  buildWhatsAppOrderUrl,
  formatWhatsAppOrderMessage,
} from '../utils/whatsappOrder';
import { SafeImage } from './SafeImage';

export type CartEntry = OrderCartItem;

interface CartDrawerProps {
  isOpen: boolean;
  items: CartEntry[];
  onClose: () => void;
  onUpdateQuantity: (key: string, delta: number) => void;
  onRemoveItem: (key: string) => void;
  onClearCart: () => void;
}

export function CartDrawer({
  isOpen,
  items,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const prefersReduced = useReducedMotion();
  const zones = RESTAURANT_CONFIG.deliveryZones;
  const [fulfillment, setFulfillment] = useState<'delivery' | 'pickup'>('delivery');
  const [zoneId, setZoneId] = useState(zones[0]?.id ?? 'hassan-abdal');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [address, setAddress] = useState('');
  const [formError, setFormError] = useState('');
  const [preparedOrder, setPreparedOrder] = useState<{
    message: string;
    whatsappUrl: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCloseDrawer = () => {
    setFormError('');
    setPreparedOrder(null);
    onClose();
  };

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleCloseDrawer();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  const subtotal = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );
  const selectedZone = zones.find((z) => z.id === zoneId) || zones[0];
  const deliveryFee =
    fulfillment === 'pickup' || items.length === 0 ? 0 : (selectedZone?.fee ?? 0);
  const grandTotal = subtotal + deliveryFee;
  const minOrderShortfall =
    fulfillment === 'delivery' && selectedZone
      ? Math.max(0, selectedZone.minOrder - subtotal)
      : 0;

  const handlePrepareWhatsAppOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (items.length === 0) {
      setFormError('Your bag is empty. Please add at least one pizza.');
      return;
    }

    if (minOrderShortfall > 0) {
      setFormError(
        `Minimum order for ${selectedZone.name} is ${formatCurrency(
          selectedZone.minOrder
        )}. Add ${formatCurrency(minOrderShortfall)} more or choose Takeaway.`
      );
      return;
    }

    const trimmedName = customerName.trim();
    if (trimmedName.length < 2) {
      setFormError('Please enter your full name.');
      return;
    }

    const cleanPhone = customerPhone.replace(/[\s()-]/g, '');
    if (!/^[+]?\d{7,15}$/.test(cleanPhone)) {
      setFormError('Please enter a valid 7 to 15 digit phone number.');
      return;
    }

    const trimmedAddress = address.trim();
    if (fulfillment === 'delivery' && trimmedAddress.length < 5) {
      setFormError('Please enter your full street address or nearby landmark.');
      return;
    }

    const message = formatWhatsAppOrderMessage({
      customerName: trimmedName,
      customerPhone: customerPhone.trim(),
      fulfillment,
      deliveryZoneName: selectedZone?.name ?? 'Hassan Abdal',
      deliveryAddress: trimmedAddress,
      items,
      subtotal,
      deliveryFee,
      grandTotal,
    });

    const whatsappUrl = buildWhatsAppOrderUrl(message);
    setPreparedOrder({ message, whatsappUrl });
    setCopied(false);
  };

  const handleCopyMessage = async () => {
    if (!preparedOrder) return;
    try {
      await navigator.clipboard.writeText(preparedOrder.message);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="cart-drawer-backdrop"
          initial={prefersReduced ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={prefersReduced ? undefined : { opacity: 0 }}
          transition={{ duration: 0.24 }}
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label="Your Crown Crust Order Bag"
          onClick={handleCloseDrawer}
        >
          <motion.aside
            initial={prefersReduced ? false : { x: '100%' }}
            animate={{ x: 0 }}
            exit={prefersReduced ? undefined : { x: '100%' }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-md h-full bg-[#120908] border-l border-[#D4AF37]/30 flex flex-col shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-5 sm:px-6 py-4 border-b border-[#D4AF37]/20 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShoppingBag className="w-5 h-5 text-[#E5C158]" />
                <h2 className="font-display font-bold text-lg text-[#FAF5EB]">
                  {preparedOrder ? 'Send Order via WhatsApp' : 'Your Order Bag'}
                </h2>
              </div>
              <button
                type="button"
                onClick={handleCloseDrawer}
                className="w-10 h-10 rounded-md bg-white/5 hover:bg-white/10 text-[#FAF5EB] flex items-center justify-center cursor-pointer"
                aria-label="Close order drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {preparedOrder ? (
            <div className="space-y-4">
              {!RESTAURANT_CONFIG.contact.isWhatsAppVerified && (
                <div className="p-3.5 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/45 text-xs text-[#F4D576] flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>Placeholder WhatsApp Active:</strong> Update{' '}
                    <code>whatsappNumber</code> in{' '}
                    <code>src/config/restaurantConfig.ts</code> with the restaurant’s verified
                    number before live deployment.
                  </p>
                </div>
              )}

              <div className="p-4 rounded-xl bg-[#1A0D0B] border border-[#D4AF37]/35 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-[#F4D576]">
                  Important Step
                </p>
                <p className="text-xs sm:text-sm text-[#DED5C8] leading-relaxed">
                  Your order has <strong>not</strong> been placed yet. Click{' '}
                  <strong>Open WhatsApp to Send</strong> below and press <strong>Send</strong>{' '}
                  inside WhatsApp to submit your order directly to the kitchen.
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-wider text-[#B8A99A]">
                  Formatted Order Summary
                </p>
                <pre className="p-4 rounded-lg bg-black/50 border border-white/10 text-xs text-[#EAE0D2] whitespace-pre-wrap font-sans leading-relaxed max-h-64 overflow-y-auto">
                  {preparedOrder.message}
                </pre>
              </div>

              <div className="space-y-2.5 pt-2">
                <a
                  href={preparedOrder.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold w-full py-3.5 min-h-[44px] rounded-md text-xs sm:text-sm font-bold uppercase tracking-[0.12em] inline-flex items-center justify-center gap-2 transition-all duration-150"
                >
                  <span>Open WhatsApp to Send</span>
                  <ExternalLink className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="w-full py-3 min-h-[44px] rounded-md border border-[#D4AF37]/45 text-xs font-semibold uppercase tracking-wider text-[#F4D576] hover:bg-[#D4AF37]/10 inline-flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Order Text Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Order Message</span>
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => setPreparedOrder(null)}
                    className="inline-flex items-center gap-1.5 text-xs text-[#C7BBAE] hover:text-[#FAF5EB] py-2 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Edit Order / Details</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onClearCart();
                      setPreparedOrder(null);
                      setCustomerName('');
                      setCustomerPhone('');
                      setAddress('');
                    }}
                    className="text-xs text-[#A89A8A] hover:text-[#FCA5A5] py-2 cursor-pointer"
                  >
                    Clear Bag After Sending
                  </button>
                </div>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <ShoppingBag className="w-10 h-10 text-[#D4AF37]/40 mx-auto" />
              <p className="font-display font-semibold text-lg text-[#FAF5EB]">
                Your order bag is empty
              </p>
              <p className="text-xs text-[#B8A99A] max-w-xs mx-auto leading-relaxed">
                Select a wood-fired classic or stuffed Crown Crust creation from our menu to
                build your WhatsApp order.
              </p>
              <button
                type="button"
                onClick={handleCloseDrawer}
                className="mt-2 px-5 py-2.5 min-h-[44px] rounded-md border border-[#D4AF37]/40 text-xs font-semibold uppercase tracking-wider text-[#F4D576] hover:bg-[#D4AF37]/10 cursor-pointer"
              >
                Browse Pizzas
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider text-[#C7BBAE]">
                  {items.reduce((sum, i) => sum + i.quantity, 0)} Item(s) Selected
                </span>
                <button
                  type="button"
                  onClick={onClearCart}
                  className="text-xs text-[#B8A99A] hover:text-[#FCA5A5] cursor-pointer"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.key}
                    className="p-3.5 rounded-lg bg-[#1A0D0B] border border-white/10 flex gap-3"
                  >
                    <div className="w-16 h-16 rounded-md overflow-hidden shrink-0 bg-[#24120F]">
                      <SafeImage
                        src={item.pizza.image}
                        alt={item.pizza.name}
                        fallbackTitle={item.pizza.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-display font-semibold text-sm text-[#FAF5EB] truncate">
                          {item.pizza.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(item.key)}
                          className="p-1 text-[#968778] hover:text-[#FCA5A5] cursor-pointer"
                          aria-label={`Remove ${item.pizza.name}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-[11px] text-[#C7BBAE] mt-0.5">
                        {item.size} · {item.crust}
                      </p>
                      {item.extras.length > 0 && (
                        <p className="text-[11px] text-[#A89A8A] truncate">
                          +{item.extras.join(', ')}
                        </p>
                      )}

                      <div className="mt-2.5 flex items-center justify-between">
                        <div className="inline-flex items-center rounded border border-white/15 bg-black/30">
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.key, -1)}
                            className="p-2 text-[#DED5C8] hover:text-[#F4D576] cursor-pointer"
                            aria-label={`Decrease quantity of ${item.pizza.name}`}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-semibold tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => onUpdateQuantity(item.key, 1)}
                            className="p-2 text-[#DED5C8] hover:text-[#F4D576] cursor-pointer"
                            aria-label={`Increase quantity of ${item.pizza.name}`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-sm font-bold text-[#F4D576] tabular-nums">
                          {formatCurrency(item.unitPrice * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <form
                id="whatsapp-checkout-form"
                onSubmit={handlePrepareWhatsAppOrder}
                className="pt-4 border-t border-white/10 space-y-4"
                noValidate
              >
                <div className="flex items-center gap-1.5 p-1 rounded-lg bg-black/40 border border-white/10">
                  <button
                    type="button"
                    onClick={() => {
                      setFulfillment('delivery');
                      setFormError('');
                    }}
                    className={`flex-1 py-2.5 min-h-[40px] rounded text-xs font-semibold transition-colors cursor-pointer ${
                      fulfillment === 'delivery'
                        ? 'bg-[#D4AF37] text-[#160C06]'
                        : 'text-[#C7BBAE] hover:text-[#FAF5EB]'
                    }`}
                  >
                    Delivery
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFulfillment('pickup');
                      setFormError('');
                    }}
                    className={`flex-1 py-2.5 min-h-[40px] rounded text-xs font-semibold transition-colors cursor-pointer ${
                      fulfillment === 'pickup'
                        ? 'bg-[#D4AF37] text-[#160C06]'
                        : 'text-[#C7BBAE] hover:text-[#FAF5EB]'
                    }`}
                  >
                    Takeaway / Pickup
                  </button>
                </div>

                {fulfillment === 'delivery' && zones.length > 0 && (
                  <div>
                    <label
                      htmlFor="checkout-zone"
                      className="block text-[11px] uppercase tracking-wider text-[#C7BBAE] mb-1.5"
                    >
                      Delivery Zone
                    </label>
                    <select
                      id="checkout-zone"
                      value={zoneId}
                      onChange={(e) => {
                        setZoneId(e.target.value);
                        setFormError('');
                      }}
                      className="w-full px-3 py-2.5 min-h-[44px] rounded-md bg-[#1A0D0B] border border-white/15 text-xs text-[#FAF5EB] focus:outline-none focus:border-[#D4AF37]"
                    >
                      {zones.map((z) => (
                        <option key={z.id} value={z.id}>
                          {z.name} ({z.eta}) —{' '}
                          {z.fee === 0 ? 'Free' : formatCurrency(z.fee)} · Min{' '}
                          {formatCurrency(z.minOrder)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label htmlFor="checkout-name" className="sr-only">
                    Full Name
                  </label>
                  <input
                    id="checkout-name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Full Name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-md bg-black/45 border border-white/15 text-xs sm:text-sm text-[#FAF5EB] placeholder:text-[#968778] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label htmlFor="checkout-phone" className="sr-only">
                    Mobile Phone Number
                  </label>
                  <input
                    id="checkout-phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    placeholder="Phone Number (e.g. 03XX XXXXXXX)"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 min-h-[44px] rounded-md bg-black/45 border border-white/15 text-xs sm:text-sm text-[#FAF5EB] placeholder:text-[#968778] focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                {fulfillment === 'delivery' && (
                  <div>
                    <label htmlFor="checkout-address" className="sr-only">
                      Delivery Address
                    </label>
                    <textarea
                      id="checkout-address"
                      rows={2}
                      required
                      autoComplete="street-address"
                      placeholder="Full Delivery Address & Nearby Landmark"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-md bg-black/45 border border-white/15 text-xs sm:text-sm text-[#FAF5EB] placeholder:text-[#968778] focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                )}

                {minOrderShortfall > 0 && (
                  <p className="text-xs text-[#F4D576]">
                    Add {formatCurrency(minOrderShortfall)} more to meet the{' '}
                    {formatCurrency(selectedZone.minOrder)} minimum for {selectedZone.name}.
                  </p>
                )}

                {formError && (
                  <p role="alert" className="text-xs text-[#FCA5A5]">
                    {formError}
                  </p>
                )}
              </form>
            </>
          )}
        </div>

        {items.length > 0 && !preparedOrder && (
          <div className="p-5 sm:p-6 border-t border-[#D4AF37]/25 bg-[#0D0605] space-y-3 shrink-0">
            <div className="space-y-1.5 text-xs text-[#C7BBAE]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="tabular-nums text-[#FAF5EB]">{formatCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>
                  Delivery ({fulfillment === 'pickup' ? 'Takeaway' : selectedZone?.name})
                </span>
                <span className="tabular-nums text-[#FAF5EB]">
                  {deliveryFee === 0 ? 'Free' : formatCurrency(deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/10 text-sm font-bold text-[#FAF5EB]">
                <span>Grand Total</span>
                <span className="text-[#F4D576] tabular-nums">
                  {formatCurrency(grandTotal)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              form="whatsapp-checkout-form"
              className="btn-gold w-full py-3.5 min-h-[44px] rounded-md text-xs sm:text-sm font-bold uppercase tracking-[0.12em] cursor-pointer transition-all duration-150"
            >
              Review &amp; Send on WhatsApp · {formatCurrency(grandTotal)}
            </button>
          </div>
        )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
