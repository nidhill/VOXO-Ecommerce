import React, { useEffect } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { AuthProvider } from './context/AuthContext';
import { Analytics } from '@vercel/analytics/react';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AnimatedRoutes from './components/AnimatedRoutes';
import ScrollToTop from './components/ScrollToTop';
import AuthModal from './components/AuthModal';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import CookieConsent from './components/CookieConsent';
import RegisterNudge from './components/RegisterNudge';
import AnnouncementBar from './components/AnnouncementBar';
import PolicyConsentModal from './components/PolicyConsentModal';
import useSmoothScroll from './hooks/useSmoothScroll';

const Layout = () => {
  useSmoothScroll();
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  const isAuthPage = location.pathname === '/auth' ||
    location.pathname === '/forgot-password' ||
    location.pathname === '/reset-password' ||
    location.pathname === '/checkout' ||
    location.pathname === '/orders' ||
    location.pathname === '/profile' ||
    location.pathname === '/privacy-policy';
  const isHomePage = location.pathname === '/';

  return (
    <>
      <ScrollToTop />
      {!isAdminPage && !isAuthPage && <AnnouncementBar />}
      {!isAdminPage && !isAuthPage && <Navbar />}
      <main>
        <AnimatedRoutes />
      </main>
      {!isAdminPage && !isAuthPage && <Footer />}
      {!isAdminPage && <FloatingWhatsApp />}
      {!isAdminPage && <CookieConsent />}
      {!isAdminPage && <RegisterNudge />}
      <AuthModal />
      <PolicyConsentModal />
    </>
  );
};

function App() {
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.body.classList.remove('dark');
    localStorage.removeItem('theme');
  }, []);

  return (
    <div className="app">
      <AuthProvider>
        <OrderProvider>
          <CartProvider>
            <Router>
              <Layout />
              <Analytics />
            </Router>
          </CartProvider>
        </OrderProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
