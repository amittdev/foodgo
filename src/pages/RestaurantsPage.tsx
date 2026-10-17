import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, Star, Clock, Flame, X } from 'lucide-react';
import { RESTAURANTS, CATEGORIES } from '../data/mockData';
import { RestaurantCard } from '../components/restaurant/RestaurantCard';

export const RestaurantsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCuisine, setSelectedCuisine] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'rating' | 'delivery' | 'costAsc' | 'costDesc'>('recommended');
  const [vegOnly, setVegOnly] = useState(false);
  const [minRating, setMinRating] = useState<number>(0);

  // Extract all cuisines
  const allCuisines = useMemo(() => {
    const set = new Set<string>();
    RESTAURANTS.forEach((r) => r.cuisines.forEach((c) => set.add(c)));
    return Array.from(set);
  }, []);

  const filtered = useMemo(() => {
    return RESTAURANTS.filter((r) => {
      // Search term
      if (
        searchTerm &&
        !r.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !r.cuisines.some((c) => c.toLowerCase().includes(searchTerm.toLowerCase())) &&
        !r.area.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Veg filter
      if (vegOnly && !r.isVegOnly) {
        return false;
      }

      // Rating filter
      if (minRating > 0 && r.rating < minRating) {
        return false;
      }

      // Cuisine filter
      if (selectedCuisine !== 'all' && !r.cuisines.includes(selectedCuisine)) {
        return false;
      }

      // Category filter (checks if restaurant cuisines or menu contains category)
      if (selectedCategory !== 'all') {
        const catObj = CATEGORIES.find((c) => c.slug === selectedCategory);
        if (catObj) {
          const matchCuisine = r.cuisines.some(
            (c) => c.toLowerCase() === catObj.name.toLowerCase()
          );
          const matchMenu = r.menu.some(
            (m) => m.category.toLowerCase() === catObj.name.toLowerCase()
          );
          if (!matchCuisine && !matchMenu) return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'delivery') return a.deliveryTimeMin - b.deliveryTimeMin;
      if (sortBy === 'costAsc') return a.priceForTwo - b.priceForTwo;
      if (sortBy === 'costDesc') return b.priceForTwo - a.priceForTwo;
      return 0; // recommended default
    });
  }, [searchTerm, selectedCategory, selectedCuisine, sortBy, vegOnly, minRating]);

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedCuisine('all');
    setSortBy('recommended');
    setVegOnly(false);
    setMinRating(0);
  };

  const hasActiveFilters =
    searchTerm || selectedCategory !== 'all' || selectedCuisine !== 'all' || vegOnly || minRating > 0 || sortBy !== 'recommended';

  return (
    <div className="min-h-screen bg-[#07090e] text-white py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-widest mb-1.5">
            <Flame className="w-3.5 h-3.5" />
            <span>Discover Top Cuisines</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white font-heading">
            All Restaurants
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Order from {RESTAURANTS.length} premium restaurants with instant delivery to your location.
          </p>
        </div>

        {/* Search & Main Filter Controls Bar */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 mb-8 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search restaurants, cuisines, or neighborhoods..."
                className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-orange-500"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="w-full md:w-56">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full bg-slate-800/90 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white focus:outline-none focus:border-orange-500"
              >
                <option value="recommended">Sort: Recommended</option>
                <option value="rating">Rating: High to Low</option>
                <option value="delivery">Delivery: Fastest</option>
                <option value="costAsc">Cost: Low to High</option>
                <option value="costDesc">Cost: High to Low</option>
              </select>
            </div>
          </div>

          {/* Filter Chips & Quick Toggles */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
            <div className="flex flex-wrap items-center gap-2">
              {/* Veg Only Toggle */}
              <button
                type="button"
                onClick={() => setVegOnly(!vegOnly)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                  vegOnly
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-sm'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                🌱 Pure Veg
              </button>

              {/* 4.5+ Rating Toggle */}
              <button
                type="button"
                onClick={() => setMinRating(minRating === 4.5 ? 0 : 4.5)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 ${
                  minRating === 4.5
                    ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                4.5+ Rating
              </button>

              {/* Cuisine Filter dropdown */}
              <select
                value={selectedCuisine}
                onChange={(e) => setSelectedCuisine(e.target.value)}
                className="bg-slate-800 text-xs font-bold text-slate-300 rounded-xl px-3 py-1.5 border border-slate-700 focus:outline-none"
              >
                <option value="all">All Cuisines</option>
                {allCuisines.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="px-3 py-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear Filters
                </button>
              )}
            </div>

            <span className="text-xs text-slate-400 font-medium">
              Showing <strong className="text-white">{filtered.length}</strong> restaurants
            </span>
          </div>
        </div>

        {/* Results Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filtered.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-900/40 rounded-3xl border border-slate-800 p-8 max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400 mb-4">
              <SlidersHorizontal className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">No restaurants match your filters</h3>
            <p className="text-xs text-slate-400 mb-6">
              Try adjusting your rating, cuisine, or clearing your active filters to see all available kitchens.
            </p>
            <button
              type="button"
              onClick={clearAllFilters}
              className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-orange-500/20"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
