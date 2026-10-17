import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tag, Copy, Check, Percent, Sparkles, Clock, ArrowRight } from 'lucide-react';
import { COUPONS, RESTAURANTS } from '../data/mockData';
import { useToast } from '../context/ToastContext';
import { useCart } from '../context/CartContext';
import { RestaurantCard } from '../components/restaurant/RestaurantCard';

export const OffersPage: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { showToast } = useToast();
  const { applyCoupon } = useCart();

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    applyCoupon(code);
    showToast(`Code "${code}" copied & applied to your cart!`, 'success');
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const offerRestaurants = RESTAURANTS.filter((r) => r.hasOffers);

  return (
    <div className="min-h-screen bg-[#07090e] text-white py-8 sm:py-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-bold mb-3">
            <Percent className="w-3.5 h-3.5" />
            <span>SAVINGS & DEALS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-heading mb-3">
            Exclusive FoodGo Vouchers
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Enjoy handpicked discounts on your favorite restaurants. Tap any voucher to automatically apply it to your cart.
          </p>
        </div>

        {/* Coupons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {COUPONS.map((coupon) => {
            const isCopied = copiedCode === coupon.code;
            return (
              <div
                key={coupon.code}
                className="relative bg-slate-900/90 border border-slate-800 hover:border-orange-500/50 rounded-3xl p-6 shadow-xl flex flex-col justify-between group transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-orange-400 font-heading">
                      {coupon.discountPercent}% OFF
                    </span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded-lg">
                      Min ${coupon.minOrder}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 font-medium mb-4">
                    {coupon.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
                  <div className="px-3 py-1.5 rounded-xl bg-slate-800 border border-dashed border-slate-700 font-mono font-bold text-xs text-white">
                    {coupon.code}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(coupon.code)}
                    className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-all flex items-center gap-1 shadow-md shadow-orange-500/20"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Applied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Apply</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Restaurants with Live Special Offers */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">
                Restaurants With Live Discounts
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Extra deals directly applied by partner kitchens
              </p>
            </div>
            <Link
              to="/restaurants"
              className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1"
            >
              See All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {offerRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
