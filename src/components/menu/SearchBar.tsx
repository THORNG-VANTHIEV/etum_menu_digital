import React from 'react';
import type { Locale } from '../../types/menu';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  locale?: Locale;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  locale = 'km',
}) => {
  return (
    <div className="relative w-full md:w-80">
      <label htmlFor="menu-search-input" className="sr-only">
        {locale === 'km' ? 'ស្វែងរកមុខម្ហូប' : 'Search menu items'}
      </label>
      <input
        id="menu-search-input"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={locale === 'km' ? 'ស្វែងរកឈ្មោះមុខម្ហូប...' : 'Search items...'}
        className="w-full pl-10 pr-9 py-2 text-sm bg-white dark:bg-palm-900 border border-stone-300 dark:border-palm-700 rounded-xl outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all placeholder:text-stone-400"
      />
      <div className="absolute left-3 top-2.5 text-stone-400 pointer-events-none" aria-hidden="true">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute right-2.5 top-2.5 p-0.5 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-300 hover:bg-stone-100 dark:hover:bg-palm-800 outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          aria-label={locale === 'km' ? 'សម្អាតការស្វែងរក' : 'Clear search'}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SearchBar;

