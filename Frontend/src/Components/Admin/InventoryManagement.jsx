import React, { useState, useEffect } from 'react';
import { Search, Package, AlertTriangle, Save, RefreshCw, Edit2, Trash2, X, Plus, Upload, ArrowLeft, SlidersHorizontal, CheckCircle } from 'lucide-react';

// --- DYNAMIC CATEGORY LOGIC ---
const categoryTree = {
  Men: ['Shirts', 'T-Shirts', 'Pants'],
  Women: ['Shirts', 'Skirts', 'Pants']
};

const getDefaultSizes = (productType) => {
  if (productType === 'Pants') {
    return [{ size: '28', stock: 0 }, { size: '30', stock: 0 }, { size: '32', stock: 0 }, { size: '34', stock: 0 }, { size: '36', stock: 0 }];
  }
  return [{ size: 'S', stock: 0 }, { size: 'M', stock: 0 }, { size: 'L', stock: 0 }];
};

export default function InventoryManagement() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showLowStock, setShowLowStock] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Custom Notification Modal State (Replaces alert)
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // Filter & Sort States
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    masterCategory: 'All',
    productType: 'All',
    minPrice: '',
    maxPrice: '',
    sortBy: 'newest' // newest, oldest, priceHighLow, priceLowHigh
  });
  
  // Local state for stock inputs
  const [stockInputs, setStockInputs] = useState({});
  const [savingSku, setSavingSku] = useState(null);

  // Edit Mode States
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [formData, setFormData] = useState(null);

  // Helper to show custom alerts
  const notify = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    // Auto-hide success messages after a short delay
    if (type === 'success') {
      setTimeout(() => setNotification({ show: false, message: '', type: 'success' }), 2500);
    }
  };

  // ==========================================
  // 1. DATA LOADING (NOW SECURE FOR ADMINS)
  // ==========================================
  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('admin_token');
      // Passing the token ensures the backend sends Draft products too!
      const response = await fetch(import.meta.env.VITE_API_BASE_URL + '/api/products', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();

      if (!response.ok) throw new Error(result.message || 'Failed to fetch inventory');

      setProducts(result.data);

      const initialStocks = {};
      result.data.forEach(p => {
        p.variants.forEach(v => {
          v.sizes.forEach(s => {
            const sku = `${p._id}-${v._id}-${s._id}`;
            initialStocks[sku] = s.stock;
          });
        });
      });
      setStockInputs(initialStocks);

    } catch (error) {
      console.error("Error loading inventory:", error);
      notify("Failed to load inventory from server.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // ==========================================
  // 2. QUICK ACTIONS (STOCK, STATUS, DELETE)
  // ==========================================
  const handleStockChange = (sku, value) => {
    setStockInputs(prev => ({ ...prev, [sku]: Math.max(0, parseInt(value) || 0) }));
  };

  const handleSaveStock = async (productId, variantId, sizeId, sku) => {
    setSavingSku(sku);
    try {
      const token = localStorage.getItem('admin_token');
      const newStock = stockInputs[sku];

      const response = await fetch(`https://app-backend-msic.onrender.com/api/products/${productId}/variants/${variantId}/sizes/${sizeId}/stock`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ stock: newStock })
      });

      if (!response.ok) throw new Error('Failed to update stock');
      
      notify("Stock updated successfully!", "success");
      loadInventory();
    } catch (error) {
      console.error(error);
      notify("Error saving stock.", "error");
    } finally {
      setSavingSku(null);
    }
  };

  const handleStatusChange = async (productId, newStatus) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`https://app-backend-msic.onrender.com/api/products/${productId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Failed to update status');
      
      notify(`Product status changed to ${newStatus}.`, "success");
      loadInventory();
    } catch (error) {
      console.error(error);
      notify("Error updating status.", "error");
    }
  };

  const handleDeleteProduct = async (productId) => {
    // We keep this confirmation alert because deleting a product is highly destructive
    if (!window.confirm("CRITICAL WARNING: Are you sure you want to completely delete this product and all its variants? This cannot be undone.")) return;
    
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`https://app-backend-msic.onrender.com/api/products/${productId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error('Failed to delete product');
      
      notify("Product deleted permanently.", "success");
      loadInventory();
    } catch (error) {
      console.error(error);
      notify("Error deleting product.", "error");
    }
  };

  // ==========================================
  // 3. FULL EDIT PRODUCT LOGIC
  // ==========================================
  const startEditing = (product) => {
    const mappedVariants = product.variants.map(v => {
      const images = [null, null, null];
      if (v.images) {
        v.images.forEach((img, i) => {
          if (i < 3) images[i] = { file: null, preview: `https://app-backend-msic.onrender.com/${img.replace(/\\/g, '/')}`, original: img };
        });
      }
      return {
        _id: v._id, colorName: v.colorName, hexCode: v.hexCode,
        sizes: v.sizes.map(s => ({ _id: s._id, size: s.size, stock: s.stock })),
        images: images
      };
    });

    setFormData({
      _id: product._id, name: product.name, description: product.description, material: product.material,
      fit: product.fit, masterCategory: product.masterCategory, productType: product.productType,
      price: product.price, isOnSale: product.isOnSale, status: product.status,
      tags: product.tags.join(', '), variants: mappedVariants
    });

    setEditingProduct(product._id);
  };

  const handleEditFormInput = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleEditTypeChange = (e) => {
    const newType = e.target.value;
    setFormData({ 
      ...formData, productType: newType,
      variants: formData.variants.map(v => ({ ...v, sizes: getDefaultSizes(newType) }))
    });
  };

  const handleEditImageUpload = (vIdx, slotIdx, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    const updatedVariants = [...formData.variants];
    updatedVariants[vIdx].images[slotIdx] = { file: file, preview: previewUrl, original: null };
    setFormData({ ...formData, variants: updatedVariants });
  };

  const removeEditImage = (vIdx, slotIdx) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[vIdx].images[slotIdx] = null;
    setFormData({ ...formData, variants: updatedVariants });
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    setIsSavingEdit(true);

    try {
      const token = localStorage.getItem('admin_token');
      const formPayload = new FormData();

      formPayload.append('name', formData.name);
      formPayload.append('description', formData.description);
      formPayload.append('material', formData.material);
      formPayload.append('fit', formData.fit);
      formPayload.append('masterCategory', formData.masterCategory);
      formPayload.append('productType', formData.productType);
      formPayload.append('price', Number(formData.price));
      formPayload.append('isOnSale', formData.isOnSale);
      formPayload.append('status', formData.status);

      const formattedTags = formData.tags.split(',').map(t => t.trim()).filter(t => t !== '').slice(0, 3);
      formPayload.append('tags', JSON.stringify(formattedTags));

      const cleanVariants = formData.variants.map(v => ({
        _id: v._id, colorName: v.colorName, hexCode: v.hexCode, sizes: v.sizes,
        images: v.images.map(img => img && !img.file ? img.original : null).filter(Boolean)
      }));
      formPayload.append('variants', JSON.stringify(cleanVariants));

      formData.variants.forEach((v) => {
        v.images.forEach((imgObj) => {
          if (imgObj && imgObj.file) formPayload.append('images', imgObj.file);
        });
      });

      const response = await fetch(`https://app-backend-msic.onrender.com/api/products/${formData._id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formPayload
      });

      if (!response.ok) throw new Error('Failed to update product');

      notify("Product updated successfully!", "success");
      setEditingProduct(null);
      loadInventory();

    } catch (error) {
      console.error(error);
      notify("Error updating product.", "error");
    } finally {
      setIsSavingEdit(false);
    }
  };

  // ==========================================
  // 4. FRONTEND FILTERING & SORTING LOGIC
  // ==========================================
  let processedProducts = products.filter(product => {
    // 1. Search Check
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // 2. Low Stock Check (Product must have at least one variant size <= 5)
    const isLowStock = product.variants.some(v => v.sizes.some(s => s.stock <= 5));
    const matchesLowStock = showLowStock ? isLowStock : true;

    // 3. Category & Type Check
    const matchesCat = filters.masterCategory === 'All' || product.masterCategory === filters.masterCategory;
    const matchesType = filters.productType === 'All' || product.productType === filters.productType;

    // 4. Price Check
    const meetsMin = filters.minPrice === '' || product.price >= Number(filters.minPrice);
    const meetsMax = filters.maxPrice === '' || product.price <= Number(filters.maxPrice);

    return matchesSearch && matchesLowStock && matchesCat && matchesType && meetsMin && meetsMax;
  });

  // Apply Sorting
  processedProducts.sort((a, b) => {
    if (filters.sortBy === 'newest') return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    if (filters.sortBy === 'oldest') return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
    if (filters.sortBy === 'priceHighLow') return b.price - a.price;
    if (filters.sortBy === 'priceLowHigh') return a.price - b.price;
    return 0;
  });

  // Calculate Product Type dropdown options for the filter based on selected Master Category
  const availableFilterTypes = filters.masterCategory === 'All' 
    ? Array.from(new Set([...categoryTree.Men, ...categoryTree.Women])) 
    : categoryTree[filters.masterCategory];

  // ==========================================
  // VIEW RENDERS
  // ==========================================
  
  // Custom Notification Modal
  const NotificationOverlay = () => (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 animate-in fade-in duration-200">
      <div className="bg-white border border-nav-dark shadow-2xl p-8 max-w-[400px] w-full flex flex-col items-center text-center animate-in zoom-in-95 duration-200">
        {notification.type === 'error' ? (
          <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        ) : (
          <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
        )}
        <h3 className="font-central text-lg font-bold uppercase tracking-widest mb-2">
          {notification.type === 'error' ? 'Action Failed' : 'Success'}
        </h3>
        <p className="font-ballinger text-gray-600 mb-8">{notification.message}</p>
        <button 
          onClick={() => setNotification({ show: false, message: '', type: 'success' })}
          className="w-full bg-nav-dark text-white p-4 font-central text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors"
        >
          Acknowledge
        </button>
      </div>
    </div>
  );

  // Full Edit Form View
  if (editingProduct && formData) {
    return (
      <div className="max-w-[1200px] mx-auto animate-in fade-in duration-300 pb-20">
        {notification.show && <NotificationOverlay />}
        
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => setEditingProduct(null)} className="p-2 border border-nav-dark hover:bg-gray-100 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="font-central text-2xl font-bold uppercase tracking-widest">Edit Product</h2>
          </div>
          <button onClick={submitEdit} disabled={isSavingEdit} className={`flex items-center gap-2 text-white px-6 py-3 font-central text-xs font-bold uppercase tracking-widest transition-colors ${isSavingEdit ? 'bg-gray-400 cursor-not-allowed' : 'bg-nav-dark hover:bg-black'}`}>
            <Save className="w-4 h-4" /> {isSavingEdit ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

        <form className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 flex flex-col gap-8">
            <div className="bg-white border border-nav-dark p-6 shadow-sm flex flex-col gap-5">
              <h3 className="font-central text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-3">General Information</h3>
              <div>
                <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Product Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleEditFormInput} required className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm" />
              </div>
              <div>
                <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Description</label>
                <textarea name="description" value={formData.description} onChange={handleEditFormInput} rows="4" className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Material</label>
                  <input type="text" name="material" value={formData.material} onChange={handleEditFormInput} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm" />
                </div>
                <div>
                  <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Product Type (Warning: Changing alters sizes)</label>
                  <select name="productType" value={formData.productType} onChange={handleEditTypeChange} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm bg-white cursor-pointer">
                    {categoryTree[formData.masterCategory].map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white border border-nav-dark p-6 shadow-sm flex flex-col gap-5">
              <h3 className="font-central text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-3">Variants (Colors & Sizes)</h3>
              <div className="flex flex-col gap-6">
                {formData.variants.map((variant, vIdx) => (
                  <div key={vIdx} className="border border-gray-200 bg-[#fbfbfb] p-4 relative">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="font-central text-[9px] uppercase tracking-widest font-bold text-gray-500 mb-1 block">Color Name</label>
                        <input type="text" value={variant.colorName} onChange={(e) => { const v = [...formData.variants]; v[vIdx].colorName = e.target.value; setFormData({...formData, variants: v}); }} required className="w-full p-2 border border-gray-300 outline-none font-ballinger text-sm" />
                      </div>
                      <div>
                        <label className="font-central text-[9px] uppercase tracking-widest font-bold text-gray-500 mb-1 block">Hex Code</label>
                        <div className="flex gap-2">
                          <input type="color" value={variant.hexCode} onChange={(e) => { const v = [...formData.variants]; v[vIdx].hexCode = e.target.value; setFormData({...formData, variants: v}); }} className="w-10 h-10 border border-gray-300 cursor-pointer" />
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <label className="font-central text-[9px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Images (Max 3 per color)</label>
                      <div className="grid grid-cols-3 gap-4">
                        {[0, 1, 2].map((slotIndex) => {
                          const imageObj = variant.images[slotIndex];
                          return (
                            <div key={slotIndex} className="relative w-full aspect-square border-2 border-dashed border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center overflow-hidden group">
                              {imageObj && imageObj.preview ? (
                                <>
                                  <img src={imageObj.preview} alt="Variant" className="w-full h-full object-cover" />
                                  <button type="button" onClick={() => removeEditImage(vIdx, slotIndex)} className="absolute top-2 right-2 bg-white/90 p-1.5 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity border border-gray-200 shadow-sm"><X className="w-4 h-4" /></button>
                                </>
                              ) : (
                                <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center text-gray-400 hover:text-nav-dark">
                                  <Upload className="w-5 h-5 mb-1" />
                                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleEditImageUpload(vIdx, slotIndex, e)} />
                                </label>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[350px] flex flex-col gap-8 shrink-0">
            <div className="bg-white border border-nav-dark p-6 shadow-sm flex flex-col gap-5">
              <h3 className="font-central text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-3">Pricing & Tags</h3>
              <div>
                <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Price (PKR)</label>
                <input type="number" name="price" value={formData.price} onChange={handleEditFormInput} required className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm font-bold" />
              </div>
              <label className="flex items-center gap-3 cursor-pointer mb-2">
                <input type="checkbox" name="isOnSale" checked={formData.isOnSale} onChange={handleEditFormInput} className="w-4 h-4 accent-nav-dark" />
                <span className="font-ballinger text-sm">Product is on Sale</span>
              </label>
              <div>
                <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Tags (Comma Separated)</label>
                <input type="text" name="tags" value={formData.tags} onChange={handleEditFormInput} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm" />
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }

  // ==========================================
  // VIEW: MAIN INVENTORY DASHBOARD
  // ==========================================
  return (
    <div className="max-w-[1200px] mx-auto animate-in fade-in duration-300 pb-20 relative">
      {notification.show && <NotificationOverlay />}

      {/* FILTER MODAL */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white w-full max-w-[500px] shadow-2xl relative border border-nav-dark animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-[#f4f2ed]">
              <h2 className="font-central text-lg font-bold uppercase tracking-widest">Filter & Sort</h2>
              <button onClick={() => setIsFilterModalOpen(false)} className="hover:opacity-60 transition-opacity"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 flex flex-col gap-6 font-ballinger">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Category</label>
                  <select value={filters.masterCategory} onChange={(e) => setFilters({...filters, masterCategory: e.target.value, productType: 'All'})} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark bg-white">
                    <option value="All">All Categories</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                  </select>
                </div>
                <div>
                  <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Product Type</label>
                  <select value={filters.productType} onChange={(e) => setFilters({...filters, productType: e.target.value})} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark bg-white">
                    <option value="All">All Types</option>
                    {availableFilterTypes.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Price Range (PKR)</label>
                <div className="flex items-center gap-4">
                  <input type="number" placeholder="Min" value={filters.minPrice} onChange={(e) => setFilters({...filters, minPrice: e.target.value})} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark" />
                  <span className="text-gray-400">-</span>
                  <input type="number" placeholder="Max" value={filters.maxPrice} onChange={(e) => setFilters({...filters, maxPrice: e.target.value})} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark" />
                </div>
              </div>

              <div>
                <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Sort By</label>
                <select value={filters.sortBy} onChange={(e) => setFilters({...filters, sortBy: e.target.value})} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark bg-white">
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="priceHighLow">Price: High to Low</option>
                  <option value="priceLowHigh">Price: Low to High</option>
                </select>
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-200 mt-2">
                <button onClick={() => setFilters({ masterCategory: 'All', productType: 'All', minPrice: '', maxPrice: '', sortBy: 'newest' })} className="flex-1 p-3 font-central text-xs font-bold uppercase tracking-widest text-nav-dark border border-nav-dark hover:bg-gray-50 transition-colors">Clear</button>
                <button onClick={() => setIsFilterModalOpen(false)} className="flex-1 p-3 font-central text-xs font-bold uppercase tracking-widest text-white bg-nav-dark hover:bg-black transition-colors">Apply Filters</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <h2 className="font-central text-2xl font-bold uppercase tracking-widest">Inventory</h2>
          <span className="bg-nav-dark text-white font-ballinger text-xs px-3 py-1 rounded-full">
            {processedProducts.length} Products
          </span>
        </div>
        
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto">
          <label className="flex items-center gap-2 cursor-pointer font-central text-[10px] uppercase tracking-widest font-bold border-r border-gray-300 pr-4">
            <input type="checkbox" checked={showLowStock} onChange={(e) => setShowLowStock(e.target.checked)} className="w-4 h-4 accent-red-600" />
            <span className={showLowStock ? 'text-red-600' : 'text-gray-500'}>Show Low Stock Only</span>
          </label>
          
          <button onClick={() => setIsFilterModalOpen(true)} className="flex items-center gap-2 font-central text-[10px] font-bold uppercase tracking-widest hover:text-blue-600 transition-colors">
            <SlidersHorizontal className="w-4 h-4" /> Filter & Sort
          </button>

          <div className="relative flex-1 md:w-[250px]">
            <input type="text" placeholder="Search product name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full p-3 pl-10 border border-nav-dark outline-none focus:bg-white font-ballinger text-sm transition-colors" />
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Main List */}
      <div className="flex flex-col gap-6">
        {isLoading ? (
          <div className="text-center py-10 text-gray-500 font-central text-sm uppercase tracking-widest">Loading Inventory...</div>
        ) : processedProducts.length === 0 ? (
          <div className="text-center py-20 bg-white border border-nav-dark text-gray-500 font-central text-sm uppercase tracking-widest flex flex-col items-center gap-4">
            <Package className="w-10 h-10 text-gray-300" />
            No products match your filters.
          </div>
        ) : (
          processedProducts.map(product => (
            <div key={product._id} className="bg-white border border-nav-dark shadow-sm overflow-hidden">
              
              {/* Product Header Row */}
              <div className="bg-[#f4f2ed] border-b border-nav-dark p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white border border-nav-dark shrink-0 p-1">
                    {product.variants[0]?.images[0] ? (
                      <img src={`https://app-backend-msic.onrender.com/${product.variants[0].images[0].replace(/\\/g, '/')}`} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-full h-full p-2 text-gray-300" />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-3">
                      <h3 className="font-central font-bold uppercase tracking-widest">{product.name}</h3>
                      <span className="font-ballinger text-xs font-bold text-gray-500 bg-gray-200 px-2 py-0.5 rounded-sm">PKR {product.price.toLocaleString()}</span>
                    </div>
                    <span className="font-ballinger text-xs text-gray-500 uppercase tracking-widest mt-1">{product.masterCategory} / {product.productType}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <select 
                    value={product.status} 
                    onChange={(e) => handleStatusChange(product._id, e.target.value)}
                    className={`p-2 border font-central text-[10px] font-bold uppercase tracking-widest outline-none cursor-pointer ${product.status === 'published' ? 'border-green-300 bg-green-50 text-green-700' : 'border-gray-300 bg-white text-gray-600'}`}
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>

                  <button onClick={() => startEditing(product)} className="flex items-center gap-1 bg-white border border-nav-dark text-nav-dark px-3 py-2 hover:bg-gray-50 transition-colors outline-none font-central text-[10px] font-bold uppercase tracking-widest">
                    <Edit2 className="w-3 h-3" /> Edit
                  </button>
                  <button onClick={() => handleDeleteProduct(product._id)} className="flex items-center gap-1 bg-red-50 border border-red-200 text-red-600 px-3 py-2 hover:bg-red-100 transition-colors outline-none font-central text-[10px] font-bold uppercase tracking-widest">
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              </div>

              {/* Variants Stock Table */}
              <div className="p-4">
                <table className="w-full text-left font-ballinger text-sm">
                  <tbody>
                    {product.variants.map((variant) => (
                      variant.sizes.map((sizeObj) => {
                        const sku = `${product._id}-${variant._id}-${sizeObj._id}`;
                        const currentStock = stockInputs[sku] ?? sizeObj.stock;
                        const isLowStock = currentStock <= 5 && currentStock > 0;
                        const isOutOfStock = currentStock === 0;

                        return (
                          <tr key={sku} className={`border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors`}>
                            <td className="py-3 px-2 w-[180px]">
                              <div className="flex items-center gap-3">
                                <div className="w-4 h-4 rounded-full border border-gray-300" style={{ backgroundColor: variant.hexCode }}></div>
                                <span className="font-bold text-gray-700">{variant.colorName}</span>
                              </div>
                            </td>
                            <td className="py-3 px-2 w-[100px]">
                              <span className="font-central text-xs font-bold uppercase tracking-widest px-3 py-1 bg-gray-100">{sizeObj.size}</span>
                            </td>
                            <td className="py-3 px-2">
                              {isOutOfStock ? (
                                <span className="flex items-center gap-1 text-red-600 font-central text-[10px] font-bold uppercase tracking-widest"><AlertTriangle className="w-3 h-3" /> Out of Stock</span>
                              ) : isLowStock ? (
                                <span className="flex items-center gap-1 text-yellow-600 font-central text-[10px] font-bold uppercase tracking-widest"><AlertTriangle className="w-3 h-3" /> Low Stock</span>
                              ) : (
                                <span className="text-green-600 font-central text-[10px] font-bold uppercase tracking-widest">In Stock</span>
                              )}
                            </td>
                            <td className="py-3 px-2 w-[120px]">
                              <input 
                                type="number" 
                                min="0" 
                                value={currentStock} 
                                onChange={(e) => handleStockChange(sku, e.target.value)} 
                                className={`w-full p-2 border outline-none font-ballinger text-sm font-bold text-center transition-colors ${isOutOfStock ? 'border-red-300 bg-red-50 text-red-700' : 'border-gray-300 focus:border-nav-dark'}`} 
                              />
                            </td>
                            <td className="py-3 px-2 w-[60px] text-right">
                              <button 
                                onClick={() => handleSaveStock(product._id, variant._id, sizeObj._id, sku)} 
                                disabled={savingSku === sku} 
                                className={`inline-flex items-center justify-center w-10 h-10 border transition-colors outline-none ${savingSku === sku ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed' : 'bg-white border-nav-dark text-nav-dark hover:bg-nav-dark hover:text-white'}`}
                              >
                                {savingSku === sku ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ))}
                  </tbody>
                </table>
              </div>
              
            </div>
          ))
        )}
      </div>
    </div>
  );
}