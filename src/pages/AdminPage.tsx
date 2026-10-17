import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Lock,
  User,
  CheckCircle2,
  XCircle,
  Clock,
  ChefHat,
  Bike,
  PackageCheck,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  AlertCircle,
  Bell,
  LogOut,
  RefreshCw,
  Sparkles,
  ArrowRight,
  Eye,
  Phone,
  MapPin,
  Flame,
  Check,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Order, OrderStatus } from '../types';
import { formatCurrency } from '../utils/orderLogic';

const ADMIN_STORAGE_KEY = 'foodgo_admin_session_v1';

export const AdminPage: React.FC = () => {
  const { orders, updateOrderStatus, simulateIncomingOrder } = useAuth();
  const { showToast } = useToast();

  // Admin auth state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ADMIN_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // Dashboard filtering & search state
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<Order | null>(null);
  const [audioAlertEnabled, setAudioAlertEnabled] = useState(true);

  // Rejection modal
  const [rejectingOrderId, setRejectingOrderId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('Kitchen currently at maximum capacity');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (usernameInput.trim() === 'foodgo' && passwordInput === '12345678') {
      setIsAdminLoggedIn(true);
      try {
        localStorage.setItem(ADMIN_STORAGE_KEY, 'true');
      } catch {}
      setLoginError('');
      showToast('Welcome to FoodGo Restaurant Admin Console!', 'success');
    } else {
      setLoginError('Invalid credentials. Please enter valid admin username and password.');
      showToast('Authentication failed. Check credentials.', 'error');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    try {
      localStorage.removeItem(ADMIN_STORAGE_KEY);
    } catch {}
    showToast('Admin signed out', 'info');
  };


  // Orders statistics
  const stats = useMemo(() => {
    const total = orders.length;
    const pendingConfirmation = orders.filter((o) => o.status === 'placed').length;
    const inKitchen = orders.filter((o) => o.status === 'accepted' || o.status === 'preparing').length;
    const onRoad = orders.filter((o) => o.status === 'out_for_delivery').length;
    const completed = orders.filter((o) => o.status === 'delivered').length;
    const revenue = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    return { total, pendingConfirmation, inKitchen, onRoad, completed, revenue };
  }, [orders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== 'all' && o.status !== statusFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = o.id.toLowerCase().includes(q);
        const matchRest = o.restaurantName.toLowerCase().includes(q);
        const matchItems = o.items.some((i) => i.name.toLowerCase().includes(q));
        const matchStreet = o.deliveryAddress.street.toLowerCase().includes(q);
        if (!matchId && !matchRest && !matchItems && !matchStreet) return false;
      }

      return true;
    });
  }, [orders, statusFilter, searchQuery]);

  // Order action handlers
  const handleConfirmOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'accepted');
    showToast(`Order #${orderId} CONFIRMED! Notified kitchen & customer.`, 'success');
  };

  const handleStartPreparing = (orderId: string) => {
    updateOrderStatus(orderId, 'preparing');
    showToast(`Order #${orderId} moved to PREPARING in kitchen.`, 'info');
  };

  const handleDispatchCourier = (orderId: string) => {
    updateOrderStatus(orderId, 'out_for_delivery');
    showToast(`Order #${orderId} DISPATCHED! Carlos (Courier) is en route.`, 'info');
  };

  const handleMarkDelivered = (orderId: string) => {
    updateOrderStatus(orderId, 'delivered');
    showToast(`Order #${orderId} successfully DELIVERED!`, 'success');
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (rejectingOrderId) {
      updateOrderStatus(rejectingOrderId, 'cancelled');
      showToast(`Order #${rejectingOrderId} cancelled: ${rejectReason}`, 'error');
      setRejectingOrderId(null);
    }
  };

  const triggerIncomingOrderSim = () => {
    const newOrd = simulateIncomingOrder();
    showToast(`Incoming Customer Order #${newOrd.id} received!`, 'success');
    setStatusFilter('all');
  };

  // If not logged in as Admin, show login screen
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-[#07090e] text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900/90 border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Admin Header */}
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-orange-500/20">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <span className="text-[11px] font-bold text-orange-400 uppercase tracking-widest bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
              Restaurant Partner Portal
            </span>
            <h1 className="text-2xl font-black font-heading text-white mt-2">
              Kitchen Admin Login
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Sign in to manage live orders, confirm incoming dishes, and dispatch couriers.
            </p>
          </div>



          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Admin Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                  placeholder="Enter admin username"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Access Kitchen Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            <Link to="/" className="text-xs text-slate-400 hover:text-orange-400 transition-colors">
              ← Return to FoodGo Customer Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard
  return (
    <div className="min-h-screen bg-[#07090e] text-white py-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Control Header */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/25 shrink-0">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-black font-heading text-white">
                  Restaurant Order Console
                </h1>
                <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Live Kitchen Online
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Logged in as <strong className="text-orange-400">foodgo (Manager)</strong> • Central Kitchen Station
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={triggerIncomingOrderSim}
              className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5 active:scale-95"
              title="Simulates a real customer ordering from your restaurant"
            >
              <Sparkles className="w-4 h-4" />
              <span>Simulate New Order</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAudioAlertEnabled(!audioAlertEnabled);
                showToast(
                  audioAlertEnabled ? 'Chime mute toggled' : 'Audio chime enabled for incoming orders',
                  'info'
                );
              }}
              className={`p-2 rounded-xl border transition-colors ${
                audioAlertEnabled
                  ? 'bg-slate-800 text-orange-400 border-slate-700'
                  : 'bg-slate-900 text-slate-500 border-slate-800'
              }`}
              title="Toggle Audio Notifications"
            >
              <Bell className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleAdminLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-rose-500/10 text-slate-300 hover:text-rose-400 border border-slate-700/80 rounded-xl text-xs font-semibold transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Real-time Order Metrics Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Total Orders
            </span>
            <p className="text-2xl font-black text-white font-heading mt-1">{stats.total}</p>
          </div>

          <div
            onClick={() => setStatusFilter('placed')}
            className={`p-4 rounded-2xl border cursor-pointer transition-all ${
              stats.pendingConfirmation > 0
                ? 'bg-orange-950/40 border-orange-500/60 shadow-lg shadow-orange-500/10'
                : 'bg-slate-900/80 border-slate-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-orange-400 font-bold uppercase tracking-wider">
                Needs Confirmation
              </span>
              {stats.pendingConfirmation > 0 && (
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-ping" />
              )}
            </div>
            <p className="text-2xl font-black text-orange-400 font-heading mt-1">
              {stats.pendingConfirmation}
            </p>
          </div>

          <div
            onClick={() => setStatusFilter('preparing')}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 cursor-pointer hover:border-slate-700"
          >
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
              In Kitchen Prep
            </span>
            <p className="text-2xl font-black text-amber-400 font-heading mt-1">{stats.inKitchen}</p>
          </div>

          <div
            onClick={() => setStatusFilter('out_for_delivery')}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 cursor-pointer hover:border-slate-700"
          >
            <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">
              Out for Delivery
            </span>
            <p className="text-2xl font-black text-blue-400 font-heading mt-1">{stats.onRoad}</p>
          </div>

          <div
            onClick={() => setStatusFilter('delivered')}
            className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 cursor-pointer hover:border-slate-700"
          >
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
              Delivered
            </span>
            <p className="text-2xl font-black text-emerald-400 font-heading mt-1">{stats.completed}</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              Live Revenue
            </span>
            <p className="text-2xl font-black text-emerald-400 font-heading mt-1">
              {formatCurrency(stats.revenue)}
            </p>
          </div>
        </div>

        {/* Filter Tabs & Search Bar */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 shadow-xl flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Status Tabs */}
          <div className="flex gap-2 sm:gap-2.5 overflow-x-auto pb-1 md:pb-0 no-scrollbar">
            {[
              { key: 'all', label: 'All Orders', count: orders.length },
              { key: 'placed', label: 'New / To Confirm', count: stats.pendingConfirmation, highlight: stats.pendingConfirmation > 0 },
              { key: 'accepted', label: 'Accepted', count: orders.filter((o) => o.status === 'accepted').length },
              { key: 'preparing', label: 'Preparing', count: orders.filter((o) => o.status === 'preparing').length },
              { key: 'out_for_delivery', label: 'Out for Delivery', count: stats.onRoad },
              { key: 'delivered', label: 'Delivered', count: stats.completed },
              { key: 'cancelled', label: 'Cancelled', count: orders.filter((o) => o.status === 'cancelled').length },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setStatusFilter(tab.key as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  statusFilter === tab.key
                    ? 'bg-orange-500 text-white shadow-md'
                    : tab.highlight
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[10px] opacity-80 bg-black/30 px-1.5 py-0.2 rounded-full">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ID, customer, address..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {/* Orders List Container */}
        <div className="space-y-4">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => {
              const isPending = order.status === 'placed';

              return (
                <div
                  key={order.id}
                  className={`bg-slate-900/90 rounded-3xl p-6 shadow-xl border transition-all ${
                    isPending
                      ? 'border-orange-500/80 ring-2 ring-orange-500/20 bg-gradient-to-r from-orange-950/20 to-slate-900'
                      : 'border-slate-800'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-base font-black text-orange-400">
                          #{order.id}
                        </span>
                        <span className="text-xs text-slate-400">• {order.createdAt}</span>

                        {/* Status Badge */}
                        {order.status === 'placed' && (
                          <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/40 text-[11px] font-bold animate-pulse flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Action Needed: Confirm Order
                          </span>
                        )}
                        {order.status === 'accepted' && (
                          <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/40 text-[11px] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Accepted by Kitchen
                          </span>
                        )}
                        {order.status === 'preparing' && (
                          <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/40 text-[11px] font-bold flex items-center gap-1">
                            <ChefHat className="w-3 h-3" />
                            Chef Preparing
                          </span>
                        )}
                        {order.status === 'out_for_delivery' && (
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 text-[11px] font-bold flex items-center gap-1">
                            <Bike className="w-3 h-3" />
                            On The Road
                          </span>
                        )}
                        {order.status === 'delivered' && (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Completed
                          </span>
                        )}
                        {order.status === 'cancelled' && (
                          <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/40 text-[11px] font-bold flex items-center gap-1">
                            <XCircle className="w-3 h-3" />
                            Cancelled
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-white font-heading">
                        {order.restaurantName}
                      </h3>
                    </div>

                    {/* Quick Info: Total, Payment Method, View Details */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-base font-black text-white">
                          {formatCurrency(order.total)}
                        </span>
                        <p className="text-[11px] text-slate-400">{order.paymentMethod}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedOrderForModal(order)}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-700 flex items-center gap-1"
                        title="View Full Details"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">Details</span>
                      </button>
                    </div>
                  </div>

                  {/* Order Contents & Customer Dropoff */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 py-4 text-xs">
                    {/* Items List */}
                    <div className="md:col-span-7 space-y-1.5">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                        Dishes to prepare ({order.items.reduce((s, i) => s + i.quantity, 0)} items):
                      </span>
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-800/40 last:border-0">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-slate-800 text-orange-400 font-bold flex items-center justify-center text-[11px]">
                              {item.quantity}x
                            </span>
                            <span className="text-slate-200 font-medium">{item.name}</span>
                            {item.isVeg && (
                              <span className="text-[9px] bg-emerald-500/20 text-emerald-400 px-1 py-0.2 rounded">
                                Veg
                              </span>
                            )}
                          </div>
                          <span className="text-slate-400 font-mono">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Customer & Address */}
                    <div className="md:col-span-5 bg-slate-800/40 border border-slate-800 p-3.5 rounded-2xl space-y-1.5">
                      <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                        Delivery Destination:
                      </span>
                      <p className="text-xs font-semibold text-white flex items-start gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                        <span>
                          {order.deliveryAddress.street}, {order.deliveryAddress.city} ({order.deliveryAddress.type})
                        </span>
                      </p>
                      {order.deliveryPartner && (
                        <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                          <span>Courier: {order.deliveryPartner.name}</span>
                          <span className="text-orange-400">{order.deliveryPartner.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Confirmation & Progression Action Bar */}
                  <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs text-slate-400 font-medium">
                      Status Workflow Action:
                    </span>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* Step 1: PLACED -> ACCEPT/CONFIRM ORDER */}
                      {order.status === 'placed' && (
                        <>
                          <button
                            type="button"
                            onClick={() => setRejectingOrderId(order.id)}
                            className="px-4 py-2 bg-slate-800 hover:bg-rose-500/20 text-rose-400 rounded-xl text-xs font-bold border border-rose-500/30 transition-all flex items-center gap-1.5"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Decline Order</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleConfirmOrder(order.id)}
                            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-1.5 active:scale-95"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Confirm & Accept Order</span>
                          </button>
                        </>
                      )}

                      {/* Step 2: ACCEPTED -> START PREPARING */}
                      {order.status === 'accepted' && (
                        <button
                          type="button"
                          onClick={() => handleStartPreparing(order.id)}
                          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                        >
                          <ChefHat className="w-4 h-4" />
                          <span>Send to Kitchen (Start Preparing)</span>
                        </button>
                      )}

                      {/* Step 3: PREPARING -> DISPATCH / OUT FOR DELIVERY */}
                      {order.status === 'preparing' && (
                        <button
                          type="button"
                          onClick={() => handleDispatchCourier(order.id)}
                          className="px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                        >
                          <Bike className="w-4 h-4" />
                          <span>Handover to Courier (Out for Delivery)</span>
                        </button>
                      )}

                      {/* Step 4: OUT FOR DELIVERY -> MARK DELIVERED */}
                      {order.status === 'out_for_delivery' && (
                        <button
                          type="button"
                          onClick={() => handleMarkDelivered(order.id)}
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                        >
                          <PackageCheck className="w-4 h-4" />
                          <span>Confirm Doorstep Delivery Complete</span>
                        </button>
                      )}

                      {/* Final status */}
                      {order.status === 'delivered' && (
                        <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Order Completed Successfully</span>
                        </span>
                      )}

                      {order.status === 'cancelled' && (
                        <span className="text-xs text-rose-400 font-bold flex items-center gap-1">
                          <XCircle className="w-4 h-4" />
                          <span>Cancelled by Kitchen</span>
                        </span>
                      )}

                      {/* Link to view customer side tracking */}
                      <Link
                        to={`/order-tracking/${order.id}`}
                        target="_blank"
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold border border-slate-700"
                      >
                        View Customer GPS Live ↗
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800 p-8">
              <CheckCircle2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-white mb-1">No orders in this view</h3>
              <p className="text-xs text-slate-400 mb-6">
                All caught up! Tap "Simulate New Order" to create a live incoming customer order.
              </p>
              <button
                type="button"
                onClick={triggerIncomingOrderSim}
                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Simulate Incoming Order
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Reject Order Reason Modal */}
      {rejectingOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">Decline Order #{rejectingOrderId}</h3>
            <p className="text-xs text-slate-400 mb-4">
              Please choose a reason for declining this order. The customer will be refunded immediately.
            </p>
            <form onSubmit={handleConfirmReject} className="space-y-4">
              <select
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white"
              >
                <option value="Kitchen currently at maximum capacity">Kitchen at maximum capacity</option>
                <option value="Item ingredient out of stock">Item ingredient out of stock</option>
                <option value="Restaurant closing soon">Restaurant closing soon</option>
                <option value="Delivery address outside service zone">Delivery address outside service zone</option>
              </select>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectingOrderId(null)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Confirm Decline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Order Details Drawer/Modal */}
      {selectedOrderForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white font-heading">
                  Order Details #{selectedOrderForModal.id}
                </h3>
                <p className="text-xs text-slate-400">{selectedOrderForModal.createdAt}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrderForModal(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                Items & Breakdown:
              </span>
              {selectedOrderForModal.items.map((item, idx) => (
                <div key={idx} className="flex justify-between py-1 border-b border-slate-800/60">
                  <span>
                    {item.quantity}x {item.name}
                  </span>
                  <span className="font-semibold text-white">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
              <div className="pt-2 space-y-1 text-slate-400">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="text-white">{formatCurrency(selectedOrderForModal.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <span className="text-emerald-400">-{formatCurrency(selectedOrderForModal.discount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee:</span>
                  <span className="text-white">{formatCurrency(selectedOrderForModal.deliveryFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes:</span>
                  <span className="text-white">{formatCurrency(selectedOrderForModal.taxes)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
                  <span>Total Amount Paid:</span>
                  <span className="text-orange-400">{formatCurrency(selectedOrderForModal.total)}</span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-800/60 rounded-2xl text-xs space-y-1">
              <p className="font-bold text-white">Delivery Address:</p>
              <p className="text-slate-300">
                {selectedOrderForModal.deliveryAddress.street}, {selectedOrderForModal.deliveryAddress.city} {selectedOrderForModal.deliveryAddress.zip}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setSelectedOrderForModal(null)}
              className="w-full py-2.5 bg-orange-500 text-white font-bold text-xs rounded-xl"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
