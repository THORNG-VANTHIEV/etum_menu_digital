import React from 'react';
import { Link } from 'react-router-dom';
import { DataService } from '../services/dataService';
import { useLanguage } from '../features/language/LanguageContext';
import ImageWithFallback from '../components/common/ImageWithFallback';

export const HomePage: React.FC = () => {
  const { locale, t, getLocalizedText } = useLanguage();
  const featuredItems = DataService.getFeaturedMenuItems();

  return (
    <div className="space-y-10">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-800 via-amber-900 to-stone-950 text-white p-8 sm:p-12 shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="inline-block px-3 py-1 bg-amber-400/20 text-amber-200 border border-amber-400/30 rounded-full text-xs font-semibold tracking-wide">
            {t('welcomeBadge')}
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            {t('heroTitle')}
          </h1>
          <p className="text-amber-100/90 text-sm sm:text-base leading-relaxed">
            {t('heroSubtitle')}
          </p>
          <div className="pt-2">
            <Link
              to="/menu"
              className="inline-flex items-center justify-center px-6 py-3.5 rounded-2xl bg-amber-400 text-stone-950 font-bold text-sm hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-400 transition-all shadow-md active:scale-95"
            >
              <span>{t('viewFullMenu')}</span>
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Items Preview */}
      {featuredItems.length > 0 && (
        <section className="space-y-5" aria-labelledby="featured-heading">
          <div className="flex items-center justify-between">
            <div>
              <h2 id="featured-heading" className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
                {t('featuredItems')}
              </h2>
              <p className="text-xs sm:text-sm text-stone-500">
                {t('featuredSubtitle')}
              </p>
            </div>
            <Link
              to="/menu"
              className="text-xs sm:text-sm font-bold text-amber-800 hover:text-amber-950 transition-colors flex items-center space-x-1"
            >
              <span>{t('viewAll')}</span>
              <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {featuredItems.map((item) => {
              const primaryName = getLocalizedText(item.name);
              const secondaryName = locale === 'en' ? item.name.km : item.name.en;

              return (
                <Link
                  key={item.id}
                  to={`/menu/${item.slug}`}
                  className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 flex flex-col"
                  aria-label={`${primaryName} - ${item.available ? 'Available' : 'Sold Out'}`}
                >
                  <div className="aspect-[4/3] bg-stone-50 overflow-hidden relative flex items-center justify-center p-2.5 sm:p-3">
                    <ImageWithFallback
                      src={item.images[0]}
                      alt={primaryName}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-xs"
                    />
                    {!item.available && (
                      <div className="absolute top-2 right-2 bg-stone-900/85 text-white text-[11px] font-bold px-2 py-0.5 rounded backdrop-blur">
                        {t('soldOut')}
                      </div>
                    )}
                  </div>
                  <div className="p-4 space-y-1 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-stone-900 group-hover:text-amber-900 transition-colors text-base">
                        {primaryName}
                      </h3>
                      {secondaryName && (
                        <p className="text-xs text-stone-500 font-medium">
                          {secondaryName}
                        </p>
                      )}
                    </div>
                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                      <span className="font-extrabold text-amber-950 text-sm">
                        {item.priceUsd !== undefined ? `$${item.priceUsd.toFixed(2)}` : t('hasVariants')}
                      </span>
                      <span className="text-amber-700 font-bold group-hover:text-amber-950 transition-colors flex items-center space-x-1">
                        <span>{t('viewDetails')}</span>
                        <span aria-hidden="true" className="group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
