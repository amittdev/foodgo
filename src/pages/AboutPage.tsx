import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, ShieldCheck, Clock, Award, Users, Heart, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#07090e] text-white py-12 pb-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-bold">
            <Flame className="w-3.5 h-3.5" />
            <span>OUR MISSION</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-heading text-white tracking-tight">
            Connecting You With The Taste You Love
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Founded with a passion for culinary excellence, FoodGo redefines food delivery through precision thermal transit, chef-first partnerships, and real-time order tracking.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold font-heading text-white">How FoodGo Started</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We started FoodGo with a straightforward question: why should restaurant-quality food lose its crunch, heat, and soul when delivered to someone’s home?
            </p>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              We engineered a dedicated platform that prioritizes meal integrity. By partnering exclusively with certified hygienic kitchens and deploying smart route optimization, our couriers arrive within 30 minutes with meals at optimal serving temperature.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden border border-slate-700/80 shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"
              alt="Restaurant kitchen craftsmanship"
              className="w-full h-72 object-cover"
            />
          </div>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold font-heading text-white">30-Minute Dispatch</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Live batch routing algorithms ensure couriers arrive when the pan leaves the fire.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold font-heading text-white">Hygiene Certified</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every partner kitchen undergoes strict audits for sanitation, packaging seals, and temperature safety.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold font-heading text-white">Curated Selection</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We don’t list thousands of mediocre diners. Only top-rated, authentic eateries make our cut.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8">
          <Link
            to="/restaurants"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-orange-500/25 transition-all"
          >
            <span>Explore Restaurants Today</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
