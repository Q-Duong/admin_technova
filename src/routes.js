import { Navigate, useRoutes } from 'react-router-dom';
// layouts
import DashboardLayout from './layouts/dashboard';

import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import ErrorPage from './pages/ErrorPage';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import CategoryPage from './pages/CategoryPage';
import BrandPage from './pages/BrandPage';
import NewsPage from './pages/NewsPage';
import AboutCompanyPage from './pages/AboutCompanyPage';
import OrderPage from './pages/OrderPage';
import EmployeePage from './pages/EmployeePage';
import SolutionPage from './pages/SolutionPage';
import TechnovaServicePage from './pages/TechnovaServicePage';
import BannerPage from './pages/BannerPage';

// ----------------------------------------------------------------------

export default function Router() {

  const routes = useRoutes([
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      errorElement: <ErrorPage />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        {
          path: 'app',
          element: 
            <DashboardAppPage />
          
        },
        {
          path: 'user',
          element: 
            <UserPage />
          
        },
        {
          path: 'product', element: 
            <ProductsPage />
          
        },
        {
          path: 'category', element: 
            <CategoryPage />
          
        },
        {
          path: 'brand', element: 
            <BrandPage />
          
        },
        {
          path: 'news', element: 
            <NewsPage />
          
        },
        {
          path: 'about-company', element: 
            <AboutCompanyPage />
          
        },
        {
          path: 'solution', element: 
            <SolutionPage />
          
        },
        {
          path: 'order', element: 
            <OrderPage />
          
        },
        {
          path: 'user', element: 
            <UserPage />
          
        },
        {
          path: 'employee', element: 
            <EmployeePage />
          
        },
        {
          path: 'technova-service', element: 
            <TechnovaServicePage />
          
        },
        {
          path: 'banner', element: 
            <BannerPage />
          
        },
      ],
    },
    {
      path: 'login',
      element: <LoginPage />,
    },
    {
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },
        { path: 'error', element: <ErrorPage /> },
        { path: '*', element: <Navigate to="/error" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/error" replace />,
    },
  ]);

  return routes;
}
 