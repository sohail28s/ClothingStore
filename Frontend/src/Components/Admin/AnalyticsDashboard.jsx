import React, { useState, useEffect, useMemo } from 'react';
import { TrendingUp, Users, Package, Search, ArrowUpDown, DollarSign, Calendar, AlertCircle } from 'lucide-react';

export default function AnalyticsDashboard() {
  const [dateFilter, setDateFilter] = useState('all_time');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Raw Data State
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);

  // Search States
  const [customerSearch, setCustomerSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');

  // Sort States (Defaulting to highest revenue/spend first)
  const [customerSort, setCustomerSort] = useState({ key: 'totalSpent', direction: 'desc' });
  const [productSort, setProductSort] = useState({ key: 'revenue', direction: 'desc' });

  // ==========================================
  // API FETCHING LOGIC WITH DATE PARSING
  // ==========================================
  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      setError('');

      try {
        const token = localStorage.getItem('admin_token');
        const headers = { 'Authorization': `Bearer ${token}` };

        // 1. Calculate Date Ranges
        let queryString = '';
        if (dateFilter !== 'all_time') {
          const end = new Date();
          const start = new Date();
          
          if (dateFilter === 'today') {
            start.setHours(0, 0, 0, 0);
          } else if (dateFilter === '7days') {
            start.setDate(end.getDate() - 7);
          } else if (dateFilter === '30days') {
            start.setDate(end.getDate() - 30);
          }

          const startStr = start.toISOString().split('T')[0];
          const endStr = end.toISOString().split('T')[0];
          queryString = `?startDate=${startStr}&endDate=${endStr}`;
        }

        // 2. Fetch Both Reports Simultaneously
        const [customersRes, productsRes] = await Promise.all([
          fetch(`https://app-backend-msic.onrender.com/api/admin/dashboard/customers${queryString}`, { headers }),
          fetch(`https://app-backend-msic.onrender.com/api/admin/dashboard/product-sales${queryString}`, { headers })
        ]);

        const customersResult = await customersRes.json();
        const productsResult = await productsRes.json();

        if (customersResult.status === 'Success') setCustomers(customersResult.data || []);
        if (productsResult.status === 'Success') setProducts(productsResult.data || []);

      } catch (err) {
        console.error("Analytics fetch error:", err);
        setError('Failed to load analytics data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [dateFilter]);


  // ==========================================
  // FRONTEND FILTERING & SORTING (CUSTOMERS)
  // ==========================================
  const handleCustomerSort = (key) => {
    let direction = 'desc';
    if (customerSort.key === key && customerSort.direction === 'desc') {
      direction = 'asc';
    }
    setCustomerSort({ key, direction });
  };

  const processedCustomers = useMemo(() => {
    let filtered = customers.filter(c => 
      c.customerName.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.email.toLowerCase().includes(customerSearch.toLowerCase())
    );

    return filtered.sort((a, b) => {
      let valA = a[customerSort.key];
      let valB = b[customerSort.key];
      
      // Handle strings vs numbers
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return customerSort.direction === 'asc' ? -1 : 1;
      if (valA > valB) return customerSort.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [customers, customerSearch, customerSort]);


  // ==========================================
  // FRONTEND FILTERING & SORTING (PRODUCTS)
  // ==========================================
  const handleProductSort = (key) => {
    let direction = 'desc';
    if (productSort.key === key && productSort.direction === 'desc') {
      direction = 'asc';
    }
    setProductSort({ key, direction });
  };

  const processedProducts = useMemo(() => {
    let filtered = products.filter(p => 
      p.productName.toLowerCase().includes(productSearch.toLowerCase())
    );

    return filtered.sort((a, b) => {
      let valA = a[productSort.key];
      let valB = b[productSort.key];
      
      if (typeof valA === 'string') valA = valA.toLowerCase();
      if (typeof valB === 'string') valB = valB.toLowerCase();

      if (valA < valB) return productSort.direction === 'asc' ? -1 : 1;
      if (valA > valB) return productSort.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [products, productSearch, productSort]);


  // ==========================================
  // RENDER
  // ==========================================
  return (
    <div className="max-w-[1200px] mx-auto animate-in fade-in duration-300 pb-20">
      
      {/* HEADER & DATE FILTER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-nav-dark pb-6">
        <div>
          <h2 className="font-central text-2xl font-bold uppercase tracking-widest text-nav-dark">Sales & Analytics</h2>
          <p className="font-ballinger text-sm text-gray-500 mt-1">Track customer loyalty and product performance.</p>
        </div>
        
        <div className="flex items-center gap-3 bg-white border border-nav-dark p-1">
          <Calendar className="w-4 h-4 text-nav-dark ml-3" />
          <select 
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="p-2 outline-none font-central text-xs font-bold uppercase tracking-widest bg-white cursor-pointer min-w-[150px]"
          >
            <option value="today">Today</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="all_time">All Time</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 font-ballinger flex items-center gap-2 text-sm">
          <AlertCircle className="w-5 h-5" /> {error}
        </div>
      )}

      <div className="flex flex-col xl:flex-row gap-8">
        
        {/* --- SECTION 1: PRODUCT SALES REPORT --- */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-central text-lg font-bold uppercase tracking-widest flex items-center gap-2">
              <Package className="w-5 h-5" /> Product Performance
            </h3>
            <span className="bg-nav-dark text-white font-central text-[10px] uppercase font-bold tracking-widest px-3 py-1">
              {processedProducts.length} Items
            </span>
          </div>

          <div className="bg-white border border-nav-dark shadow-sm flex flex-col">
            <div className="p-4 border-b border-nav-dark bg-[#f4f2ed]">
              <div className="relative w-full">
                <input 
                  type="text" 
                  placeholder="Search products..." 
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full p-2 pl-9 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm bg-white"
                />
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              <table className="w-full text-left font-ballinger text-sm">
                <thead className="bg-[#f4f2ed] border-b border-nav-dark font-central text-[10px] uppercase tracking-widest text-nav-dark sticky top-0 z-10">
                  <tr>
                    <th className="p-4 font-bold cursor-pointer hover:bg-gray-200 transition-colors" onClick={() => handleProductSort('productName')}>
                      <div className="flex items-center gap-1">Product <ArrowUpDown className="w-3 h-3 text-gray-400"/></div>
                    </th>
                    <th className="p-4 font-bold cursor-pointer hover:bg-gray-200 transition-colors" onClick={() => handleProductSort('unitsSold')}>
                      <div className="flex items-center gap-1">Units Sold <ArrowUpDown className="w-3 h-3 text-gray-400"/></div>
                    </th>
                    <th className="p-4 font-bold cursor-pointer hover:bg-gray-200 transition-colors text-right" onClick={() => handleProductSort('revenue')}>
                      <div className="flex items-center justify-end gap-1">Revenue <ArrowUpDown className="w-3 h-3 text-gray-400"/></div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan="3" className="p-8 text-center text-gray-500 font-central text-xs uppercase tracking-widest">Loading...</td></tr>
                  ) : processedProducts.length === 0 ? (
                    <tr><td colSpan="3" className="p-8 text-center text-gray-500 font-central text-xs uppercase tracking-widest">No product data found.</td></tr>
                  ) : (
                    processedProducts.map((p, idx) => (
                      <tr key={p.productId || idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-4 font-medium text-nav-dark">{p.productName}</td>
                        <td className="p-4">
                          <span className="bg-gray-100 text-nav-dark px-2 py-1 rounded font-bold text-xs">{p.unitsSold}</span>
                        </td>
                        <td className="p-4 text-right font-bold text-green-700">PKR {p.revenue.toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* --- SECTION 2: CUSTOMER SALES REPORT --- */}
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h3 className="font-central text-lg font-bold uppercase tracking-widest flex items-center gap-2">
              <Users className="w-5 h-5" /> Top Customers
            </h3>
            <span className="bg-nav-dark text-white font-central text-[10px] uppercase font-bold tracking-widest px-3 py-1">
              {processedCustomers.length} Users
            </span>
          </div>

          <div className="bg-white border border-nav-dark shadow-sm flex flex-col">
            <div className="p-4 border-b border-nav-dark bg-[#f4f2ed]">
              <div className="relative w-full">
                <input 
                  type="text" 
                  placeholder="Search by name or email..." 
                  value={customerSearch}
                  onChange={(e) => setCustomerSearch(e.target.value)}
                  className="w-full p-2 pl-9 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm bg-white"
                />
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
            </div>

            <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
              <table className="w-full text-left font-ballinger text-sm">
                <thead className="bg-[#f4f2ed] border-b border-nav-dark font-central text-[10px] uppercase tracking-widest text-nav-dark sticky top-0 z-10">
                  <tr>
                    <th className="p-4 font-bold cursor-pointer hover:bg-gray-200 transition-colors" onClick={() => handleCustomerSort('customerName')}>
                      <div className="flex items-center gap-1">Customer <ArrowUpDown className="w-3 h-3 text-gray-400"/></div>
                    </th>
                    <th className="p-4 font-bold cursor-pointer hover:bg-gray-200 transition-colors" onClick={() => handleCustomerSort('noOfOrders')}>
                      <div className="flex items-center gap-1">Orders <ArrowUpDown className="w-3 h-3 text-gray-400"/></div>
                    </th>
                    <th className="p-4 font-bold cursor-pointer hover:bg-gray-200 transition-colors text-right" onClick={() => handleCustomerSort('totalSpent')}>
                      <div className="flex items-center justify-end gap-1">Total Spent <ArrowUpDown className="w-3 h-3 text-gray-400"/></div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan="3" className="p-8 text-center text-gray-500 font-central text-xs uppercase tracking-widest">Loading...</td></tr>
                  ) : processedCustomers.length === 0 ? (
                    <tr><td colSpan="3" className="p-8 text-center text-gray-500 font-central text-xs uppercase tracking-widest">No customer data found.</td></tr>
                  ) : (
                    processedCustomers.map((c, idx) => (
                      <tr key={c.customerId || idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="p-4 flex flex-col">
                          <span className="font-bold text-nav-dark">{c.customerName || "Guest User"}</span>
                          <span className="text-xs text-gray-500">{c.email}</span>
                        </td>
                        <td className="p-4">
                          <span className="bg-nav-dark text-white px-2 py-1 rounded font-bold text-xs">{c.noOfOrders}</span>
                        </td>
                        <td className="p-4 text-right font-bold text-nav-dark">PKR {c.totalSpent.toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}


///real shirt graphcial code 

// import React, { useState, useEffect, useMemo } from 'react';
// import { TrendingUp, Users, Package, Search, ArrowUpDown, DollarSign, Calendar, AlertCircle, Filter } from 'lucide-react';
// import Chart from 'react-apexcharts';

// export default function AnalyticsDashboard() {
//   const [dateFilter, setDateFilter] = useState('all_time');
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState('');

//   // Raw Data State
//   const [customers, setCustomers] = useState([]);
//   const [products, setProducts] = useState([]);

//   // Search & Filter States
//   const [customerSearch, setCustomerSearch] = useState('');
//   const [productSearch, setProductSearch] = useState('');
//   const [masterCategoryFilter, setMasterCategoryFilter] = useState('All');
//   const [productTypeFilter, setProductTypeFilter] = useState('All');

//   // Sort States
//   const [customerSort, setCustomerSort] = useState({ key: 'totalSpent', direction: 'desc' });
//   const [productSort, setProductSort] = useState({ key: 'revenue', direction: 'desc' });

//   // ==========================================
//   // API FETCHING LOGIC
//   // ==========================================
//   useEffect(() => {
//     const fetchAnalytics = async () => {
//       setIsLoading(true);
//       setError('');

//       try {
//         const token = localStorage.getItem('admin_token');
//         const headers = { 'Authorization': `Bearer ${token}` };

//         let queryString = '';
//         if (dateFilter !== 'all_time') {
//           const end = new Date();
//           const start = new Date();
          
//           if (dateFilter === 'today') {
//             start.setHours(0, 0, 0, 0);
//           } else if (dateFilter === '7days') {
//             start.setDate(end.getDate() - 7);
//           } else if (dateFilter === '30days') {
//             start.setDate(end.getDate() - 30);
//           }

//           const startStr = start.toISOString().split('T')[0];
//           const endStr = end.toISOString().split('T')[0];
//           queryString = `?startDate=${startStr}&endDate=${endStr}`;
//         }

//         const [customersRes, productsRes] = await Promise.all([
//           fetch(`https://app-backend-msic.onrender.com/api/admin/dashboard/customers${queryString}`, { headers }),
//           fetch(`https://app-backend-msic.onrender.com/api/admin/dashboard/product-sales${queryString}`, { headers })
//         ]);

//         const customersResult = await customersRes.json();
//         const productsResult = await productsRes.json();

//         if (customersResult.status === 'Success') setCustomers(customersResult.data || []);
//         if (productsResult.status === 'Success') setProducts(productsResult.data || []);

//       } catch (err) {
//         console.error("Analytics fetch error:", err);
//         setError('Failed to load analytics data. Please try again.');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchAnalytics();
//   }, [dateFilter]);


//   // ==========================================
//   // DATA PROCESSING & FILTERING
//   // ==========================================
//   const handleCustomerSort = (key) => {
//     let direction = 'desc';
//     if (customerSort.key === key && customerSort.direction === 'desc') direction = 'asc';
//     setCustomerSort({ key, direction });
//   };

//   const processedCustomers = useMemo(() => {
//     let filtered = customers.filter(c => 
//       c.customerName.toLowerCase().includes(customerSearch.toLowerCase()) ||
//       c.email.toLowerCase().includes(customerSearch.toLowerCase())
//     );

//     return filtered.sort((a, b) => {
//       let valA = a[customerSort.key];
//       let valB = b[customerSort.key];
//       if (typeof valA === 'string') valA = valA.toLowerCase();
//       if (typeof valB === 'string') valB = valB.toLowerCase();
//       if (valA < valB) return customerSort.direction === 'asc' ? -1 : 1;
//       if (valA > valB) return customerSort.direction === 'asc' ? 1 : -1;
//       return 0;
//     });
//   }, [customers, customerSearch, customerSort]);

//   const handleProductSort = (key) => {
//     let direction = 'desc';
//     if (productSort.key === key && productSort.direction === 'desc') direction = 'asc';
//     setProductSort({ key, direction });
//   };

//   const processedProducts = useMemo(() => {
//     let filtered = products.filter(p => p.productName.toLowerCase().includes(productSearch.toLowerCase()));

//     // Apply Master Category Filter (Requires backend to send this field)
//     if (masterCategoryFilter !== 'All') {
//       filtered = filtered.filter(p => p.masterCategory === masterCategoryFilter);
//     }
//     // Apply Product Type Filter (Requires backend to send this field)
//     if (productTypeFilter !== 'All') {
//       filtered = filtered.filter(p => p.productType === productTypeFilter);
//     }

//     return filtered.sort((a, b) => {
//       let valA = a[productSort.key];
//       let valB = b[productSort.key];
//       if (valA < valB) return productSort.direction === 'asc' ? -1 : 1;
//       if (valA > valB) return productSort.direction === 'asc' ? 1 : -1;
//       return 0;
//     });
//   }, [products, productSearch, productSort, masterCategoryFilter, productTypeFilter]);

//   // ==========================================
//   // CHART CONFIGURATIONS (APEX CHARTS)
//   // ==========================================
  
//   // 1. Bar Chart: Top 5 Products by Revenue
//   const topProductsChart = useMemo(() => {
//     const top5 = [...processedProducts].sort((a, b) => b.revenue - a.revenue).slice(0, 5);
//     return {
//       options: {
//         chart: { type: 'bar', toolbar: { show: false }, fontFamily: 'inherit' },
//         plotOptions: { bar: { borderRadius: 4, horizontal: true, distributed: true } },
//         colors: ['#232323', '#4a4a4a', '#757575', '#a3a3a3', '#d1d1d1'],
//         dataLabels: { enabled: true, formatter: (val) => `PKR ${val.toLocaleString()}` },
//         xaxis: { categories: top5.map(p => p.productName), labels: { show: false } },
//         yaxis: { labels: { style: { fontWeight: 'bold' } } },
//         legend: { show: false },
//         tooltip: { y: { formatter: (val) => `PKR ${val.toLocaleString()}` } }
//       },
//       series: [{ name: 'Revenue', data: top5.map(p => p.revenue) }]
//     };
//   }, [processedProducts]);

//   // 2. Donut Chart: Revenue Distribution by Product Type
//   const categoryChart = useMemo(() => {
//     // Group revenue by product type
//     const distribution = processedProducts.reduce((acc, curr) => {
//       const type = curr.productType || 'Uncategorized'; // Fallback if backend hasn't updated yet
//       acc[type] = (acc[type] || 0) + curr.revenue;
//       return acc;
//     }, {});

//     const labels = Object.keys(distribution);
//     const series = Object.values(distribution);

//     return {
//       options: {
//         chart: { type: 'donut', fontFamily: 'inherit' },
//         labels: labels,
//         colors: ['#232323', '#5a31f4', '#a58c69', '#ffc439', '#e0e0e0'],
//         plotOptions: {
//           pie: { donut: { size: '70%', labels: { show: true, total: { show: true, label: 'Total Revenue', formatter: () => `PKR ${series.reduce((a, b) => a + b, 0).toLocaleString()}` } } } }
//         },
//         dataLabels: { enabled: false },
//         legend: { position: 'bottom' },
//         tooltip: { y: { formatter: (val) => `PKR ${val.toLocaleString()}` } }
//       },
//       series: series
//     };
//   }, [processedProducts]);


//   // ==========================================
//   // RENDER
//   // ==========================================
//   return (
//     <div className="max-w-[1200px] mx-auto animate-in fade-in duration-300 pb-20">
      
//       {/* HEADER & GLOBAL FILTERS */}
//       <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-nav-dark pb-6">
//         <div>
//           <h2 className="font-central text-2xl font-bold uppercase tracking-widest text-nav-dark">Sales & Analytics</h2>
//           <p className="font-ballinger text-sm text-gray-500 mt-1">Track performance graphically and filter by category.</p>
//         </div>
        
//         <div className="flex flex-wrap items-center gap-3">
//           {/* Master Category Filter */}
//           <div className="flex items-center bg-white border border-nav-dark p-1">
//             <Filter className="w-4 h-4 text-nav-dark ml-3" />
//             <select 
//               value={masterCategoryFilter}
//               onChange={(e) => setMasterCategoryFilter(e.target.value)}
//               className="p-2 outline-none font-central text-xs font-bold uppercase tracking-widest bg-white cursor-pointer"
//             >
//               <option value="All">All Genders</option>
//               <option value="Men">Men</option>
//               <option value="Women">Women</option>
//             </select>
//           </div>

//           {/* Product Type Filter */}
//           <div className="flex items-center bg-white border border-nav-dark p-1">
//             <Filter className="w-4 h-4 text-nav-dark ml-3" />
//             <select 
//               value={productTypeFilter}
//               onChange={(e) => setProductTypeFilter(e.target.value)}
//               className="p-2 outline-none font-central text-xs font-bold uppercase tracking-widest bg-white cursor-pointer"
//             >
//               <option value="All">All Types</option>
//               <option value="Shirts">Shirts</option>
//               <option value="T-Shirts">T-Shirts</option>
//               <option value="Pants">Pants</option>
//               <option value="Skirts">Skirts</option>
//             </select>
//           </div>

//           {/* Date Range Filter */}
//           <div className="flex items-center bg-nav-dark border border-nav-dark p-1 text-white">
//             <Calendar className="w-4 h-4 ml-3" />
//             <select 
//               value={dateFilter}
//               onChange={(e) => setDateFilter(e.target.value)}
//               className="p-2 outline-none font-central text-xs font-bold uppercase tracking-widest bg-nav-dark text-white cursor-pointer min-w-[130px]"
//             >
//               <option value="today">Today</option>
//               <option value="7days">Last 7 Days</option>
//               <option value="30days">Last 30 Days</option>
//               <option value="all_time">All Time</option>
//             </select>
//           </div>
//         </div>
//       </div>

//       {error && (
//         <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 font-ballinger flex items-center gap-2 text-sm">
//           <AlertCircle className="w-5 h-5" /> {error}
//         </div>
//       )}

//       {/* --- CHARTS SECTION --- */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
//         {/* Chart 1: Top Products Bar Chart */}
//         <div className="bg-white border border-nav-dark shadow-sm p-6">
//           <h3 className="font-central text-sm font-bold uppercase tracking-widest text-nav-dark mb-4 border-b border-gray-100 pb-2">
//             Top Performing Products
//           </h3>
//           {processedProducts.length > 0 ? (
//             <div className="h-[300px]">
//               <Chart options={topProductsChart.options} series={topProductsChart.series} type="bar" height="100%" />
//             </div>
//           ) : (
//             <div className="h-[300px] flex items-center justify-center text-gray-400 font-ballinger text-sm">No data for selected filters</div>
//           )}
//         </div>

//         {/* Chart 2: Revenue Distribution Donut */}
//         <div className="bg-white border border-nav-dark shadow-sm p-6">
//           <h3 className="font-central text-sm font-bold uppercase tracking-widest text-nav-dark mb-4 border-b border-gray-100 pb-2">
//             Revenue by Product Type
//           </h3>
//           {processedProducts.length > 0 ? (
//             <div className="h-[300px] flex items-center justify-center">
//               <Chart options={categoryChart.options} series={categoryChart.series} type="donut" height="100%" />
//             </div>
//           ) : (
//             <div className="h-[300px] flex items-center justify-center text-gray-400 font-ballinger text-sm">No data for selected filters</div>
//           )}
//         </div>

//       </div>

//       {/* --- TABLES SECTION --- */}
//       <div className="flex flex-col xl:flex-row gap-8">
        
//         {/* SECTION 1: PRODUCT SALES REPORT */}
//         <div className="flex-1 flex flex-col gap-4">
//           <div className="flex items-center justify-between">
//             <h3 className="font-central text-lg font-bold uppercase tracking-widest flex items-center gap-2">
//               <Package className="w-5 h-5" /> Product Data
//             </h3>
//           </div>

//           <div className="bg-white border border-nav-dark shadow-sm flex flex-col">
//             <div className="p-4 border-b border-nav-dark bg-[#f4f2ed]">
//               <div className="relative w-full">
//                 <input 
//                   type="text" 
//                   placeholder="Search products..." 
//                   value={productSearch}
//                   onChange={(e) => setProductSearch(e.target.value)}
//                   className="w-full p-2 pl-9 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm bg-white"
//                 />
//                 <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//               </div>
//             </div>

//             <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
//               <table className="w-full text-left font-ballinger text-sm">
//                 <thead className="bg-[#f4f2ed] border-b border-nav-dark font-central text-[10px] uppercase tracking-widest text-nav-dark sticky top-0 z-10">
//                   <tr>
//                     <th className="p-4 font-bold cursor-pointer hover:bg-gray-200" onClick={() => handleProductSort('productName')}>
//                       <div className="flex items-center gap-1">Product <ArrowUpDown className="w-3 h-3 text-gray-400"/></div>
//                     </th>
//                     <th className="p-4 font-bold cursor-pointer hover:bg-gray-200" onClick={() => handleProductSort('unitsSold')}>
//                       <div className="flex items-center gap-1">Units Sold <ArrowUpDown className="w-3 h-3 text-gray-400"/></div>
//                     </th>
//                     <th className="p-4 font-bold cursor-pointer hover:bg-gray-200 text-right" onClick={() => handleProductSort('revenue')}>
//                       <div className="flex items-center justify-end gap-1">Revenue <ArrowUpDown className="w-3 h-3 text-gray-400"/></div>
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {isLoading ? (
//                     <tr><td colSpan="3" className="p-8 text-center text-gray-500 font-central text-xs uppercase tracking-widest">Loading...</td></tr>
//                   ) : processedProducts.length === 0 ? (
//                     <tr><td colSpan="3" className="p-8 text-center text-gray-500 font-central text-xs uppercase tracking-widest">No product data found.</td></tr>
//                   ) : (
//                     processedProducts.map((p, idx) => (
//                       <tr key={p.productId || idx} className="border-b border-gray-100 hover:bg-gray-50">
//                         <td className="p-4 flex flex-col">
//                           <span className="font-medium text-nav-dark">{p.productName}</span>
//                           {/* Shows the type/category beneath the name if the backend sends it */}
//                           <span className="text-xs text-gray-500">{p.masterCategory || 'N/A'} - {p.productType || 'N/A'}</span>
//                         </td>
//                         <td className="p-4"><span className="bg-gray-100 px-2 py-1 font-bold text-xs">{p.unitsSold}</span></td>
//                         <td className="p-4 text-right font-bold text-green-700">PKR {p.revenue.toLocaleString()}</td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//         {/* SECTION 2: CUSTOMER SALES REPORT */}
//         <div className="flex-1 flex flex-col gap-4">
//           <div className="flex items-center justify-between">
//             <h3 className="font-central text-lg font-bold uppercase tracking-widest flex items-center gap-2">
//               <Users className="w-5 h-5" /> Customer Data
//             </h3>
//           </div>

//           <div className="bg-white border border-nav-dark shadow-sm flex flex-col">
//             <div className="p-4 border-b border-nav-dark bg-[#f4f2ed]">
//               <div className="relative w-full">
//                 <input 
//                   type="text" 
//                   placeholder="Search by name or email..." 
//                   value={customerSearch}
//                   onChange={(e) => setCustomerSearch(e.target.value)}
//                   className="w-full p-2 pl-9 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm bg-white"
//                 />
//                 <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//               </div>
//             </div>

//             <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
//               <table className="w-full text-left font-ballinger text-sm">
//                 <thead className="bg-[#f4f2ed] border-b border-nav-dark font-central text-[10px] uppercase tracking-widest text-nav-dark sticky top-0 z-10">
//                   <tr>
//                     <th className="p-4 font-bold cursor-pointer hover:bg-gray-200" onClick={() => handleCustomerSort('customerName')}>
//                       <div className="flex items-center gap-1">Customer <ArrowUpDown className="w-3 h-3 text-gray-400"/></div>
//                     </th>
//                     <th className="p-4 font-bold cursor-pointer hover:bg-gray-200" onClick={() => handleCustomerSort('noOfOrders')}>
//                       <div className="flex items-center gap-1">Orders <ArrowUpDown className="w-3 h-3 text-gray-400"/></div>
//                     </th>
//                     <th className="p-4 font-bold cursor-pointer hover:bg-gray-200 text-right" onClick={() => handleCustomerSort('totalSpent')}>
//                       <div className="flex items-center justify-end gap-1">Spent <ArrowUpDown className="w-3 h-3 text-gray-400"/></div>
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {isLoading ? (
//                     <tr><td colSpan="3" className="p-8 text-center text-gray-500 font-central text-xs uppercase tracking-widest">Loading...</td></tr>
//                   ) : processedCustomers.length === 0 ? (
//                     <tr><td colSpan="3" className="p-8 text-center text-gray-500 font-central text-xs uppercase tracking-widest">No customer data found.</td></tr>
//                   ) : (
//                     processedCustomers.map((c, idx) => (
//                       <tr key={c.customerId || idx} className="border-b border-gray-100 hover:bg-gray-50">
//                         <td className="p-4 flex flex-col">
//                           <span className="font-bold text-nav-dark">{c.customerName || "Guest User"}</span>
//                           <span className="text-xs text-gray-500">{c.email}</span>
//                         </td>
//                         <td className="p-4"><span className="bg-nav-dark text-white px-2 py-1 rounded font-bold text-xs">{c.noOfOrders}</span></td>
//                         <td className="p-4 text-right font-bold text-nav-dark">PKR {c.totalSpent.toLocaleString()}</td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>

//       </div>
//     </div>
//   );
// }