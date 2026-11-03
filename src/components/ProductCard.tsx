import React from 'react';
import { Product } from '../types';
import { ProductIllustration } from './ProductIllustration';
import { ShoppingBag, Sparkles, Star, MapPin } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onSelect: (product: Product) => void;
  onFindSimilar: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onSelect,
  onFindSimilar
}) => {
  return (
    <article className="group relative flex flex-col bg-white rounded-xl border border-stone-200/80 hover:border-emerald-700/40 hover:shadow-lg transition-all duration-300 overflow-hidden">
      {/* Product Image Area */}
      <div
        onClick={() => onSelect(product)}
        className="relative aspect-4/3 w-full cursor-pointer bg-stone-100 overflow-hidden"
      >
        <ProductIllustration product={product} className="w-full h-full" />
        
        {/* Subtle authentic heritage badge */}
        <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-emerald-900 text-[11px] font-medium px-2.5 py-1 rounded shadow-xs border border-stone-200/60">
          {product.badge}
        </div>

        {/* Quick similar lookup shortcut */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onFindSimilar(product);
          }}
          title="Find Jaccard similar products based on tags"
          className="absolute top-3 right-3 p-2 bg-white/95 hover:bg-emerald-50 text-stone-600 hover:text-emerald-800 rounded-full shadow-xs border border-stone-200/60 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex flex-col flex-1">
        {/* Clean Unboxed Metadata with Typographic Separators (Frontend Design Constitution) */}
        <div className="flex items-center gap-1.5 text-xs text-stone-500 mb-1.5">
          <span className="font-medium text-stone-700">{product.category}</span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-0.5">
            <MapPin className="w-3 h-3 text-emerald-700" />
            {product.origin}
          </span>
        </div>

        {/* Product Title & Bangla Name */}
        <h3
          onClick={() => onSelect(product)}
          className="font-semibold text-stone-900 text-base leading-snug group-hover:text-emerald-800 transition-colors cursor-pointer line-clamp-1"
        >
          {product.name}
        </h3>
        <p className="text-xs text-stone-400 font-normal mb-2 line-clamp-1">
          {product.banglaName}
        </p>

        {/* Short honest description */}
        <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-3">
          {product.description}
        </p>

        {/* Tags metadata: Clean text with middle dots */}
        <div className="flex flex-wrap items-center gap-1 text-[11px] text-stone-500 mb-4">
          <span className="text-stone-400">Tags:</span>
          {product.tags.slice(0, 3).map((t, idx) => (
            <React.Fragment key={t}>
              <span className="text-stone-600 font-mono">#{t}</span>
              {idx < 2 && <span aria-hidden="true" className="text-stone-300">·</span>}
            </React.Fragment>
          ))}
          {product.tags.length > 3 && (
            <span className="text-stone-400 text-[10px]">+{product.tags.length - 3}</span>
          )}
        </div>

        {/* Footer: Price, Rating & Add to Cart button */}
        <div className="mt-auto pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1 text-emerald-900">
              <span className="text-xs font-semibold">৳</span>
              <span className="text-lg font-bold tracking-tight">
                {product.price.toLocaleString('en-US')}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-stone-500">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-medium text-stone-800">{product.rating}</span>
              <span>({product.reviewsCount})</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onSelect(product)}
              className="px-2.5 py-1.5 text-xs font-medium text-stone-600 hover:text-emerald-800 hover:bg-stone-100 rounded-lg transition-colors"
            >
              Details
            </button>
            <button
              type="button"
              onClick={() => onAddToCart(product)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-medium rounded-lg shadow-xs transition-all active:scale-95"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
