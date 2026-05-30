import React from 'react';
import { createBrowserRouter, Navigate } from "react-router";
import RegisterPage from "../features/auth/RegisterPage";
import LoginPage from "../features/auth/LoginPage";
import ProjectsDashboard from "../features/projects/ProjectsDashboard";
import ProjectEditor from "../features/editor/ProjectEditor";
import ProtectedRoute from "../features/auth/ProtectedRoute";
import PublicOnlyRoute from "../features/auth/PublicOnlyRoute";

export const routes = createBrowserRouter([
  // Public-only authentication routes
  {
    element: <PublicOnlyRoute />,
    children: [
      {
        path: "/login",
        element: <LoginPage />
      },
      {
        path: "/register",
        element: <RegisterPage />
      }
    ]
  },
  // Private application routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/projects",
        element: <ProjectsDashboard />
      },
      {
        path: "/project/:sandboxId",
        element: <ProjectEditor />
      }
    ]
  },
  // Fallback redirect
  {
    path: "*",
    element: <Navigate to="/projects" replace />
  }
]);