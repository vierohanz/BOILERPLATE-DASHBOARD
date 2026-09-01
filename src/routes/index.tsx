import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout, AuthGuard } from '@/components/layout';
import { DashboardPage } from '@/modules/dashboard';
import { LoginPage, ForgotPasswordPage } from '@/modules/auth';
import { UsersPage } from '@/modules/users';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
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
        element: <DashboardPage />,
      },
      {
        path: 'users',
        element: <UsersPage />,
      },
    ],
  },
]);
