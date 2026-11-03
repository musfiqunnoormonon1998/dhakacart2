import React from 'react';
import { Product } from '../types';

interface ProductIllustrationProps {
  product: Product;
  className?: string;
}

export const ProductIllustration: React.FC<ProductIllustrationProps> = ({
  product,
  className = 'w-full h-full'
}) => {
  const { id, color, accentColor, category } = product;

  // Render distinct artistic vector scenes for each Bangladeshi product
  const renderVisual = () => {
    switch (id) {
      case 'dc-01': // Dhakai Jamdani Saree
        return (
          <g>
            <rect x="20" y="20" width="260" height="200" rx="8" fill={color} />
            {/* Traditional Jamdani Panna Hajar Floral Jaal Weave */}
            <path
              d="M 40 40 L 70 70 L 100 40 L 130 70 L 160 40 L 190 70 L 220 40 L 250 70"
              stroke={accentColor}
              strokeWidth="2.5"
              fill="none"
              opacity="0.85"
            />
            <path
              d="M 40 80 L 70 110 L 100 80 L 130 110 L 160 80 L 190 110 L 220 80 L 250 110"
              stroke={accentColor}
              strokeWidth="2.5"
              fill="none"
              opacity="0.85"
            />
            <path
              d="M 40 120 L 70 150 L 100 120 L 130 150 L 160 120 L 190 150 L 220 120 L 250 150"
              stroke={accentColor}
              strokeWidth="2.5"
              fill="none"
              opacity="0.85"
            />
            <path
              d="M 40 160 L 70 190 L 100 160 L 130 190 L 160 160 L 190 190 L 220 160 L 250 190"
              stroke={accentColor}
              strokeWidth="2.5"
              fill="none"
              opacity="0.85"
            />
            {/* Zari Gold Border */}
            <rect x="20" y="195" width="260" height="25" rx="4" fill={accentColor} opacity="0.95" />
            <line x1="20" y1="200" x2="280" y2="200" stroke="#FAF8F5" strokeWidth="2" strokeDasharray="4 4" />
            <circle cx="150" cy="110" r="28" fill="none" stroke={accentColor} strokeWidth="2" opacity="0.9" />
            <polygon points="150,90 158,110 150,130 142,110" fill={accentColor} />
          </g>
        );

      case 'dc-02': // Tangail Taant Cotton Saree
        return (
          <g>
            <rect x="20" y="20" width="260" height="200" rx="8" fill={color} />
            {/* Breathable Combed Weave stripes & temple border */}
            <g opacity="0.4" stroke="#FFF" strokeWidth="1">
              {Array.from({ length: 18 }).map((_, i) => (
                <line key={i} x1="30" y1={30 + i * 9} x2="270" y2={30 + i * 9} />
              ))}
            </g>
            {/* Temple triangular motifs */}
            <path
              d="M 30 185 L 45 160 L 60 185 L 75 160 L 90 185 L 105 160 L 120 185 L 135 160 L 150 185 L 165 160 L 180 185 L 195 160 L 210 185 L 225 160 L 240 185 L 255 160 L 270 185"
              fill={accentColor}
            />
            <rect x="20" y="185" width="260" height="35" rx="4" fill={accentColor} />
          </g>
        );

      case 'dc-03': // Mirpur Katan Saree
        return (
          <g>
            <rect x="20" y="20" width="260" height="200" rx="8" fill={color} />
            {/* Heavy gold brocade motifs */}
            <circle cx="90" cy="80" r="24" fill="none" stroke={accentColor} strokeWidth="3" />
            <circle cx="210" cy="80" r="24" fill="none" stroke={accentColor} strokeWidth="3" />
            <circle cx="150" cy="140" r="28" fill="none" stroke={accentColor} strokeWidth="3.5" />
            <polygon points="150,120 162,140 150,160 138,140" fill={accentColor} />
            <rect x="20" y="180" width="260" height="40" fill={accentColor} rx="6" />
            <path d="M 20 190 Q 75 180 150 190 T 280 190" stroke="#7A1523" strokeWidth="2.5" fill="none" />
          </g>
        );

      case 'dc-04': // Semi Silk Panjabi
        return (
          <g>
            {/* Elegant Panjabi silhouette */}
            <rect x="30" y="20" width="240" height="200" rx="10" fill={color} />
            {/* Band collar & embroidered placket */}
            <path d="M 110 30 Q 150 50 190 30" fill="none" stroke={accentColor} strokeWidth="5" />
            <rect x="142" y="38" width="16" height="110" fill={accentColor} rx="2" />
            {/* Buttons */}
            <circle cx="150" cy="55" r="3" fill="#FFF" />
            <circle cx="150" cy="80" r="3" fill="#FFF" />
            <circle cx="150" cy="105" r="3" fill="#FFF" />
            <circle cx="150" cy="130" r="3" fill="#FFF" />
            {/* Embroidery scroll */}
            <path d="M 134 45 Q 138 75 134 105" stroke={accentColor} strokeWidth="2" fill="none" />
            <path d="M 166 45 Q 162 75 166 105" stroke={accentColor} strokeWidth="2" fill="none" />
          </g>
        );

      case 'dc-05': // Khadi Panjabi
        return (
          <g>
            <rect x="30" y="20" width="240" height="200" rx="10" fill={color} />
            {/* Natural handspun texture lines */}
            <g opacity="0.3" stroke="#FAF8F5" strokeWidth="1.5">
              {Array.from({ length: 14 }).map((_, i) => (
                <line key={i} x1="40" y1={30 + i * 13} x2="260" y2={30 + i * 13} />
              ))}
            </g>
            {/* Clean collar & coconut buttons */}
            <path d="M 115 32 Q 150 48 185 32" fill="none" stroke={accentColor} strokeWidth="4" />
            <rect x="144" y="38" width="12" height="95" fill={accentColor} rx="2" />
            <circle cx="150" cy="55" r="3.5" fill="#4A3B32" />
            <circle cx="150" cy="80" r="3.5" fill="#4A3B32" />
            <circle cx="150" cy="105" r="3.5" fill="#4A3B32" />
          </g>
        );

      case 'dc-06': // Silk Shawl
        return (
          <g>
            <rect x="30" y="25" width="240" height="190" rx="8" fill={color} />
            {/* Rajshahi silk gradient and tassels */}
            <path d="M 40 40 Q 150 90 260 40" stroke={accentColor} strokeWidth="3" fill="none" />
            <path d="M 40 80 Q 150 130 260 80" stroke={accentColor} strokeWidth="2.5" fill="none" opacity="0.8" />
            <path d="M 40 120 Q 150 170 260 120" stroke={accentColor} strokeWidth="2" fill="none" opacity="0.6" />
            {/* Tassels */}
            {Array.from({ length: 15 }).map((_, i) => (
              <line
                key={i}
                x1={45 + i * 15}
                y1="215"
                x2={45 + i * 15}
                y2="230"
                stroke={accentColor}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            ))}
          </g>
        );

      case 'dc-07': // Nakshi Kantha Quilt
        return (
          <g>
            <rect x="25" y="20" width="250" height="200" rx="8" fill={color} />
            {/* Folk art floral wheel & tree of life running stitches */}
            <circle cx="150" cy="120" r="55" fill="none" stroke={accentColor} strokeWidth="2.5" strokeDasharray="5 4" />
            <circle cx="150" cy="120" r="30" fill="none" stroke="#FFF" strokeWidth="2" strokeDasharray="4 3" />
            <circle cx="150" cy="120" r="8" fill={accentColor} />
            {/* Petals */}
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i * Math.PI) / 4;
              const x2 = 150 + Math.cos(angle) * 45;
              const y2 = 120 + Math.sin(angle) * 45;
              return (
                <line
                  key={i}
                  x1="150"
                  y1="120"
                  x2={x2}
                  y2={y2}
                  stroke={accentColor}
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />
              );
            })}
            {/* Border running stitches */}
            <rect x="35" y="30" width="230" height="180" rx="4" fill="none" stroke="#FFF" strokeWidth="2" strokeDasharray="6 4" />
          </g>
        );

      case 'dc-08': // Dhamrai Brass Tea Pot & Cups
        return (
          <g>
            <rect x="20" y="20" width="260" height="200" rx="8" fill="#1C1812" />
            {/* Solid polished brass teapot */}
            <ellipse cx="140" cy="140" rx="45" ry="35" fill={color} />
            <path d="M 120 105 L 160 105 L 155 95 L 125 95 Z" fill={accentColor} />
            <circle cx="140" cy="90" r="5" fill={accentColor} />
            {/* Spout */}
            <path d="M 95 135 C 75 130 65 110 55 95 C 65 95 85 115 98 125 Z" fill={color} />
            {/* Handle */}
            <path d="M 185 125 C 220 120 220 165 180 160" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" />
            {/* Brass Cups */}
            <path d="M 210 160 L 235 160 L 230 180 L 215 180 Z" fill={accentColor} />
            <ellipse cx="222.5" cy="160" rx="12.5" ry="4" fill={color} />
          </g>
        );

      case 'dc-09': // Rickshaw Art Tray
        return (
          <g>
            {/* Wooden Tray Frame */}
            <rect x="25" y="25" width="250" height="190" rx="10" fill="#3A1C0E" />
            <rect x="35" y="35" width="230" height="170" rx="6" fill={color} />
            {/* Rickshaw peacock art motif */}
            <ellipse cx="150" cy="120" rx="35" ry="25" fill="#00A878" />
            <circle cx="170" cy="100" r="14" fill="#0267C1" />
            <polygon points="184,100 195,97 184,105" fill="#EFA00B" />
            {/* Fan tail */}
            <path d="M 120 120 C 90 90 90 70 80 60 C 100 75 110 95 120 115" stroke="#EFA00B" strokeWidth="4" fill="none" />
            <path d="M 125 125 C 95 110 85 100 70 95 C 95 105 110 115 125 122" stroke="#D33F49" strokeWidth="4" fill="none" />
            {/* Border scallops */}
            <circle cx="45" cy="45" r="4" fill="#FFF" />
            <circle cx="255" cy="45" r="4" fill="#FFF" />
            <circle cx="45" cy="195" r="4" fill="#FFF" />
            <circle cx="255" cy="195" r="4" fill="#FFF" />
          </g>
        );

      case 'dc-10': // Clay Terracotta Cups
        return (
          <g>
            <rect x="20" y="20" width="260" height="200" rx="8" fill="#F4EBE2" />
            {/* Natural terracotta earthenware tea cups */}
            <g transform="translate(45, 60)">
              <path d="M 10 30 L 60 30 L 50 100 L 20 100 Z" fill={color} />
              <ellipse cx="35" cy="30" rx="25" ry="8" fill="#8B3820" />
            </g>
            <g transform="translate(115, 45)">
              <path d="M 10 30 L 60 30 L 50 100 L 20 100 Z" fill={color} />
              <ellipse cx="35" cy="30" rx="25" ry="8" fill="#8B3820" />
              {/* Steaming tea swirls */}
              <path d="M 30 18 Q 35 5 40 -8" stroke="#B55334" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.7" />
            </g>
            <g transform="translate(185, 60)">
              <path d="M 10 30 L 60 30 L 50 100 L 20 100 Z" fill={color} />
              <ellipse cx="35" cy="30" rx="25" ry="8" fill="#8B3820" />
            </g>
          </g>
        );

      case 'dc-11': // Sundarbans Honey
        return (
          <g>
            <rect x="20" y="20" width="260" height="200" rx="8" fill="#20362B" />
            {/* Glass Jar with Raw Amber Honey */}
            <rect x="105" y="75" width="90" height="110" rx="12" fill={color} opacity="0.9" />
            <rect x="115" y="55" width="70" height="22" rx="4" fill="#D4A373" />
            <ellipse cx="150" cy="55" rx="35" ry="6" fill="#BC6C25" />
            {/* Twine wrap */}
            <line x1="115" y1="70" x2="185" y2="70" stroke="#FFF" strokeWidth="2" strokeDasharray="3 3" />
            {/* Hexagonal honeycomb label */}
            <polygon points="150,110 165,120 165,140 150,150 135,140 135,120" fill={accentColor} />
            <circle cx="150" cy="130" r="4" fill="#784805" />
          </g>
        );

      case 'dc-12': // Kalojira Rice
        return (
          <g>
            <rect x="20" y="20" width="260" height="200" rx="8" fill={color} />
            {/* Burlap sack filled with fragrant white rice */}
            <path d="M 80 180 C 70 120 85 80 110 80 L 190 80 C 215 80 230 120 220 180 Z" fill="#DDB892" />
            <ellipse cx="150" cy="80" rx="40" ry="12" fill="#FAF5E8" />
            {/* Fragrant grains */}
            <ellipse cx="140" cy="76" rx="4" ry="2" fill="#FFFFFF" />
            <ellipse cx="155" cy="78" rx="4" ry="2" fill="#FFFFFF" />
            <ellipse cx="148" cy="84" rx="4" ry="2" fill="#FFFFFF" />
            {/* Traditional grain stalk */}
            <path d="M 150 170 Q 150 110 150 95" stroke="#7F5539" strokeWidth="3" />
          </g>
        );

      case 'dc-13': // Mustard Oil
        return (
          <g>
            <rect x="20" y="20" width="260" height="200" rx="8" fill="#2E2816" />
            {/* Golden mustard oil bottle with wooden cap */}
            <rect x="115" y="70" width="70" height="120" rx="10" fill={color} />
            <rect x="135" y="45" width="30" height="28" rx="3" fill={color} />
            <rect x="130" y="35" width="40" height="14" rx="4" fill="#583101" />
            {/* Label with mustard flowers */}
            <rect x="123" y="100" width="54" height="60" rx="4" fill={accentColor} />
            <circle cx="150" cy="130" r="8" fill="#F4A261" />
            <circle cx="144" cy="124" r="4" fill="#E76F51" />
            <circle cx="156" cy="124" r="4" fill="#E76F51" />
          </g>
        );

      case 'dc-14': // Cox's Bazar Dry Fish
        return (
          <g>
            <rect x="20" y="20" width="260" height="200" rx="8" fill={color} />
            {/* Clean sun-dried coastal fish on bamboo slats */}
            <path d="M 60 120 C 100 80 180 85 240 120 C 180 145 100 150 60 120 Z" fill="#B7B7A4" />
            <polygon points="50,120 70,105 70,135" fill="#A5A58D" />
            <circle cx="215" cy="115" r="4" fill="#3D3A35" />
            <path d="M 110 105 Q 120 120 110 135" stroke="#6B705C" strokeWidth="2" fill="none" />
            <path d="M 140 102 Q 150 120 140 138" stroke="#6B705C" strokeWidth="2" fill="none" />
          </g>
        );

      case 'dc-15': // Sandesh & Naru Sweets
        return (
          <g>
            <rect x="20" y="20" width="260" height="200" rx="8" fill={color} />
            {/* Festive Sweets Hamper */}
            <rect x="50" y="60" width="200" height="120" rx="10" fill="#E9D8A6" />
            {/* 3 Coconut Naru Balls */}
            <circle cx="95" cy="100" r="18" fill="#FAF0CA" />
            <circle cx="150" cy="100" r="18" fill="#FAF0CA" />
            <circle cx="205" cy="100" r="18" fill="#FAF0CA" />
            {/* Cardamom garnish */}
            <circle cx="95" cy="98" r="2.5" fill="#43281C" />
            <circle cx="150" cy="98" r="2.5" fill="#43281C" />
            <circle cx="205" cy="98" r="2.5" fill="#43281C" />
            {/* 3 Khejur Gur Sandesh */}
            <rect x="78" y="130" width="34" height="28" rx="4" fill="#D4A373" />
            <rect x="133" y="130" width="34" height="28" rx="4" fill="#D4A373" />
            <rect x="188" y="130" width="34" height="28" rx="4" fill="#D4A373" />
          </g>
        );

      case 'dc-16': // Leather Wallet
        return (
          <g>
            <rect x="20" y="20" width="260" height="200" rx="8" fill="#1E1614" />
            {/* Vegetable tanned leather bifold */}
            <rect x="60" y="65" width="180" height="110" rx="8" fill={color} />
            {/* Saddle stitching */}
            <rect x="68" y="73" width="164" height="94" rx="6" fill="none" stroke={accentColor} strokeWidth="1.8" strokeDasharray="5 3" />
            {/* Card slots & embossed logo */}
            <line x1="150" y1="65" x2="150" y2="175" stroke="#1E1614" strokeWidth="3" />
            <circle cx="195" cy="120" r="12" fill="none" stroke={accentColor} strokeWidth="1.5" />
            <circle cx="195" cy="120" r="4" fill={accentColor} />
          </g>
        );

      case 'dc-17': // Jute Laptop Bag
        return (
          <g>
            <rect x="20" y="20" width="260" height="200" rx="8" fill="#2B2117" />
            {/* Structured jute canvas bag */}
            <rect x="60" y="80" width="180" height="105" rx="8" fill={color} />
            {/* Leather handles */}
            <path d="M 110 80 C 110 40 190 40 190 80" fill="none" stroke="#8B5A2B" strokeWidth="8" strokeLinecap="round" />
            {/* Leather base trim */}
            <rect x="60" y="155" width="180" height="30" rx="4" fill="#8B5A2B" />
            {/* Brass buckles */}
            <circle cx="110" cy="90" r="4" fill="#DFB15B" />
            <circle cx="190" cy="90" r="4" fill="#DFB15B" />
          </g>
        );

      case 'dc-18': // Rangpur Shotoronji Rug
        return (
          <g>
            <rect x="20" y="20" width="260" height="200" rx="8" fill={color} />
            {/* Heritage Rangpur geometric flat-weave diamond patterns */}
            <polygon points="150,50 190,90 150,130 110,90" fill={accentColor} />
            <polygon points="150,110 190,150 150,190 110,150" fill={accentColor} />
            <polygon points="70,90 110,130 70,170 30,130" fill={accentColor} opacity="0.7" />
            <polygon points="230,90 270,130 230,170 190,130" fill={accentColor} opacity="0.7" />
            {/* Fringe ends */}
            {Array.from({ length: 14 }).map((_, i) => (
              <line key={i} x1={35 + i * 17} y1="20" x2={35 + i * 17} y2="10" stroke="#FFF" strokeWidth="2" />
            ))}
          </g>
        );

      case 'dc-19': // Muslin Kurti
        return (
          <g>
            <rect x="20" y="20" width="260" height="200" rx="8" fill={color} />
            {/* Soft pink straight-cut kurti with threadwork */}
            <path d="M 100 40 L 200 40 L 225 210 L 75 210 Z" fill="#FCEADE" />
            {/* Embroidered floral neckline */}
            <path d="M 130 40 Q 150 65 170 40" fill="none" stroke="#8E5572" strokeWidth="4" />
            <circle cx="150" cy="75" r="4" fill="#8E5572" />
            <circle cx="150" cy="95" r="4" fill="#8E5572" />
            <circle cx="150" cy="115" r="4" fill="#8E5572" />
            <circle cx="150" cy="135" r="4" fill="#8E5572" />
          </g>
        );

      case 'dc-20': // Kumarkhali Lungi
        return (
          <g>
            <rect x="20" y="20" width="260" height="200" rx="8" fill={color} />
            {/* Classic Kushtia woven plaid checkered pattern */}
            <g stroke="#FAF8F5" strokeWidth="2" opacity="0.45">
              <line x1="50" y1="20" x2="50" y2="220" />
              <line x1="100" y1="20" x2="100" y2="220" />
              <line x1="150" y1="20" x2="150" y2="220" />
              <line x1="200" y1="20" x2="200" y2="220" />
              <line x1="250" y1="20" x2="250" y2="220" />
              <line x1="20" y1="60" x2="280" y2="60" />
              <line x1="20" y1="110" x2="280" y2="110" />
              <line x1="20" y1="160" x2="280" y2="160" />
            </g>
            {/* Combed cotton rolled fold */}
            <rect x="70" y="80" width="160" height="90" rx="8" fill="#1C3144" stroke="#FFF" strokeWidth="2" />
          </g>
        );

      default:
        return (
          <g>
            <rect x="20" y="20" width="260" height="200" rx="8" fill={color} />
            <circle cx="150" cy="120" r="40" fill={accentColor} />
          </g>
        );
    }
  };

  return (
    <div className={`relative overflow-hidden bg-[#F7F5F0] flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 300 240"
        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        xmlns="http://www.w3.org/2000/svg"
      >
        {renderVisual()}
      </svg>
    </div>
  );
};
