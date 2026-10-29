import React from 'react';
import { useLanguage } from '../../features/language/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <p className="font-bold text-white text-base">{t('appName')}</p>
            <p className="text-xs text-stone-400">
              {t('footerDescription')}
            </p>
          </div>
          <div className="text-xs text-stone-400 space-y-1">
            <p>
              © {new Date().getFullYear()} {t('digitalMenuCopyright')}
            </p>
            <p>
              {t('developedBy')} <span className="text-stone-300 font-medium">THORNG VANTHIEV</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
