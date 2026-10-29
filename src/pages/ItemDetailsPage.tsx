import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DataService } from '../services/dataService';
import NotFoundPage from './NotFoundPage';
import VariantSelector from '../components/menu/VariantSelector';
import ImageWithFallback from '../components/common/ImageWithFallback';
import { CurrencyService } from '../domain/currency/currencyService';

export const ItemDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const item = slug ? DataService.getMenuItemBySlug(slug) : undefined;
  const siteConfig = useMemo(() => DataService.getSiteConfig(), []);

  // Compute initial variant: pick first available variant if parent is available, else first variant
  const initialVariant = useMemo(() => {
    if (!item?.variants || item.variants.length === 0) return null;
    if (item.available) {
      return item.variants.find((v) => v.available) || item.variants[0];
    }
    return item.variants[0];
  }, [item]);

  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    initialVariant ? initialVariant.id : null
  );

  if (!item) {
    return (
      <NotFoundPage
        title="រកមិនឃើញមុខម្ហូបនេះទេ"
        message={`មុខម្ហូបដែលមានតំណ "${slug}" មិនមាននៅក្នុងប្រព័ន្ធឡើយ។`}
      />
    );
  }

  const category = DataService.getCategoryById(item.categoryId);
  const selectedVariant = item.variants?.find((v) => v.id === selectedVariantId);

  const hasVariants = Array.isArray(item.variants) && item.variants.length > 0;
  const isParentAvailable = item.available;
  const isCurrentSelectionAvailable = isParentAvailable && (hasVariants ? (selectedVariant?.available ?? false) : true);

  const currentPriceUsd = hasVariants
    ? (selectedVariant ? selectedVariant.priceUsd : 0)
    : (item.priceUsd ?? 0);

  const dualPrice = CurrencyService.formatDualPrice(
    currentPriceUsd,
    siteConfig.currency.exchangeRateKhrPerUsd,
    siteConfig.currency.roundingRule
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs sm:text-sm text-stone-500">
        <Link to="/" className="hover:text-amber-800 transition-colors">
          ទំព័រដើម (Home)
        </Link>
        <span>/</span>
        <Link to="/menu" className="hover:text-amber-800 transition-colors">
          បញ្ជីមុខម្ហូប (Menu)
        </Link>
        <span>/</span>
        <span className="text-stone-900 font-semibold truncate" aria-current="page">
          {item.name.km}
        </span>
      </nav>

      {/* Main Item Card */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-2">
        {/* Item Image */}
        <div className="aspect-[4/3] md:aspect-auto bg-stone-100 relative overflow-hidden">
          <ImageWithFallback
            src={item.images[0]}
            alt={item.name.km}
            className="w-full h-full object-cover"
          />
          {!isParentAvailable && (
            <div className="absolute top-4 left-4 bg-stone-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow backdrop-blur flex items-center space-x-1.5">
              <span>⚠️</span>
              <span>អស់ពីស្តុកបណ្តោះអាសន្ន (Out of Stock)</span>
            </div>
          )}
        </div>

        {/* Content & Options */}
        <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {category && (
              <span className="inline-block px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200/60 rounded-full text-xs font-semibold">
                {category.name.km} {category.name.en ? `· ${category.name.en}` : ''}
              </span>
            )}

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                {item.name.km}
              </h1>
              {item.name.en && (
                <p className="text-sm font-medium text-stone-500 mt-1">
                  {item.name.en}
                </p>
              )}
            </div>

            {item.description && (
              <p className="text-stone-600 text-sm leading-relaxed">
                {item.description.km}
              </p>
            )}

            {/* Variants Selector */}
            {hasVariants && item.variants && (
              <div className="pt-2 border-t border-stone-100">
                <VariantSelector
                  variants={item.variants}
                  selectedVariantId={selectedVariantId}
                  onSelectVariant={setSelectedVariantId}
                  parentAvailable={isParentAvailable}
                  locale="km"
                  currencyConfig={siteConfig.currency}
                />
              </div>
            )}
          </div>

          {/* Pricing & Availability Footer */}
          <div className="pt-4 border-t border-stone-200 space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                តម្លៃសរុប (Price):
              </span>
              <div className="text-right">
                <div data-testid="total-price" className="text-2xl sm:text-3xl font-black text-amber-950">
                  {dualPrice.usd}
                </div>
                {dualPrice.khr && (
                  <div className="text-sm font-bold text-stone-600 mt-0.5">
                    {dualPrice.khr}
                  </div>
                )}
              </div>
            </div>

            <div>
              {isCurrentSelectionAvailable ? (
                <div className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold text-center flex items-center justify-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>មានក្នុងស្តុកស្រាប់ (In Stock & Available)</span>
                </div>
              ) : (
                <div className="w-full py-2.5 px-4 rounded-xl bg-stone-100 border border-stone-300 text-stone-700 text-xs font-semibold text-center">
                  ⚠️ មុខម្ហូបនេះអស់ពីស្តុកហើយ (Currently Unavailable)
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetailsPage;
