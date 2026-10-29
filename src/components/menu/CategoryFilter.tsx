import React, { useEffect, useRef } from 'react';
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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const selectedTabRef = useRef<HTMLButtonElement | null>(null);

  // Auto scroll the selected tab into view (centered) whenever activeCategoryId changes
  useEffect(() => {
    if (selectedTabRef.current && typeof selectedTabRef.current.scrollIntoView === 'function') {
      selectedTabRef.current.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  }, [activeCategoryId]);

  const handleTabClick = (categoryId: string, element: HTMLButtonElement) => {
    onSelectCategory(categoryId);
    if (typeof element.scrollIntoView === 'function') {
      element.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  };

  return (
    <div
      ref={containerRef}
      className="flex items-center space-x-2 overflow-x-auto pb-2 scroll-smooth scrollbar-none overscroll-x-contain touch-pan-x"
      role="tablist"
      aria-label="Filter menu items by category"
    >
      <button
        ref={activeCategoryId === 'all' ? selectedTabRef : null}
        type="button"
        role="tab"
        aria-selected={activeCategoryId === 'all'}
        onClick={(e) => handleTabClick('all', e.currentTarget)}
        className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 shrink-0 ${
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
            ref={isSelected ? selectedTabRef : null}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={(e) => handleTabClick(cat.id, e.currentTarget)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 shrink-0 ${
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
