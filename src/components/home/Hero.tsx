import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, ArrowRight, Utensils, Clock, ShieldCheck, Flame, Star, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Hero: React.FC = () => {
  const { currentLocation, setCurrentLocation } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationInput, setLocationInput] = useState(currentLocation);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (locationInput !== currentLocation) {
      setCurrentLocation(locationInput);
    }
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/restaurants');
    }
  };

  const quickPicks = ['Smash Burgers', 'Artisan Pizza', 'Royal Biryani', 'Butter Chicken', 'Tiramisu'];

  return (
    <section className="relative bg-[#07090e] text-white overflow-hidden pt-8 pb-20 lg:pt-14 lg:pb-28">
      {/* Background Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Content Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 text-orange-400 text-xs font-semibold shadow-inner">
              <Flame className="w-3.5 h-3.5 animate-pulse text-orange-500" />
              <span>Good Food. Delivered Fast.</span>
              <span className="hidden sm:inline text-slate-500">•</span>
              <span className="hidden sm:inline text-slate-300">Over 500+ Top Kitchens</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] font-heading">
              Delicious Food, <br className="hidden sm:block" />
              <span className="text-white">Delivered To </span>
              <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500 bg-clip-text text-transparent">
                Your Door
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Discover the best restaurants and enjoy your favorite meals anytime. Handcrafted recipes, hot dispatch, and live GPS tracking.
            </p>

            {/* Location & Search Capsule - Inspired by Reference */}
            <form
              onSubmit={handleSearch}
              className="mt-4 p-2 bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl sm:rounded-full shadow-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-2xl mx-auto lg:mx-0"
            >
              {/* Location Input */}
              <div className="flex-1 flex items-center gap-2 px-4 py-2 sm:py-0 border-b sm:border-b-0 sm:border-r border-slate-800">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0" />
                <input
                  type="text"
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  placeholder="Enter your location..."
                  className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none"
                  aria-label="Delivery location input"
                />
              </div>

              {/* Food / Restaurant Search Input */}
              <div className="flex-1 flex items-center gap-2 px-4 py-2 sm:py-0">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cravings or restaurant..."
                  className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none"
                  aria-label="Food or restaurant search"
                />
              </div>

              {/* Search Food CTA Button */}
              <button
                type="submit"
                className="px-6 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs sm:text-sm rounded-xl sm:rounded-full transition-all shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 shrink-0 active:scale-95"
              >
                <span>Search Food</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Pick Pills */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1 text-xs">
              <span className="text-slate-400 font-medium">Trending cravings:</span>
              {quickPicks.map((pick) => (
                <button
                  key={pick}
                  type="button"
                  onClick={() => navigate(`/search?q=${encodeURIComponent(pick)}`)}
                  className="px-3 py-1 rounded-full bg-slate-900/60 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-orange-400 transition-colors"
                >
                  {pick}
                </button>
              ))}
            </div>
          </div>

          {/* Right Hero Food Imagery - Large Gourmet Food Visual */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Subtle glow disk behind burger */}
            <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-tr from-orange-500/20 to-amber-500/10 blur-3xl" />

            {/* Main Food Showcase Image */}
            <div className="relative group w-full max-w-md sm:max-w-lg lg:max-w-none">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800/80 bg-slate-900/40">
                <img
                  src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=1000&q=85"
                  alt="Delicious artisan gourmet cheeseburger with sesame seeds and fresh lettuce"
                  className="w-full h-[340px] sm:h-[420px] object-cover object-center transform group-hover:scale-105 transition-transform duration-700"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-transparent to-transparent opacity-60" />
              </div>

              {/* Floating Badge 1: Top Rated */}
              <div className="absolute -top-4 -left-4 sm:top-6 sm:-left-6 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-left duration-500">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Star className="w-5 h-5 fill-amber-400" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-white font-bold text-sm">4.9 / 5.0</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <p className="text-[10px] text-slate-400">12k+ Happy Reviews</p>
                </div>
              </div>

              {/* Floating Badge 2: Express Delivery */}
              <div className="absolute -bottom-4 -right-4 sm:bottom-6 sm:-right-6 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-right duration-500">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-white font-bold text-sm">⚡ 25 Mins Avg</span>
                  <p className="text-[10px] text-slate-400">Guaranteed Fresh & Hot</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Stepped Service Cards Overlapping Bottom Edge (From Reference Image) */}
        <div className="mt-16 sm:mt-20 pt-8 border-t border-slate-800/80">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Step 1 */}
            <div className="relative group bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-orange-500/40 p-6 rounded-2xl shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-full">
                    STEP 1
                  </span>
                </div>
                <span className="text-4xl font-black text-slate-800 group-hover:text-orange-500/20 transition-colors font-heading">
                  01
                </span>
              </div>
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base mb-1 font-heading">Choose Location</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Enter your delivery address or choose your current location to explore restaurants near you.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-orange-500/40 p-6 rounded-2xl shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
                    STEP 2
                  </span>
                </div>
                <span className="text-4xl font-black text-slate-800 group-hover:text-amber-500/20 transition-colors font-heading">
                  02
                </span>
              </div>
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 shrink-0">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base mb-1 font-heading">Find Your Favorite Food</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Discover local culinary gems, explore chef-curated menus, and customize your orders easily.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group bg-slate-900/80 hover:bg-slate-800/80 border border-slate-800 hover:border-orange-500/40 p-6 rounded-2xl shadow-xl transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                    STEP 3
                  </span>
                </div>
                <span className="text-4xl font-black text-slate-800 group-hover:text-emerald-500/20 transition-colors font-heading">
                  03
                </span>
              </div>
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-base mb-1 font-heading">Fast Delivery</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Get your piping hot food delivered directly to your doorstep in 30 minutes with live GPS tracking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
