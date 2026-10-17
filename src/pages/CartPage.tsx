import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Tag,
  CheckCircle2,
  Sparkles,
  Receipt,
  FileText,
  AlertCircle,
  Truck,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { COUPONS } from '../data/mockData';
import { formatCurrency } from '../utils/orderLogic';

export const CartPage: React.FC = () => {
  const {
    items,
    restaurantName,
    restaurantId,
    totalCount,
    bill,
    appliedCoupon,
    specialInstructions,
    setSpecialInstructions,
    updateQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCodeInput, setCouponCodeInput] = useState('');
  const navigate = useNavigate();

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCodeInput.trim()) return;
    const ok = applyCoupon(couponCodeInput.trim());
    if (ok) setCouponCodeInput('');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-[#07090e] text-white px-4">
        <div className="max-w-md w-full text-center py-16 px-6 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-2xl">
          <div className="w-20 h-20 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto mb-5 text-orange-400">
            <ShoppingBag className="w-9 h-9" />
          </div>
          <h2 className="text-2xl font-bold font-heading mb-2">Your Cart is Empty</h2>
          <p className="text-xs sm:text-sm text-slate-400 mb-8 max-w-xs mx-auto">
            Looks like you haven't added anything to your cart yet. Explore the best restaurants around you!
          </p>
          <Link
            to="/restaurants"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-orange-500/20 transition-all"
          >
            <span>Explore Restaurants</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-white py-8 sm:py-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800">
          <div>
            <Link
              to={restaurantId ? `/restaurant/${restaurantId}` : '/restaurants'}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Menu</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black font-heading text-white">
              Your Food Cart
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Ordering from <span className="text-orange-400 font-bold">{restaurantName}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={clearCart}
            className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition-colors p-2 rounded-lg hover:bg-rose-500/10"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Empty Cart</span>
          </button>
        </div>

        {/* Free Delivery Incentive Bar */}
        {bill.amountNeededForFreeDelivery > 0 ? (
          <div className="mb-6 p-4 rounded-2xl bg-slate-900 border border-amber-500/30 flex items-center gap-3">
            <Truck className="w-5 h-5 text-amber-400 shrink-0" />
            <div className="flex-1 text-xs">
              <span className="text-slate-300">
                Add <strong className="text-amber-400">{formatCurrency(bill.amountNeededForFreeDelivery)}</strong> more of items to unlock{' '}
                <strong className="text-white">FREE Delivery</strong>!
              </span>
              <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(100, (bill.subtotal / bill.freeDeliveryThreshold) * 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <p className="text-xs text-emerald-300 font-semibold">
              🎉 Congratulations! You have unlocked <span className="underline">FREE Delivery</span> on this order!
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Items List & Instructions */}
          <div className="lg:col-span-7 space-y-6">
            {/* Cart Items Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl divide-y divide-slate-800">
              {items.map(({ item, quantity }) => (
                <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5 flex-1 min-w-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-800"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3.5 h-3.5 border flex items-center justify-center rounded-[2px] shrink-0 ${
                            item.isVeg ? 'border-emerald-500' : 'border-rose-500'
                          }`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${
                              item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'
                            }`}
                          />
                        </div>
                        <h4 className="text-sm font-bold text-white truncate font-heading">
                          {item.name}
                        </h4>
                      </div>
                      <p className="text-xs font-bold text-orange-400 mt-1">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                  </div>

                  {/* Quantity Stepper & Subtotal */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl p-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
                        aria-label={`Decrease ${item.name} quantity`}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-white">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg transition-colors"
                        aria-label={`Increase ${item.name} quantity`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-sm font-extrabold text-white w-16 text-right">
                      {formatCurrency(item.price * quantity)}
                    </span>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-slate-500 hover:text-rose-400 p-1.5 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Special Instructions Note Input */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                <FileText className="w-4 h-4 text-orange-400" />
                <span>Cooking or Delivery Instructions (Optional)</span>
              </label>
              <textarea
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
                placeholder="e.g. Please leave extra napkins, pack cutlery, mild spicy only..."
                rows={2}
                className="w-full bg-slate-800/80 border border-slate-700/80 rounded-xl p-3 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 resize-none"
              />
            </div>
          </div>

          {/* Right Column: Coupon & Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            {/* Coupon Section */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-orange-400" />
                <span>Promo Code & Coupons</span>
              </h3>

              {appliedCoupon ? (
                <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-extrabold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{appliedCoupon.code} APPLIED</span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-0.5">
                      Saved {formatCurrency(bill.discount)} on your bill!
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="text-xs font-bold text-rose-400 hover:text-rose-300 underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                    placeholder="Enter FOODIE50 or TASTY20"
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-orange-500 uppercase font-semibold"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-all shrink-0"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Quick Available Coupon Suggestions */}
              {!appliedCoupon && (
                <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                    Available vouchers:
                  </span>
                  {COUPONS.slice(0, 2).map((c) => (
                    <div
                      key={c.code}
                      onClick={() => applyCoupon(c.code)}
                      className="cursor-pointer p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 flex items-center justify-between transition-colors"
                    >
                      <div>
                        <span className="text-xs font-bold text-orange-400">{c.code}</span>
                        <p className="text-[10px] text-slate-400">{c.description}</p>
                      </div>
                      <span className="text-[11px] font-bold text-orange-400">APPLY</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bill Summary */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-3.5">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-2">
                <Receipt className="w-4 h-4 text-orange-400" />
                <span>Bill Details</span>
              </h3>

              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex justify-between">
                  <span>Item Subtotal ({totalCount} items)</span>
                  <span className="font-semibold text-white">{formatCurrency(bill.subtotal)}</span>
                </div>

                {bill.discount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-semibold">
                    <span>Coupon Discount</span>
                    <span>-{formatCurrency(bill.discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <div className="flex items-center gap-1">
                    <span>Delivery Fee</span>
                    {bill.deliveryFee === 0 && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-bold">
                        FREE
                      </span>
                    )}
                  </div>
                  <span className="font-semibold text-white">
                    {bill.deliveryFee === 0 ? 'FREE' : formatCurrency(bill.deliveryFee)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Platform Fee</span>
                  <span className="font-semibold text-white">{formatCurrency(bill.platformFee)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Government Taxes & Packaging (8%)</span>
                  <span className="font-semibold text-white">{formatCurrency(bill.taxes)}</span>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-base">
                  <span className="font-extrabold text-white">To Pay</span>
                  <span className="text-xl font-black text-orange-400">
                    {formatCurrency(bill.grandTotal)}
                  </span>
                </div>
              </div>

              {/* Proceed to Checkout CTA */}
              <button
                type="button"
                onClick={() => navigate('/checkout')}
                className="w-full mt-4 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-sm rounded-2xl shadow-xl shadow-orange-500/25 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
