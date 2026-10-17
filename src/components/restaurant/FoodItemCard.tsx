import React from 'react';
import { Plus, Minus, Star, Sparkles } from 'lucide-react';
import { MenuItem } from '../../types';
import { useCart } from '../../context/CartContext';
import { formatCurrency } from '../../utils/orderLogic';

interface FoodItemCardProps {
  item: MenuItem;
  restaurantId: string;
  restaurantName: string;
}

export const FoodItemCard: React.FC<FoodItemCardProps> = ({
  item,
  restaurantId,
  restaurantName,
}) => {
  const { addItem, updateQuantity, getItemQuantity } = useCart();
  const quantity = getItemQuantity(item.id);

  const handleAdd = () => {
    addItem(item, restaurantId, restaurantName);
  };

  return (
    <div className="bg-slate-900/80 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700/80 rounded-2xl p-4 sm:p-5 transition-all flex flex-col-reverse sm:flex-row items-start justify-between gap-4">
      {/* Left Details */}
      <div className="flex-1 space-y-2">
        {/* Badges: Veg indicator & Bestseller */}
        <div className="flex items-center gap-2">
          {/* Veg/Non-Veg Icon */}
          <div
            className={`w-4 h-4 border flex items-center justify-center rounded-[3px] shrink-0 ${
              item.isVeg ? 'border-emerald-500' : 'border-rose-500'
            }`}
            title={item.isVeg ? 'Pure Vegetarian' : 'Non-Vegetarian'}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                item.isVeg ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            />
          </div>

          {item.isBestseller && (
            <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
              <Sparkles className="w-3 h-3 text-amber-400" />
              Bestseller
            </span>
          )}

          {item.rating && (
            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-300">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>{item.rating}</span>
              {item.ratingCount && (
                <span className="text-slate-500">({item.ratingCount})</span>
              )}
            </div>
          )}
        </div>

        {/* Item Name */}
        <h4 className="text-base sm:text-lg font-bold text-white font-heading">
          {item.name}
        </h4>

        {/* Price Row */}
        <div className="flex items-center gap-2">
          <span className="text-base font-extrabold text-orange-400">
            {formatCurrency(item.price)}
          </span>
          {item.originalPrice && (
            <span className="text-xs text-slate-500 line-through">
              {formatCurrency(item.originalPrice)}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed max-w-md">
          {item.description}
        </p>
      </div>

      {/* Right Image & Add/Quantity Button */}
      <div className="relative shrink-0 w-full sm:w-36 flex flex-col items-center">
        <div className="w-full h-32 sm:h-28 rounded-xl overflow-hidden bg-slate-800 border border-slate-700/60 shadow-md">
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </div>

        {/* Add Button or Stepper */}
        <div className="-mt-4 relative z-10 w-28">
          {quantity === 0 ? (
            <button
              type="button"
              onClick={handleAdd}
              className="w-full py-1.5 px-3 bg-slate-900 border-2 border-orange-500 hover:bg-orange-500 text-orange-400 hover:text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 active:scale-95"
              aria-label={`Add ${item.name} to cart`}
            >
              <span>ADD</span>
              <Plus className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="w-full py-1 px-2 bg-orange-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-between border-2 border-orange-400">
              <button
                type="button"
                onClick={() => updateQuantity(item.id, -1)}
                className="p-1 hover:bg-orange-600 rounded-lg transition-colors"
                aria-label={`Decrease quantity of ${item.name}`}
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="font-extrabold text-sm px-1">{quantity}</span>
              <button
                type="button"
                onClick={() => updateQuantity(item.id, 1)}
                className="p-1 hover:bg-orange-600 rounded-lg transition-colors"
                aria-label={`Increase quantity of ${item.name}`}
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
