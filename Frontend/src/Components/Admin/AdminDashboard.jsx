import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, LogOut, TrendingUp, DollarSign, Activity, ArrowUpRight, ClipboardList, Lock, ArrowRight } from 'lucide-react';
import AddProduct from './AddProduct';
import OrderManagement from './OrderManagement';
import InventoryManagement from './InventoryManagement';
import CustomerManagement from './CustomerManagement';
import AnalyticsDashboard from './AnalyticsDashboard'; 
// import SettingsManagement from './SettingManagement';

export default function AdminDashboard() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [metrics, setMetrics] = useState({ totalRevenue: 0, activeOrders: 0, totalCustomers: 0, totalProducts: 0, totalOrders: 0 });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) setIsAdminLoggedIn(true);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      const response = await fetch(import.meta.env.VITE_API_BASE_URL + '/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await response.json();

      if (!response.ok || data.status === "Fail") {
        throw new Error(data.message || 'Invalid admin credentials');
      }

      localStorage.setItem('admin_token', data.token);
      setIsAdminLoggedIn(true);
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAdminLoggedIn(false);
    setLoginEmail('');
    setLoginPassword('');
  };

  // ==========================================
  // --- REAL DASHBOARD DATA LOADING (API) ---
  // ==========================================
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (isAdminLoggedIn && activeTab === 'overview') {
        try {
          const token = localStorage.getItem('admin_token');
          const headers = { 'Authorization': `Bearer ${token}` };

          // 1. Fetch Stats for KPI Cards
          const statsRes = await fetch(import.meta.env.VITE_API_BASE_URL + '/api/admin/dashboard/stats', { headers });
          const statsResult = await statsRes.json();
          if (statsResult.status === 'Success') {
            setMetrics(statsResult.data);
          }

          // 2. Fetch Recent Orders for the Table
          const ordersRes = await fetch(import.meta.env.VITE_API_BASE_URL + '/api/orders', { headers });
          const ordersResult = await ordersRes.json();

          if (ordersResult.status === 'Success' || ordersResult.success) {
            const allOrders = ordersResult.data || [];
            const recentTop5 = allOrders.slice(0, 5).map(order => ({
              orderId: (order.orderId || order._id).substring((order.orderId || order._id).length - 6).toUpperCase(),
              customer: { name: order.customerName || 'N/A' },
              date: order.date || order.createdAt,
              total: order.totalAmount,
              status: order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Processing'
            }));
            setRecentOrders(recentTop5);
          }
        } catch (error) {
          console.error("Error fetching overview data:", error);
        }
      }
    };

    fetchDashboardData();
  }, [activeTab, isAdminLoggedIn]);

  // Added Analytics to the Menu
  const adminMenu = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }, 
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'inventory', label: 'Inventory', icon: ClipboardList },
    { id: 'customers', label: 'Customers', icon: Users },
    // { id: 'settings', label: 'Settings', icon: Settings },
  ];
  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-[#f4f2ed] flex items-center justify-center p-4 font-central">
        <div className="w-full max-w-[400px] bg-white border border-nav-dark shadow-2xl flex flex-col">
          <div className="bg-nav-dark p-6 flex flex-col items-center justify-center border-b border-nav-dark text-[#f4f2ed]">
            <Lock className="w-8 h-8 mb-2" strokeWidth={1.5} />
            <h1 className="text-xl tracking-[0.2em] font-bold uppercase">Restricted Area</h1>
          </div>

          <form onSubmit={handleLogin} className="p-8 flex flex-col gap-5">
            {loginError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 text-[10px] uppercase tracking-widest font-bold leading-relaxed text-center">
                {loginError}
              </div>
            )}
            
            <input 
              type="email" 
              required 
              placeholder="Admin Email" 
              value={loginEmail} 
              onChange={(e) => setLoginEmail(e.target.value)}
              className="w-full bg-transparent border border-nav-dark px-4 py-3 text-xs uppercase tracking-widest outline-none focus:bg-gray-50 transition-colors" 
            />
            
            <input 
              type="password" 
              required 
              placeholder="Password" 
              value={loginPassword} 
              onChange={(e) => setLoginPassword(e.target.value)}
              className="w-full bg-transparent border border-nav-dark px-4 py-3 text-xs uppercase tracking-widest outline-none focus:bg-gray-50 transition-colors" 
            />
            
            <button 
              type="submit" 
              disabled={isLoggingIn}
              className={`mt-4 flex w-full h-[52px] border border-nav-dark group ${isLoggingIn ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className="flex-1 bg-nav-dark flex items-center justify-center font-bold uppercase tracking-widest text-sm text-[#f4f2ed] transition-colors group-hover:bg-black">
                {isLoggingIn ? 'Verifying...' : 'Authorize Access'}
              </div>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f2ed] flex font-ballinger text-nav-dark animate-in fade-in duration-500">

      <aside className="w-[280px] bg-white border-r border-nav-dark flex-col shrink-0 hidden lg:flex">
        <div className="h-20 border-b border-nav-dark flex items-center px-8 bg-[#f4f2ed]">
          <span className="font-central text-2xl tracking-[0.2em] font-bold uppercase">Outrey Admin</span>
        </div>
        <nav className="flex-1 py-8 px-4 flex flex-col gap-2">
          {adminMenu.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-4 px-4 py-3 font-central text-xs font-bold uppercase tracking-widest transition-colors outline-none ${
                  isActive ? 'bg-nav-dark text-white' : 'text-nav-dark hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={1.5} />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-nav-dark">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3 font-central text-xs font-bold uppercase tracking-widest text-red-600 hover:bg-red-50 transition-colors w-full outline-none"
          >
            <LogOut className="w-5 h-5" strokeWidth={1.5} />
            Logout Admin
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b border-nav-dark flex items-center justify-between px-8 shrink-0">
          <h1 className="font-central text-xl font-bold uppercase tracking-widest">
            {adminMenu.find((item) => item.id === activeTab)?.label}
          </h1>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-200 border border-nav-dark flex items-center justify-center font-central text-sm font-bold">
              SZ
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-8">
          
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="max-w-[1200px] mx-auto animate-in fade-in duration-300">
              
              {/* TOP KPI CARDS (Now Clickable) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                
                <div 
                  onClick={() => setActiveTab('analytics')}
                  className="bg-white border border-nav-dark p-6 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors group relative"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-central text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-nav-dark transition-colors">Total Revenue</span>
                    <DollarSign className="w-5 h-5 text-gray-400 group-hover:text-nav-dark transition-colors" />
                  </div>
                  <div className="flex items-end gap-3">
                    <span className="font-central text-3xl font-bold tracking-wider">PKR {metrics.totalRevenue?.toLocaleString()}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity text-nav-dark" />
                </div>
                
                <div 
                  onClick={() => setActiveTab('orders')}
                  className="bg-white border border-nav-dark p-6 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors group relative"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-central text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-nav-dark transition-colors">Active Orders</span>
                    <ShoppingBag className="w-5 h-5 text-gray-400 group-hover:text-nav-dark transition-colors" />
                  </div>
                  <div className="flex items-end gap-3">
                    <span className="font-central text-3xl font-bold tracking-wider">{metrics.activeOrders}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity text-nav-dark" />
                </div>

                <div 
                  onClick={() => setActiveTab('customers')}
                  className="bg-white border border-nav-dark p-6 shadow-sm cursor-pointer hover:bg-gray-50 transition-colors group relative"
                >
                  <div className="flex justify-between items-start mb-4">
                    <span className="font-central text-[10px] font-bold uppercase tracking-widest text-gray-500 group-hover:text-nav-dark transition-colors">Total Customers</span>
                    <Users className="w-5 h-5 text-gray-400 group-hover:text-nav-dark transition-colors" />
                  </div>
                  <div className="flex items-end gap-3">
                    <span className="font-central text-3xl font-bold tracking-wider">{metrics.totalCustomers}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity text-nav-dark" />
                </div>
              </div>

              {/* RECENT ORDERS TABLE */}
              <div className="bg-white border border-nav-dark shadow-sm">
                <div className="p-6 border-b border-nav-dark flex justify-between items-center">
                  <h2 className="font-central text-sm font-bold uppercase tracking-widest">Recent Orders</h2>
                  <button 
                    onClick={() => setActiveTab('orders')}
                    className="flex items-center gap-1 font-central text-[10px] font-bold uppercase tracking-widest text-nav-dark hover:opacity-60 transition-opacity outline-none"
                  >
                    View All <ArrowUpRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-ballinger text-sm">
                    <thead className="bg-[#f4f2ed] border-b border-nav-dark font-central text-[10px] uppercase tracking-widest text-gray-500">
                      <tr>
                        <th className="p-4 font-bold">Order ID</th>
                        <th className="p-4 font-bold">Customer</th>
                        <th className="p-4 font-bold">Date</th>
                        <th className="p-4 font-bold">Total</th>
                        <th className="p-4 font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentOrders.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="p-8 text-center text-gray-500 font-central text-sm uppercase tracking-widest">No orders placed yet.</td>
                        </tr>
                      ) : (
                        recentOrders.map((order, idx) => (
                          <tr key={order.orderId} className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${idx === recentOrders.length - 1 ? 'border-none' : ''}`}>
                            <td className="p-4 font-bold font-central tracking-wider">#{order.orderId}</td>
                            <td className="p-4">{order.customer?.name || 'Guest'}</td>
                            <td className="p-4 text-gray-500">{new Date(order.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                            <td className="p-4 font-bold">PKR {order.total.toLocaleString()}</td>
                            <td className="p-4">
                              <span className={`px-2 py-1 text-[10px] font-central font-bold uppercase tracking-widest border 
                                ${order.status === 'Delivered' ? 'bg-green-100 text-green-700 border-green-200' : 
                                  order.status === 'Shipped' ? 'bg-blue-100 text-blue-700 border-blue-200' : 
                                  order.status === 'Cancelled' ? 'bg-red-100 text-red-700 border-red-200' : 
                                  'bg-yellow-100 text-yellow-700 border-yellow-200'}`}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* --- OTHER TABS --- */}
          {activeTab === 'analytics' && <AnalyticsDashboard />}
          {activeTab === 'products' && <AddProduct onBack={() => setActiveTab('overview')} />}
          {activeTab === 'orders' && <OrderManagement />}
          {activeTab === 'inventory' && <InventoryManagement />}
          {activeTab === 'customers' && <CustomerManagement />}
          {/* {activeTab === 'settings' && <SettingsManagement />} */}
        </div>
      </main>
    </div>
  );
}