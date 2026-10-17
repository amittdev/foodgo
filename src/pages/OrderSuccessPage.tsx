import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Clock, MapPin, ArrowRight, Home, Receipt, ShieldCheck, Flame } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/orderLogic';

export const OrderSuccessPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getOrder } = useAuth();
  const order = getOrder(id || '') || null;

  return (
    <div className="min-h-screen bg-[#07090e] text-white py-12 px-4 flex items-center justify-center">
      <div className="max-w-xl w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Success Icon Animation */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-emerald-500/10">
            <CheckCircle2 className="w-10 h-10 animate-bounce" />
          </div>
          <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full">
            Payment Successful
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-heading text-white mt-2">
            Order Confirmed!
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Sit back and relax. Your hot meal is already being prepared with care.
          </p>
        </div>

        {/* Order Details Card */}
        {order ? (
          <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 mb-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700/60 text-xs">
              <div>
                <span className="text-slate-400">Order ID:</span>
                <span className="ml-1.5 font-mono font-bold text-orange-400">{order.id}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Clock className="w-3.5 h-3.5 text-orange-400" />
                <span>Est. Delivery: ~25-30 Mins</span>
              </div>
            </div>

            <div>
              <p className="text-xs text-slate-400">Restaurant:</p>
              <h4 className="text-sm font-bold text-white font-heading">{order.restaurantName}</h4>
            </div>

            {/* Items summary */}
            <div className="space-y-1.5 pt-1">
              <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                Ordered Items:
              </p>
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs text-slate-200">
                  <span>
                    {item.quantity}x {item.name}
                  </span>
                  <span className="font-semibold">{formatCurrency(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            {/* Address */}
            <div className="pt-2 border-t border-slate-700/60 flex items-start gap-2 text-xs text-slate-300">
              <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
              <span>
                {order.deliveryAddress.street}, {order.deliveryAddress.city}
              </span>
            </div>

            {/* Total Paid */}
            <div className="pt-2 border-t border-slate-700/60 flex justify-between items-center text-sm">
              <span className="font-bold text-slate-300">Total Paid:</span>
              <span className="text-base font-extrabold text-white">
                {formatCurrency(order.total)}
              </span>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-slate-800 rounded-2xl mb-6 text-center text-xs text-slate-300">
            Order #{id} has been registered in the system.
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to={`/order-tracking/${id}`}
            className="flex-1 py-3.5 px-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2"
          >
            <span>Track Live Order</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/"
            className="py-3.5 px-6 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs sm:text-sm rounded-xl border border-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
