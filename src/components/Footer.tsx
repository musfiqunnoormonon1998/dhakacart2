import React from 'react';
import { BrandLogo } from './BrandLogo';
import { ShieldCheck, MapPin, Heart, Truck, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#1A2621] text-stone-300 border-t border-stone-800 pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Column 1: Brand & Manifesto */}
          <div className="space-y-4">
            <div className="bg-white/10 p-3 rounded-2xl inline-block">
              <BrandLogo size="lg" showSubtitle={true} className="brightness-125" />
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              DhakaCart bridges authentic Bangladeshi master artisans directly with conscious shoppers worldwide. From GI-certified Dhakai Jamdani to pure Sundarbans honey, every item celebrates our rich cultural heritage.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>Ethical Artisan Commerce & Transparent AI</span>
            </div>
          </div>

          {/* Column 2: Heritage Craft Regions */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-mono">
              Artisan Origins & GI Crafts
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Narayanganj · GI Dhakai Jamdani Weaving</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tangail · Heritage Taant & Combed Cotton</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Rajshahi · Mulberry Silk Sericulture</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sundarbans · Wild Mawali Raw Honey</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Jessore · Hand-Embroidered Nakshi Kantha</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Dhamrai · 200-Year Lost-Wax Brass Casting</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Transparent Local AI Engine */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-mono">
              Deterministic Local Logic
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed mb-3">
              Unlike black-box LLMs that harvest user data, DhakaCart runs a 100% deterministic local recommendation engine:
            </p>
            <div className="space-y-2 text-xs text-stone-400">
              <div className="p-2.5 bg-stone-900/80 rounded-lg border border-stone-800">
                <div className="font-semibold text-emerald-300 text-[11px]">Strict Budget Enforcement</div>
                <div className="text-[10px]">Zero recommendations ever exceed your specified limit.</div>
              </div>
              <div className="p-2.5 bg-stone-900/80 rounded-lg border border-stone-800">
                <div className="font-semibold text-emerald-300 text-[11px]">Jaccard Similarity</div>
                <div className="text-[10px]">Mathematical tag overlap |A ∩ B| / |A ∪ B|.</div>
              </div>
              <div className="p-2.5 bg-stone-900/80 rounded-lg border border-stone-800">
                <div className="font-semibold text-emerald-300 text-[11px]">Python & JS Parity</div>
                <div className="text-[10px]">Identical outputs across brain.py & brain.ts.</div>
              </div>
            </div>
          </div>

          {/* Column 4: Shipping & Bangladeshi Payments */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4 font-mono">
              Courier & Payments
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed mb-3">
              Courier tracking across all 64 districts with 24-48h Dhaka Metro delivery and Cash on Delivery option.
            </p>
            <div className="space-y-2 text-xs">
              <div className="text-stone-300 font-medium">Supported Payment Options:</div>
              <div className="flex flex-wrap gap-1.5 text-[11px]">
                <span className="px-2 py-0.5 bg-pink-950 text-pink-300 rounded border border-pink-900 font-semibold">bKash</span>
                <span className="px-2 py-0.5 bg-orange-950 text-orange-300 rounded border border-orange-900 font-semibold">Nagad</span>
                <span className="px-2 py-0.5 bg-purple-950 text-purple-300 rounded border border-purple-900 font-semibold">Rocket</span>
                <span className="px-2 py-0.5 bg-stone-800 text-stone-300 rounded border border-stone-700">Cash on Delivery</span>
                <span className="px-2 py-0.5 bg-blue-950 text-blue-300 rounded border border-blue-900">Visa / Mastercard</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            © 2026 DhakaCart (ঢাকা কার্ট). Classy Online Shopping · Dhaka, Bangladesh.
          </div>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-current" />
            <span>for Bangladeshi Artisan Heritage</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
