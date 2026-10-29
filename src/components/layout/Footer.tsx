import React from 'react';

interface FooterProps {
  currentLocale?: 'km' | 'en';
}

export const Footer: React.FC<FooterProps> = ({ currentLocale = 'km' }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="space-y-1">
            <p className="font-bold text-white text-base">អ៊ីទុំ លៀសអប់សៀមរាប</p>
            <p className="text-xs text-stone-400">
              {currentLocale === 'km'
                ? 'ម្ហូបខ្មែរឆ្ងាញ់ពិសា និងភេសជ្ជៈស្រស់ថ្លា • ក្រុងសៀមរាប'
                : 'Authentic Khmer food & refreshing beverages • Siem Reap'}
            </p>
          </div>
          <div className="text-xs text-stone-400">
            <p>
              © {new Date().getFullYear()} {currentLocale === 'km' ? 'ម៉ឺនុយឌីជីថល' : 'Digital Menu'}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

