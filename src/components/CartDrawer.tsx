import React, { useState } from 'react';
import { CartItem, Product } from '../types';
import { ProductIllustration } from './ProductIllustration';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, ShieldCheck, Truck } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onProceedToCheckout: (discountAmount: number, promoApplied: string | null) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [deliveryArea, setDeliveryArea] = useState<'dhaka' | 'outside'>('dhaka');

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  
  // Free delivery over ৳3,000 BDT
  const isFreeDelivery = subtotal >= 3000;
  const standardDeliveryFee = deliveryArea === 'dhaka' ? 60 : 120;
  const deliveryFee = isFreeDelivery ? 0 : standardDeliveryFee;

  // Promo discount calculation (10% off for EIDMUBARAK or DHAKA10)
  let discountAmount = 0;
  if (appliedPromo) {
    discountAmount = Math.round(subtotal * 0.1);
  }

  const grandTotal = subtotal + deliveryFee - discountAmount;

  const handleApplyPromo = () => {
    setPromoError(null);
    const code = promoCode.trim().toUpperCase();
    if (code === 'EIDMUBARAK' || code === 'DHAKA10') {
      setAppliedPromo(code);
      setPromoCode('');
    } else {
      setPromoError('Invalid coupon. Try "EIDMUBARAK" or "DHAKA10"');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-stone-900/50 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/70">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-800" />
              <h2 className="text-base font-bold text-stone-900 font-serif">
                Your DhakaCart Basket
              </h2>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                {items.reduce((sum, i) => sum + i.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-stone-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-stone-400">
                <ShoppingBag className="w-12 h-12 mb-3 stroke-1 text-stone-300" />
                <p className="text-sm font-semibold text-stone-700 mb-1">
                  Your cart is empty
                </p>
                <p className="text-xs text-stone-500 max-w-xs mb-4">
                  Explore our handcrafted sarees, brass crafts, raw Sundarbans honey, or ask the Smart Assistant!
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-emerald-800 text-white rounded-lg text-xs font-semibold hover:bg-emerald-900 transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.product.id} className="py-4 flex gap-3">
                  <div className="w-16 h-16 rounded-lg bg-stone-100 shrink-0 overflow-hidden border border-stone-200/70">
                    <ProductIllustration product={item.product} className="w-full h-full" />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-semibold text-stone-900 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <span className="text-[10px] text-stone-500">
                          {item.product.origin} · {item.product.category}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveItem(item.product.id)}
                        className="text-stone-400 hover:text-red-600 transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-stone-200 rounded-md bg-stone-50 text-xs">
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                          className="px-2 py-0.5 text-stone-600 hover:bg-stone-200 font-bold"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 font-semibold text-stone-800 min-w-6 text-center">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                          className="px-2 py-0.5 text-stone-600 hover:bg-stone-200 font-bold"
                        >
                          +
                        </button>
                      </div>

                      {/* Total for this line */}
                      <span className="font-bold text-xs text-stone-900">
                        ৳{(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer */}
          {items.length > 0 && (
            <div className="p-5 border-t border-stone-200 bg-stone-50/50 flex flex-col gap-3">
              {/* Delivery Zone Toggle */}
              <div className="flex items-center justify-between text-xs bg-white p-2 rounded-lg border border-stone-200">
                <span className="font-medium text-stone-700 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-800" />
                  Delivery Zone:
                </span>
                <div className="flex gap-1 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setDeliveryArea('dhaka')}
                    className={`px-2 py-1 rounded font-medium transition-colors ${
                      deliveryArea === 'dhaka'
                        ? 'bg-emerald-800 text-white'
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    Dhaka Metro (৳60)
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeliveryArea('outside')}
                    className={`px-2 py-1 rounded font-medium transition-colors ${
                      deliveryArea === 'outside'
                        ? 'bg-emerald-800 text-white'
                        : 'text-stone-600 hover:bg-stone-100'
                    }`}
                  >
                    Outside Dhaka (৳120)
                  </button>
                </div>
              </div>

              {/* Promo code input */}
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400" />
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Coupon code (e.g. EIDMUBARAK)"
                    className="w-full pl-8 pr-3 py-2 bg-white border border-stone-300 rounded-lg text-xs uppercase focus:outline-none focus:border-emerald-700"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="px-3 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg text-xs font-semibold transition-colors"
                >
                  Apply
                </button>
              </div>

              {appliedPromo && (
                <div className="text-[11px] text-emerald-700 font-medium flex items-center justify-between bg-emerald-50 px-2 py-1 rounded border border-emerald-200">
                  <span>Coupon '{appliedPromo}' applied (10% off)</span>
                  <button
                    onClick={() => setAppliedPromo(null)}
                    className="text-stone-400 hover:text-red-600 text-xs ml-2"
                  >
                    ×
                  </button>
                </div>
              )}

              {promoError && (
                <p className="text-[11px] text-red-600">{promoError}</p>
              )}

              {/* Transparent Price Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-stone-200">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium text-stone-900">৳{subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span>
                    Delivery ({deliveryArea === 'dhaka' ? 'Inside Dhaka' : 'All Bangladesh'})
                  </span>
                  <span>
                    {isFreeDelivery ? (
                      <span className="text-emerald-700 font-bold">FREE (Above ৳3,000)</span>
                    ) : (
                      `৳${deliveryFee}`
                    )}
                  </span>
                </div>

                {appliedPromo && (
                  <div className="flex justify-between text-emerald-800 font-medium">
                    <span>Discount (10%)</span>
                    <span>-৳{discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Grand Total</span>
                  <span className="text-emerald-950 text-base">
                    ৳{grandTotal.toLocaleString()} BDT
                  </span>
                </div>
              </div>

              {/* Ethical Pricing Guarantee Notice */}
              <div className="flex items-center gap-1.5 text-[11px] text-stone-500 bg-white p-2 rounded-lg border border-stone-200/70">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>Zero hidden fees · Transparent artisan pricing</span>
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                onClick={() => onProceedToCheckout(discountAmount, appliedPromo)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-800 hover:bg-emerald-900 text-white text-sm font-bold rounded-xl shadow-xs transition-all active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
