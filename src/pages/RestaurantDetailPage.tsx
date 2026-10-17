import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  Clock,
  MapPin,
  Heart,
  Search,
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  Info,
  DollarSign,
  Share2,
} from 'lucide-react';
import { RESTAURANTS } from '../data/mockData';
import { FoodItemCard } from '../components/restaurant/FoodItemCard';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { formatCurrency } from '../utils/orderLogic';

export const RestaurantDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const restaurant = RESTAURANTS.find((r) => r.id === id) || RESTAURANTS[0];

  const { isFavorite, toggleFavorite } = useAuth();
  const { totalCount, bill } = useCart();
  const { showToast } = useToast();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [vegOnly, setVegOnly] = useState<boolean>(false);
  const [menuSearch, setMenuSearch] = useState<string>('');

  const favorited = isFavorite(restaurant.id);

  // Group menu categories
  const categories = useMemo(() => {
    const cats = new Set<string>();
    restaurant.menu.forEach((item) => cats.add(item.category));
    return ['All', ...Array.from(cats)];
  }, [restaurant]);

  // Filter items
  const filteredItems = useMemo(() => {
    return restaurant.menu.filter((item) => {
      if (vegOnly && !item.isVeg) return false;
      if (activeCategory !== 'All' && item.category !== activeCategory) return false;
      if (
        menuSearch &&
        !item.name.toLowerCase().includes(menuSearch.toLowerCase()) &&
        !item.description.toLowerCase().includes(menuSearch.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [restaurant, activeCategory, vegOnly, menuSearch]);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Restaurant link copied to clipboard!', 'success');
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white pb-28">
      {/* Back Button & Top Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
        <Link
          to="/restaurants"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors py-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to all restaurants</span>
        </Link>
      </div>

      {/* Hero Banner Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900">
          {/* Cover Photo */}
          <div className="relative h-48 sm:h-64 lg:h-72 w-full overflow-hidden">
            <img
              src={restaurant.coverImage}
              alt={restaurant.name}
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07090e] via-[#07090e]/60 to-black/30" />

            {/* Quick Actions (Share, Fav) */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="p-2.5 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-md text-white transition-all"
                aria-label="Share restaurant"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => toggleFavorite(restaurant.id)}
                className={`p-2.5 rounded-full backdrop-blur-md transition-all ${
                  favorited
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/30'
                    : 'bg-black/60 text-white hover:bg-black/80'
                }`}
                aria-label="Favorite restaurant"
              >
                <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Restaurant Details Card Overlay */}
          <div className="p-6 sm:p-8 -mt-16 sm:-mt-20 relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex items-start sm:items-end gap-4 sm:gap-6">
              {/* Restaurant Logo Avatar */}
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-4 border-[#07090e] shadow-2xl shrink-0 bg-slate-800">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Title & Info */}
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-heading">
                    {restaurant.name}
                  </h1>
                  {restaurant.featured && (
                    <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 border border-orange-500/40 text-orange-400 text-[10px] font-bold">
                      Top Rated
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-slate-300 font-medium">
                  {restaurant.cuisines.join(' • ')}
                </p>

                <p className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{restaurant.address}</span>
                </p>
              </div>
            </div>

            {/* Quick Metrics Badges */}
            <div className="flex items-center gap-3 sm:gap-4 bg-slate-900/90 border border-slate-700/80 p-3 sm:p-4 rounded-2xl shadow-xl shrink-0">
              <div className="text-center px-2">
                <div className="flex items-center justify-center gap-1 text-emerald-400 font-bold text-sm sm:text-base">
                  <Star className="w-4 h-4 fill-emerald-400" />
                  <span>{restaurant.rating}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">{restaurant.ratingCount}+ ratings</p>
              </div>

              <div className="w-px h-8 bg-slate-800" />

              <div className="text-center px-2">
                <div className="flex items-center justify-center gap-1 text-orange-400 font-bold text-sm sm:text-base">
                  <Clock className="w-4 h-4" />
                  <span>{restaurant.deliveryTimeMin}-{restaurant.deliveryTimeMax}m</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Delivery Time</p>
              </div>

              <div className="w-px h-8 bg-slate-800" />

              <div className="text-center px-2">
                <div className="text-white font-bold text-sm sm:text-base">
                  {formatCurrency(restaurant.priceForTwo)}
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">Cost For Two</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu Browsing Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="sticky top-20 z-30 bg-[#07090e]/95 backdrop-blur-md py-4 border-b border-slate-800 mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Search Dishes In Menu */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={menuSearch}
                onChange={(e) => setMenuSearch(e.target.value)}
                placeholder="Search within this menu..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Veg Only Toggle */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setVegOnly(!vegOnly)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                  vegOnly
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 border flex items-center justify-center rounded-[2px] ${
                    vegOnly ? 'border-emerald-400' : 'border-slate-500'
                  }`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      vegOnly ? 'bg-emerald-400' : 'bg-slate-500'
                    }`}
                  />
                </div>
                <span>Veg Only</span>
              </button>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  activeCategory === cat
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold font-heading text-white">
              {activeCategory === 'All' ? 'Full Menu' : activeCategory}
            </h2>
            <span className="text-xs text-slate-400">
              {filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'}
            </span>
          </div>

          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredItems.map((item) => (
                <FoodItemCard
                  key={item.id}
                  item={item}
                  restaurantId={restaurant.id}
                  restaurantName={restaurant.name}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-slate-800 p-8">
              <p className="text-sm font-semibold text-slate-300">No dishes match your filters</p>
              <button
                onClick={() => {
                  setVegOnly(false);
                  setMenuSearch('');
                  setActiveCategory('All');
                }}
                className="mt-3 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-orange-400 text-xs font-bold rounded-xl"
              >
                Reset Menu Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Floating Sticky Cart Bar (Shown when items are in cart) */}
      {totalCount > 0 && (
        <div className="fixed bottom-16 md:bottom-6 left-4 right-4 max-w-2xl mx-auto z-40 animate-in fade-in slide-in-from-bottom-4">
          <Link
            to="/cart"
            className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-2xl shadow-orange-500/30 hover:scale-[1.01] transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-orange-100">
                  {totalCount} {totalCount === 1 ? 'Item' : 'Items'} in Cart
                </p>
                <p className="text-base font-extrabold">{formatCurrency(bill.grandTotal)}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider bg-white/20 px-4 py-2 rounded-xl backdrop-blur-md">
              <span>View Cart</span>
              <Sparkles className="w-4 h-4" />
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};
