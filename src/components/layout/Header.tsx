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
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                isHome
                  ? 'bg-amber-100/80 text-amber-950 font-bold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              {t('home')}
            </Link>
            <Link
              to="/menu"
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                isMenu
                  ? 'bg-amber-100/80 text-amber-950 font-bold'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              {t('menu')}
            </Link>
          </nav>

          {/* Language toggle: shows the language it switches to */}
          <button
            type="button"
            onClick={() => setLocale(locale === 'km' ? 'en' : 'km')}
            aria-label={t('switchLanguage')}
            title={t('switchLanguage')}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-stone-200 bg-stone-100 text-xs font-bold text-stone-700 whitespace-nowrap flex-shrink-0 hover:bg-white hover:text-stone-900 transition active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            <svg className="w-3.5 h-3.5 text-stone-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path strokeLinecap="round" d="M3 12h18M12 3c2.5 2.7 3.8 5.7 3.8 9s-1.3 6.3-3.8 9c-2.5-2.7-3.8-5.7-3.8-9S9.5 5.7 12 3z" />
            </svg>
            <span lang={locale === 'km' ? 'en' : 'km'}>{locale === 'km' ? 'EN' : 'ខ្មែរ'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
