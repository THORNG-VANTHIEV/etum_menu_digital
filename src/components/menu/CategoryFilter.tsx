import React from 'react';
import type { MenuCategory, Locale } from '../../types/menu';

interface CategoryFilterProps {
  categories: MenuCategory[];
  activeCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
  locale?: Locale;
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  activeCategoryId,
  onSelectCategory,
  locale = 'km',
}) => {
  return (
    <div
      className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none"
      role="tablist"
      aria-label="Filter menu items by category"
    >
      <button
        type="button"
        role="tab"
        aria-selected={activeCategoryId === 'all'}
        onClick={() => onSelectCategory('all')}
        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
          activeCategoryId === 'all'
            ? 'bg-amber-800 text-white shadow-xs'
            : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
        }`}
      >
        {locale === 'km' ? 'ទាំងអស់ (All)' : 'All'}
      </button>

      {categories.map((cat) => {
        const isSelected = activeCategoryId === cat.id;
        const name = locale === 'en' && cat.name.en ? cat.name.en : cat.name.km;

        return (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onSelectCategory(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
              isSelected
                ? 'bg-amber-800 text-white shadow-xs'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            {name}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;
