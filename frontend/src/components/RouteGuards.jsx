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
  if (isAuthenticated) {
    if (user?.role === 'ADMIN')     return <Navigate to="/admin"     replace />;
    if (user?.role === 'EMPLOYEE')  return <Navigate to="/dashboard" replace />;
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}

/** ADMIN only — anyone else gets bounced to their correct page */
export function AdminRoute() {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  if (user?.role !== 'ADMIN') return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

/** STUDENT only — employees and admins cannot access student pages */
export function StudentRoute() {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  if (user?.role !== 'STUDENT') return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}

/** EMPLOYEE or ADMIN — students cannot access staff pages */
export function StaffRoute() {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  if (user?.role !== 'EMPLOYEE' && user?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}
