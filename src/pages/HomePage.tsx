import React from 'react';
import { Link } from 'react-router-dom';
import { DataService } from '../services/dataService';

export const HomePage: React.FC = () => {
  const featuredItems = DataService.getFeaturedMenuItems();

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-700 via-amber-800 to-stone-900 text-white p-8 sm:p-12 shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-4">
          <span className="inline-block px-3 py-1 bg-amber-500/20 text-amber-200 border border-amber-400/30 rounded-full text-xs font-medium tracking-wide">
            សូមស្វាគមន៍ / Welcome
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            រសជាតិពិតនៃម្ហូប និងភេសជ្ជៈខ្មែរ
          </h1>
          <p className="text-amber-100/90 text-sm sm:text-base leading-relaxed">
            Authentic taste, refreshing coffee & crafted beverages prepared with love in Siem Reap.
          </p>
          <div className="pt-2">
            <Link
              to="/menu"
              className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-amber-400 text-stone-950 font-semibold text-sm hover:bg-amber-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-400 transition-all shadow-md active:scale-95"
            >
              <span>មើលបញ្ជីមុខម្ហូបទាំងអស់ / View Full Menu</span>
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Items Preview */}
      {featuredItems.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
                មុខម្ហូបប្រចាំហាង / Featured Items
              </h2>
              <p className="text-xs sm:text-sm text-stone-500">
                Special selections loved by our guests
              </p>
            </div>
            <Link
              to="/menu"
              className="text-xs sm:text-sm font-semibold text-amber-700 hover:text-amber-800 underline underline-offset-4"
            >
              មើលទាំងអស់ / View All
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {featuredItems.map((item) => (
              <Link
                key={item.id}
                to={`/menu/${item.slug}`}
                className="group bg-white rounded-xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
              >
                <div className="aspect-[4/3] bg-stone-100 overflow-hidden relative">
                  <img
                    src={item.images[0] || './images/menu/espresso.svg'}
                    alt={item.name.km}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {!item.available && (
                    <div className="absolute top-2 right-2 bg-stone-900/80 text-white text-[11px] font-semibold px-2 py-0.5 rounded backdrop-blur">
                      អស់ពីស្តុក / Sold Out
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-1">
                  <h3 className="font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
                    {item.name.km}
                  </h3>
                  {item.name.en && (
                    <p className="text-xs text-stone-500 font-medium">
                      {item.name.en}
                    </p>
                  )}
                  <div className="pt-2 flex items-center justify-between text-sm">
                    <span className="font-semibold text-amber-900">
                      {item.priceUsd !== undefined ? `$${item.priceUsd.toFixed(2)}` : 'ជម្រើសទំហំ / Variants'}
                    </span>
                    <span className="text-xs text-amber-700 group-hover:underline">
                      ព័ត៌មានលម្អិត &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;

