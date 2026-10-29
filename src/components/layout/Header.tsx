import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../../features/language/LanguageContext';

export const Header: React.FC = () => {
  const { locale, setLocale, t } = useLanguage();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const isMenu = location.pathname.startsWith('/menu');

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Brand / Logo */}
        <Link
          to="/"
          className="flex items-center space-x-2 sm:space-x-3 text-stone-900 outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg p-1 transition-opacity hover:opacity-90 min-w-0"
        >
          <img
            src="./images/branding/e_tum_icon.webp"
            alt=""
            className="w-8 h-8 sm:w-9 sm:h-9 object-contain rounded-full flex-shrink-0 shadow-xs"
          />
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-sm sm:text-lg leading-tight tracking-tight text-amber-950 truncate">
              {t('appName')}
            </span>
            <span className="text-[10px] sm:text-[11px] text-stone-500 truncate hidden xs:block">
              {t('appTagline')}
            </span>
          </div>
        </Link>

        {/* Navigation & Language Toggle */}
        <div className="flex items-center space-x-1 sm:space-x-3 flex-shrink-0">
          <nav className="flex items-center space-x-1" aria-label="Main navigation">
            <Link
              to="/"
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                isHome
                  ? 'bg-amber-100/80 text-amber-950 font-bold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              {t('home')}
            </Link>
            <Link
              to="/menu"
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                isMenu
                  ? 'bg-amber-100/80 text-amber-950 font-bold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              {t('menu')}
            </Link>
          </nav>

          {/* Language Switcher pill */}
          <div
            className="inline-flex items-center bg-stone-100 p-0.5 rounded-lg border border-stone-200 text-xs font-semibold flex-shrink-0"
            role="group"
            aria-label="Language selection"
          >
            <button
              type="button"
              onClick={() => setLocale('km')}
              className={`px-2 py-1 rounded-md transition-all whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                locale === 'km'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
              aria-pressed={locale === 'km'}
            >
              ខ្មែរ
            </button>
            <button
              type="button"
              onClick={() => setLocale('en')}
              className={`px-2 py-1 rounded-md transition-all whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                locale === 'en'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
              aria-pressed={locale === 'en'}
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
