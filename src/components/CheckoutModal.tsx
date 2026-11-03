import React, { useState } from 'react';
import { CartItem, PlacedOrder, DeliveryDetails } from '../types';
import { X, CheckCircle2, ShieldCheck, MapPin, CreditCard, Banknote, Phone, Printer } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  discountAmount: number;
  promoApplied: string | null;
  onOrderSuccess: (order: PlacedOrder) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  discountAmount,
  promoApplied,
  onOrderSuccess
}) => {
  const [formData, setFormData] = useState<DeliveryDetails>({
    fullName: 'Musfiqun Noor',
    phone: '01712345678',
    division: 'Dhaka',
    district: 'Dhaka',
    thana: 'Dhanmondi',
    address: 'Road 8/A, House 24, Dhanmondi',
    deliveryArea: 'dhaka',
    paymentMethod: 'bkash',
    notes: 'Please call before delivery'
  });

  const [confirmedOrder, setConfirmedOrder] = useState<PlacedOrder | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal >= 3000 ? 0 : formData.deliveryArea === 'dhaka' ? 60 : 120;
  const total = subtotal + deliveryFee - discountAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const newOrder: PlacedOrder = {
        orderId: `DKC-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
        date: new Date().toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }),
        items,
        subtotal,
        deliveryFee,
        discount: discountAmount,
        total,
        deliveryDetails: formData
      };

      setConfirmedOrder(newOrder);
      setIsSubmitting(false);
      onOrderSuccess(newOrder);
    }, 700);
  };

  const bangladeshDivisions = [
    'Dhaka',
    'Chittagong',
    'Sylhet',
    'Rajshahi',
    'Khulna',
    'Barisal',
    'Rangpur',
    'Mymensingh'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-6">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <h2 className="text-lg font-bold text-stone-900 font-serif">
              {confirmedOrder ? 'Order Confirmed!' : 'DhakaCart Express Checkout'}
            </h2>
            <p className="text-xs text-stone-500">
              {confirmedOrder ? 'Thank you for supporting authentic Bangladeshi craftspeople' : 'Fast, reliable courier delivery across all 64 districts of Bangladesh'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmedOrder ? (
          /* Order Confirmation View */
          <div className="p-6 md:p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="text-xs font-mono uppercase tracking-widest text-emerald-800 font-bold mb-1">
              {confirmedOrder.orderId}
            </span>
            <h3 className="text-2xl font-bold text-stone-900 mb-2 font-serif">
              Order Placed Successfully!
            </h3>
            <p className="text-xs text-stone-600 max-w-md mb-6">
              A courier tracking SMS has been simulated to {confirmedOrder.deliveryDetails.phone}. Estimated delivery: {confirmedOrder.deliveryDetails.deliveryArea === 'dhaka' ? '24–36 hours (Dhaka Metro)' : '2–3 business days'}.
            </p>

            {/* Receipt Summary Card */}
            <div className="w-full bg-stone-50 rounded-xl p-5 border border-stone-200 text-left text-xs mb-6">
              <div className="flex justify-between border-b border-stone-200 pb-3 mb-3">
                <div>
                  <div className="font-semibold text-stone-800">Delivery Address</div>
                  <div className="text-stone-600">{confirmedOrder.deliveryDetails.fullName}</div>
                  <div className="text-stone-500">{confirmedOrder.deliveryDetails.address}, {confirmedOrder.deliveryDetails.thana}, {confirmedOrder.deliveryDetails.district}</div>
                  <div className="text-stone-500">Contact: +88 {confirmedOrder.deliveryDetails.phone}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-stone-800">Payment</div>
                  <div className="text-emerald-800 uppercase font-bold">{confirmedOrder.deliveryDetails.paymentMethod}</div>
                  <div className="text-stone-400 text-[10px]">Verified Transaction</div>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2 mb-3 border-b border-stone-200 pb-3">
                {confirmedOrder.items.map(i => (
                  <div key={i.product.id} className="flex justify-between">
                    <span>{i.product.name} (x{i.quantity})</span>
                    <span className="font-medium text-stone-900">৳{(i.product.price * i.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Cost Totals */}
              <div className="space-y-1 text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>৳{confirmedOrder.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>{confirmedOrder.deliveryFee === 0 ? 'FREE' : `৳${confirmedOrder.deliveryFee}`}</span>
                </div>
                {confirmedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span>-৳{confirmedOrder.discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-sm text-stone-900 pt-2 border-t border-stone-200">
                  <span>Total Paid / Payable</span>
                  <span className="text-emerald-950">৳{confirmedOrder.total.toLocaleString()} BDT</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            {/* Customer Details */}
            <div>
              <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-800" />
                <span>1. Delivery Destination (Bangladesh)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-stone-600 font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:border-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-stone-600 font-medium mb-1">Phone Number (+880)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-mono text-[11px]">+880</span>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="17xxxxxxxx"
                      className="w-full pl-12 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 font-mono focus:outline-none focus:border-emerald-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-600 font-medium mb-1">Division</label>
                  <select
                    value={formData.division}
                    onChange={(e) => {
                      const div = e.target.value;
                      setFormData({
                        ...formData,
                        division: div,
                        deliveryArea: div.toLowerCase() === 'dhaka' ? 'dhaka' : 'outside'
                      });
                    }}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:border-emerald-700"
                  >
                    {bangladeshDivisions.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-600 font-medium mb-1">Thana / Upazila</label>
                  <input
                    type="text"
                    required
                    value={formData.thana}
                    onChange={(e) => setFormData({ ...formData, thana: e.target.value })}
                    placeholder="e.g. Dhanmondi, Gulshan, Uttara"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:border-emerald-700"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-600 font-medium mb-1">Detailed Street Address / Road & House</label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="House, Road, Block or Village details"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:border-emerald-700"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="pt-2 border-t border-stone-200">
              <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-emerald-800" />
                <span>2. Select Payment Method</span>
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {/* bKash */}
                <label
                  className={`p-3 rounded-xl border cursor-pointer flex flex-col items-center text-center transition-all ${
                    formData.paymentMethod === 'bkash'
                      ? 'border-pink-600 bg-pink-50/50 text-pink-900 font-bold shadow-xs'
                      : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="bkash"
                    checked={formData.paymentMethod === 'bkash'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'bkash' })}
                    className="sr-only"
                  />
                  <span className="text-base font-bold text-pink-600 mb-0.5">bKash</span>
                  <span className="text-[10px]">বিকাশ অনলাইন</span>
                </label>

                {/* Nagad */}
                <label
                  className={`p-3 rounded-xl border cursor-pointer flex flex-col items-center text-center transition-all ${
                    formData.paymentMethod === 'nagad'
                      ? 'border-orange-600 bg-orange-50/50 text-orange-900 font-bold shadow-xs'
                      : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="nagad"
                    checked={formData.paymentMethod === 'nagad'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'nagad' })}
                    className="sr-only"
                  />
                  <span className="text-base font-bold text-orange-600 mb-0.5">Nagad</span>
                  <span className="text-[10px]">নগদ ওয়ালেট</span>
                </label>

                {/* Cash on Delivery */}
                <label
                  className={`p-3 rounded-xl border cursor-pointer flex flex-col items-center text-center transition-all ${
                    formData.paymentMethod === 'cod'
                      ? 'border-emerald-700 bg-emerald-50/50 text-emerald-950 font-bold shadow-xs'
                      : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={formData.paymentMethod === 'cod'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                    className="sr-only"
                  />
                  <Banknote className="w-5 h-5 text-emerald-800 mb-0.5" />
                  <span className="font-semibold text-stone-900">Cash on Delivery</span>
                  <span className="text-[10px] text-stone-500">হাতে পেয়ে পরিশোধ</span>
                </label>

                {/* Card */}
                <label
                  className={`p-3 rounded-xl border cursor-pointer flex flex-col items-center text-center transition-all ${
                    formData.paymentMethod === 'card'
                      ? 'border-emerald-700 bg-emerald-50/50 text-emerald-950 font-bold shadow-xs'
                      : 'border-stone-200 bg-white text-stone-600 hover:border-stone-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={() => setFormData({ ...formData, paymentMethod: 'card' })}
                    className="sr-only"
                  />
                  <CreditCard className="w-5 h-5 text-stone-700 mb-0.5" />
                  <span className="font-semibold text-stone-900">Cards</span>
                  <span className="text-[10px] text-stone-500">Visa / Mastercard</span>
                </label>
              </div>
            </div>

            {/* Total Summary and Submit */}
            <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs text-stone-500">
                  Total Payable ({items.length} items)
                </div>
                <div className="text-2xl font-bold text-emerald-950">
                  ৳{total.toLocaleString()} BDT
                </div>
                <div className="text-[11px] text-emerald-800 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Ethical AI Verified · Zero hidden charges</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm rounded-xl shadow-xs transition-all active:scale-98 disabled:opacity-60"
              >
                {isSubmitting ? 'Confirming Order...' : 'Confirm Order (Demo)'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
