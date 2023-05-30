// layouts
import { Navigate, useRoutes, useNavigate } from 'react-router-dom';

import { useState, useEffect} from 'react';

import DashboardLayout from './layouts/dashboard';
import SimpleLayout from './layouts/simple';
//
import BlogPage from './pages/BlogPage';
import UserPage from './pages/UserPage';
import LoginPage from './pages/LoginPage';
import Page404 from './pages/Page404';
import ProductsPage from './pages/ProductsPage';
import DashboardAppPage from './pages/DashboardAppPage';
import { API_URL, xApiKey } from './api/api';

// ----------------------------------------------------------------------

export default function Router() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const json = JSON.parse(localStorage.getItem('tokens'));
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    await fetch(`${API_URL}user/me`,{ 
      method: 'GET',
      headers: {
        'x-api-key': xApiKey,
        'x-client-id': user._id,
        'authorization': json.accessToken
      }
    })
      .then((response) => response.json())
      .then(data => {
        console.log(data);
       if (data.status ==='success' || data.status === 200 ) {
        navigate('/dashboard', { replace: true });
       }else{
        navigate('/login', { replace: true });
       }
        
      })
  };
  const routes = useRoutes([
    {
      path: '/login',
      element: <LoginPage />,
      children: [
        { element: <Navigate to="/login" />, index: true},
        { path: 'login', element: <LoginPage /> },
      ]
    },
    {
      path: '/dashboard',
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to="/dashboard/leads" />, index: true},
        { path: 'leads', element: <ProductsPage /> },
     
      ],
    },

    {
      element: <SimpleLayout />,
      children: [
        { element:  <Navigate to="/login" />, index: true },
        { path: '404', element: <Page404 /> },
        { path: '*', element: <Navigate to="/404" /> },
      ],
    },
    {
      path: '*',
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
