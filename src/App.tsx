import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './store';

// Admin Pages
import { Login as AdminLogin } from './admin/pages/Login';
import { AdminDashboard } from './admin/pages/AdminDashboard';
import { BookingsPage } from './admin/pages/BookingsPage';
import { ServicesPage } from './admin/pages/ServicesPage';
import { PartsPage as AdminPartsPage } from './admin/pages/PartsPage';
import { UsersPage } from './admin/pages/UsersPage';
import { AnalyticsPage } from './admin/pages/AnalyticsPage';
import { VehiclesPage } from './admin/pages/VehiclesPage';

// Client Pages
import { MainLayout } from './components/layout/MainLayout';
import { HomePage } from './pages/HomePage';
import { PartsPage as ClientPartsPage } from './pages/PartsPage';
import { ServicesPage as ClientServicesPage } from './pages/ServicesPage';
import { BookingPage } from './pages/BookingPage';
import { Login as ClientLogin } from './pages/Login';
import { Register as ClientRegister } from './pages/Register';
import { ProfilePage } from './pages/ProfilePage';

import './App.css';

const ThemeManager = () => {
  const location = useLocation();
  
  useEffect(() => {
    if (location.pathname.startsWith('/admin')) {
      document.body.className = 'admin-theme';
    } else {
      document.body.className = 'client-theme';
    }
  }, [location.pathname]);

  return null;
};

function App() {
  const { isAuthenticated, user } = useAuthStore();
  
  // Basic role check
  const isAdmin = isAuthenticated && user?.role === 'admin';

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
          path="/admin/analytics"
          element={isAdmin ? <AnalyticsPage /> : <Navigate to="/admin/login" />}
        />
        
        {/* Public Client Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="parts" element={<ClientPartsPage />} />
          <Route path="services" element={<ClientServicesPage />} />
          <Route path="book" element={<BookingPage />} />
          
          {/* Client Auth Routes */}
          <Route path="login" element={isAuthenticated ? <Navigate to="/" /> : <ClientLogin />} />
          <Route path="register" element={isAuthenticated ? <Navigate to="/" /> : <ClientRegister />} />
          <Route path="profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
