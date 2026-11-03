import React from 'react';

interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  size = 'md',
  showSubtitle = true,
  className = ''
}) => {
  const dimensionMap = {
    sm: { width: 36, height: 36, fontSize: 'text-base', subSize: 'text-[9px]' },
    md: { width: 48, height: 48, fontSize: 'text-xl', subSize: 'text-[10px]' },
    lg: { width: 68, height: 68, fontSize: 'text-2xl', subSize: 'text-xs' },
    xl: { width: 92, height: 92, fontSize: 'text-3xl', subSize: 'text-sm' }
  };

  const dim = dimensionMap[size];

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Exact Circular SVG Emblem matching user's image */}
      <div
        className="relative shrink-0 flex items-center justify-center transition-transform hover:scale-105 duration-200"
        style={{ width: dim.width, height: dim.height }}
      >
        <svg
          viewBox="0 0 500 500"
          className="w-full h-full drop-shadow-sm"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Circular Outer Frame */}
          <circle cx="250" cy="250" r="236" fill="#FAF8F5" />
          <circle cx="250" cy="230" r="195" fill="none" stroke="#124E33" strokeWidth="4.5" />

          {/* SHOPPING CART / D-C MONOGRAM */}
          <g id="cart-monogram" transform="translate(10, -5)">
            {/* Cart Handle & Top Bar */}
            <path
              d="M 172 135 L 186 135 L 202 235 L 246 235"
              fill="none"
              stroke="#124E33"
              strokeWidth="7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Letter D Top & Spine */}
            <path
              d="M 196 150 L 252 150 C 280 150 286 172 268 190"
              fill="none"
              stroke="#124E33"
              strokeWidth="7"
              strokeLinecap="round"
            />

            {/* Cart Bottom Plate / Letter D Base */}
            <path
              d="M 203 252 L 278 252 C 288 252 292 245 292 238 C 292 230 284 228 274 228 L 207 228 C 196 228 192 236 192 244 C 192 251 199 252 208 252 L 284 252"
              fill="none"
              stroke="#124E33"
              strokeWidth="7"
              strokeLinecap="round"
            />

            {/* Letter C Curve (Front of Cart) */}
            <path
              d="M 326 182 C 344 192 344 235 324 246 C 304 255 288 248 288 240"
              fill="none"
              stroke="#124E33"
              strokeWidth="7"
              strokeLinecap="round"
            />
            <path
              d="M 302 152 C 342 152 358 184 358 214 C 358 246 338 272 294 272"
              fill="none"
              stroke="#124E33"
              strokeWidth="7"
              strokeLinecap="round"
            />

            {/* Jatiyo Sriti Soudho (National Martyrs' Memorial) inside basket */}
            <g transform="translate(226, 155)">
              <line x1="0" y1="0" x2="0" y2="78" stroke="#124E33" strokeWidth="4" />
              <path d="M 0 0 L -8 78" stroke="#124E33" strokeWidth="3" />
              <path d="M 0 16 L -16 78" stroke="#124E33" strokeWidth="2.5" />
              <path d="M 0 32 L -25 78" stroke="#124E33" strokeWidth="2.5" />
              <path d="M 0 48 L -35 78" stroke="#124E33" strokeWidth="2" />
              <path d="M 0 0 L 8 78" stroke="#124E33" strokeWidth="3" />
              <path d="M 0 16 L 16 78" stroke="#124E33" strokeWidth="2.5" />
              <path d="M 0 32 L 24 78" stroke="#124E33" strokeWidth="2.5" />
              <line x1="-38" y1="78" x2="25" y2="78" stroke="#124E33" strokeWidth="2.5" />
            </g>

            {/* Dhaka Skyline */}
            <g transform="translate(202, 178)">
              <rect x="0" y="24" width="9" height="32" fill="none" stroke="#124E33" strokeWidth="3" />
              <line x1="4.5" y1="18" x2="4.5" y2="24" stroke="#124E33" strokeWidth="3" />
              <rect x="11" y="14" width="10" height="42" fill="none" stroke="#124E33" strokeWidth="3" />
              <rect x="48" y="20" width="8" height="36" fill="none" stroke="#124E33" strokeWidth="3" />
              <rect x="58" y="28" width="7" height="28" fill="none" stroke="#124E33" strokeWidth="3" />
            </g>

            {/* Dhaka Cycle Rickshaw */}
            <g transform="translate(305, 204)">
              <path d="M -2 14 C -6 6 4 -1 12 0 C 18 1 20 6 22 14" fill="none" stroke="#124E33" strokeWidth="3.5" />
              <path d="M 1 14 L 18 14" fill="none" stroke="#124E33" strokeWidth="3" strokeLinecap="round" />
              <circle cx="5" cy="28" r="7" fill="none" stroke="#124E33" strokeWidth="3" />
              <path d="M 14 18 L 22 24 L 28 20" fill="none" stroke="#124E33" strokeWidth="3" />
              <circle cx="28" cy="27" r="5" fill="none" stroke="#124E33" strokeWidth="3" />
              <path d="M 28 22 L 26 12 L 23 11" fill="none" stroke="#124E33" strokeWidth="3" strokeLinecap="round" />
            </g>

            {/* Cart Wheels */}
            <circle cx="218" cy="272" r="8" fill="none" stroke="#124E33" strokeWidth="7" />
            <circle cx="276" cy="272" r="8" fill="none" stroke="#124E33" strokeWidth="7" />
          </g>
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col leading-tight">
        <span className={`font-bold tracking-tight text-[#124E33] font-serif ${dim.fontSize}`}>
          Dhaka<span className="text-[#C59B27]">Cart</span>
        </span>
        {showSubtitle && (
          <span className={`font-medium tracking-widest text-stone-600 uppercase ${dim.subSize}`}>
            Classy Online Shopping · Dhaka
          </span>
        )}
      </div>
    </div>
  );
};
