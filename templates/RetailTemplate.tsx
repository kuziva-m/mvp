import React from "react";
import { ShoppingBag, Star, Menu } from "lucide-react";
import { TemplateProps } from "./RestaurantTemplate";

export default function RetailTemplate({ content, leadInfo }: TemplateProps) {
  return (
    <div className="min-h-screen bg-white font-sans text-neutral-900">
      {/* Promo Banner */}
      <div className="bg-neutral-900 text-white text-xs font-bold text-center py-3 tracking-widest uppercase">
        Free Shipping on all orders over $100
      </div>

      {/* Header */}
      <nav className="sticky top-0 bg-white/80 backdrop-blur-md z-40 border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <Menu className="md:hidden cursor-pointer" />
          <div className="text-2xl font-serif font-bold italic tracking-tight">
            {leadInfo?.business_name || "Boutique"}
          </div>
          <div className="flex gap-6 items-center">
            <span className="hidden md:block text-sm font-medium cursor-pointer hover:text-neutral-600">
              Shop
            </span>
            <span className="hidden md:block text-sm font-medium cursor-pointer hover:text-neutral-600">
              New Arrivals
            </span>
            <ShoppingBag className="cursor-pointer hover:text-neutral-600" />
          </div>
        </div>
      </nav>

      {/* Hero Split */}
      <div className="grid md:grid-cols-2 h-[80vh]">
        <div className="bg-neutral-100 flex items-center justify-center p-12 order-2 md:order-1">
          <div className="max-w-md text-center md:text-left">
            <span className="text-neutral-500 text-sm uppercase tracking-widest font-bold mb-4 block">
              Summer Collection 2025
            </span>
            <h1 className="text-5xl md:text-7xl font-serif mb-8 leading-tight text-neutral-900">
              {content.hero?.headline || "Style Redefined."}
            </h1>
            <p className="text-lg text-neutral-600 mb-10 leading-relaxed">
              {content.hero?.subheadline ||
                "Discover the new season essentials designed for the modern lifestyle."}
            </p>
            <button className="bg-neutral-900 text-white px-10 py-4 text-sm font-bold tracking-widest uppercase hover:bg-neutral-800 transition">
              Shop Collection
            </button>
          </div>
        </div>
        <div className="order-1 md:order-2 bg-[url('https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center h-full min-h-[400px]"></div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-center font-serif text-4xl mb-16">Trending Now</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="group cursor-pointer">
              <div className="aspect-[3/4] bg-neutral-100 mb-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-neutral-200 group-hover:scale-105 transition duration-500"></div>
                <div className="absolute top-4 left-4 bg-white px-2 py-1 text-xs font-bold uppercase tracking-wide">
                  New
                </div>
              </div>
              <h3 className="text-base font-medium mb-1">Essential Item {i}</h3>
              <p className="text-neutral-500 mb-2">$129.00</p>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={12}
                    className="text-neutral-300 fill-neutral-300"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white py-8 text-center border-t border-neutral-100">
        <p className="text-xs text-neutral-400">
          Designed & Powered by MVP Agency
        </p>
      </div>
    </div>
  );
}
