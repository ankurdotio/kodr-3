import React from 'react';
import { Navigate, Outlet } from 'react-router';
import { useAuth } from './AuthContext';

export default function PublicOnlyRoute() {
  const { user } = useAuth();
  
  if (user) {
    return <Navigate to="/projects" replace />;
  }
  
  return <Outlet />;
}
