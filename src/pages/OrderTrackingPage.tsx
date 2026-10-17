import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  Phone,
  MessageSquare,
  MapPin,
  ArrowLeft,
  Bike,
  ChefHat,
  PackageCheck,
  Sparkles,
  Play,
  RotateCcw,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { OrderStatus } from '../types';

export const OrderTrackingPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getOrder, updateOrderStatus, orders } = useAuth();
  const { showToast } = useToast();

  const currentOrder = getOrder(id || '') || orders[0];

  const [activeStatus, setActiveStatus] = useState<OrderStatus>(
    currentOrder ? currentOrder.status : 'preparing'
  );

  const steps: { key: OrderStatus; label: string; desc: string; icon: any }[] = [
    {
      key: 'placed',
      label: 'Order Placed',
      desc: 'We received your order and notified the kitchen',
      icon: CheckCircle2,
    },
    {
      key: 'accepted',
      label: 'Restaurant Accepted',
      desc: 'The restaurant confirmed your order',
      icon: PackageCheck,
    },
    {
      key: 'preparing',
      label: 'Food Preparing',
      desc: 'Chef is handcrafting your gourmet dishes',
      icon: ChefHat,
    },
    {
      key: 'out_for_delivery',
      label: 'Out for Delivery',
      desc: 'Delivery partner Carlos is speeding toward you',
      icon: Bike,
    },
    {
      key: 'delivered',
      label: 'Delivered',
      desc: 'Order handed over. Enjoy your meal!',
      icon: Sparkles,
    },
  ];

  const statusOrder: OrderStatus[] = [
    'placed',
    'accepted',
    'preparing',
    'out_for_delivery',
    'delivered',
  ];

  const currentIndex = statusOrder.indexOf(activeStatus);

  const handleNextStep = () => {
    if (currentIndex < statusOrder.length - 1) {
      const next = statusOrder[currentIndex + 1];
      setActiveStatus(next);
      if (currentOrder) {
        updateOrderStatus(currentOrder.id, next);
      }
      showToast(`Status updated: ${next.replace('_', ' ').toUpperCase()}`, 'info');
    }
  };

  const handleResetStep = () => {
    setActiveStatus('placed');
    if (currentOrder) updateOrderStatus(currentOrder.id, 'placed');
    showToast('Simulation reset to Order Placed', 'info');
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white py-8 sm:py-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-800">
          <div>
            <Link
              to="/profile"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors mb-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Orders</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-black font-heading text-white">
              Live Order Tracking
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Order ID: <strong className="text-orange-400 font-mono">{currentOrder?.id || id}</strong> • {currentOrder?.restaurantName || 'Burger House'}
            </p>
          </div>

          {/* Simulation Helper Pill */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 p-2 rounded-2xl shadow-lg">
            <span className="text-[11px] font-bold text-slate-300 pl-2">Simulator:</span>
            <button
              type="button"
              onClick={handleNextStep}
              disabled={activeStatus === 'delivered'}
              className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Advance Step</span>
            </button>
            <button
              type="button"
              onClick={handleResetStep}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl text-xs transition-colors"
              title="Reset Simulator"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Visual Timeline */}
          <div className="lg:col-span-6 space-y-6">
            {/* Estimated Arrival Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-orange-950/60 via-slate-900 to-slate-900 border border-orange-500/30 shadow-2xl flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-orange-400 font-bold">
                  Estimated Delivery Time
                </span>
                <div className="flex items-center gap-2">
                  <Clock className="w-6 h-6 text-orange-400" />
                  <span className="text-3xl font-black text-white font-heading">
                    {activeStatus === 'delivered' ? 'DELIVERED' : '18-24 Mins'}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  {activeStatus === 'delivered'
                    ? 'Delivered right on schedule'
                    : 'On-time delivery guarantee with fresh insulated box'}
                </p>
              </div>
            </div>

            {/* Step-by-Step Progress Timeline */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6 font-heading">
                Delivery Milestones
              </h3>

              <div className="relative pl-6 space-y-8">
                {/* Vertical connecting line */}
                <div className="absolute left-2.5 top-2 bottom-6 w-0.5 bg-slate-800" />

                {steps.map((step, idx) => {
                  const isDone = idx <= currentIndex;
                  const isCurrent = idx === currentIndex;
                  const StepIcon = step.icon;

                  return (
                    <div key={step.key} className="relative flex items-start gap-4 group">
                      {/* Node Bullet */}
                      <div
                        className={`absolute -left-6 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                          isDone
                            ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/40 ring-4 ring-orange-500/20'
                            : 'bg-slate-800 text-slate-600 border border-slate-700'
                        } ${isCurrent ? 'animate-pulse' : ''}`}
                      >
                        <StepIcon className="w-3.5 h-3.5" />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4
                            className={`text-sm font-bold ${
                              isDone ? 'text-white' : 'text-slate-500'
                            }`}
                          >
                            {step.label}
                          </h4>
                          {isCurrent && (
                            <span className="text-[10px] uppercase font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full border border-orange-500/20 animate-pulse">
                              In Progress
                            </span>
                          )}
                          {isDone && !isCurrent && (
                            <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                              Completed
                            </span>
                          )}
                        </div>
                        <p
                          className={`text-xs mt-0.5 ${
                            isDone ? 'text-slate-400' : 'text-slate-600'
                          }`}
                        >
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery Partner Card */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3.5">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
                    alt="Delivery Courier Carlos"
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-orange-500/50 shadow-md"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm sm:text-base font-bold text-white font-heading">
                        Carlos Rivera
                      </h4>
                      <span className="text-[11px] bg-amber-500/20 text-amber-400 px-1.5 py-0.2 rounded font-bold">
                        ★ 4.95
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      FoodGo Top Courier • 1,280 deliveries
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Honda CB500X • Silver • Plate #FD-729
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="tel:+15557890123"
                    className="p-3 bg-slate-800 hover:bg-orange-500 text-slate-300 hover:text-white rounded-xl transition-all shadow-md"
                    title="Call Delivery Partner"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                  <button
                    type="button"
                    onClick={() => showToast('Opening direct messaging with Carlos...', 'info')}
                    className="p-3 bg-slate-800 hover:bg-orange-500 text-slate-300 hover:text-white rounded-xl transition-all shadow-md"
                    title="Message Delivery Partner"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Simulated GPS Map */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-heading">
                  Real-Time GPS Route
                </h3>
                <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  GPS Live Active
                </span>
              </div>

              {/* Graphic Map Simulation */}
              <div className="relative h-96 w-full rounded-2xl overflow-hidden bg-[#111624] border border-slate-800 flex items-center justify-center">
                {/* Stylized Grid Roads Pattern */}
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: `radial-gradient(circle, #f97316 1px, transparent 1px), linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)`,
                    backgroundSize: '40px 40px, 80px 80px, 80px 80px',
                  }}
                />

                {/* Curved SVG Transit Line */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <path
                    d="M 80 280 C 150 160, 240 220, 340 100"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="4"
                    strokeDasharray="8 6"
                    className="animate-pulse"
                  />
                </svg>

                {/* Restaurant Pin */}
                <div className="absolute left-16 bottom-24 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-xl ring-4 ring-orange-500/20">
                    <ChefHat className="w-5 h-5" />
                  </div>
                  <span className="mt-1.5 text-[10px] font-bold text-white bg-slate-900/90 px-2 py-0.5 rounded-md border border-slate-700 shadow">
                    {currentOrder?.restaurantName || 'Kitchen'}
                  </span>
                </div>

                {/* Moving Courier Bike Pin */}
                <div
                  className={`absolute transition-all duration-700 flex flex-col items-center z-10 ${
                    activeStatus === 'placed' || activeStatus === 'accepted'
                      ? 'left-16 bottom-24'
                      : activeStatus === 'preparing'
                      ? 'left-36 bottom-36'
                      : activeStatus === 'out_for_delivery'
                      ? 'left-56 bottom-48'
                      : 'right-20 top-20'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-2xl ring-4 ring-orange-400/30 animate-bounce">
                    <Bike className="w-6 h-6" />
                  </div>
                  <span className="mt-1 text-[10px] font-extrabold text-orange-400 bg-black/80 px-2 py-0.5 rounded shadow">
                    Carlos (Courier)
                  </span>
                </div>

                {/* Destination Dropoff Pin */}
                <div className="absolute right-16 top-16 flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xl ring-4 ring-emerald-500/20">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <span className="mt-1.5 text-[10px] font-bold text-white bg-slate-900/90 px-2 py-0.5 rounded-md border border-slate-700 shadow">
                    Your Doorstep
                  </span>
                </div>

                {/* Floating GPS HUD Pill */}
                <div className="absolute bottom-4 left-4 right-4 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-slate-300 font-medium">
                      Status: <strong className="text-white capitalize">{activeStatus.replace('_', ' ')}</strong>
                    </span>
                  </div>
                  <span className="text-orange-400 font-bold">1.2 km away</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
