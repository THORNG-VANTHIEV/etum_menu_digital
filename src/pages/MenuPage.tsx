import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DataService } from '../services/dataService';
import CategoryFilter from '../components/menu/CategoryFilter';
import SearchBar from '../components/menu/SearchBar';
import MenuCard from '../components/menu/MenuCard';
import { filterMenuItems } from '../features/menu-search/searchUtils';
import { useLanguage } from '../features/language/LanguageContext';

export const MenuPage: React.FC = () => {
  const { locale, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';
  const [searchTerm, setSearchTerm] = useState('');

  const categories = useMemo(() => DataService.getCategories(), []);
  const allItems = useMemo(() => DataService.getMenuItems(), []);
  const siteConfig = useMemo(() => DataService.getSiteConfig(), []);

  const filteredItems = useMemo(() => {
    return filterMenuItems(allItems, {
      category: activeCategory,
      searchTerm,
      locale,
    });
  }, [allItems, activeCategory, searchTerm, locale]);

  const handleCategorySelect = (categoryId: string) => {
    if (categoryId === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: categoryId });
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    handleCategorySelect('all');
  };

  return (
    <div className="space-y-6">
      {/* Header with Title and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 tracking-tight">
            {t('menu')}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 mt-1">
            {t('menuSubtitle')}
          </p>
        </div>

        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          locale={locale}
        />
      </div>

      {/* Category Filter Tabs */}
      <CategoryFilter
        categories={categories}
        activeCategoryId={activeCategory}
        onSelectCategory={handleCategorySelect}
        locale={locale}
      />

      {/* Items Grid or Empty State */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-palm-900 rounded-3xl border border-stone-200 dark:border-palm-800 p-8 space-y-3 shadow-xs">
          <div className="w-14 h-14 mx-auto rounded-full bg-stone-100 dark:bg-palm-800 flex items-center justify-center text-stone-400">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-base sm:text-lg font-bold text-stone-800 dark:text-stone-200">
            {t('noItemsFound')}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
            {t('noItemsFoundDesc')}
          </p>
          {(searchTerm !== '' || activeCategory !== 'all') && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="mt-2 inline-flex items-center text-xs font-semibold text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950 hover:bg-amber-100 dark:hover:bg-amber-900 border border-amber-200 dark:border-amber-800 px-3.5 py-1.5 rounded-xl transition-all active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-amber-500 shadow-xs"
            >
              {t('resetFilters')}
            </button>
          )}
        </div>
      ) : (
        // Keyed by category so the cards fade in again (staggered) on each category change
        <div key={activeCategory} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              className="grid motion-safe:animate-fade-in-up"
              style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
            >
              <MenuCard
                item={item}
                locale={locale}
                currencyConfig={siteConfig.currency}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuPage;
