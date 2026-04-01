import React from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { OrderProvider } from './context/OrderContext';
<<<<<<< HEAD
import { AdminProvider } from './context/AdminContext';
=======
import { AuthProvider } from './context/AuthContext';

>>>>>>> 2fcbeb1 (Initial clean commit — WAVWAY e-commerce project)
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AnimatedRoutes from './components/AnimatedRoutes';
import ScrollToTop from './components/ScrollToTop';
<<<<<<< HEAD

const Layout = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
=======
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
>>>>>>> 2fcbeb1 (Initial clean commit — WAVWAY e-commerce project)

  return (
    <>
      <ScrollToTop />
<<<<<<< HEAD
      {!isAdminPage && <Navbar />}
      <main>
        <AnimatedRoutes />
      </main>
      {!isAdminPage && <Footer />}
=======
      {!isAdminPage && !isAuthPage && <Navbar />}
      <main>
        <AnimatedRoutes />
      </main>
      {isHomePage && <Footer />}
      <AuthModal />
>>>>>>> 2fcbeb1 (Initial clean commit — WAVWAY e-commerce project)
    </>
  );
};

function App() {
  return (
    <div className="app">
<<<<<<< HEAD
      <AdminProvider>
=======
      <AuthProvider>
>>>>>>> 2fcbeb1 (Initial clean commit — WAVWAY e-commerce project)
        <OrderProvider>
          <CartProvider>
            <Router>
              <Layout />
            </Router>
          </CartProvider>
        </OrderProvider>
<<<<<<< HEAD
      </AdminProvider>
=======
      </AuthProvider>
>>>>>>> 2fcbeb1 (Initial clean commit — WAVWAY e-commerce project)
    </div>
  );
}

export default App;
