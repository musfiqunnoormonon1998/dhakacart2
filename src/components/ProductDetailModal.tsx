import React, { useMemo } from 'react';
import { Product } from '../types';
import { ProductIllustration } from './ProductIllustration';
import { getSimilarProducts } from '../lib/brain';
import { X, Star, ShoppingBag, MapPin, Sparkles, Check, ShieldCheck, Truck } from 'lucide-react';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity?: number) => void;
  onSelectProduct: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onSelectProduct
}) => {
  const [quantity, setQuantity] = React.useState(1);
  const [addedNotice, setAddedNotice] = React.useState(false);

  // Compute Jaccard similar products excluding current product
  const similarResults = useMemo(() => {
    if (!product) return null;
    try {
      return getSimilarProducts(undefined, product.id, 4);
    } catch {
      return null;
    }
  }, [product]);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-stone-100 text-stone-500 hover:text-stone-800 rounded-full border border-stone-200 transition-colors shadow-xs"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Product Visual */}
          <div className="p-6 md:p-8 bg-stone-50 border-b md:border-b-0 md:border-r border-stone-200 flex flex-col justify-center items-center">
            <div className="w-full max-w-sm aspect-4/3 rounded-xl overflow-hidden shadow-xs border border-stone-200/80 bg-white">
              <ProductIllustration product={product} className="w-full h-full" />
            </div>

            {/* Honest Heritage Badges */}
            <div className="mt-4 w-full max-w-sm flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs text-stone-600 bg-white px-3 py-2 rounded-lg border border-stone-200/70">
                <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>GI Certified Authentic Heritage Item · {product.origin}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-600 bg-white px-3 py-2 rounded-lg border border-stone-200/70">
                <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Next-day Dhaka delivery (৳60) · Free above ৳3,000</span>
              </div>
            </div>
          </div>

          {/* Right: Product Details & Purchase Controls */}
          <div className="p-6 md:p-8 flex flex-col">
            {/* Category & Origin */}
            <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
              <span className="font-semibold text-emerald-800 uppercase tracking-wider">{product.category}</span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                {product.origin}, Bangladesh
              </span>
            </div>

            <h2 className="text-2xl font-bold text-stone-900 leading-snug">
              {product.name}
            </h2>
            <p className="text-sm font-medium text-emerald-900/80 mb-3">
              {product.banglaName}
            </p>

            {/* Rating and Reviews */}
            <div className="flex items-center gap-2 text-sm text-stone-600 mb-4 pb-4 border-b border-stone-100">
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-bold text-stone-900">{product.rating}</span>
              </div>
              <span aria-hidden="true">·</span>
              <span>{product.reviewsCount} customer reviews</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 font-medium">In Stock ({product.stock} units)</span>
            </div>

            {/* Price */}
            <div className="mb-4">
              <div className="flex items-baseline gap-1 text-emerald-900">
                <span className="text-sm font-semibold">৳</span>
                <span className="text-3xl font-bold tracking-tight">
                  {product.price.toLocaleString('en-US')}
                </span>
                <span className="text-xs text-stone-500 ml-2">BDT (inclusive of all taxes)</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed mb-5">
              {product.description}
            </p>

            {/* Specifications Table */}
            <div className="mb-6 bg-stone-50 rounded-xl p-3 border border-stone-200/70">
              <h4 className="text-xs font-semibold text-stone-800 uppercase tracking-wider mb-2">
                Authentic Craft Specifications
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(product.specs).map(([key, val]) => (
                  <div key={key} className="flex flex-col">
                    <span className="text-stone-400 font-medium">{key}</span>
                    <span className="text-stone-800 font-medium">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tag List */}
            <div className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-stone-600">
              <span className="text-stone-400 font-medium">Keywords:</span>
              {product.tags.map(t => (
                <span key={t} className="px-2 py-0.5 bg-stone-100 text-stone-700 rounded text-[11px] font-mono">
                  #{t}
                </span>
              ))}
            </div>

            {/* Quantity and Add to Cart Action */}
            <div className="mt-auto flex items-center gap-3 pt-4 border-t border-stone-100">
              <div className="flex items-center border border-stone-300 rounded-lg overflow-hidden bg-stone-50">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-stone-600 hover:bg-stone-200 transition-colors font-bold text-sm"
                >
                  -
                </button>
                <span className="px-3 py-2 text-stone-900 font-semibold text-sm min-w-8 text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-stone-600 hover:bg-stone-200 transition-colors font-bold text-sm"
                >
                  +
                </button>
              </div>

              <button
                type="button"
                onClick={handleAdd}
                className="flex-1 flex items-center justify-center gap-2 py-3 px-5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold rounded-lg shadow-sm transition-all active:scale-98"
              >
                {addedNotice ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Cart · ৳{(product.price * quantity).toLocaleString()}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Jaccard Similar Products */}
        {similarResults && similarResults.similarProducts.length > 0 && (
          <div className="p-6 md:p-8 bg-stone-50 border-t border-stone-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <h3 className="text-base font-bold text-stone-900">
                  Similar Products via Jaccard Similarity
                </h3>
              </div>
              <span className="text-xs text-stone-500">
                Formula: |A ∩ B| / |A ∪ B| (Excluding current item)
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {similarResults.similarProducts.map((sim) => (
                <div
                  key={sim.product.id}
                  onClick={() => onSelectProduct(sim.product)}
                  className="group bg-white rounded-xl p-3 border border-stone-200/80 hover:border-emerald-700/50 hover:shadow-sm cursor-pointer transition-all flex flex-col justify-between"
                >
                  <div className="w-full aspect-16/10 rounded-lg overflow-hidden bg-stone-100 mb-2.5">
                    <ProductIllustration product={sim.product} className="w-full h-full" />
                  </div>

                  <div>
                    {/* Jaccard similarity metric badge */}
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {sim.similarityPercentage}% Match
                      </span>
                      <span className="text-stone-400 font-mono text-[10px]">
                        {sim.sharedCount} shared tags
                      </span>
                    </div>

                    <h4 className="text-xs font-semibold text-stone-900 group-hover:text-emerald-800 line-clamp-1 mb-1">
                      {sim.product.name}
                    </h4>

                    {/* Shared Tags */}
                    <div className="text-[10px] text-stone-500 line-clamp-1 mb-2">
                      Shared: {sim.sharedTags.map(t => `#${t}`).join(' ')}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
                    <span className="font-bold text-stone-900">
                      ৳{sim.product.price.toLocaleString()}
                    </span>
                    <span className="text-emerald-700 font-medium text-[11px] group-hover:underline">
                      View →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
