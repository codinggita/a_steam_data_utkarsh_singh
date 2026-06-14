import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import DashboardLayout from '../layouts/DashboardLayout';

// Public Pages
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';

// Protected Pages
import DashboardPage from '../pages/dashboard/DashboardPage';
import OverviewPage from '../pages/dashboard/OverviewPage';
import RegistryPage from '../pages/dashboard/RegistryPage';
import GameDetailsPage from '../pages/games/GameDetailsPage';
import CreateGamePage from '../pages/games/CreateGamePage';
import EditGamePage from '../pages/games/EditGamePage';
import AnalyticsPage from '../pages/dashboard/AnalyticsPage';
import AdminPage from '../pages/dashboard/AdminPage';

import ProtectedRoute from './ProtectedRoute';

export const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="overview" element={<OverviewPage />} />
        <Route path="registry" element={<RegistryPage />} />
        <Route path="game/create" element={<CreateGamePage />} />
        <Route path="game/:id" element={<GameDetailsPage />} />
        <Route path="game/:id/edit" element={<EditGamePage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="admin" element={<AdminPage />} />
      </Route>

      {/* Catch-all redirects to Landing Page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
