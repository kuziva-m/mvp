<<<<<<< HEAD
import React from "react";
// Added 'Clock' to imports below
import {
  CheckCircle2,
  Phone,
  Calendar,
  Shield,
  ArrowRight,
  Clock,
} from "lucide-react";
import { TemplateProps } from "./RestaurantTemplate";

export default function ServiceBusinessTemplate({
  content,
  leadInfo,
}: TemplateProps) {
  const { business_name, phone, email } = leadInfo || {};

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      {/* Top Bar */}
      <div className="bg-blue-900 text-blue-50 py-3 px-6 text-sm flex justify-center md:justify-end gap-6">
        <span className="flex items-center gap-2">
          <Phone size={14} /> {phone || "Call for Quote"}
        </span>
        <span className="hidden md:flex items-center gap-2">
          <Clock size={14} /> 24/7 Emergency Service
        </span>
      </div>

      {/* Hero */}
      <header className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-32 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-block bg-blue-100 text-blue-800 px-4 py-1 rounded-full text-sm font-bold mb-6">
              #1 Rated Service Provider
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-[1.1]">
              {content.hero?.headline || "Professional Services You Can Trust"}
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
              {content.hero?.subheadline ||
                "Licensed, insured, and ready to solve your problems today. 100% satisfaction guaranteed."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-900/10">
                <Calendar size={18} /> Book Now
              </button>
              <button className="flex items-center justify-center gap-2 px-8 py-4 bg-white border border-slate-300 text-slate-700 rounded-lg font-bold hover:bg-slate-50 transition">
                Our Services
              </button>
            </div>
          </div>
          {/* Lead Form */}
          <div className="bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
            <h3 className="font-bold text-2xl mb-2">Get a Free Quote</h3>
            <p className="text-slate-500 mb-6">
              Fill out the form and we'll call you back.
            </p>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full p-3 bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-500"
              />
              <button className="w-full py-4 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition">
                Request Call Back
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Features */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              Why Choose {business_name}?
            </h2>
            <p className="text-slate-600 text-lg">
              We bring years of experience and a commitment to quality to every
              job site.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition group"
              >
                <div className="w-14 h-14 bg-blue-600 rounded-xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition">
                  <Shield size={28} />
                </div>
                <h3 className="font-bold text-xl mb-3">Service Feature {i}</h3>
                <p className="text-slate-500 mb-4">
                  Detailed explanation of this service feature and why it
                  benefits the customer.
                </p>
                <a
                  href="#"
                  className="text-blue-600 font-bold flex items-center gap-2 text-sm hover:gap-3 transition-all"
                >
                  Learn More <ArrowRight size={16} />
                </a>
              </div>
            ))}
=======
import { Wrench, Clock, Shield } from 'lucide-react'

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

const ServiceBusinessTemplate = ({
  businessName,
  heroHeadline,
  heroSubheadline,
  services,
  about,
  cta,
  colors = { primary: '#2563eb', secondary: '#1e40af', text: '#1f2937' },
  logoUrl,
}: TemplateProps) => {
  return (
    <div className="min-h-screen bg-white" style={{ color: colors.text }}>
      <header className="py-6 px-4 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {logoUrl ? (
            <img src={logoUrl} alt={businessName} className="h-12" />
          ) : (
            <h1 className="text-2xl font-bold">{businessName}</h1>
          )}
          <button
            className="px-6 py-3 rounded-lg text-white font-semibold"
            style={{ backgroundColor: colors.primary }}
          >
            {cta}
          </button>
        </div>
      </header>

      <section
        className="py-20 px-4 text-white"
        style={{ backgroundColor: colors.primary }}
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold mb-6 leading-tight">
            {heroHeadline}
          </h2>
          <p className="text-xl mb-8 max-w-2xl">{heroSubheadline}</p>
          <button
            className="px-8 py-4 rounded-lg font-semibold text-lg"
            style={{ backgroundColor: colors.secondary }}
          >
            {cta}
          </button>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {services.map((service, i) => {
              const icons = [Wrench, Clock, Shield]
              const Icon = icons[i % icons.length]
              return (
                <div
                  key={i}
                  className="p-6 rounded-lg border-2 hover:shadow-lg transition-shadow"
                  style={{ borderColor: `${colors.primary}40` }}
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${colors.primary}20` }}
                  >
                    <Icon className="w-7 h-7" style={{ color: colors.primary }} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              )
            })}
>>>>>>> 63f6fc6e827b9dbfae1a45b27731fa4333fa51d7
          </div>
        </div>
      </section>

<<<<<<< HEAD
      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold mb-2">{business_name}</h2>
            <p className="text-slate-400">
              Your trusted local service provider.
            </p>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-2 bg-blue-600 rounded-lg font-bold hover:bg-blue-700">
              Call Now
            </button>
            <button className="px-6 py-2 bg-slate-800 rounded-lg font-bold hover:bg-slate-700">
              Email Us
            </button>
          </div>
        </div>
        <div className="mt-12 text-center border-t border-slate-800 pt-8 text-slate-500 text-sm">
          <p>Powered by MVP Agency Platform</p>
        </div>
      </footer>
    </div>
  );
}
=======
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">About Us</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">{about}</p>
            <button
              className="px-6 py-3 rounded-lg text-white font-semibold"
              style={{ backgroundColor: colors.primary }}
            >
              Learn More
            </button>
          </div>
          <div
            className="h-96 rounded-lg"
            style={{ backgroundColor: `${colors.primary}20` }}
          >
            {/* Image placeholder */}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">Contact Us</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: colors.primary }}
              >
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Hours</h3>
              <p className="text-gray-600">Mon-Fri: 8am-6pm</p>
              <p className="text-gray-600">Sat: 9am-4pm</p>
            </div>
            <div>
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: colors.primary }}
              >
                <Wrench className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Phone</h3>
              <p className="text-gray-600">(555) 123-4567</p>
            </div>
            <div>
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: colors.primary }}
              >
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Email</h3>
              <p className="text-gray-600">info@example.com</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-8 px-4 bg-gray-900 text-white text-center">
        <p>&copy; {new Date().getFullYear()} {businessName}. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default ServiceBusinessTemplate
>>>>>>> 63f6fc6e827b9dbfae1a45b27731fa4333fa51d7
