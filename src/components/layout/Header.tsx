import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  currentLocale?: 'km' | 'en';
  onLocaleChange?: (locale: 'km' | 'en') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLocale = 'km',
  onLocaleChange,
}) => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isMenu = location.pathname.startsWith('/menu');

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link
          to="/"
          className="flex items-center space-x-3 text-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg p-1 transition-opacity hover:opacity-90"
        >
          <img
            src="./images/branding/logo.svg"
            alt="Cafe Logo"
            className="w-9 h-9 object-contain"
          />
          <div className="flex flex-col">
            <span className="font-bold text-base sm:text-lg leading-tight tracking-tight text-amber-950">
              អ៊ីទុំ លៀសអប់សៀមរាប
            </span>
            <span className="text-[11px] text-stone-500">
              Cafe & Restaurant
            </span>
          </div>
        </Link>

        {/* Navigation & Language Toggle */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <nav className="flex items-center space-x-1 sm:space-x-2" aria-label="Main navigation">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                isHome
                  ? 'bg-amber-100/80 text-amber-950'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              {currentLocale === 'km' ? 'ទំព័រដើម' : 'Home'}
            </Link>
            <Link
              to="/menu"
              className={`px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                isMenu
                  ? 'bg-amber-100/80 text-amber-950'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              {currentLocale === 'km' ? 'បញ្ជីមុខម្ហូប' : 'Menu'}
            </Link>
          </nav>

          {/* Language Switcher pill */}
          <div
            className="inline-flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-xs font-semibold"
            role="group"
            aria-label="Language selection"
          >
            <button
              type="button"
              onClick={() => onLocaleChange && onLocaleChange('km')}
              className={`px-2 py-1 rounded-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                currentLocale === 'km'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
              aria-pressed={currentLocale === 'km'}
            >
              ខ្មែរ
            </button>
            <button
              type="button"
              onClick={() => onLocaleChange && onLocaleChange('en')}
              className={`px-2 py-1 rounded-md transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                currentLocale === 'en'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
              aria-pressed={currentLocale === 'en'}
            >
              EN
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

