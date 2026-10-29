import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../features/language/LanguageContext';
import { useTheme } from '../../features/theme/useTheme';

const toggleButtonClass =
  'inline-flex items-center gap-1 px-2 py-1 h-7 rounded-lg border border-stone-200 dark:border-palm-800 bg-stone-100 dark:bg-palm-800 text-xs font-bold text-stone-700 dark:text-stone-300 whitespace-nowrap flex-shrink-0 hover:bg-white dark:hover:bg-palm-900 hover:text-stone-900 dark:hover:text-stone-100 transition active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-amber-500';

export const Header: React.FC = () => {
  const { locale, setLocale, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const themeLabel = theme === 'dark' ? t('switchToLight') : t('switchToDark');

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-palm-900/95 backdrop-blur border-b border-stone-200 dark:border-palm-800">
      <div className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2">
        {/* Brand / Logo — also the way back to the home page */}
        <Link
          to="/"
          aria-label={`${t('appName')} – ${t('home')}`}
          title={t('home')}
          className="flex items-center space-x-2 sm:space-x-3 text-stone-900 dark:text-stone-100 outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg p-1 transition-opacity hover:opacity-90 min-w-0"
        >
          <img
            src="./images/branding/e_tum_icon.webp"
            alt=""
            className="w-8 h-8 sm:w-9 sm:h-9 object-contain rounded-full flex-shrink-0 shadow-xs"
          />
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-sm sm:text-lg leading-tight tracking-tight text-amber-950 dark:text-amber-100 truncate">
              {t('appName')}
            </span>
            <span className="text-[10px] sm:text-[11px] text-stone-500 dark:text-stone-400 truncate hidden xs:block">
              {t('appTagline')}
            </span>
          </div>
        </Link>

        {/* Theme & Language Toggles */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Theme toggle: shows the mode it switches to */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={themeLabel}
            title={themeLabel}
            className={toggleButtonClass}
          >
            {theme === 'dark' ? (
              <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="12" cy="12" r="4" />
                <path strokeLinecap="round" d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </svg>
            ) : (
              <svg className="w-4 h-4 text-stone-500 dark:text-stone-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" />
              </svg>
            )}
          </button>

          {/* Language toggle: shows the language it switches to */}
          <button
            type="button"
            onClick={() => setLocale(locale === 'km' ? 'en' : 'km')}
            aria-label={t('switchLanguage')}
            title={t('switchLanguage')}
            className={toggleButtonClass}
          >
            <svg className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
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
