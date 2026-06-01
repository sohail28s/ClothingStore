// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

 // Your new layout file
import Navbar from './Components/Navbar';
import Footer from './Components/Footer'; 
import MainLayout from './Layout/Layout'


// Pages
import Home from './Pages/Home';
import CollectionPage from './Pages/CollectionPage';
import ProductPage from './Pages/ProductPage';
import Checkout from './Pages/Checkout';
import AuthPage from './Pages/Resgister';
import Dashboard from './Components/Dashboard';
import AdminDashboard from './Components/Admin/AdminDashboard';
import TestAPI from './Pages/TestAPI';

// Providers & Guards
import { CartProvider } from './Context/CartContext';
import { AuthProvider } from './Context/AuthContext';
import ProtectedRoute from './utils/PageLoader'; 

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="relative w-full min-h-screen font-central text-nav-dark flex flex-col">
            <Routes>
              
              {/* 🟢 ROUTES WITH NAVBAR & FOOTER (Storefront) */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/collections/:slug" element={<CollectionPage />} />
                <Route path="/products/:slug" element={<ProductPage />} />
                <Route path="/test" element={<TestAPI />} />


                
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              </Route>

              <Route path="/account/login" element={<AuthPage />} />

              <Route 
                path="/admin" 
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } 
              />
              
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}