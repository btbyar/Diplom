import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store';
import { Login } from './admin/pages/Login';
import { AdminDashboard } from './admin/pages/AdminDashboard';
import { BookingsPage } from './admin/pages/BookingsPage';
import { ServicesPage } from './admin/pages/ServicesPage';
import { PartsPage } from './admin/pages/PartsPage';
import { UsersPage } from './admin/pages/UsersPage';
import { AnalyticsPage } from './admin/pages/AnalyticsPage';
import { VehiclesPage } from './admin/pages/VehiclesPage';
import './App.css';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={isAuthenticated ? <AdminDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/bookings"
          element={isAuthenticated ? <BookingsPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/services"
          element={isAuthenticated ? <ServicesPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/parts"
          element={isAuthenticated ? <PartsPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/users"
          element={isAuthenticated ? <UsersPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/vehicles"
          element={isAuthenticated ? <VehiclesPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/admin/analytics"
          element={isAuthenticated ? <AnalyticsPage /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to={isAuthenticated ? '/admin' : '/login'} />} />
      </Routes>
    </Router>
  );
}

export default App;
