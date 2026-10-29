import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigationType } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

interface AppLayoutProps {
  children?: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  // Start each newly opened page at the top; keep the browser's position on Back/Forward.
  useEffect(() => {
    if (navigationType !== 'POP') {
      window.scrollTo(0, 0);
    }
  }, [pathname, navigationType]);

  return (
    // overflow-x-clip (not hidden) so the sticky header keeps working
    <div className="min-h-screen flex flex-col bg-stone-50 dark:bg-palm-950 text-stone-900 dark:text-stone-100 font-sans antialiased overflow-x-clip">
      <Header />
      {/* Keyed by path so each newly opened page fades in */}
      <main
        key={pathname}
        className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 motion-safe:animate-fade-in"
      >
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  );
};

export default AppLayout;
