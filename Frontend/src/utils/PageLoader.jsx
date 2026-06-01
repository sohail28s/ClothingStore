import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext'; // Adjust path if needed

export default function ProtectedRoute({ children }) {
  const { currentUser, token } = useAuth();

  // If there is no user or no token, redirect them to the login page instantly
  if (!currentUser || !token) {
    return <Navigate to="/account/login" replace />;
  }

  // If they are logged in, allow them to view the page
  return children;
}