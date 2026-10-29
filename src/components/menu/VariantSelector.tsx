import React from 'react';
import type { MenuVariant, Locale, SiteCurrencyConfig } from '../../types/menu';
import { CurrencyService } from '../../domain/currency/currencyService';
import { uiTranslations } from '../../features/language/translations';

interface VariantSelectorProps {
  variants: MenuVariant[];
  selectedVariantId: string | null;
  onSelectVariant: (variantId: string) => void;
  parentAvailable: boolean;
  locale?: Locale;
  currencyConfig?: SiteCurrencyConfig;
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({
  variants,
  selectedVariantId,
  onSelectVariant,
  parentAvailable,
  locale = 'km',
  currencyConfig,
}) => {
  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
        {uiTranslations.selectSize[locale]}
      </label>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 gap-2.5"
        role="radiogroup"
        aria-label="Menu Item Size Options"
      >
        {variants.map((variant) => {
          const isSelected = selectedVariantId === variant.id;
          // Parent availability strictly overrides variant availability
          const isAvailable = parentAvailable && variant.available;

          const variantName = locale === 'en' && variant.name.en ? variant.name.en : variant.name.km;
          const subName = locale === 'en' ? variant.name.km : variant.name.en;

          const dualPrice = CurrencyService.formatDualPrice(
            variant.priceUsd,
            currencyConfig?.exchangeRateKhrPerUsd,
            currencyConfig?.roundingRule
          );

          return (
            <button
              key={variant.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-disabled={!isAvailable}
              disabled={!isAvailable}
              onClick={() => {
                if (isAvailable) {
                  onSelectVariant(variant.id);
                }
              }}
              className={`p-3.5 rounded-2xl border text-left transition-all active:scale-[0.98] outline-none focus-visible:ring-2 focus-visible:ring-amber-500 relative ${
                isSelected
                  ? 'border-amber-600 bg-amber-50/90 text-amber-950 font-semibold ring-2 ring-amber-600 shadow-xs'
                  : isAvailable
                  ? 'border-stone-200 bg-white hover:bg-stone-50 text-stone-800'
                  : 'border-stone-200 bg-stone-100 text-stone-400 cursor-not-allowed opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">{variantName}</span>
                <span className="font-extrabold text-amber-950 text-sm">
                  {dualPrice.formatted}
                </span>
              </div>

              <div className="text-xs text-stone-500 mt-1 flex items-center justify-between">
                <span>{subName || ''}</span>
                {!isAvailable && (
                  <span className="text-[11px] font-bold text-stone-600 bg-stone-200 px-1.5 py-0.5 rounded">
                    {!parentAvailable
                      ? (locale === 'km' ? 'អស់ពីស្តុក' : 'Out of Stock')
                      : (locale === 'km' ? 'ទំហំនេះអស់' : 'Unavailable')}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default VariantSelector;

