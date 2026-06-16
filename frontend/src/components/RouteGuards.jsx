import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/** Redirects unauthenticated users to /login */
export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  return <Outlet />;
}

/** Redirects already-authenticated users away from login/register */
export function PublicOnlyRoute() {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    // Admins go to /admin by default
    const dest = user?.role === 'ADMIN'
      ? '/admin'
      : location.state?.from?.pathname || '/dashboard';
    return <Navigate to={dest} replace />;
  }
  return <Outlet />;
}

/** Admins only */
export function AdminRoute() {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  if (user?.role !== 'ADMIN') return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
