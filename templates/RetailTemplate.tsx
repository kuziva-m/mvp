<<<<<<< HEAD
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
                {/* Use actual images here later */}
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

      {/* Newsletter */}
      <div className="bg-neutral-50 py-24 text-center px-6">
        <div className="max-w-xl mx-auto">
          <h3 className="font-serif text-3xl mb-4">Join the Club</h3>
          <p className="text-neutral-500 mb-8">
            Sign up for exclusive offers, original stories, events and more.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              placeholder="Enter your email address"
              className="flex-1 p-4 border border-neutral-300 bg-white focus:outline-none focus:border-neutral-900"
            />
            <button className="bg-neutral-900 text-white px-8 py-4 font-bold uppercase tracking-widest text-xs hover:bg-black">
              Subscribe
            </button>
          </div>
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
=======
import { ShoppingBag, Clock, MapPin } from 'lucide-react'

interface TemplateProps {
  businessName: string
  industry: string
  heroHeadline: string
  heroSubheadline: string
  services: Array<{ title: string; description: string }>
  about: string
  cta: string
  colors?: { primary: string; secondary: string; text: string }
  logoUrl?: string
}

const RetailTemplate = ({
  businessName,
  heroHeadline,
  heroSubheadline,
  services,
  about,
  cta,
  colors = { primary: '#9333ea', secondary: '#7e22ce', text: '#1f2937' },
  logoUrl,
}: TemplateProps) => {
  return (
    <div className="min-h-screen bg-white" style={{ color: colors.text }}>
      <header className="py-6 px-4 shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          {logoUrl ? <img src={logoUrl} alt={businessName} className="h-12" /> : <h1 className="text-2xl font-bold">{businessName}</h1>}
          <button className="px-6 py-2 rounded-lg text-white font-semibold" style={{ backgroundColor: colors.primary }}>{cta}</button>
        </div>
      </header>

      <section className="py-20 px-4" style={{ backgroundColor: `${colors.primary}10` }}>
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">{heroHeadline}</h2>
          <p className="text-xl mb-8">{heroSubheadline}</p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Featured Products</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((product, i) => (
              <div key={i} className="border rounded-lg overflow-hidden hover:shadow-lg transition">
                <div className="bg-gray-200 h-64 flex items-center justify-center">
                  <ShoppingBag className="w-16 h-16 text-gray-400" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{product.title}</h3>
                  <p className="text-gray-600">{product.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">About {businessName}</h2>
          <p className="text-lg text-gray-700">{about}</p>
        </div>
      </section>

      <section className="py-16 px-4" style={{ backgroundColor: colors.primary }}>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 text-white">
          <div className="text-center">
            <Clock className="w-10 h-10 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Store Hours</h3>
            <p>Mon-Sat: 9am-8pm</p>
          </div>
          <div className="text-center">
            <MapPin className="w-10 h-10 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Location</h3>
            <p>123 Shopping Plaza</p>
          </div>
        </div>
      </section>

      <footer className="py-8 px-4 bg-gray-900 text-white text-center">
        <p>&copy; {new Date().getFullYear()} {businessName}</p>
      </footer>
    </div>
  )
}

export default RetailTemplate
>>>>>>> 63f6fc6e827b9dbfae1a45b27731fa4333fa51d7
