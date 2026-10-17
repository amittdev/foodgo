import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Filter,
  SlidersHorizontal,
  X,
  Star,
  Clock,
  Flame,
  UtensilsCrossed,
  Store,
} from 'lucide-react';
import { RESTAURANTS, CATEGORIES } from '../data/mockData';
import { RestaurantCard } from '../components/restaurant/RestaurantCard';
import { FoodItemCard } from '../components/restaurant/FoodItemCard';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || '';

  const [query, setQuery] = useState(initialQuery);
  const [activeTab, setActiveTab] = useState<'dishes' | 'restaurants'>('restaurants');
  const [vegOnly, setVegOnly] = useState(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [maxDeliveryTime, setMaxDeliveryTime] = useState<number>(60);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);

  useEffect(() => {
    if (initialQuery) setQuery(initialQuery);
    if (initialCategory) setSelectedCategory(initialCategory);
  }, [initialQuery, initialCategory]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: query, ...(selectedCategory ? { category: selectedCategory } : {}) });
  };

  // Find matching restaurants
  const matchingRestaurants = useMemo(() => {
    return RESTAURANTS.filter((r) => {
      if (vegOnly && !r.isVegOnly) return false;
      if (minRating > 0 && r.rating < minRating) return false;
      if (r.deliveryTimeMin > maxDeliveryTime) return false;

      if (selectedCategory) {
        const catObj = CATEGORIES.find((c) => c.slug === selectedCategory);
        if (catObj) {
          const inCuisine = r.cuisines.some((c) => c.toLowerCase() === catObj.name.toLowerCase());
          const inMenu = r.menu.some((m) => m.category.toLowerCase() === catObj.name.toLowerCase());
          if (!inCuisine && !inMenu) return false;
        }
      }

      if (!query.trim()) return true;

      const q = query.toLowerCase();
      const inName = r.name.toLowerCase().includes(q);
      const inCuisine = r.cuisines.some((c) => c.toLowerCase().includes(q));
      const inArea = r.area.toLowerCase().includes(q);
      const inDishes = r.menu.some((m) => m.name.toLowerCase().includes(q) || m.description.toLowerCase().includes(q));

      return inName || inCuisine || inArea || inDishes;
    });
  }, [query, selectedCategory, vegOnly, minRating, maxDeliveryTime]);

  // Find matching dishes
  const matchingDishes = useMemo(() => {
    const list: {
      item: (typeof RESTAURANTS)[0]['menu'][0];
      restaurant: (typeof RESTAURANTS)[0];
    }[] = [];

    RESTAURANTS.forEach((r) => {
      r.menu.forEach((item) => {
        if (vegOnly && !item.isVeg) return;
        if (minRating > 0 && (item.rating || 0) < minRating) return;

        if (selectedCategory) {
          const catObj = CATEGORIES.find((c) => c.slug === selectedCategory);
          if (catObj && item.category.toLowerCase() !== catObj.name.toLowerCase()) {
            return;
          }
        }

        if (query.trim()) {
          const q = query.toLowerCase();
          const matchItem =
            item.name.toLowerCase().includes(q) ||
            item.description.toLowerCase().includes(q) ||
            item.category.toLowerCase().includes(q) ||
            r.name.toLowerCase().includes(q);

          if (!matchItem) return;
        }

        list.push({ item, restaurant: r });
      });
    });

    return list;
  }, [query, selectedCategory, vegOnly, minRating]);

  const clearFilters = () => {
    setQuery('');
    setSelectedCategory('');
    setVegOnly(false);
    setMinRating(0);
    setMaxDeliveryTime(60);
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-white py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Search Input Form */}
        <div className="max-w-3xl mx-auto mb-10 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-bold mb-3">
            <Search className="w-3.5 h-3.5" />
            <span>INSTANT EXPLORER</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-heading mb-4">
            Find Your Next Favorite Meal
          </h1>

          <form onSubmit={handleSearchSubmit} className="relative shadow-2xl">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search burgers, pizza, biryani, or restaurant name..."
              className="w-full bg-slate-900 border-2 border-slate-700/80 focus:border-orange-500 rounded-2xl pl-12 pr-28 py-3.5 text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none transition-all"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery('')}
                className="absolute right-20 top-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-2 top-2 bottom-2 px-5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              Search
            </button>
          </form>
        </div>

        {/* Filter Controls Bar */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 mb-8 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* View Mode Tabs: Restaurants vs Dishes */}
            <div className="flex bg-slate-800 p-1 rounded-xl border border-slate-700">
              <button
                type="button"
                onClick={() => setActiveTab('restaurants')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'restaurants'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Restaurants ({matchingRestaurants.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('dishes')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'dishes'
                    ? 'bg-orange-500 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UtensilsCrossed className="w-3.5 h-3.5" />
                <span>Dishes ({matchingDishes.length})</span>
              </button>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setVegOnly(!vegOnly)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  vegOnly
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                🌱 Veg Only
              </button>

              <button
                type="button"
                onClick={() => setMinRating(minRating === 4.5 ? 0 : 4.5)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border flex items-center gap-1 transition-all ${
                  minRating === 4.5
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                <Star className="w-3 h-3 fill-current" />
                4.5+ Rating
              </button>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-800 text-xs font-bold text-slate-300 rounded-xl px-3 py-1.5 border border-slate-700 focus:outline-none"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>

              {(query || selectedCategory || vegOnly || minRating > 0) && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-2.5 py-1 text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Area */}
        {activeTab === 'restaurants' ? (
          <div>
            {matchingRestaurants.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {matchingRestaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-3xl p-8 max-w-md mx-auto">
                <Store className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white mb-1">No restaurants found</h3>
                <p className="text-xs text-slate-400 mb-4">
                  Try checking your spelling or relaxing filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-orange-500 text-white font-bold text-xs rounded-xl"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        ) : (
          <div>
            {matchingDishes.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {matchingDishes.map(({ item, restaurant }) => (
                  <div key={`${restaurant.id}-${item.id}`} className="space-y-1">
                    <div className="px-2 text-[11px] text-slate-400 flex items-center gap-1">
                      <span>from</span>
                      <Link
                        to={`/restaurant/${restaurant.id}`}
                        className="text-orange-400 hover:underline font-semibold"
                      >
                        {restaurant.name}
                      </Link>
                    </div>
                    <FoodItemCard
                      item={item}
                      restaurantId={restaurant.id}
                      restaurantName={restaurant.name}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-3xl p-8 max-w-md mx-auto">
                <UtensilsCrossed className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                <h3 className="text-base font-bold text-white mb-1">No dishes found</h3>
                <p className="text-xs text-slate-400 mb-4">
                  Try searching for keywords like "Burger", "Pizza", or "Biryani".
                </p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-orange-500 text-white font-bold text-xs rounded-xl"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
