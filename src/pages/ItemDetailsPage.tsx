import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DataService } from '../services/dataService';
import NotFoundPage from './NotFoundPage';

export const ItemDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const item = slug ? DataService.getMenuItemBySlug(slug) : undefined;

  // Initial variant selection: first available variant if exists, else first variant
  const initialVariant = item?.variants && item.variants.length > 0
    ? (item.variants.find((v) => v.available) || item.variants[0])
    : null;

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

  // Pricing & availability calculation
  const hasVariants = Array.isArray(item.variants) && item.variants.length > 0;
  const isParentAvailable = item.available;
  const isCurrentSelectionAvailable = isParentAvailable && (hasVariants ? (selectedVariant?.available ?? false) : true);
  const currentPriceUsd = hasVariants ? selectedVariant?.priceUsd : item.priceUsd;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs sm:text-sm text-stone-500">
        <Link to="/" className="hover:text-amber-800 transition-colors">
          ទំព័រដើម / Home
        </Link>
        <span>/</span>
        <Link to="/menu" className="hover:text-amber-800 transition-colors">
          បញ្ជីមុខម្ហូប / Menu
        </Link>
        <span>/</span>
        <span className="text-stone-900 font-medium truncate" aria-current="page">
          {item.name.km}
        </span>
      </nav>

      {/* Item Details Card */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-2">
        {/* Media */}
        <div className="aspect-[4/3] md:aspect-auto bg-stone-100 relative overflow-hidden">
          <img
            src={item.images[0] || './images/menu/espresso.svg'}
            alt={item.name.km}
            className="w-full h-full object-cover"
          />
          {!isParentAvailable && (
            <div className="absolute top-4 left-4 bg-stone-900/90 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow backdrop-blur">
              ⚠️ អស់ពីស្តុកបណ្តោះអាសន្ន / Out of Stock
            </div>
          )}
        </div>

        {/* Content & Options */}
        <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {category && (
              <span className="inline-block px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200/60 rounded-full text-xs font-semibold">
                {category.name.km} {category.name.en ? `· ${category.name.en}` : ''}
              </span>
            )}

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
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
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                  ជ្រើសរើសទំហំ / Select Size:
                </label>
                <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Variant size selection">
                  {item.variants.map((variant) => {
                    const isSelected = selectedVariantId === variant.id;
                    const isVariantAvailable = isParentAvailable && variant.available;

                    return (
                      <button
                        key={variant.id}
                        type="button"
                        role="radio"
                        aria-checked={isSelected}
                        disabled={!isVariantAvailable}
                        onClick={() => setSelectedVariantId(variant.id)}
                        className={`p-3 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                          isSelected
                            ? 'border-amber-600 bg-amber-50/80 text-amber-950 font-semibold ring-1 ring-amber-600'
                            : isVariantAvailable
                            ? 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                            : 'border-stone-200 bg-stone-100 text-stone-400 cursor-not-allowed opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span>{variant.name.km}</span>
                          <span className="font-bold text-stone-900">
                            ${variant.priceUsd.toFixed(2)}
                          </span>
                        </div>
                        <div className="text-[11px] text-stone-500 mt-0.5 flex justify-between">
                          <span>{variant.name.en || ''}</span>
                          {!isVariantAvailable && (
                            <span className="text-stone-500 font-semibold">
                              {!isParentAvailable ? 'អស់ពីស្តុក' : 'ទំហំនេះអស់ពីស្តុក'}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Pricing & State Summary */}
          <div className="pt-4 border-t border-stone-200 space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-xs font-semibold text-stone-500 uppercase">
                តម្លៃសរុប / Price:
              </span>
              <div className="text-right">
                <div className="text-2xl font-extrabold text-amber-900">
                  {currentPriceUsd !== undefined ? `$${currentPriceUsd.toFixed(2)}` : 'N/A'}
                </div>
                <div className="text-xs text-stone-500">
                  {/* Currency display will be connected in T07 */}
                  KHR calculated according to policy
                </div>
              </div>
            </div>

            <div className="pt-2">
              {isCurrentSelectionAvailable ? (
                <div className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold text-center flex items-center justify-center space-x-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>មានក្នុងស្តុកស្រាប់ / In Stock & Available</span>
                </div>
              ) : (
                <div className="w-full py-2.5 px-4 rounded-xl bg-stone-100 border border-stone-300 text-stone-700 text-xs font-semibold text-center">
                  ⚠️ មុខម្ហូបនេះអស់ពីស្តុកហើយ / Currently Unavailable
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

