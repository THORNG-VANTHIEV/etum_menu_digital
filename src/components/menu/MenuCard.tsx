import React from 'react';
import { Link } from 'react-router-dom';
import type { MenuItem, SiteCurrencyConfig, Locale } from '../../types/menu';
import ImageWithFallback from '../common/ImageWithFallback';
import Badge from '../common/Badge';
import { CurrencyService } from '../../domain/currency/currencyService';

interface MenuCardProps {
  item: MenuItem;
  locale?: Locale;
  currencyConfig?: SiteCurrencyConfig;
}

export const MenuCard: React.FC<MenuCardProps> = ({
  item,
  locale = 'km',
  currencyConfig,
}) => {
  const hasVariants = Array.isArray(item.variants) && item.variants.length > 0;

  // Localized title & description with fallback to Khmer
  const primaryName = locale === 'en' && item.name.en ? item.name.en : item.name.km;
  const secondaryName = locale === 'en' ? item.name.km : item.name.en;
  const descriptionText = locale === 'en' && item.description?.en
    ? item.description.en
    : item.description?.km;

  // Price calculation
  let priceDisplay = '';
  if (!hasVariants && item.priceUsd !== undefined) {
    const dual = CurrencyService.formatDualPrice(
      item.priceUsd,
      currencyConfig?.exchangeRateKhrPerUsd,
      currencyConfig?.roundingRule
    );
    priceDisplay = dual.formatted;
  } else if (hasVariants && item.variants) {
    // Show price starting from lowest variant
    const minPrice = Math.min(...item.variants.map((v) => v.priceUsd));
    const dualMin = CurrencyService.formatDualPrice(
      minPrice,
      currencyConfig?.exchangeRateKhrPerUsd,
      currencyConfig?.roundingRule
    );
    priceDisplay = `${locale === 'km' ? 'ចាប់ពី' : 'From'} ${dualMin.formatted}`;
  }

  return (
    <Link
      to={`/menu/${item.slug}`}
      className={`group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 flex flex-col ${
        !item.available ? 'opacity-85' : ''
      }`}
      aria-label={`${primaryName} - ${priceDisplay} - ${item.available ? 'Available' : 'Unavailable'}`}
    >
      {/* Thumbnail */}
      <div className="aspect-[16/10] bg-stone-100 overflow-hidden relative">
        <ImageWithFallback
          src={item.images[0]}
          alt={primaryName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {!item.available && (
          <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[1px] flex items-center justify-center p-2 text-center">
            <Badge variant="warning" className="shadow-md">
              {locale === 'km' ? 'អស់ពីស្តុក / Unavailable' : 'Out of Stock'}
            </Badge>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div className="space-y-1">
          <h2 className="font-bold text-stone-900 group-hover:text-amber-900 transition-colors text-base leading-snug">
            {primaryName}
          </h2>
          {secondaryName && (
            <p className="text-xs text-stone-500 font-medium">
              {secondaryName}
            </p>
          )}
          {descriptionText && (
            <p className="text-xs text-stone-600 line-clamp-2 pt-1 leading-relaxed">
              {descriptionText}
            </p>
          )}
        </div>

        {/* Price & Action Footer */}
        <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
          <span className="font-extrabold text-amber-950 text-sm">
            {priceDisplay}
          </span>
          <span className="font-semibold text-amber-700 group-hover:underline flex items-center space-x-1">
            <span>{locale === 'km' ? 'មើលលម្អិត' : 'Details'}</span>
            <span aria-hidden="true">&rarr;</span>
          </span>
        </div>
      </div>
    </Link>
  );
};

export default MenuCard;
