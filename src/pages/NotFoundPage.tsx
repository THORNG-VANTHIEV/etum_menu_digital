import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../features/language/LanguageContext';

interface NotFoundPageProps {
  title?: string;
  message?: string;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  title,
  message,
}) => {
  const { t } = useLanguage();

  const displayTitle = title || t('pageNotFoundTitle');
  const displayMessage = message || t('pageNotFoundMessage');

  return (
    <div className="py-16 flex flex-col items-center justify-center text-center px-4">
      <div className="w-20 h-20 bg-amber-100 rounded-3xl flex items-center justify-center text-amber-800 text-3xl font-black mb-6 shadow-inner">
        404
      </div>
      <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mb-3">
        {displayTitle}
      </h1>
      <p className="text-stone-600 max-w-md text-sm sm:text-base leading-relaxed mb-8">
        {displayMessage}
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          to="/menu"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-semibold text-sm transition-all shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2"
        >
          {t('backToMenu')}
        </Link>
        <Link
          to="/"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white border border-stone-300 hover:bg-stone-50 text-stone-700 font-semibold text-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
        >
          {t('backToHome')}
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
