// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Navbar from './Components/Navbar';
// import Footer from './Components/Footer';
// import Home from './Pages/Home';
// import CollectionPage from './Pages/CollectionPage';
// import ProductPage from './Pages/ProductPage';
// import { CartProvider } from './Context/CartContext';
// import { AuthProvider } from './Context/AuthContext';
// import Checkout from './Pages/Checkout'
// import AuthPage from './Pages/Resgister';
// import Dashboard from './Components/Dashboard';
// import AdminDashboard from './Components/Admin/AdminDashboard';
// import TestAPI from './Pages/TestAPI';

// export default function App() {
//   return (
//     <AuthProvider>
//     <CartProvider>
//     <Router>
//       <div className="relative w-full min-h-screen font-central text-nav-dark flex flex-col">
//         <Navbar />
//         <main className="flex-grow">
//           <Routes>
          
//             <Route path="/" element={<Home />} />
//             <Route path="/collections/:slug" element={<CollectionPage />} />
//             <Route path="/products/:slug" element={<ProductPage />} />
//             <Route path="/checkout" element={<Checkout/>} />
//             <Route path="/account/login" element={<AuthPage/>} />
//             <Route path="/dashboard" element={<Dashboard/>}/>
//             <Route path="/admin" element={<AdminDashboard />} />
//             <Route path="/test" element={<TestAPI />} />
//           </Routes>
//         </main>
//         <Footer />
//       </div>
//     </Router>
//     </CartProvider>
//     </AuthProvider>
//   );
// }


import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Home from './Pages/Home';
import CollectionPage from './Pages/CollectionPage';
import ProductPage from './Pages/ProductPage';
import { CartProvider } from './Context/CartContext';
import { AuthProvider } from './Context/AuthContext';
import Checkout from './Pages/Checkout';
import AuthPage from './Pages/Resgister'; // Note: your file is named Resgister
import Dashboard from './Components/Dashboard';
import AdminDashboard from './Components/Admin/AdminDashboard';
import TestAPI from './Pages/TestAPI';
import MainLayout from './Layout/Layout';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="relative w-full min-h-screen font-central text-nav-dark flex flex-col">
            <Routes>
              
              {/* === ROUTES WITHOUT NAVBAR & FOOTER === */}
              <Route path="/account/login" element={<AuthPage />} />

              {/* === ROUTES WITH NAVBAR & FOOTER === */}
              {/* We wrap these in our MainLayout */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/collections/:slug" element={<CollectionPage />} />
                <Route path="/products/:slug" element={<ProductPage />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/test" element={<TestAPI />} />
              </Route>

            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}