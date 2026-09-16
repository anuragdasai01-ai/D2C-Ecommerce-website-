// src/components/storefront/ProductActions.tsx
'use client';

import { useState } from 'react';
import { useCartStore } from '@/lib/store/useCartStore';
import { formatINR } from '@/lib/utils';
import toast from 'react-hot-toast'; // Assuming react-hot-toast is installed

interface Variant {
  id: string;
  name: string;
  price_adjustment: number;
  stock_quantity: number;
}

interface ProductActionsProps {
  product: {
    id: string;
    title: string;
    base_price: number;
    imageUrl: string;
  };
  variants: Variant[];
}

export default function ProductActions({ product, variants }: ProductActionsProps) {
  const [selectedVariant, setSelectedVariant] = useState<Variant>(variants[0]);
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const currentPrice = product.base_price + selectedVariant.price_adjustment;
  const isOutOfStock = selectedVariant.stock_quantity === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addItem({
      variantId: selectedVariant.id,
      productId: product.id,
      name: product.title,
      variantName: selectedVariant.name,
      price: currentPrice,
      imageUrl: product.imageUrl,
      quantity,
      maxStock: selectedVariant.stock_quantity,
    });

    toast.success(`${product.title} added to cart!`, {
      style: {
        background: '#18181b', // zinc-900
        color: '#fff',
        borderRadius: '4px',
      },
    });
  };

  return (
    <div className="flex flex-col gap-6 mt-8">
      {/* Price Display */}
      <div className="text-2xl font-medium text-zinc-900">
        {formatINR(currentPrice)}
      </div>

      {/* Variant Selection */}
      {variants.length > 1 && (
        <div className="flex flex-col gap-3">
          <span className="text-sm font-medium text-zinc-900">Select Option</span>
          <div className="flex flex-wrap gap-3">
            {variants.map((variant) => (
              <button
                key={variant.id}
                onClick={() => {
                  setSelectedVariant(variant);
                  setQuantity(1); // Reset quantity on variant change
                }}
                disabled={variant.stock_quantity === 0}
                className={`px-4 py-2 text-sm border rounded-md transition-all ${
                  selectedVariant.id === variant.id
                    ? 'border-zinc-900 bg-zinc-900 text-white'
                    : 'border-zinc-200 text-zinc-900 hover:border-zinc-400'
                } ${variant.stock_quantity === 0 ? 'opacity-50 cursor-not-allowed line-through' : ''}`}
              >
                {variant.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity & Add to Cart */}
      <div className="flex gap-4 items-end">
        <div className="flex flex-col gap-3 w-24">
          <span className="text-sm font-medium text-zinc-900">Quantity</span>
          <div className="flex items-center border border-zinc-200 rounded-md h-12">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 text-zinc-500 hover:text-zinc-900"
            >-</button>
            <span className="flex-1 text-center text-sm font-medium">{quantity}</span>
            <button 
              onClick={() => setQuantity(Math.min(selectedVariant.stock_quantity, quantity + 1))}
              className="px-3 text-zinc-500 hover:text-zinc-900"
            >+</button>
          </div>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="flex-1 h-12 bg-zinc-900 text-white font-medium rounded-md hover:bg-zinc-800 transition-colors disabled:bg-zinc-300 disabled:cursor-not-allowed"
        >
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>

      {/* Trust Indicators */}
      <div className="flex items-center gap-4 mt-4 py-4 border-t border-zinc-100 text-sm text-zinc-500">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
          Secure Checkout
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path></svg>
          Pan India Delivery
        </div>
      </div>
    </div>
  );
                  }
