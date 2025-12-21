import React from "react";
import { ArrowRight, BarChart, Users, Globe, Building2 } from "lucide-react";
import { TemplateProps } from "./RestaurantTemplate";

export default function ProfessionalTemplate({
  content,
  leadInfo,
}: TemplateProps) {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2 text-indigo-900">
            <Building2 size={32} />
            <span className="text-xl font-bold tracking-tight">
              {leadInfo?.business_name || "Consulting Partners"}
            </span>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-semibold text-slate-600">
            <a href="#" className="hover:text-indigo-600 transition">
              Services
            </a>
            <a href="#" className="hover:text-indigo-600 transition">
              Case Studies
            </a>
            <a href="#" className="hover:text-indigo-600 transition">
              About
            </a>
          </nav>
          <button className="px-6 py-2.5 bg-indigo-900 text-white rounded text-sm font-semibold hover:bg-indigo-800 transition shadow-lg shadow-indigo-900/20">
            Client Portal
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-24 md:py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wide mb-8">
            <span className="w-2 h-2 rounded-full bg-indigo-600"></span> Now
            accepting new clients
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight tracking-tight text-slate-900">
            {content.hero?.headline ||
              "Strategic Solutions for Modern Business"}
          </h1>
          <p className="text-xl text-slate-500 mb-12 max-w-2xl mx-auto leading-relaxed">
            {content.hero?.subheadline ||
              "We provide the insights, leadership, and expertise to help your organization navigate complex challenges."}
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition shadow-xl shadow-indigo-600/20">
              Explore Services
            </button>
            <button className="px-8 py-4 bg-white border border-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-50 transition">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-slate-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Our Expertise
              </h2>
              <p className="text-slate-500">
                Comprehensive solutions for every stage of growth.
              </p>
            </div>
            <a
              href="#"
              className="hidden md:flex items-center gap-2 text-indigo-700 font-bold hover:gap-3 transition-all"
            >
              All Services <ArrowRight size={18} />
            </a>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card
              title="Global Strategy"
              icon={<Globe />}
              text="Expanding your reach across borders with confidence and data-backed strategies."
            />
            <Card
              title="Data Analytics"
              icon={<BarChart />}
              text="Turning raw data into actionable business intelligence to drive decision making."
            />
            <Card
              title="Team Leadership"
              icon={<Users />}
              text="Empowering your workforce to achieve maximum potential through training."
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16 px-6">
        <div className="max-w-7xl mx-auto text-center md:text-left flex flex-col md:flex-row justify-between items-center">
          <p>&copy; 2025 {leadInfo?.business_name}. All rights reserved.</p>
          <div className="mt-8 md:mt-0">
            <button className="text-xs bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded text-white transition border border-slate-700">
              Built by MVP Agency
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Card({ title, icon, text }: any) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition group">
      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-6 group-hover:bg-indigo-600 group-hover:text-white transition">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-slate-900">{title}</h3>
      <p className="text-slate-500 mb-6 leading-relaxed">{text}</p>
      <div className="text-indigo-600 font-semibold flex items-center gap-2 cursor-pointer text-sm">
        Learn more{" "}
        <ArrowRight
          size={16}
          className="group-hover:translate-x-1 transition"
        />
      </div>
    </div>
  );
}
