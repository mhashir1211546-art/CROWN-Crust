import React from 'react';
import { RESTAURANT_CONFIG } from '../config/restaurantConfig';

export function CrownIcon({ className = 'w-10 h-7' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="crownGold" x1="32" y1="2" x2="32" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FCE79C" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#9E7316" />
        </linearGradient>
      </defs>
      <path
        d="M8 34L4 12L19 22L32 6L45 22L60 12L56 34H8Z"
        fill="url(#crownGold)"
      />
      <rect x="8" y="36.5" width="48" height="4.5" rx="2" fill="url(#crownGold)" />
      <circle cx="4" cy="10" r="2.8" fill="#FCE79C" />
      <circle cx="32" cy="4.5" r="3.2" fill="#FCE79C" />
      <circle cx="60" cy="10" r="2.8" fill="#FCE79C" />
      <circle cx="19" cy="20" r="2" fill="#FCE79C" />
      <circle cx="45" cy="20" r="2" fill="#FCE79C" />
    </svg>
  );
}

export function HassanAbdalMapGraphic({
  activeZoneId,
  onSelectZone,
}: {
  activeZoneId: string;
  onSelectZone: (zoneId: string) => void;
}) {
  const zones = RESTAURANT_CONFIG.deliveryZones;
  const pins = [
    {
      id: zones[0]?.id ?? 'hassan-abdal',
      label: zones[0]?.name ?? 'Hassan Abdal City',
      x: 150,
      y: 120,
      primary: true,
    },
    ...(zones[1]
      ? [
          {
            id: zones[1].id,
            label: zones[1].name,
            x: 196,
            y: 168,
            primary: false,
          },
        ]
      : []),
  ];

  return (
    <div className="relative w-full max-w-[340px] mx-auto select-none">
      <svg
        viewBox="0 0 300 260"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-[0_18px_36px_rgba(212,175,55,0.18)]"
        role="img"
        aria-label="Stylized golden delivery coverage graphic for Hassan Abdal"
      >
        <defs>
          <linearGradient id="mapGoldFill" x1="40" y1="20" x2="250" y2="240" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F5DC86" />
            <stop offset="55%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#A67A19" />
          </linearGradient>
          <radialGradient id="mapHalo" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="150" cy="130" r="122" fill="url(#mapHalo)" />

        <path
          d="M114 26L138 34L154 22L173 36L194 31L212 50L234 57L227 81L248 103L241 124L262 146L242 167L249 189L225 204L214 226L185 218L165 236L138 225L114 238L93 216L66 218L56 192L38 175L54 148L44 121L68 98L64 73L89 58L94 36L114 26Z"
          fill="url(#mapGoldFill)"
          stroke="#FCE79C"
          strokeWidth="1.5"
          strokeOpacity="0.65"
        />

        <path
          d="M52 162C96 148 128 134 150 120C178 138 204 162 238 174"
          stroke="#260908"
          strokeWidth="2.2"
          strokeDasharray="5 4"
          strokeOpacity="0.55"
        />
        <path
          d="M150 120C154 92 160 68 174 44"
          stroke="#260908"
          strokeWidth="1.6"
          strokeDasharray="4 4"
          strokeOpacity="0.45"
        />

        <circle
          cx="150"
          cy="120"
          r="56"
          stroke="#260908"
          strokeWidth="1.25"
          strokeDasharray="3 3"
          strokeOpacity="0.45"
        />

        {pins.map((pin) => {
          const isActive = activeZoneId === pin.id;
          return (
            <g
              key={pin.id}
              onClick={() => onSelectZone(pin.id)}
              className="cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label={`Select delivery zone ${pin.label}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectZone(pin.id);
                }
              }}
            >
              {isActive && (
                <circle
                  cx={pin.x}
                  cy={pin.y}
                  r={pin.primary ? 18 : 14}
                  fill="#260908"
                  fillOpacity="0.22"
                />
              )}
              <circle
                cx={pin.x}
                cy={pin.y}
                r={isActive ? 8 : 6}
                fill="#1D0606"
                stroke="#FCE79C"
                strokeWidth="2"
              />
              {pin.primary && (
                <circle cx={pin.x} cy={pin.y} r="2.5" fill="#FCE79C" />
              )}
              <rect
                x={pin.x - 52}
                y={pin.y + 12}
                width="104"
                height="19"
                rx="4"
                fill="#1D0606"
                fillOpacity={isActive ? '0.94' : '0.78'}
              />
              <text
                x={pin.x}
                y={pin.y + 24.5}
                textAnchor="middle"
                fill="#FAF5EB"
                fontSize="8.5"
                fontWeight="600"
                letterSpacing="0.03em"
              >
                {pin.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
