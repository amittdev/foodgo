import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { CATEGORIES } from '../../data/mockData';

interface CategorySliderProps {
  selectedCategory?: string;
  onSelectCategory?: (categorySlug: string) => void;
}

export const CategorySlider: React.FC<CategorySliderProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const navigate = useNavigate();
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleCategoryClick = (slug: string) => {
    if (onSelectCategory) {
      onSelectCategory(slug);
    } else {
      navigate(`/search?category=${slug}`);
    }
  };

  return (
    <section className="py-12 bg-[#090d16] border-y border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header with Left/Right Buttons */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-widest mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Inspiration For Your Cravings</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">
              Explore By Category
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll('left')}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
              aria-label="Scroll categories left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll('right')}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
              aria-label="Scroll categories right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pb-4 pt-1 no-scrollbar scroll-smooth snap-x snap-mandatory"
        >
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryClick(cat.slug)}
                className={`snap-start shrink-0 flex flex-col items-center group w-28 sm:w-32 p-3 rounded-2xl transition-all duration-300 ${
                  isSelected
                    ? 'bg-orange-500/20 border-2 border-orange-500 shadow-lg shadow-orange-500/20'
                    : 'bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Image Avatar */}
                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden mb-3 border-2 border-slate-700/60 group-hover:border-orange-500/80 transition-all shadow-md">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>

                {/* Name */}
                <span
                  className={`text-xs sm:text-sm font-bold text-center truncate max-w-full font-heading ${
                    isSelected ? 'text-orange-400' : 'text-white group-hover:text-orange-400'
                  }`}
                >
                  {cat.name}
                </span>

                {/* Restaurant Count */}
                <span className="text-[10px] text-slate-400 mt-0.5">
                  {cat.restaurantCount} places
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
