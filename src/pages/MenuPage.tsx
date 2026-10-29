import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { DataService } from '../services/dataService';

export const MenuPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';
  const [searchTerm, setSearchTerm] = useState('');

  const categories = useMemo(() => DataService.getCategories(), []);
  const allItems = useMemo(() => DataService.getMenuItems(), []);

  const filteredItems = useMemo(() => {
    return allItems.filter((item) => {
      // Category filter
      if (activeCategory !== 'all' && item.categoryId !== activeCategory) {
        return false;
      }
      // Search filter (Khmer name and English name fallback)
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesKm = item.name.km.toLowerCase().includes(query);
        const matchesEn = item.name.en?.toLowerCase().includes(query) ?? false;
        if (!matchesKm && !matchesEn) {
          return false;
        }
      }
      return true;
    });
  }, [allItems, activeCategory, searchTerm]);

  const handleCategorySelect = (categoryId: string) => {
    if (categoryId === 'all') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ category: categoryId });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900">
            បញ្ជីមុខម្ហូប និងភេសជ្ជៈ
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Menu & Beverages Catalog
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <label htmlFor="menu-search-input" className="sr-only">
            ស្វែងរកមុខម្ហូប / Search menu
          </label>
          <input
            id="menu-search-input"
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ស្វែងរក / Search item..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
          <svg
            className="w-4 h-4 text-stone-400 absolute left-3 top-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none" role="tablist">
        <button
          role="tab"
          aria-selected={activeCategory === 'all'}
          onClick={() => handleCategorySelect('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
            activeCategory === 'all'
              ? 'bg-amber-800 text-white shadow-sm'
              : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
          }`}
        >
          ទាំងអស់ / All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            role="tab"
            aria-selected={activeCategory === cat.id}
            onClick={() => handleCategorySelect(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
              activeCategory === cat.id
                ? 'bg-amber-800 text-white shadow-sm'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            {cat.name.km} {cat.name.en ? `(${cat.name.en})` : ''}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-stone-200 p-8 space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-stone-100 flex items-center justify-center text-stone-400">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-base font-semibold text-stone-800">
            រកមិនឃើញមុខម្ហូបទេ / No items found
          </h2>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            សូមព្យាយាមផ្លាស់ប្តូរពាក្យស្វែងរក ឬប្រភេទមុខម្ហូបផ្សេងទៀត។
          </p>
          {(searchTerm !== '' || activeCategory !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                handleCategorySelect('all');
              }}
              className="mt-2 text-xs font-semibold text-amber-700 hover:text-amber-800 underline underline-offset-4"
            >
              កំណត់ឡើងវិញ / Reset filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <Link
              key={item.id}
              to={`/menu/${item.slug}`}
              className={`group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 flex flex-col ${
                !item.available ? 'opacity-85' : ''
              }`}
            >
              <div className="aspect-[16/10] bg-stone-100 overflow-hidden relative">
                <img
                  src={item.images[0] || './images/menu/espresso.svg'}
                  alt={item.name.km}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {!item.available && (
                  <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[1px] flex items-center justify-center">
                    <span className="bg-stone-900 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      អស់ពីស្តុក / Unavailable
                    </span>
                  </div>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h2 className="font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
                    {item.name.km}
                  </h2>
                  {item.name.en && (
                    <p className="text-xs text-stone-500 font-medium mt-0.5">
                      {item.name.en}
                    </p>
                  )}
                  {item.description && (
                    <p className="text-xs text-stone-600 line-clamp-2 mt-1.5 leading-relaxed">
                      {item.description.km}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                  <div className="text-sm font-bold text-amber-900">
                    {item.priceUsd !== undefined ? (
                      <span>${item.priceUsd.toFixed(2)}</span>
                    ) : (
                      <span className="text-xs text-stone-600 font-medium">
                        មានជម្រើសទំហំ ({item.variants?.length} ទំហំ)
                      </span>
                    )}
                  </div>
                  <span className="text-xs font-medium text-amber-700 group-hover:underline">
                    មើលលម្អិត &rarr;
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuPage;
