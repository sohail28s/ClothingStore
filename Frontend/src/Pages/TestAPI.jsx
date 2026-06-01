import React, { useState, useEffect } from 'react';

export default function TestAPI() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("Fetching from ${import.meta.env.VITE_API_BASE_URL}/api/products...");
      
      const response = await fetch(import.meta.env.VITE_API_BASE_URL + '/api/products');
      
      // Check if the network request itself failed (e.g., 404, 500)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Raw Backend Response:", result);
      
      setData(result);
    } catch (err) {
      console.error("Fetch failed:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto mt-20 font-sans">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">API Connection Test</h1>
        <button 
          onClick={fetchProducts}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Refetch Data
        </button>
      </div>

      {loading && <div className="p-4 bg-yellow-100 text-yellow-800 rounded">Loading API data...</div>}
      
      {error && (
        <div className="p-4 bg-red-100 text-red-800 rounded mb-4">
          <h3 className="font-bold">Connection Error:</h3>
          <p>{error}</p>
          <p className="text-sm mt-2">Check if your Node server is running on port 5000 and CORS is enabled.</p>
        </div>
      )}

      {data && (
        <div className="space-y-6">
          <div className={`p-4 rounded ${data.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            <strong>Backend Success Status: </strong> {data.success ? "True" : "False"} <br/>
            <strong>Products Found: </strong> {data.count || 0}
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">Product Summary:</h2>
            {data.data && data.data.length === 0 ? (
              <p className="text-gray-500">The database returned an empty array. Do you have any 'published' products?</p>
            ) : (
              <ul className="list-disc pl-5 space-y-1">
                {data.data && data.data.map((p, idx) => (
                  <li key={idx}>
                    <strong>{p.name}</strong> - Status: {p.status} - Category: {p.masterCategory} / {p.productType}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h2 className="text-xl font-bold mb-2">Raw JSON Payload:</h2>
            <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-auto max-h-[500px] text-xs">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}