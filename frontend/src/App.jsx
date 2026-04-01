import React from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
import { AuthProvider } from './context/AuthContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AnimatedRoutes from './components/AnimatedRoutes';
import ScrollToTop from './components/ScrollToTop';
import AuthModal from './components/AuthModal';
import useSmoothScroll from './hooks/useSmoothScroll';

const Layout = () => {
  useSmoothScroll();
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  const isAuthPage = location.pathname === '/auth' ||
    location.pathname === '/forgot-password' ||
    location.pathname === '/reset-password' ||
    location.pathname === '/checkout' ||
    location.pathname === '/orders';
  const isHomePage = location.pathname === '/';

  return (
    <>
      <ScrollToTop />
      {!isAdminPage && !isAuthPage && <Navbar />}
      <main>
        <AnimatedRoutes />
      </main>
      {isHomePage && <Footer />}
      <AuthModal />
    </>
  );
};

function App() {
  return (
    <div className="app">
      <AuthProvider>
        <OrderProvider>
          <CartProvider>
            <Router>
              <Layout />
            </Router>
          </CartProvider>
        </OrderProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
