<<<<<<< HEAD
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
      {/* Navbar */}
      <nav className="fixed w-full bg-white/95 backdrop-blur-md z-50 border-b border-stone-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tighter text-orange-700">
            {business_name || "Restaurante"}
          </h1>
          <div className="hidden md:flex gap-6 text-sm font-medium font-sans">
            <a href="#menu" className="hover:text-orange-600 transition">
              Menu
            </a>
            <a href="#about" className="hover:text-orange-600 transition">
              Our Story
            </a>
            <a href="#contact" className="hover:text-orange-600 transition">
              Contact
            </a>
          </div>
          <button className="bg-orange-700 text-white px-6 py-2 rounded-full font-sans text-sm hover:bg-orange-800 transition shadow-lg shadow-orange-700/20">
            Book a Table
          </button>
        </div>
      </nav>

      {/* Hero */}
      <header className="relative pt-40 pb-24 md:pt-48 md:pb-32 px-6 bg-[url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="relative max-w-4xl mx-auto text-center space-y-8 text-white">
          <span className="font-sans tracking-[0.2em] uppercase text-sm md:text-base opacity-90">
            Fine Dining Experience
          </span>
          <h2 className="text-5xl md:text-7xl font-bold leading-tight">
            {content.hero?.headline || "Taste the Extraordinary"}
          </h2>
          <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto font-light">
            {content.hero?.subheadline ||
              "Culinary excellence tailored for the refined palate."}
          </p>
          <div className="pt-8 flex flex-col md:flex-row gap-4 justify-center font-sans">
            <button className="px-8 py-4 bg-orange-600 text-white rounded hover:bg-orange-700 transition font-medium">
              View Menu
            </button>
            <button className="px-8 py-4 border border-white text-white rounded hover:bg-white hover:text-black transition font-medium">
              Order Online
            </button>
          </div>
        </div>
      </header>

      {/* About Section */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h3 className="text-4xl font-bold text-stone-900">
              A Tradition of Flavor
            </h3>
            <div className="w-16 h-1 bg-orange-600"></div>
            <p className="text-stone-600 leading-relaxed text-lg font-sans">
              {content.about?.content ||
                "We believe in using only the freshest ingredients, sourced locally and prepared with passion. Our chefs are dedicated to bringing you an unforgettable dining experience."}
            </p>
            <ul className="space-y-3 font-sans text-stone-700 pt-4">
              <li className="flex gap-3 items-center">
                <Utensils size={18} className="text-orange-600" /> Fresh Local
                Ingredients
              </li>
              <li className="flex gap-3 items-center">
                <Utensils size={18} className="text-orange-600" /> Award Winning
                Chef
              </li>
              <li className="flex gap-3 items-center">
                <Utensils size={18} className="text-orange-600" /> Extensive
                Wine List
              </li>
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-stone-200 h-64 rounded-lg"></div>
            <div className="bg-stone-300 h-64 rounded-lg mt-8"></div>
          </div>
        </div>
      </section>

      {/* Menu Preview */}
      <section id="menu" className="py-24 bg-stone-100">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="font-sans text-orange-600 font-bold uppercase tracking-widest text-sm">
              Delicious Choices
            </span>
            <h3 className="text-4xl font-bold mt-3 mb-4">Our Favorites</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-8 font-sans">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition group"
              >
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-xl group-hover:text-orange-700 transition">
                    Signature Dish {i}
                  </h4>
                  <span className="text-orange-700 font-bold text-lg">$24</span>
                </div>
                <p className="text-stone-500 leading-relaxed">
                  A delightful combination of flavors that will leave you
                  wanting more.
                </p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12 font-sans">
            <button className="text-orange-700 font-bold border-b-2 border-orange-700 pb-1 hover:text-orange-800">
              View Full Menu
            </button>
=======
import { Utensils, Clock, MapPin, Phone } from 'lucide-react'

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

const RestaurantTemplate = ({
  businessName,
  heroHeadline,
  heroSubheadline,
  services,
  about,
  cta,
  colors = { primary: '#ea580c', secondary: '#c2410c', text: '#1f2937' },
  logoUrl,
}: TemplateProps) => {
  return (
    <div className="min-h-screen bg-white" style={{ color: colors.text }}>
      {/* Hero */}
      <section className="relative h-[600px] flex items-center justify-center text-white"
        style={{ backgroundColor: colors.primary }}>
        <div className="text-center z-10 px-4">
          {logoUrl ? (
            <img src={logoUrl} alt={businessName} className="h-20 mx-auto mb-6" />
          ) : (
            <h1 className="text-5xl font-bold mb-4">{businessName}</h1>
          )}
          <h2 className="text-4xl font-bold mb-4">{heroHeadline}</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">{heroSubheadline}</p>
          <button className="px-8 py-4 text-lg font-semibold rounded-lg"
            style={{ backgroundColor: colors.secondary }}>
            {cta}
          </button>
        </div>
      </section>

      {/* Menu Highlights */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">Menu Highlights</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((item, i) => (
              <div key={i} className="text-center">
                <div className="bg-gray-200 h-48 rounded-lg mb-4 flex items-center justify-center">
                  <Utensils className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Our Story</h2>
          <p className="text-lg text-gray-700 leading-relaxed">{about}</p>
        </div>
      </section>

      {/* Hours & Contact */}
      <section className="py-20 px-4" style={{ backgroundColor: colors.primary }}>
        <div className="max-w-6xl mx-auto text-white">
          <h2 className="text-4xl font-bold text-center mb-12">Visit Us</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <Clock className="w-10 h-10 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Hours</h3>
              <p>Mon-Fri: 11am-10pm</p>
              <p>Sat-Sun: 10am-11pm</p>
            </div>
            <div>
              <MapPin className="w-10 h-10 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Location</h3>
              <p>123 Food Street</p>
            </div>
            <div>
              <Phone className="w-10 h-10 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Phone</h3>
              <p>(555) 123-4567</p>
            </div>
>>>>>>> 63f6fc6e827b9dbfae1a45b27731fa4333fa51d7
          </div>
        </div>
      </section>

<<<<<<< HEAD
      {/* Footer */}
      <footer
        id="contact"
        className="bg-stone-900 text-stone-400 py-20 font-sans"
      >
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-3 gap-12 text-center md:text-left">
          <div>
            <h4 className="text-white text-xl font-bold mb-6">
              {business_name}
            </h4>
            <p className="opacity-80">
              Serving the community with love and great food since 2024.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-start space-y-4">
            <h4 className="text-white text-xl font-bold mb-2">Visit Us</h4>
            <div className="flex gap-3">
              <MapPin size={20} /> {address || "123 Food Street, City"}
            </div>
            <div className="flex gap-3">
              <Phone size={20} /> {phone || "(555) 123-4567"}
            </div>
            <div className="flex gap-3">
              <Clock size={20} /> Mon-Sun: 11am - 10pm
            </div>
          </div>
          <div className="flex flex-col justify-center items-center">
            <div className="bg-stone-800 p-6 rounded-lg w-full">
              <p className="text-sm text-stone-500 mb-3">
                System Generated Website
              </p>
              <button className="w-full bg-white text-black font-bold py-3 rounded hover:bg-stone-200 transition">
                Subscribe Now
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
=======
      <footer className="py-8 px-4 bg-gray-900 text-white text-center">
        <p>&copy; {new Date().getFullYear()} {businessName}</p>
      </footer>
    </div>
  )
}

export default RestaurantTemplate
>>>>>>> 63f6fc6e827b9dbfae1a45b27731fa4333fa51d7
