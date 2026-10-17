import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, MapPin, Heart, ArrowRight, Tag, Leaf } from 'lucide-react';
import { Restaurant } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/orderLogic';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant }) => {
  const { isFavorite, toggleFavorite } = useAuth();
  const favorited = isFavorite(restaurant.id);

  return (
    <div className="group bg-slate-900/90 rounded-2xl sm:rounded-3xl border border-slate-800/80 hover:border-orange-500/50 shadow-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-orange-500/10 flex flex-col justify-between">
      <div>
        {/* Cover Image Container */}
        <div className="relative aspect-[16/10] overflow-hidden bg-slate-800">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

          {/* Offer Pill if available */}
          {restaurant.hasOffers && restaurant.offerText && (
            <div className="absolute bottom-3 left-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg shadow-lg flex items-center gap-1.5">
              <Tag className="w-3 h-3" />
              <span>{restaurant.offerText}</span>
            </div>
          )}

          {/* Favorite Heart Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(restaurant.id);
            }}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all active:scale-75 ${
              favorited
                ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40'
                : 'bg-black/50 text-white hover:bg-black/80'
            }`}
            aria-label={favorited ? `Remove ${restaurant.name} from favorites` : `Add ${restaurant.name} to favorites`}
          >
            <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
          </button>

          {/* Pure Veg Indicator Badge */}
          {restaurant.isVegOnly && (
            <div className="absolute top-3 left-3 bg-emerald-950/80 backdrop-blur-md border border-emerald-500/50 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Leaf className="w-3 h-3 text-emerald-400" />
              <span>Pure Veg</span>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5">
          {/* Header Row: Name & Rating */}
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-orange-400 transition-colors truncate font-heading">
              {restaurant.name}
            </h3>
            <div className="flex items-center gap-1 bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold px-2 py-0.5 rounded-md shrink-0">
              <Star className="w-3 h-3 fill-emerald-400" />
              <span>{restaurant.rating}</span>
            </div>
          </div>

          {/* Cuisines */}
          <p className="text-xs text-slate-400 truncate mb-3">
            {restaurant.cuisines.join(' • ')}
          </p>

          {/* Meta Info Row: Delivery Time, Price for two, Area */}
          <div className="flex items-center justify-between text-xs text-slate-300 pt-3 border-t border-slate-800/80">
            <div className="flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-orange-400" />
              <span>{restaurant.deliveryTimeMin}-{restaurant.deliveryTimeMax} mins</span>
            </div>
            <div className="flex items-center gap-1 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span className="truncate max-w-[100px]">{restaurant.area}</span>
            </div>
            <span className="font-semibold text-white">
              {formatCurrency(restaurant.priceForTwo)} for two
            </span>
          </div>
        </div>
      </div>

      {/* Footer CTA: View Menu */}
      <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0">
        <Link
          to={`/restaurant/${restaurant.id}`}
          className="w-full py-2.5 px-4 bg-slate-800/90 hover:bg-gradient-to-r hover:from-amber-500 hover:to-orange-500 text-white rounded-xl text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-sm"
        >
          <span>View Menu</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
};
