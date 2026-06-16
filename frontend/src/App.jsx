import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicOnlyRoute, AdminRoute } from './components/RouteGuards';
import Navbar  from './components/Navbar';
import Footer  from './components/Footer';
import AiChat  from './components/AiChat';

import HomePage        from './pages/HomePage';
import LoginPage       from './pages/LoginPage';
import RegisterPage    from './pages/RegisterPage';
import ServicesPage    from './pages/ServicesPage';
import AppointmentPage from './pages/AppointmentPage';
import DashboardPage   from './pages/DashboardPage';
import ContactPage     from './pages/ContactPage';
import AdminPage       from './pages/AdminPage';

import './styles/global.css';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />

        <main id="main-content">
          <Routes>
            {/* Public routes */}
            <Route path="/"         element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact"  element={<ContactPage />} />

            {/* Auth routes — redirect if already logged in */}
            <Route element={<PublicOnlyRoute />}>
              <Route path="/login"    element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Protected routes — require authentication */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard"   element={<DashboardPage />} />
              <Route path="/appointment" element={<AppointmentPage />} />
            </Route>

            {/* Admin only */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
        <AiChat />
      </BrowserRouter>
    </AuthProvider>
  );
}
