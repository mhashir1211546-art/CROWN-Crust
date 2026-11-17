import React, { useState } from 'react';
import {
  Clock,
  Flame,
  MapPin,
  MessageSquareQuote,
  Phone,
  ShoppingBag,
  Star,
} from 'lucide-react';
import { RESTAURANT_CONFIG, formatCurrency } from '../config/restaurantConfig';
import { CinematicReveal } from './CinematicMotion';
import { HassanAbdalMapGraphic } from './CrownEmblem';

interface ReviewsAndLocationSectionProps {
  onStartOrder: () => void;
}

export function ReviewsAndLocationSection({
  onStartOrder,
}: ReviewsAndLocationSectionProps) {
  const reviews = RESTAURANT_CONFIG.verifiedReviews;
  const zones = RESTAURANT_CONFIG.deliveryZones;

  const [activeZoneId, setActiveZoneId] = useState<string>(zones[0]?.id ?? 'hassan-abdal');
  const activeZone = zones.find((z) => z.id === activeZoneId) || zones[0];

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <section
      id="reviews"
      className="relative bg-gradient-to-b from-[#1D0707] via-[#2A0909] to-[#320A0A] py-16 sm:py-20 lg:py-24 border-b border-[#D4AF37]/20 overflow-hidden"
    >
      <div id="location" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-start">
          {/* LEFT COLUMN: Genuine Customer Reviews or Honest Empty State */}
          <CinematicReveal delay={0.04} className="lg:col-span-4 space-y-6">
            <div>
              <h2
                className="font-display font-bold text-[#F4D576] leading-tight"
                style={{ fontSize: 'clamp(1.65rem, 2.8vw, 2.25rem)' }}
              >
                Customer
                <span className="block">Reviews</span>
              </h2>

              {averageRating ? (
                <div
                  className="mt-3 flex items-center gap-1.5"
                  aria-label={`${averageRating} out of 5 stars`}
                >
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-5 h-5 fill-[#E5C158] text-[#E5C158]"
                    />
                  ))}
                  <span className="ml-2 text-xs font-semibold text-[#FAF5EB] tabular-nums">
                    {averageRating} / 5.0 · {reviews.length} Verified
                  </span>
                </div>
              ) : (
                <p className="mt-2.5 text-xs uppercase tracking-[0.16em] text-[#CBBFA9]">
                  Verified Guest Feedback
                </p>
              )}

              <p className="mt-2.5 text-sm sm:text-base font-display font-semibold tracking-[0.14em] uppercase text-[#FAF5EB]">
                {RESTAURANT_CONFIG.cityRegion}
              </p>
            </div>

            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <article
                    key={rev.id}
                    className="p-4 rounded-xl bg-[#150606]/85 border border-[#D4AF37]/20"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: rev.rating }).map((_, idx) => (
                          <Star
                            key={idx}
                            className="w-3.5 h-3.5 fill-[#E5C158] text-[#E5C158]"
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-[#B8A99A]">{rev.dateLabel}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-[#EAE0D2] leading-relaxed">
                      “{rev.comment}”
                    </p>

                    <div className="mt-3 pt-2.5 border-t border-white/10 text-xs text-[#CBBFA9]">
                      <span className="font-semibold text-[#F4D576]">{rev.author}</span>
                      <span aria-hidden="true"> · </span>
                      <span>{rev.location}</span>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-[#150606]/85 border border-[#D4AF37]/25 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#E5C158]">
                  <MessageSquareQuote className="w-5 h-5" />
                </div>
                <h3 className="font-display font-semibold text-base text-[#FAF5EB]">
                  Verified Reviews Coming Soon
                </h3>
                <p className="text-xs sm:text-sm text-[#C7BBAE] leading-relaxed">
                  We publish verified customer reviews directly after orders are completed.
                  Once verified feedback is supplied in{' '}
                  <code className="text-[#E5C158]">restaurantConfig.ts</code>, it will appear
                  here.
                </p>
              </div>
            )}
          </CinematicReveal>

          {/* CENTER COLUMN: Stylized Golden Regional Map & Delivery Zones */}
          <CinematicReveal
            direction="scale"
            delay={0.12}
            className="lg:col-span-4 flex flex-col items-center justify-center py-2"
          >
            <HassanAbdalMapGraphic
              activeZoneId={activeZoneId}
              onSelectZone={setActiveZoneId}
            />

            {activeZone && (
              <div className="mt-5 w-full max-w-sm rounded-xl bg-[#150606]/90 border border-[#D4AF37]/30 p-4">
                <div className="flex items-center gap-1.5 mb-3">
                  {zones.map((zone) => {
                    const selected = zone.id === activeZoneId;
                    return (
                      <button
                        key={zone.id}
                        type="button"
                        onClick={() => setActiveZoneId(zone.id)}
                        className={`flex-1 py-2 px-2 min-h-[38px] rounded text-[11px] font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                          selected
                            ? 'bg-[#D4AF37] text-[#160C06]'
                            : 'bg-white/5 text-[#DED5C8] hover:bg-white/10'
                        }`}
                      >
                        {zone.name}
                      </button>
                    );
                  })}
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-[#F4D576]">{activeZone.name}</span>
                    <span className="font-semibold text-[#FAF5EB] tabular-nums">
                      {activeZone.eta}
                    </span>
                  </div>
                  <p className="text-[#C7BBAE]">{activeZone.landmark}</p>
                  <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[#DED5C8] tabular-nums">
                    <span>
                      Delivery:{' '}
                      {activeZone.fee === 0 ? 'Free' : formatCurrency(activeZone.fee)}
                    </span>
                    <span>Min. Order: {formatCurrency(activeZone.minOrder)}</span>
                  </div>
                  {!RESTAURANT_CONFIG.isDeliveryConfigVerified && (
                    <p className="pt-1 text-[11px] text-[#A89A8A]">
                      Delivery zone rates are editable placeholders in restaurantConfig.ts.
                    </p>
                  )}
                </div>
              </div>
            )}
          </CinematicReveal>

          {/* RIGHT COLUMN: Location, Contact & WhatsApp Order Dispatch */}
          <CinematicReveal delay={0.18} className="lg:col-span-4 space-y-6">
            <div>
              <h2
                className="font-display font-bold text-[#F4D576] leading-tight"
                style={{ fontSize: 'clamp(1.65rem, 2.8vw, 2.25rem)' }}
              >
                Location and
                <span className="block">Contact</span>
              </h2>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[#CBBFA9]">
                Takeaway · Cash on Delivery via WhatsApp
              </p>
            </div>

            <div className="space-y-4 text-sm text-[#EAE0D2]">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#E5C158] shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-[#FAF5EB]">
                    {RESTAURANT_CONFIG.brandName} Kitchen
                  </p>
                  <p className="text-xs text-[#C7BBAE] mt-0.5 leading-relaxed">
                    {RESTAURANT_CONFIG.contact.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-[#E5C158] shrink-0 mt-1" />
                <div className="tabular-nums">
                  {RESTAURANT_CONFIG.contact.isPhoneVerified &&
                  RESTAURANT_CONFIG.contact.phoneTel ? (
                    <a
                      href={`tel:${RESTAURANT_CONFIG.contact.phoneTel}`}
                      className="font-semibold text-[#FAF5EB] hover:text-[#F4D576] transition-colors"
                    >
                      {RESTAURANT_CONFIG.contact.phoneDisplay}
                    </a>
                  ) : (
                    <p className="font-semibold text-[#FAF5EB]">
                      {RESTAURANT_CONFIG.contact.phoneDisplay}
                    </p>
                  )}
                  <p className="text-xs text-[#C7BBAE] mt-0.5">
                    WhatsApp Orders:{' '}
                    {RESTAURANT_CONFIG.contact.isWhatsAppVerified
                      ? `+${RESTAURANT_CONFIG.contact.whatsappNumber}`
                      : 'Configure verified WhatsApp number in restaurantConfig.ts'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-[#E5C158] shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-[#FAF5EB]">Opening Hours</p>
                  <p className="text-xs text-[#C7BBAE] tabular-nums mt-0.5">
                    {RESTAURANT_CONFIG.contact.openingHours}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#150606]/90 border border-[#D4AF37]/30 space-y-4">
              <div className="flex items-center gap-2 text-[#F4D576]">
                <Flame className="w-4 h-4 shrink-0" />
                <h3 className="font-display font-semibold text-base">
                  Order Directly on WhatsApp
                </h3>
              </div>

              <p className="text-xs sm:text-sm text-[#DED5C8] leading-relaxed">
                Build your pizza order with your chosen size, stuffed crust, and toppings, then
                send the complete itemized order directly to our kitchen on WhatsApp.
              </p>

              <div className="pt-2 border-t border-white/10 space-y-2.5">
                <button
                  type="button"
                  onClick={onStartOrder}
                  className="btn-gold w-full py-3 min-h-[44px] rounded-md text-xs font-bold tracking-[0.14em] uppercase inline-flex items-center justify-center gap-2 cursor-pointer transition-all duration-150"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Start WhatsApp Order</span>
                </button>

                {RESTAURANT_CONFIG.contact.isPhoneVerified &&
                  RESTAURANT_CONFIG.contact.phoneTel && (
                    <a
                      href={`tel:${RESTAURANT_CONFIG.contact.phoneTel}`}
                      className="w-full py-2.5 min-h-[44px] rounded-md text-xs font-semibold tracking-[0.12em] uppercase border border-[#D4AF37]/45 text-[#F4D576] hover:bg-[#D4AF37]/10 inline-flex items-center justify-center gap-2 transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Call Kitchen</span>
                    </a>
                  )}
              </div>
            </div>
          </CinematicReveal>
        </div>
      </div>
    </section>
  );
}
