const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const axios = require('axios'); 

const API_URL = 'https://app-backend-msic.onrender.com/api/products'; 
const ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZjgyNDY0MWJjZTc3YmVmNjk0MzE1NyIsImlhdCI6MTc3NzkwMDMxMCwiZXhwIjoxNzc4NTA1MTEwfQ.Op-BYSpGOBAM-4jWzvlig_ZM_yvdEfYlBQY98I9jJbo'; // 🚨 PASTE YOUR TOKEN HERE

const productsMap = new Map();

// 📁 Create dedicated folders for Women's Pants
const BASE_UPLOADS_DIR = path.join(__dirname, 'uploads');
const CATEGORY_UPLOADS_DIR = path.join(BASE_UPLOADS_DIR, 'womens_pants');

if (!fs.existsSync(BASE_UPLOADS_DIR)) {
  fs.mkdirSync(BASE_UPLOADS_DIR);
}
if (!fs.existsSync(CATEGORY_UPLOADS_DIR)) {
  fs.mkdirSync(CATEGORY_UPLOADS_DIR);
}

// 🎨 COLOR DICTIONARY (Expanded for Denim and Pants)
const getColorHex = (colorName) => {
  const name = colorName.toLowerCase().replace('_', ' ').trim(); 
  const colors = {
    blue: "#1E3A8A", navy: "#1e293b", taupe: "#8B8589", white: "#FFFFFF",
    black: "#000000", red: "#DC2626", maroon: "#7F1D1D", green: "#15803d",
    olive: "#4D7C0F", yellow: "#eab308", pink: "#F472B6", grey: "#6B7280",
    gray: "#6B7280", brown: "#78350F", beige: "#f5f5dc", khaki: "#F0E68C",
    mustard: "#FFDB58", charcoal: "#36454F", stone: "#877F6C", tan: "#D2B48C",
    "vintage blue": "#4F6987", denim: "#1560BD", "washed black": "#2C2C2B",
    "ice blue": "#A5CBF0", indigo: "#4B0082", ecru: "#C2B280"
  };
  return colors[name] || "#333333"; 
};

// ⬇️ IMAGE DOWNLOADER FUNCTION
async function downloadImage(url, filename) {
  try {
    const filepath = path.resolve(CATEGORY_UPLOADS_DIR, filename);
    
    // Check if the file already exists to save time
    if (fs.existsSync(filepath)) {
      return `uploads/womens_pants/${filename}`;
    }

    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream'
    });
    
    return new Promise((resolve, reject) => {
      response.data.pipe(fs.createWriteStream(filepath))
        .on('error', reject)
        .once('close', () => resolve(`uploads/womens_pants/${filename}`)); 
    });
  } catch (error) {
    console.error(`Error downloading ${url}:`, error.message);
    return null;
  }
}

console.log("⏳ Reading WOMEN'S PANTS CSV and organizing data...");

// Read the CSV file
fs.createReadStream('pk-lamaretail-com-2026-05-04-6.csv')
  .pipe(csv())
  .on('data', (row) => {
    const rawPrice = row.data || '0';
    const cleanPrice = parseInt(rawPrice.replace(/[^\d]/g, ''), 10) / 100; 
    
    // Dynamically grab all image URLs from the row
    const rawImages = [];
    const imageKeys = Object.keys(row).filter(key => key.startsWith('image') || key.startsWith('photo'));
    imageKeys.forEach(key => {
      if (row[key] && row[key].trim() !== '') {
        rawImages.push(row[key].split('?')[0]); 
      }
    });

    const productName = row.name || row.title || row.title2;
    if (!productName) return; 

    // Extract color
    const colorName = row.data2 || "Standard";

    // Initialize the base product
    if (!productsMap.has(productName)) {
      productsMap.set(productName, {
        name: productName,
        description: `Premium quality ${productName.toLowerCase()}. Tailored for a perfect and flattering fit.`,
        material: "Denim / Cotton Blend", 
        fit: "Straight/Wide Leg", 
        masterCategory: "Women", // 🚨 Women
        productType: "Pants",    // 🚨 Pants
        price: cleanPrice || 4500,
        isOnSale: false,
        tags: ["casual", "trousers", "jeans"],
        status: "published",
        variants: []
      });
    }

    const product = productsMap.get(productName);
    let existingVariant = product.variants.find(v => v.colorName === colorName);
    
    if (!existingVariant) {
      existingVariant = {
        colorName: colorName,
        hexCode: getColorHex(colorName),
        _rawImageUrls: rawImages,
        images: [], 
        sizes: [
          // 🚨 Strict Even-Numbered Waist Sizing Overrides CSV Data!
          { size: "24", stock: Math.floor(Math.random() * 10) + 2 },
          { size: "26", stock: Math.floor(Math.random() * 15) + 5 },
          { size: "28", stock: Math.floor(Math.random() * 25) + 10 },
          { size: "30", stock: Math.floor(Math.random() * 25) + 10 },
          { size: "32", stock: Math.floor(Math.random() * 15) + 5 },
          { size: "34", stock: Math.floor(Math.random() * 10) + 2 }
        ]
      };
      product.variants.push(existingVariant);
    }
  })
  .on('end', async () => {
    const finalProducts = Array.from(productsMap.values());
    console.log(`✅ Formatted ${finalProducts.length} unique Women's Pants.\n`);
    console.log(`⬇️ Downloading images to 'uploads/womens_pants' & sending to DB...\n`);

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < finalProducts.length; i++) {
      const product = finalProducts[i];
      
      for (let v = 0; v < product.variants.length; v++) {
        const variant = product.variants[v];
        const localImagePaths = [];
        
        // Take exactly the first 3 images
        const urlsToDownload = variant._rawImageUrls.slice(0, 3);
        
        for (let imgIndex = 0; imgIndex < urlsToDownload.length; imgIndex++) {
          const url = urlsToDownload[imgIndex];
          const safeName = product.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
          const ext = path.extname(url) || '.jpg';
          const filename = `${safeName}_${variant.colorName.toLowerCase().replace(/[^a-z0-9]/g, '')}_${imgIndex}${ext}`;
          
          const localPath = await downloadImage(url, filename);
          
          if (localPath) {
            localImagePaths.push(localPath.replace(/\\/g, '/'));
          }
        }

        // Fill blanks if there are less than 3 images
        while(localImagePaths.length < 3) {
           localImagePaths.push(`uploads/placeholder.jpg`); 
        }

        variant.images = localImagePaths;
        delete variant._rawImageUrls; 
      }

      // Upload to MongoDB
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ADMIN_TOKEN}` 
          },
          body: JSON.stringify(product)
        });

        if (response.ok) {
          successCount++;
          console.log(`[SUCCESS] Uploaded: ${product.name} (${i + 1}/${finalProducts.length})`);
        } else {
          const errorData = await response.json();
          failCount++;
          console.error(`[FAILED] ${product.name}: ${errorData.message}`);
        }
      } catch (error) {
        failCount++;
        console.error(`[ERROR] Network issue on ${product.name}`);
      }
    }

    console.log(`\n🎉 WOMEN'S PANTS SEEDING COMPLETE!`);
    console.log(`Successfully added: ${successCount}`);
  });