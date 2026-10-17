import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  User,
  ShoppingBag,
  MapPin,
  Heart,
  CreditCard,
  LogOut,
  Clock,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Award,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { RESTAURANTS } from '../data/mockData';
import { RestaurantCard } from '../components/restaurant/RestaurantCard';
import { formatCurrency } from '../utils/orderLogic';

export const ProfilePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'orders';

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'favorites' | 'payments'>(
    (initialTab as any) || 'orders'
  );

  const { user, isLoggedIn, logout, orders, openAuthModal, deleteAddress, addAddress } = useAuth();
  const { addItem } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // New address modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('Metropolis');
  const [newZip, setNewZip] = useState('90210');
  const [newType, setNewType] = useState<'Home' | 'Work' | 'Other'>('Home');

  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-[#07090e] text-white px-4">
        <div className="max-w-md w-full text-center py-16 px-6 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto mb-4 text-orange-400">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold font-heading mb-2">Sign In Required</h2>
          <p className="text-xs text-slate-400 mb-6">
            Please sign in to view your profile, manage addresses, and track previous orders.
          </p>
          <button
            type="button"
            onClick={() => openAuthModal('login')}
            className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/20"
          >
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet) return;
    addAddress({
      type: newType,
      street: newStreet,
      city: newCity,
      zip: newZip,
    });
    setShowAddModal(false);
    setNewStreet('');
  };

  const favoriteRestaurants = RESTAURANTS.filter((r) => user.favorites.includes(r.id));

  const handleReorder = (order: (typeof orders)[0]) => {
    const targetRestaurant = RESTAURANTS.find((r) => r.id === order.restaurantId) || RESTAURANTS[0];
    let count = 0;
    order.items.forEach((item) => {
      const foundInMenu = targetRestaurant.menu.find((m) => m.name === item.name) || targetRestaurant.menu[0];
      addItem(foundInMenu, targetRestaurant.id, targetRestaurant.name);
      count++;
    });
    showToast(`Added ${count} items to cart from ${targetRestaurant.name}`, 'success');
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white py-8 sm:py-12 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Card Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
              alt={user.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-orange-500 shadow-xl"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-white font-heading">
                  {user.name}
                </h1>
                <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-full">
                  <Award className="w-3 h-3 text-amber-400" />
                  Gold Foodie
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">{user.email} • {user.phone}</p>
              <p className="text-[11px] text-emerald-400 mt-0.5">● Active member • 100% On-time delivery rate</p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-rose-500/10 text-slate-300 hover:text-rose-400 rounded-xl text-xs font-semibold border border-slate-700/60 transition-colors w-fit"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

        {/* Profile Tabs Navigation */}
        <div className="flex gap-2.5 sm:gap-3 overflow-x-auto pb-2 mb-8 border-b border-slate-800 no-scrollbar">
          {[
            { key: 'orders', label: 'Previous Orders', count: orders.length, icon: ShoppingBag },
            { key: 'addresses', label: 'Saved Addresses', count: user.addresses.length, icon: MapPin },
            { key: 'favorites', label: 'Favorite Kitchens', count: favoriteRestaurants.length, icon: Heart },
            { key: 'payments', label: 'Payment Methods', count: 2, icon: CreditCard },
          ].map((tab) => {
            const Icon = tab.icon;
            const isTabActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setActiveTab(tab.key as any);
                  setSearchParams({ tab: tab.key });
                }}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                  isTabActive
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                    : 'bg-slate-900/80 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isTabActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Orders History */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length > 0 ? (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white font-heading">
                          {order.restaurantName}
                        </h3>
                        <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full capitalize">
                          {order.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Order #{order.id} • Placed {order.createdAt}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to={`/order-tracking/${order.id}`}
                        className="px-4 py-2 bg-orange-500/10 hover:bg-orange-500 text-orange-400 hover:text-white text-xs font-bold rounded-xl border border-orange-500/30 transition-all flex items-center gap-1.5"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Track Live</span>
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleReorder(order)}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition-all flex items-center gap-1.5"
                      >
                        <span>Reorder</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="space-y-1.5 text-xs text-slate-300">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span className="font-semibold text-white">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Total & Address footer */}
                  <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>Delivered to: {order.deliveryAddress.street}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Total Paid:</span>
                      <span className="text-base font-extrabold text-orange-400">
                        {formatCurrency(order.total)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
                <ShoppingBag className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white mb-1">No orders yet</h3>
                <p className="text-xs text-slate-400 mb-4">
                  Once you order your favorite meal, it will appear here for easy tracking and reordering.
                </p>
                <Link
                  to="/restaurants"
                  className="px-6 py-2.5 bg-orange-500 text-white font-bold text-xs rounded-xl"
                >
                  Order Food Now
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Saved Addresses */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold font-heading text-white">Saved Delivery Addresses</h3>
                <p className="text-xs text-slate-400">Manage drop-off locations for instant checkout</p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-md shadow-orange-500/20"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Address</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {user.addresses.map((addr) => (
                <div
                  key={addr.id}
                  className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-orange-400 uppercase tracking-wider bg-orange-500/10 px-2.5 py-1 rounded-full border border-orange-500/20">
                      {addr.type}
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteAddress(addr.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 rounded-lg hover:bg-rose-500/10 transition-colors"
                      title="Delete Address"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <p className="text-sm font-bold text-white">{addr.street}</p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {addr.city}, {addr.zip}
                    </p>
                    {addr.landmark && (
                      <p className="text-[11px] text-slate-500 mt-1">Landmark: {addr.landmark}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Modal for adding address */}
            {showAddModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
                  <h3 className="text-lg font-bold text-white mb-4">Add New Address</h3>
                  <form onSubmit={handleAddAddress} className="space-y-3">
                    <div className="flex gap-2 mb-2">
                      {(['Home', 'Work', 'Other'] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setNewType(t)}
                          className={`flex-1 py-1.5 text-xs font-bold rounded-xl border ${
                            newType === t
                              ? 'bg-orange-500 text-white border-orange-400'
                              : 'bg-slate-800 text-slate-400 border-slate-700'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <input
                      type="text"
                      required
                      value={newStreet}
                      onChange={(e) => setNewStreet(e.target.value)}
                      placeholder="Street address & Flat/House #"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={newCity}
                        onChange={(e) => setNewCity(e.target.value)}
                        placeholder="City"
                        className="bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
                      />
                      <input
                        type="text"
                        value={newZip}
                        onChange={(e) => setNewZip(e.target.value)}
                        placeholder="ZIP"
                        className="bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddModal(false)}
                        className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-orange-500 text-white font-bold text-xs rounded-xl shadow-md"
                      >
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Favorites */}
        {activeTab === 'favorites' && (
          <div>
            {favoriteRestaurants.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {favoriteRestaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-3xl p-8">
                <Heart className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white mb-1">No favorites saved</h3>
                <p className="text-xs text-slate-400 mb-4">
                  Tap the heart icon on any restaurant card to save it here for quick access.
                </p>
                <Link
                  to="/restaurants"
                  className="px-6 py-2.5 bg-orange-500 text-white font-bold text-xs rounded-xl"
                >
                  Browse Restaurants
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Payments */}
        {activeTab === 'payments' && (
          <div className="max-w-xl space-y-4">
            <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center">
                  <CreditCard className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-heading">
                    Visa Classic Ending in •••• 4242
                  </h4>
                  <p className="text-xs text-slate-400">Expires 09/28 • Default Payment Method</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Active</span>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white font-heading">
                    UPI ID: alex.morgan@okhdfcbank
                  </h4>
                  <p className="text-xs text-slate-400">Linked to Google Pay</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">Verified</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
