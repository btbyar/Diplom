import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore, useAdminAuthStore, useThemeStore } from './store';

// Admin Pages
import { Login as AdminLogin } from './admin/pages/Login';
import { AdminDashboard } from './admin/pages/AdminDashboard';
import { BookingsPage } from './admin/pages/BookingsPage';
import { ServicesPage } from './admin/pages/ServicesPage';
import { PartsPage as AdminPartsPage } from './admin/pages/PartsPage';
import { UsersPage } from './admin/pages/UsersPage';
import { AnalyticsPage } from './admin/pages/AnalyticsPage';
import { VehiclesPage } from './admin/pages/VehiclesPage';
import { PaymentsPage } from './admin/pages/PaymentsPage';
import { OrdersPage } from './admin/pages/OrdersPage';

// Client Pages
import { MainLayout } from './components/layout/MainLayout';
import { HomePage } from './pages/HomePage';
import { PartsPage as ClientPartsPage } from './pages/PartsPage';
import { ServicesPage as ClientServicesPage } from './pages/ServicesPage';
import { BookingPage } from './pages/BookingPage';
import { Login as ClientLogin } from './pages/Login';
import { Register as ClientRegister } from './pages/Register';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { ProfilePage } from './pages/ProfilePage';
import { PaymentSuccess } from './pages/PaymentSuccess';
import { PaymentCancelled } from './pages/PaymentCancelled';
import { CheckoutPage } from './pages/CheckoutPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

import './App.css';

const ThemeManager = () => {
  const location = useLocation();
  const { theme } = useThemeStore();

  useEffect(() => {
    if (location.pathname.startsWith('/admin')) {
      document.body.className = 'admin-theme';
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.body.className = 'client-theme';
      document.documentElement.setAttribute('data-theme', theme);
    }
  }, [location.pathname, theme]);

  return null;
};

function App() {
  const { isAuthenticated: isClientAuthenticated } = useAuthStore();
  const { isAuthenticated: isAdminAuthenticated, user: adminUser } = useAdminAuthStore();

  // Basic role check
  const isAdmin = isAdminAuthenticated && adminUser?.role === 'admin';

  return (
    <Router>
      <ThemeManager />
      <Routes>
        {/* Admin Auth Route */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Routes - Protected */}
        <Route
          path="/admin"
          element={isAdmin ? <AdminDashboard /> : <Navigate to="/admin/login" />}
        />
        <Route
          path="/admin/bookings"
          element={isAdmin ? <BookingsPage /> : <Navigate to="/admin/login" />}
        />
        <Route
          path="/admin/orders"
          element={isAdmin ? <OrdersPage /> : <Navigate to="/admin/login" />}
        />
        <Route
          path="/admin/services"
          element={isAdmin ? <ServicesPage /> : <Navigate to="/admin/login" />}
        />
        <Route
          path="/admin/parts"
          element={isAdmin ? <AdminPartsPage /> : <Navigate to="/admin/login" />}
        />
        <Route
          path="/admin/users"
          element={isAdmin ? <UsersPage /> : <Navigate to="/admin/login" />}
        />
        <Route
          path="/admin/vehicles"
          element={isAdmin ? <VehiclesPage /> : <Navigate to="/admin/login" />}
        />
        <Route
          path="/admin/payments"
          element={isAdmin ? <PaymentsPage /> : <Navigate to="/admin/login" />}
        />
        <Route
          path="/admin/analytics"
          element={isAdmin ? <AnalyticsPage /> : <Navigate to="/admin/login" />}
        />

        {/* Public Client Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="parts" element={<ClientPartsPage />} />
          <Route path="services" element={<ClientServicesPage />} />
          <Route path="book" element={<BookingPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="payment-success" element={<PaymentSuccess />} />
          <Route path="payment-cancelled" element={<PaymentCancelled />} />

          {/* Client Auth Routes */}
          <Route path="login" element={isClientAuthenticated ? <Navigate to="/" /> : <ClientLogin />} />
          <Route path="register" element={isClientAuthenticated ? <Navigate to="/" /> : <ClientRegister />} />
          <Route path="forgot-password" element={isClientAuthenticated ? <Navigate to="/" /> : <ForgotPasswordPage />} />
          <Route path="reset-password/:token" element={isClientAuthenticated ? <Navigate to="/" /> : <ResetPasswordPage />} />
          <Route path="profile" element={isClientAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} />
        </Route>
      </Routes>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(10, 22, 40, 0.95)',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            backdropFilter: 'blur(12px)',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </Router>
  );
}

export default App;
