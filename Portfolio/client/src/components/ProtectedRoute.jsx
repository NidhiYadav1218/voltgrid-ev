import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function ProtectedRoute({ children, role }) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-emerald-400">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium tracking-wide">Validating session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    const target = role === 'vendor' ? '/vendor/login' : role === 'admin' ? '/admin/login' : '/login';
    return <Navigate to={target} state={{ from: location }} replace />;
  }

  if (role && user?.role !== role && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
