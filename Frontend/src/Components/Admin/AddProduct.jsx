import React, { useState } from 'react';
import { Save, X, Plus, Trash2, Upload, ArrowLeft } from 'lucide-react';

const categoryTree = {
  Men: ['Shirts', 'T-Shirts', 'Pants'],
  Women: ['Shirts', 'Skirts', 'Pants']
};

const getDefaultSizes = (productType) => {
  if (productType === 'Pants') {
    return [
      { size: '28', stock: 0 },
      { size: '30', stock: 0 },
      { size: '32', stock: 0 },
      { size: '34', stock: 0 },
      { size: '36', stock: 0 }
    ];
  }
  return [
    { size: 'S', stock: 0 },
    { size: 'M', stock: 0 },
    { size: 'L', stock: 0 }
  ];
};

export default function AddProduct({ onBack }) {
  const [isSaving, setIsSaving] = useState(false);
  const [productData, setProductData] = useState({
    masterCategory: 'Men', 
    productType: 'Shirts', 
    name: '',
    description: '',
    material: '',
    fit: '',
    price: '',
    isOnSale: false,
    status: 'draft', 
    tags: '',
    variants: [
      // IMAGES ARRAY NOW EXPECTS OBJECTS: { file: File, preview: 'blob:...' }
      { colorName: '', hexCode: '#000000', images: [null, null, null], sizes: getDefaultSizes('Shirts') }
    ]
  });

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData({ ...productData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleMasterCategoryChange = (e) => {
    const newMaster = e.target.value;
    const firstAvailableType = categoryTree[newMaster][0];
    setProductData({ 
      ...productData, 
      masterCategory: newMaster, 
      productType: firstAvailableType 
    });
  };

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    const newDefaultSizes = getDefaultSizes(newType);
    setProductData({ 
      ...productData, 
      productType: newType,
      variants: productData.variants.map(variant => ({ ...variant, sizes: newDefaultSizes }))
    });
  };

  const addColorVariant = () => {
    setProductData({
      ...productData,
      variants: [
        ...productData.variants,
        { colorName: '', hexCode: '#ffffff', images: [null, null, null], sizes: getDefaultSizes(productData.productType) }
      ]
    });
  };

  const updateColorField = (variantIndex, field, value) => {
    const updatedVariants = [...productData.variants];
    updatedVariants[variantIndex][field] = value;
    setProductData({ ...productData, variants: updatedVariants });
  };

  // --- REAL IMAGE UPLOAD HANDLERS ---
  const handleImageUpload = (variantIndex, slotIndex, e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create a local preview URL AND save the actual file for FormData
    const previewUrl = URL.createObjectURL(file);

    const updatedVariants = [...productData.variants];
    const currentImages = [...(updatedVariants[variantIndex].images || [null, null, null])];
    
    // Store both the File (for the backend) and the Preview (for the frontend)
    currentImages[slotIndex] = { file: file, preview: previewUrl }; 
    updatedVariants[variantIndex].images = currentImages;

    setProductData({ ...productData, variants: updatedVariants });
  };

  const removeImage = (variantIndex, slotIndex) => {
    const updatedVariants = [...productData.variants];
    const currentImages = [...updatedVariants[variantIndex].images];
    
    currentImages[slotIndex] = null;
    updatedVariants[variantIndex].images = currentImages;
    
    setProductData({ ...productData, variants: updatedVariants });
  };

  // --- SIZE HANDLERS ---
  const addSizeToColor = (variantIndex) => {
    const updatedVariants = [...productData.variants];
    updatedVariants[variantIndex].sizes.push({ size: '', stock: 0 });
    setProductData({ ...productData, variants: updatedVariants });
  };

  const updateSize = (variantIndex, sizeIndex, field, value) => {
    const updatedVariants = [...productData.variants];
    updatedVariants[variantIndex].sizes[sizeIndex][field] = value;
    setProductData({ ...productData, variants: updatedVariants });
  };

  const removeSize = (variantIndex, sizeIndex) => {
    const updatedVariants = [...productData.variants];
    updatedVariants[variantIndex].sizes.splice(sizeIndex, 1);
    setProductData({ ...productData, variants: updatedVariants });
  };

  const removeColor = (variantIndex) => {
    const updatedVariants = [...productData.variants];
    updatedVariants.splice(variantIndex, 1);
    setProductData({ ...productData, variants: updatedVariants });
  };

  // ==========================================
  // REAL API SAVE LOGIC (WITH FORM-DATA)
  // ==========================================
  const handleSave = async (e) => {
    e.preventDefault();

    if (!productData.name || !productData.price || productData.variants[0].colorName === '') {
      alert("Please fill in the Product Name, Price, and at least one Color Name.");
      return;
    }

    setIsSaving(true);

    try {
      const token = localStorage.getItem('admin_token');

      // Create a new FormData object (This acts exactly like Postman)
      const formData = new FormData();

      // Append standard text fields
      formData.append('name', productData.name);
      formData.append('description', productData.description);
      formData.append('material', productData.material);
      formData.append('fit', productData.fit);
      formData.append('masterCategory', productData.masterCategory);
      formData.append('productType', productData.productType);
      formData.append('price', Number(productData.price));
      formData.append('isOnSale', productData.isOnSale);
      formData.append('status', productData.status);

      // Format and stringify Tags
      const formattedTags = productData.tags.split(',').map(t => t.trim()).filter(t => t !== '').slice(0, 3);
      formData.append('tags', JSON.stringify(formattedTags));

      // Separate the files from the variant data
      const cleanVariants = productData.variants.map(v => ({
        colorName: v.colorName,
        hexCode: v.hexCode,
        sizes: v.sizes
      }));
      
      // Stringify the variant details (Colors, hex codes, sizes)
      formData.append('variants', JSON.stringify(cleanVariants));

      // Finally, append the actual File objects!
      // Your backend multer is likely looking for a field called 'images' or 'files'
      // We will loop through all slots and append any uploaded files
      productData.variants.forEach((variant) => {
        variant.images.forEach((imgObj) => {
          if (imgObj && imgObj.file) {
            // Note: Adjust the 'images' string if your backend uses a different name like 'photos'
            formData.append('images', imgObj.file); 
          }
        });
      });

      // Send the request!
      // Notice we DO NOT set 'Content-Type'. The browser sets it automatically to 'multipart/form-data'
      const response = await fetch('https://app-backend-msic.onrender.com/api/products', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData // Sending the Form Data object directly
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create product');
      }

      alert("Product saved successfully!");
      onBack(); 

    } catch (error) {
      console.error("Error saving product:", error);
      alert(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 border border-nav-dark hover:bg-gray-100 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="font-central text-2xl font-bold uppercase tracking-widest">Add New Product</h2>
        </div>
        <button 
          onClick={handleSave} 
          disabled={isSaving}
          className={`flex items-center gap-2 text-white px-6 py-3 font-central text-xs font-bold uppercase tracking-widest transition-colors ${isSaving ? 'bg-gray-400 cursor-not-allowed' : 'bg-nav-dark hover:bg-black'}`}
        >
          <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Product'}
        </button>
      </div>

      <form className="flex flex-col lg:flex-row gap-8 pb-20">
        <div className="flex-1 flex flex-col gap-8">
          
          <div className="bg-white border border-nav-dark p-6 shadow-sm flex flex-col gap-5">
            <h3 className="font-central text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-3">Classification</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Master Category</label>
                <select name="masterCategory" value={productData.masterCategory} onChange={handleMasterCategoryChange} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm bg-white cursor-pointer">
                  {Object.keys(categoryTree).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Product Type</label>
                <select name="productType" value={productData.productType} onChange={handleTypeChange} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm bg-white cursor-pointer">
                  {categoryTree[productData.masterCategory].map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white border border-nav-dark p-6 shadow-sm flex flex-col gap-5">
            <h3 className="font-central text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-3">General Information</h3>
            <div>
              <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Product Name</label>
              <input type="text" name="name" value={productData.name} onChange={handleInput} required className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm" placeholder="e.g. Wayfarer Flannel Overshirt" />
            </div>
            <div>
              <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Description</label>
              <textarea name="description" value={productData.description} onChange={handleInput} rows="4" className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm" placeholder="Product details..."></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Material</label>
                <input type="text" name="material" value={productData.material} onChange={handleInput} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm" placeholder="100% Cotton" />
              </div>
              <div>
                <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Fit</label>
                <input type="text" name="fit" value={productData.fit} onChange={handleInput} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm" placeholder="Relaxed" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-nav-dark p-6 shadow-sm flex flex-col gap-5">
            <div className="flex justify-between items-center border-b border-gray-200 pb-3">
              <h3 className="font-central text-sm font-bold uppercase tracking-widest">Variants (Colors & Sizes)</h3>
              <button type="button" onClick={addColorVariant} className="flex items-center gap-1 text-nav-dark font-central text-[10px] font-bold uppercase tracking-widest hover:opacity-60">
                <Plus className="w-3 h-3" /> Add Color
              </button>
            </div>
            
            <div className="flex flex-col gap-6">
              {productData.variants.map((variant, vIdx) => (
                <div key={vIdx} className="border border-gray-200 bg-[#fbfbfb] p-4 relative group">
                  {vIdx > 0 && (
                    <button type="button" onClick={() => removeColor(vIdx)} className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 mb-4 pr-8">
                    <div>
                      <label className="font-central text-[9px] uppercase tracking-widest font-bold text-gray-500 mb-1 block">Color Name</label>
                      <input type="text" value={variant.colorName} onChange={(e) => updateColorField(vIdx, 'colorName', e.target.value)} required className="w-full p-2 border border-gray-300 outline-none font-ballinger text-sm" placeholder="Rust Check" />
                    </div>
                    <div>
                      <label className="font-central text-[9px] uppercase tracking-widest font-bold text-gray-500 mb-1 block">Hex Code</label>
                      <div className="flex gap-2">
                        <input type="color" value={variant.hexCode} onChange={(e) => updateColorField(vIdx, 'hexCode', e.target.value)} className="w-10 h-10 border border-gray-300 cursor-pointer" />
                        <input type="text" value={variant.hexCode} onChange={(e) => updateColorField(vIdx, 'hexCode', e.target.value)} className="flex-1 p-2 border border-gray-300 outline-none text-sm font-mono uppercase" />
                      </div>
                    </div>
                  </div>

                  {/* 3 IMAGE UPLOAD SLOTS */}
                  <div className="mb-6">
                    <label className="font-central text-[9px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Images (Max 3 per color)</label>
                    <div className="grid grid-cols-3 gap-4">
                      {[0, 1, 2].map((slotIndex) => {
                        const imageObj = variant.images[slotIndex];
                        return (
                          <div key={slotIndex} className="relative w-full aspect-square border-2 border-dashed border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center overflow-hidden group">
                            {imageObj && imageObj.preview ? (
                              <>
                                <img src={imageObj.preview} alt={`Preview ${slotIndex + 1}`} className="w-full h-full object-cover" />
                                <button type="button" onClick={() => removeImage(vIdx, slotIndex)} className="absolute top-2 right-2 bg-white/90 p-1.5 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity border border-gray-200 shadow-sm">
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            ) : (
                              <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center text-gray-400 gap-2 hover:text-nav-dark transition-colors">
                                <Upload className="w-5 h-5" />
                                <span className="font-central text-[9px] uppercase tracking-widest font-bold text-center px-2">Add Image {slotIndex + 1}</span>
                                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(vIdx, slotIndex, e)} />
                              </label>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Sizes & Inventory Grid */}
                  <div className="bg-white border border-gray-200 p-3">
                    <div className="flex justify-between items-center mb-3">
                      <label className="font-central text-[9px] uppercase tracking-widest font-bold text-gray-500 block">Sizes & Inventory</label>
                      <button type="button" onClick={() => addSizeToColor(vIdx)} className="text-nav-dark font-central text-[9px] font-bold uppercase tracking-widest hover:opacity-60 flex items-center gap-1">
                        <Plus className="w-3 h-3" /> Add Size
                      </button>
                    </div>
                    <div className="flex flex-col gap-2">
                      {variant.sizes.map((sizeObj, sIdx) => (
                        <div key={sIdx} className="flex items-center gap-3">
                          <input type="text" value={sizeObj.size} onChange={(e) => updateSize(vIdx, sIdx, 'size', e.target.value)} className="w-20 p-2 border border-gray-300 outline-none font-ballinger text-sm text-center uppercase" placeholder="Size" />
                          <input type="number" value={sizeObj.stock} onChange={(e) => updateSize(vIdx, sIdx, 'stock', Number(e.target.value))} min="0" className="flex-1 p-2 border border-gray-300 outline-none font-ballinger text-sm" placeholder="Stock Qty" />
                          <button type="button" onClick={() => removeSize(vIdx, sIdx)} className="p-2 text-gray-400 hover:text-red-500">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* RIGHT COLUMN: Pricing & Status */}
        {/* ========================================== */}
        <div className="w-full lg:w-[350px] flex flex-col gap-8 shrink-0">
          <div className="bg-white border border-nav-dark p-6 shadow-sm flex flex-col gap-5">
            <h3 className="font-central text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-3">Status</h3>
            <select name="status" value={productData.status} onChange={handleInput} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm bg-white cursor-pointer">
              <option value="published">Active (Published)</option>
              <option value="draft">Draft (Hidden)</option>
            </select>
          </div>

          <div className="bg-white border border-nav-dark p-6 shadow-sm flex flex-col gap-5">
            <h3 className="font-central text-sm font-bold uppercase tracking-widest border-b border-gray-200 pb-3">Pricing & Tags</h3>
            <div>
              <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Price (PKR)</label>
              <input type="number" name="price" value={productData.price} onChange={handleInput} required min="0" className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm font-bold" placeholder="0.00" />
            </div>
            
            <label className="flex items-center gap-3 cursor-pointer mb-2">
              <input type="checkbox" name="isOnSale" checked={productData.isOnSale} onChange={handleInput} className="w-4 h-4 accent-nav-dark" />
              <span className="font-ballinger text-sm">Product is on Sale</span>
            </label>
            
            <div>
              <label className="font-central text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-2 block">Tags (Max 3, Comma Separated)</label>
              <input type="text" name="tags" value={productData.tags} onChange={handleInput} className="w-full p-3 border border-gray-300 outline-none focus:border-nav-dark font-ballinger text-sm" placeholder="New, Trending, Summer" />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}