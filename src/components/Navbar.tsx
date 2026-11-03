import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { ShoppingBag, Sparkles, Search, Menu, X, Cpu } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenAssistant: () => void;
  onSelectCategory: (category: string) => void;
  selectedCategory: string;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenAssistant,
  onSelectCategory,
  selectedCategory,
  searchQuery,
  onSearchChange
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'Traditional Wear', label: 'Traditional Wear' },
    { id: 'Handicrafts & Decor', label: 'Handicrafts & Decor' },
    { id: 'Organic & Food', label: 'Organic Pantry' },
    { id: 'Leather & Accessories', label: 'Leather Craft' }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-2xs">
      {/* Top Banner: Free Delivery & Ethical AI */}
      <div className="bg-[#124E33] text-[#FAF8F5] text-[11px] font-medium py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-3">
        <span>🇧🇩 Authentic Bangladeshi Heritage Goods</span>
        <span className="hidden sm:inline" aria-hidden="true">·</span>
        <span className="hidden sm:inline">Free Delivery Across Bangladesh on orders ৳3,000+</span>
        <span aria-hidden="true">·</span>
        <span>Ethical Local AI Assistant (No Third-Party APIs)</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* Brand Logo */}
          <a href="#" className="shrink-0 flex items-center">
            <BrandLogo size="md" showSubtitle={true} />
          </a>

          {/* Search Input (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Search Jamdani, Panjabi, Honey, Clay cups, Nakshi Kantha..."
                className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-800/10 focus:border-emerald-800 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Smart Assistant Trigger */}
            <button
              type="button"
              onClick={onOpenAssistant}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-semibold rounded-xl border border-emerald-200 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">Smart Assistant</span>
            </button>

            {/* Parity Lab Shortcut */}
            <a
              href="#parity-lab"
              className="hidden lg:flex items-center gap-1 px-3 py-2 text-stone-600 hover:text-emerald-800 text-xs font-medium hover:bg-stone-50 rounded-xl transition-colors"
            >
              <Cpu className="w-3.5 h-3.5 text-stone-400" />
              <span>brain.py Lab</span>
            </a>

            {/* Cart Drawer Trigger */}
            <button
              type="button"
              onClick={onOpenCart}
              className="relative flex items-center gap-2 px-3.5 py-2 bg-emerald-800 hover:bg-emerald-900 text-white rounded-xl text-xs font-semibold shadow-xs transition-all active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="bg-amber-400 text-stone-950 font-bold px-1.5 py-0.2 rounded-full text-[10px] min-w-4 text-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-600 hover:text-stone-900 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Category Navigation Bar (Clean Typography with Subtle Hover Underline - Anti-Slop Discipline) */}
        <nav className="hidden md:flex items-center gap-6 py-2.5 border-t border-stone-100 text-xs">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`transition-colors font-medium pb-1 relative ${
                  isActive
                    ? 'text-emerald-900 font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {cat.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-800 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900"
            />
          </div>

          <div className="pt-2 flex flex-col gap-1 text-xs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onSelectCategory(cat.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left py-2 px-3 rounded-lg ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-50 text-emerald-900 font-semibold'
                    : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                {cat.label}
              </button>
            ))}
            <a
              href="#parity-lab"
              onClick={() => setMobileMenuOpen(false)}
              className="text-left py-2 px-3 text-stone-600 hover:bg-stone-50 rounded-lg flex items-center gap-2"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>brain.py Architecture Lab</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
