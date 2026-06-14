import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // If we are currently loading auth state, show a basic brutalist loader
  if (loading) {
    return (
      <div className="min-h-screen bg-canvas text-ink flex items-center justify-center font-mono">
        <div className="border-4 border-black p-8 brutalist-shadow bg-white animate-pulse">
          AUTHENTICATING CREDENTIALS...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page and store location for redirect after successful login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
