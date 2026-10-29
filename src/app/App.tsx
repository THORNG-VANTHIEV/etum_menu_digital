import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from '../features/language/LanguageContext';
import AppLayout from '../components/layout/AppLayout';
import HomePage from '../pages/HomePage';
import MenuPage from '../pages/MenuPage';
import ItemDetailsPage from '../pages/ItemDetailsPage';
import NotFoundPage from '../pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path="menu" element={<MenuPage />} />
            <Route path="menu/:slug" element={<ItemDetailsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </LanguageProvider>
  );
};

export default App;
