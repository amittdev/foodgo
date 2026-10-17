import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Flame,
  Star,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Percent,
  Copy,
  Check,
} from 'lucide-react';
import { Hero } from '../components/home/Hero';
import { CategorySlider } from '../components/home/CategorySlider';
import { RestaurantCard } from '../components/restaurant/RestaurantCard';
import { RESTAURANTS, COUPONS } from '../data/mockData';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';

export const HomePage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'rating' | 'fast' | 'veg'>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { showToast } = useToast();
  const { applyCoupon } = useCart();

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    applyCoupon(code);
    showToast(`Code ${code} copied & applied!`, 'success');
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const filteredRestaurants = RESTAURANTS.filter((r) => {
    if (activeFilter === 'rating') return r.rating >= 4.8;
    if (activeFilter === 'fast') return r.deliveryTimeMin <= 20;
    if (activeFilter === 'veg') return r.isVegOnly;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#07090e] text-white">
      {/* 1. Hero Section - Inspired by the reference image */}
      <Hero />

      {/* 2. Food Categories Slider */}
      <CategorySlider />

      {/* 3. Promotional Offers Voucher Bar */}
      <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-orange-950/40 via-amber-950/30 to-slate-900 border border-orange-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold mb-2">
                <Percent className="w-3.5 h-3.5" />
                <span>LIMITED TIME OFFERS</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
                Hungry? Claim Up To 50% OFF Right Now
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Apply active coupons at checkout or click below to apply automatically.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {COUPONS.slice(0, 2).map((coupon) => (
                <div
                  key={coupon.code}
                  className="flex-1 md:flex-initial flex items-center justify-between gap-3 bg-slate-900/90 border border-orange-500/40 px-4 py-2.5 rounded-2xl shadow-md"
                >
                  <div>
                    <span className="text-xs font-extrabold text-orange-400 tracking-wider">
                      {coupon.code}
                    </span>
                    <p className="text-[10px] text-slate-400 truncate">{coupon.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyCoupon(coupon.code)}
                    className="p-2 rounded-xl bg-orange-500/20 hover:bg-orange-500 text-orange-400 hover:text-white transition-all text-xs font-bold shrink-0"
                    title="Apply coupon"
                  >
                    {copiedCode === coupon.code ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              ))}
              <Link
                to="/offers"
                className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1 ml-1"
              >
                All Offers <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Popular Restaurants Section */}
      <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-widest mb-1.5">
              <Flame className="w-3.5 h-3.5" />
              <span>City Favorites</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">
              Popular Restaurants Near You
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeFilter === 'all'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              All Kitchens
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('rating')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeFilter === 'rating'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Star className="w-3.5 h-3.5 fill-current" />
              4.8+ Rating
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('fast')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeFilter === 'fast'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Fastest (≤20m)
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('veg')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeFilter === 'veg'
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              Pure Veg 🌱
            </button>
          </div>
        </div>

        {/* Restaurant Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} />
          ))}
        </div>

        {/* Explore More CTA */}
        <div className="mt-12 text-center">
          <Link
            to="/restaurants"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-orange-500/60 text-white font-bold text-sm transition-all shadow-xl hover:shadow-orange-500/10"
          >
            <span>Explore All 50+ Restaurants</span>
            <ArrowRight className="w-4 h-4 text-orange-400" />
          </Link>
        </div>
      </section>

      {/* 5. FoodGo App Experience & Feature Banner */}
      <section className="py-16 bg-[#090d16] border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>WHY FOODGO DELIVERS BETTER</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white font-heading leading-tight">
                Crafted For Food Lovers Who Value Quality & Speed
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                We believe great food shouldn't get soggy on the road. FoodGo connects you with verified culinary artisans with smart batch dispatching and thermally insulated transit.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-2xl font-black text-orange-400 font-heading">30m</span>
                  <p className="text-xs font-bold text-white mt-1">Average Delivery Time</p>
                  <p className="text-[11px] text-slate-400">Piping hot at your doorstep</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-2xl font-black text-amber-400 font-heading">99.8%</span>
                  <p className="text-xs font-bold text-white mt-1">On-Time Reliability</p>
                  <p className="text-[11px] text-slate-400">Live GPS tracking every meter</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-2xl font-black text-emerald-400 font-heading">500+</span>
                  <p className="text-xs font-bold text-white mt-1">Gourmet Menus</p>
                  <p className="text-[11px] text-slate-400">Strict hygiene verification</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <span className="text-2xl font-black text-rose-400 font-heading">24/7</span>
                  <p className="text-xs font-bold text-white mt-1">Live Concierge</p>
                  <p className="text-[11px] text-slate-400">Dedicated support on orders</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative">
                <img
                  src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1000&q=80"
                  alt="Delicious food feast spread"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-6 rounded-2xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center shrink-0">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Join 150,000+ Satisfied Foodies</p>
                      <p className="text-[11px] text-slate-400">Experience the difference with every single bite.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
