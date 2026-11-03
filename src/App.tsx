import React, { useState, useMemo } from 'react';
import { Product, CartItem, PlacedOrder } from './types';
import { PRODUCTS } from './lib/brain';
import { Navbar } from './components/Navbar';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { SmartAssistant } from './components/SmartAssistant';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { EngineParityLab } from './components/EngineParityLab';
import { Footer } from './components/Footer';
import { BrandLogo } from './components/BrandLogo';
import {
  Sparkles,
  SlidersHorizontal,
  ArrowUpDown,
  Check,
  ShieldCheck,
  MapPin,
  TrendingUp,
  Tag,
  FilterX
} from 'lucide-react';

export default function App() {
  // Navigation & Filter State
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedOrigin, setSelectedOrigin] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [priceMax, setPriceMax] = useState<number>(10000);
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'rating'>('recommended');

  // Cart & Checkout State
  const [cartItems, setCartItems] = useState<CartItem[]>([
    // Initialize with a popular demo item so cart isn't empty on load
    { product: PRODUCTS[9], quantity: 2 }, // Matir Cha Cups
    { product: PRODUCTS[10], quantity: 1 } // Sundarbans Honey
  ]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [promoApplied, setPromoApplied] = useState<string | null>(null);

  // Modal & Selection State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cart Management Handlers
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });

    showToast(`Added "${product.name}" to cart`);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
    showToast('Item removed from cart');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleProceedToCheckout = (discount: number, promo: string | null) => {
    setDiscountAmount(discount);
    setPromoApplied(promo);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (order: PlacedOrder) => {
    setCartItems([]);
    showToast(`Order ${order.orderId} placed successfully!`);
  };

  const handleFindSimilar = (product: Product) => {
    setSelectedProduct(product);
  };

  // Distinct origins list for filter
  const allOrigins = useMemo(() => {
    const set = new Set(PRODUCTS.map(p => p.origin));
    return ['all', ...Array.from(set)];
  }, []);

  // Filter & Sort Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(product => {
      // Category match
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false;
      }
      // Origin match
      if (selectedOrigin !== 'all' && product.origin !== selectedOrigin) {
        return false;
      }
      // Price ceiling match
      if (product.price > priceMax) {
        return false;
      }
      // Search query match across name, tags, description, origin
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesBangla = product.banglaName.toLowerCase().includes(q);
        const matchesCategory = product.category.toLowerCase().includes(q);
        const matchesOrigin = product.origin.toLowerCase().includes(q);
        const matchesTags = product.tags.some(t => t.toLowerCase().includes(q));
        const matchesDesc = product.description.toLowerCase().includes(q);
        if (!matchesName && !matchesBangla && !matchesCategory && !matchesOrigin && !matchesTags && !matchesDesc) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      // Default: recommended (rating weight + reviews)
      return b.rating * b.reviewsCount - a.rating * a.reviewsCount;
    });
  }, [selectedCategory, selectedOrigin, priceMax, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedOrigin('all');
    setSearchQuery('');
    setPriceMax(10000);
    setSortBy('recommended');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 font-sans flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-stone-800 animate-in slide-in-from-bottom duration-200">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenAssistant={() => {
          document.getElementById('smart-assistant')?.scrollIntoView({ behavior: 'smooth' });
        }}
        onSelectCategory={setSelectedCategory}
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* HERO SECTION: Warm, Distinctive, Authentic Bangladeshi Heritage */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-[#124E33] to-[#0A3321] text-[#FAF8F5] py-14 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-emerald-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs text-emerald-200 border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Direct from Master Artisans Across Bangladesh</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight font-serif leading-[1.15]">
              Authentic Bangladeshi Heritage, <span className="text-[#DFB15B]">Classy Modern Living.</span>
            </h1>

            <p className="text-sm sm:text-base text-stone-200 leading-relaxed max-w-2xl font-light">
              Explore GI-certified Dhakai Jamdani sarees, raw Sundarbans wildflower honey, Comilla handspun Khadi, and 200-year Dhamrai bell metal crafts. Guided by our explainable, local recommendation engine that <strong className="font-semibold text-white">strictly respects your budget</strong>.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#catalogue"
                className="px-6 py-3 bg-[#DFB15B] hover:bg-[#C99C44] text-stone-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md active:scale-95"
              >
                Explore Catalogue ({PRODUCTS.length} Items)
              </a>

              <a
                href="#smart-assistant"
                className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm rounded-xl border border-white/20 backdrop-blur-xs transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-[#DFB15B]" />
                <span>Ask Smart Assistant</span>
              </a>
            </div>

            {/* Value Indicators */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-stone-300">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>100% Genuine Handcrafted Goods</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-emerald-300">৳</span>
                <span>Zero Hidden Fees at Checkout</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Transparent Local AI Math</span>
              </div>
            </div>
          </div>

          {/* Right Hero Visual Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative bg-white/5 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/15 shadow-2xl max-w-sm w-full text-center">
              {/* Large Centered Logo */}
              <div className="mx-auto w-32 h-32 mb-4 bg-white/10 rounded-full p-2 flex items-center justify-center border border-white/20 shadow-inner">
                <BrandLogo size="xl" showSubtitle={false} className="flex-col" />
              </div>

              <h2 className="text-xl font-bold font-serif text-white mb-1">
                DhakaCart
              </h2>
              <p className="text-xs uppercase tracking-widest text-[#DFB15B] font-semibold mb-4">
                Classy Online Shopping · Dhaka
              </p>

              <div className="p-3 bg-black/20 rounded-xl text-xs text-stone-300 text-left space-y-1.5 border border-white/10">
                <div className="flex justify-between">
                  <span>Traditional Handlooms:</span>
                  <span className="font-semibold text-white">Narayanganj & Tangail</span>
                </div>
                <div className="flex justify-between">
                  <span>Pure Pantry Harvest:</span>
                  <span className="font-semibold text-white">Sundarbans & Kushtia</span>
                </div>
                <div className="flex justify-between">
                  <span>Local AI Technology:</span>
                  <span className="font-mono text-emerald-300">brain.py & brain.ts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SMART ASSISTANT SECTION */}
      <SmartAssistant
        onAddToCart={handleAddToCart}
        onSelectProduct={setSelectedProduct}
      />

      {/* CATALOGUE SECTION */}
      <main id="catalogue" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        {/* Section Title & Description */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-serif">
              Bangladeshi Craft Catalogue
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Curated collection of regional masterworks from the weavers of Rupganj to the potters of Rayerbazar.
            </p>
          </div>

          <div className="text-xs text-stone-500 font-medium">
            Showing <strong className="text-stone-900">{filteredProducts.length}</strong> of {PRODUCTS.length} products
          </div>
        </div>

        {/* Filter & Sorting Controls */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200/90 shadow-2xs mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
            {/* Category Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-emerald-700"
              >
                <option value="all">All Categories</option>
                <option value="Traditional Wear">Traditional Wear</option>
                <option value="Handicrafts & Decor">Handicrafts & Decor</option>
                <option value="Organic & Food">Organic & Food</option>
                <option value="Leather & Accessories">Leather & Accessories</option>
              </select>
            </div>

            {/* Origin District Filter */}
            <div>
              <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                Heritage Origin District
              </label>
              <select
                value={selectedOrigin}
                onChange={(e) => setSelectedOrigin(e.target.value)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-emerald-700"
              >
                <option value="all">All Bangladeshi Districts</option>
                {allOrigins.filter(o => o !== 'all').map(origin => (
                  <option key={origin} value={origin}>{origin}</option>
                ))}
              </select>
            </div>

            {/* Price Max Slider */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[11px] font-semibold text-stone-600 uppercase">
                  Max Price
                </label>
                <span className="text-xs font-bold text-emerald-900">
                  ৳{priceMax.toLocaleString()}
                </span>
              </div>
              <input
                type="range"
                min="500"
                max="10000"
                step="250"
                value={priceMax}
                onChange={(e) => setPriceMax(parseInt(e.target.value))}
                className="w-full accent-emerald-800 cursor-pointer"
              />
            </div>

            {/* Sort Dropdown */}
            <div>
              <label className="block text-[11px] font-semibold text-stone-600 uppercase mb-1">
                Sort Order
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:border-emerald-700"
              >
                <option value="recommended">Curated / Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Customer Rating</option>
              </select>
            </div>
          </div>

          {/* Active Filter Badges & Reset */}
          {(selectedCategory !== 'all' || selectedOrigin !== 'all' || priceMax < 10000 || searchQuery) && (
            <div className="mt-4 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-600">
                <span className="text-stone-400">Active filters:</span>
                {selectedCategory !== 'all' && (
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-900 rounded border border-emerald-200 text-[11px]">
                    Category: {selectedCategory}
                  </span>
                )}
                {selectedOrigin !== 'all' && (
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-900 rounded border border-emerald-200 text-[11px]">
                    Origin: {selectedOrigin}
                  </span>
                )}
                {priceMax < 10000 && (
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-900 rounded border border-emerald-200 text-[11px]">
                    ≤ ৳{priceMax.toLocaleString()}
                  </span>
                )}
                {searchQuery && (
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-900 rounded border border-emerald-200 text-[11px]">
                    Keyword: "{searchQuery}"
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={resetFilters}
                className="flex items-center gap-1 text-xs text-stone-500 hover:text-red-700 font-medium transition-colors"
              >
                <FilterX className="w-3.5 h-3.5" />
                <span>Reset all filters</span>
              </button>
            </div>
          )}
        </div>

        {/* Product Cards Grid */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-stone-200">
            <p className="text-base font-semibold text-stone-800 mb-1">
              No products found matching these criteria.
            </p>
            <p className="text-xs text-stone-500 mb-4">
              Try adjusting your price ceiling or search query.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="px-4 py-2 bg-emerald-800 text-white text-xs font-semibold rounded-lg hover:bg-emerald-900 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onSelect={setSelectedProduct}
                onFindSimilar={handleFindSimilar}
              />
            ))}
          </div>
        )}
      </main>

      {/* LOCAL AI ENGINE PARITY LAB */}
      <EngineParityLab />

      {/* FOOTER */}
      <Footer />

      {/* MODALS */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={handleProceedToCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        discountAmount={discountAmount}
        promoApplied={promoApplied}
        onOrderSuccess={handleOrderSuccess}
      />
    </div>
  );
}
