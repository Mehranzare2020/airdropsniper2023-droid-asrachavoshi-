import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Portfolio from './pages/Portfolio';
import BookStore from './pages/BookStore';
import Journal from './pages/Journal';
import AdminDashboard from './pages/admin/AdminDashboard';
import About from './pages/About';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import NotificationToast from './components/NotificationToast';
import { StoreProvider, useStore } from './context/StoreContext';

const Layout = ({ children }: { children?: React.ReactNode }) => {
  const { language } = useStore();
  const isRTL = language === 'fa' || language === 'ar';
  
  // Font Handling Logic
  let fontClass = 'font-sans'; // Default for en, fr, de, ru, tr
  if (language === 'fa') fontClass = 'font-vazir';
  else if (language === 'ar') fontClass = 'font-arabic';
  else if (language === 'zh') fontClass = 'font-chinese';
  
  return (
    <div className={`antialiased selection:bg-amber-500 selection:text-white flex flex-col min-h-screen ${fontClass}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Navigation />
      <CartDrawer />
      <NotificationToast />
      <div className="flex-grow">
        {children}
      </div>
      <Footer />
    </div>
  );
};

const AppRoutes = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/books" element={<BookStore />} />
        <Route path="/journal" element={<Journal />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <StoreProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </StoreProvider>
  );
};

export default App;