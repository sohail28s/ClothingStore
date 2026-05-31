import Footer from "../Components/Footer";
import Navbar from "../Components/Navbar";
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';

// 1. Create a Layout component that includes the Navbar and Footer
const MainLayout = () => {
  return (
    <>
      <Navbar />
      <main className="flex-grow">
        {/* Outlet renders whatever child route is currently active */}
        <Outlet />
      </main>
      <Footer />
    </>
  );
};
export default MainLayout;
