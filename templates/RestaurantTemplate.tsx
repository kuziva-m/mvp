import React from "react";
import { Utensils, Clock, MapPin, Phone } from "lucide-react";

export interface TemplateProps {
  content: any;
  leadInfo?: any;
}

export default function RestaurantTemplate({
  content,
  leadInfo,
}: TemplateProps) {
  const { business_name, phone, email, address } = leadInfo || {};

  return (
    <div className="min-h-screen bg-stone-50 font-serif text-stone-800">
      <nav className="fixed w-full bg-white/95 backdrop-blur-md z-50 border-b border-stone-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-orange-700">
            {business_name || "Restaurante"}
          </h1>
          <button className="bg-orange-700 text-white px-6 py-2 rounded-full text-sm">
            Book a Table
          </button>
        </div>
      </nav>
      <header className="pt-40 pb-24 px-6 text-center">
        <h2 className="text-5xl md:text-7xl font-bold leading-tight">
          {content.hero?.headline || "Taste the Extraordinary"}
        </h2>
        <p className="text-xl mt-6">
          {content.hero?.subheadline || "Culinary excellence."}
        </p>
      </header>
    </div>
  );
}
