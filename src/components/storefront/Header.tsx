// src/components/storefront/Header.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Menu, Search, User } from 'lucide-react';
import { useCartStore } from '@/lib/store/useCartStore';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Subtle sticky scroll behavior
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-white'}`}>
      {/* Announcement Bar */}
      <div className="bg-zinc-900 text-white text-xs font-medium text-center py-2 tracking-wide">
        Free shipping on orders above ₹999. Made with care in India.
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Mobile Menu & Search */}
          <div className="flex items-center gap-4 lg:hidden">
            <button aria-label="Menu" className="p-2 -ml-2 text-zinc-900">
              <Menu className="w-5 h-5" />
            </button>
            <button aria-label="Search" className="p-2 text-zinc-900">
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Desktop Links (Left) */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-zinc-600">
            <Link href="/shop" className="hover:text-zinc-900 transition-colors">Shop All</Link>
            <Link href="/category/new-arrivals" className="hover:text-zinc-900 transition-colors">New Arrivals</Link>
            <Link href="/about" className="hover:text-zinc-900 transition-colors">Our Story</Link>
          </nav>

          {/* Logo (Center) */}
          <Link href="/" className="text-2xl font-serif font-bold tracking-tight text-zinc-900 absolute left-1/2 -translate-x-1/2">
            BRAND.
          </Link>

          {/* Icons (Right) */}
          <div className="flex items-center gap-4 lg:gap-6">
            <button aria-label="Search" className="hidden lg:block p-2 text-zinc-900 hover:text-zinc-600 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <Link href="/account" aria-label="Account" className="p-2 text-zinc-900 hover:text-zinc-600 transition-colors hidden sm:block">
              <User className="w-5 h-5" />
            </Link>
            <Link href="/cart" aria-label="Cart" className="p-2 text-zinc-900 hover:text-zinc-600 transition-colors relative">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-zinc-900 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
          
        </div>
      </div>
    </header>
  );
}
