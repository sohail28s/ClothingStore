import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // 1. Initialize token from LocalStorage
  const [token, setToken] = useState(() => localStorage.getItem('outrey_token') || null);
  
  // 2. Initialize the full user profile from LocalStorage so it survives page refreshes
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('outrey_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [userId, setUserId] = useState(null);

  // Automatically decode the token whenever it changes to extract the user ID
  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserId(payload.id); 
      } catch (error) {
        console.error("Invalid token detected:", error);
        logout(); // Auto-logout if the token is corrupted
      }
    } else {
      setUserId(null);
    }
  }, [token]);

  // --- LOGIN FUNCTION ---
  // It now takes BOTH the VIP wristband (token) AND the user's profile data
  const login = (newToken, userData) => {
    setToken(newToken);
    setCurrentUser(userData); // Save to React State
    
    localStorage.setItem('outrey_token', newToken);
    localStorage.setItem('outrey_user', JSON.stringify(userData)); // Save to browser storage
  };

  // --- LOGOUT FUNCTION ---
  const logout = () => {
    setToken(null);
    setUserId(null);
    setCurrentUser(null);
    
    localStorage.removeItem('outrey_token');
    localStorage.removeItem('outrey_user');
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ token, userId, currentUser, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};