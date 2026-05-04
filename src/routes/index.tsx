import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import Dashboard from '../modules/dashboard/pages/DashboardPage';
import Login from '../modules/auth/pages/LoginPage';
import ForgotPassword from '../modules/auth/pages/ForgotPasswordPage';
import AuthGuard from '../components/layout/AuthGuard';
import UsersPage from '../modules/users/pages/UsersPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPassword />,
  },
  {
    path: '/dashboard',
    element: (
      <AuthGuard>
        <MainLayout />
      </AuthGuard>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'users',
        element: <UsersPage />
      }
    ],
  },
]);
