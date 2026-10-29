import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

interface AppLayoutProps {
  children?: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const location = useLocation();

  const isHome = location.pathname === '/';
  const isMenu = location.pathname.startsWith('/menu');

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans antialiased">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-stone-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center space-x-3 text-stone-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-md p-1"
          >
            <img
              src="./images/branding/logo.svg"
              alt="Restaurant Logo"
              className="w-9 h-9 object-contain"
            />
            <div className="flex flex-col">
              <span className="font-bold text-lg leading-tight tracking-tight text-amber-900">
                អ៊ីទុំ លៀសអប់សៀមរាប
              </span>
              <span className="text-xs text-stone-500 -mt-0.5">
                Cafe & Restaurant
              </span>
            </div>
          </Link>

          <nav className="flex items-center space-x-2 sm:space-x-4">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                isHome
                  ? 'bg-amber-100 text-amber-900'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              ទំព័រដើម / Home
            </Link>
            <Link
              to="/menu"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                isMenu
                  ? 'bg-amber-100 text-amber-900'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              បញ្ជីមុខម្ហូប / Menu
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children || <Outlet />}
      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <p className="font-semibold text-white">អ៊ីទុំ លៀសអប់សៀមរាប</p>
              <p className="text-xs text-stone-400 mt-1">
                ម្ហូបខ្មែរឆ្ងាញ់ពិសា និងភេសជ្ជៈស្រស់ថ្លា • Siem Reap Cafe & Food
              </p>
            </div>
            <div className="text-xs text-stone-400">
              <p>© {new Date().getFullYear()} ម៉ឺនុយឌីជីថល (Digital Menu)</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
