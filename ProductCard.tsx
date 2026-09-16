// src/components/storefront/ProductCard.tsx
import Image from 'next/image';
import Link from 'next/link';
import { formatINR } from '@/lib/utils';

interface ProductCardProps {
  product: {
    title: string;
    slug: string;
    price: number;
    compareAtPrice?: number;
    imageUrl: string;
    isNew?: boolean;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/product/${product.slug}`} className="group block w-full">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-100 rounded-md">
        {product.isNew && (
          <span className="absolute top-3 left-3 z-10 bg-white px-2 py-1 text-xs font-medium tracking-wider uppercase text-zinc-900">
            New
          </span>
        )}
        <Image
          src={product.imageUrl}
          alt={product.title}
          fill
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>
      <div className="mt-4 flex flex-col gap-1">
        <h3 className="text-sm font-medium text-zinc-900 truncate">{product.title}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-900">{formatINR(product.price)}</span>
          {product.compareAtPrice && (
            <span className="text-sm text-zinc-500 line-through">
              {formatINR(product.compareAtPrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
    }
