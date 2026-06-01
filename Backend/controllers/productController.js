///Older COde by Hamza 



// const Product      = require("../models/Product");
// const asyncWrapper = require("../utilities/asyncWrapper");
// // const AppError     = require("../utilities/AppError");


// // ================= CREATE =================
// exports.createProduct = asyncWrapper(async (req, res, next) => {

//     const data = { ...req.body };

//     // Parse variants JSON string
//     if (data.variants) {
//         try {
//             data.variants = JSON.parse(data.variants);
//         } catch {
//             return next(new AppError("variants must be a valid JSON string", 400));
//         }

//         // Attach uploaded images to first variant
//         const files = req.files || [];
//         if (data.variants.length > 0) {
//             data.variants[0].images = files.map(f => f.path);
//         }
//     }

//     // Parse tags
//     if (data.tags && typeof data.tags === "string") {
//         try {
//             data.tags = JSON.parse(data.tags);
//         } catch {
//             data.tags = data.tags.split(",").map(t => t.trim());
//         }
//     }

//     if (data.tags && data.tags.length > 3) {
//         return next(new AppError("Maximum 3 tags allowed", 400));
//     }

//     const product = await Product.create(data);

//     res.status(201).json({
//         success: true,
//         message: "Product created successfully",
//         data:    product
//     });
// });


// // ================= GET ALL =================
// exports.getProducts = asyncWrapper(async (req, res, next) => {

//     const filter = {};

//     // Admin = sab products | Customer/Public = sirf published
//     if (!req.user || req.user.role !== "admin") {
//         filter.status = "published";
//     }

//     // Optional query filters
//     if (req.query.masterCategory)                         filter.masterCategory = req.query.masterCategory;
//     if (req.query.productType)                            filter.productType    = req.query.productType;
//     if (req.query.isOnSale)                               filter.isOnSale       = req.query.isOnSale === "true";
//     if (req.query.status && req.user?.role === "admin")   filter.status         = req.query.status;
//     if (req.query.tag)                                    filter.tags           = { $in: [req.query.tag] };

//     const products = await Product.find(filter).sort({ createdAt: -1 });

//     res.status(200).json({
//         success: true,
//         count:   products.length,
//         data:    products
//     });
// });


// // ================= GET ONE =================
// exports.getSingleProduct = asyncWrapper(async (req, res, next) => {

//     const product = await Product.findById(req.params.id);

//     if (!product) {
//         return next(new AppError("Product not found", 404));
//     }

//     res.status(200).json({
//         success: true,
//         data:    product
//     });
// });


// // ================= UPDATE =================
// exports.updateProduct = asyncWrapper(async (req, res, next) => {

//     let product = await Product.findById(req.params.id);
//     if (!product) {
//         return next(new AppError("Product not found", 404));
//     }

//     const data = { ...req.body };

//     // Parse variants
//     if (data.variants) {
//         try {
//             data.variants = JSON.parse(data.variants);
//         } catch {
//             return next(new AppError("variants must be a valid JSON string", 400));
//         }

//         const files = req.files || [];
//         if (files.length > 0 && data.variants.length > 0) {
//             data.variants[0].images = files.map(f => f.path);
//         }
//     }

//     // Parse tags
//     if (data.tags && typeof data.tags === "string") {
//         try {
//             data.tags = JSON.parse(data.tags);
//         } catch {
//             data.tags = data.tags.split(",").map(t => t.trim());
//         }
//     }

//     if (data.tags && data.tags.length > 3) {
//         return next(new AppError("Maximum 3 tags allowed", 400));
//     }

//     product = await Product.findByIdAndUpdate(
//         req.params.id,
//         data,
//         { new: true, runValidators: true }
//     );

//     res.status(200).json({
//         success: true,
//         message: "Product updated successfully",
//         data:    product
//     });
// });


// // ================= UPDATE STATUS =================
// // draft <-> published — poore product pe apply hota hai
// exports.updateProductStatus = asyncWrapper(async (req, res, next) => {

//     const { status } = req.body;

//     if (!["draft", "published"].includes(status)) {
//         return next(new AppError("Status must be 'draft' or 'published'", 400));
//     }

//     const product = await Product.findByIdAndUpdate(
//         req.params.id,
//         { status },
//         { new: true }
//     );

//     if (!product) {
//         return next(new AppError("Product not found", 404));
//     }

//     res.status(200).json({
//         success: true,
//         message: status === "published"
//             ? "Product published — now visible on website"
//             : "Product moved to draft — hidden from website",
//         data: product
//     });
// });


// // ================= UPDATE STOCK =================
// exports.updateSizeStock = asyncWrapper(async (req, res, next) => {

//     const stock = req.body.stock;

//     if (stock === undefined || stock === null) {
//         return next(new AppError("stock value is required", 400));
//     }

//     if (Number(stock) < 0) {
//         return next(new AppError("stock cannot be negative", 400));
//     }

//     const product = await Product.findOneAndUpdate(
//         {
//             _id:                  req.params.id,
//             "variants._id":       req.params.variantId,
//             "variants.sizes._id": req.params.sizeId
//         },
//         {
//             $set: { "variants.$[v].sizes.$[s].stock": Number(stock) }
//         },
//         {
//             arrayFilters: [
//                 { "v._id": req.params.variantId },
//                 { "s._id": req.params.sizeId    }
//             ],
//             new: true
//         }
//     );

//     if (!product) {
//         return next(new AppError("Product, variant or size not found", 404));
//     }

//     res.status(200).json({
//         success: true,
//         message: "Stock updated successfully",
//         data:    product
//     });
// });


// // ================= DELETE =================
// // Poora product delete — sab variants, sizes, colors ek saath
// exports.deleteProduct = asyncWrapper(async (req, res, next) => {

//     const product = await Product.findByIdAndDelete(req.params.id);

//     if (!product) {
//         return next(new AppError("Product not found", 404));
//     }

//     res.status(200).json({
//         success: true,
//         message: "Product and all its variants deleted successfully"
//     });
// });







//New Code Below





const Product = require("../models/Product");
const asyncWrapper = require("../utilities/asyncWrapper");

// ================= CREATE =================
exports.createProduct = asyncWrapper(async (req, res, next) => {
  const data = { ...req.body };

  // Parse variants JSON string (Only if it's actually a string)
  if (data.variants && typeof data.variants === "string") {
    try {
      data.variants = JSON.parse(data.variants);
    } catch {
      return res.status(400).json({ status: "Fail", message: "variants must be a valid JSON string" });
    }
  }

  // Attach uploaded images to first variant if files exist
  const files = req.files || [];
  if (data.variants && data.variants.length > 0 && files.length > 0) {
    data.variants[0].images = files.map(f => f.path);
  }

  // Parse tags
  if (data.tags && typeof data.tags === "string") {
    try {
      data.tags = JSON.parse(data.tags);
    } catch {
      data.tags = data.tags.split(",").map(t => t.trim());
    }
  }

  if (data.tags && data.tags.length > 3) {
    return res.status(400).json({ status: "Fail", message: "Maximum 3 tags allowed" });
  }

  const product = await Product.create(data);

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product
  });
});

// ================= GET ALL =================
exports.getProducts = asyncWrapper(async (req, res, next) => {
  const filter = {};

  // Admin = sab products | Customer/Public = sirf published
  if (!req.user || req.user.role !== "admin") {
    filter.status = "published";
  }

  // Optional query filters
  if (req.query.masterCategory) filter.masterCategory = req.query.masterCategory;
  if (req.query.productType) filter.productType = req.query.productType;
  if (req.query.isOnSale) filter.isOnSale = req.query.isOnSale === "true";
  if (req.query.status && req.user?.role === "admin") filter.status = req.query.status;
  if (req.query.tag) filter.tags = { $in: [req.query.tag] };

  const products = await Product.find(filter).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: products.length,
    data: products
  });
});

// ================= GET ONE =================
exports.getSingleProduct = asyncWrapper(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ status: "Fail", message: "Product not found" });
  }

  res.status(200).json({
    success: true,
    data: product
  });
});

// ================= UPDATE =================
exports.updateProduct = asyncWrapper(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ status: "Fail", message: "Product not found" });
  }

  const data = { ...req.body };

  // Parse variants (Only if it's actually a string)
  if (data.variants && typeof data.variants === "string") {
    try {
      data.variants = JSON.parse(data.variants);
    } catch {
      return res.status(400).json({ status: "Fail", message: "variants must be a valid JSON string" });
    }
  }

  const files = req.files || [];
  if (files.length > 0 && data.variants && data.variants.length > 0) {
    data.variants[0].images = files.map(f => f.path);
  }

  // Parse tags
  if (data.tags && typeof data.tags === "string") {
    try {
      data.tags = JSON.parse(data.tags);
    } catch {
      data.tags = data.tags.split(",").map(t => t.trim());
    }
  }

  if (data.tags && data.tags.length > 3) {
    return res.status(400).json({ status: "Fail", message: "Maximum 3 tags allowed" });
  }

  product = await Product.findByIdAndUpdate(
    req.params.id,
    data,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: product
  });
});

// ================= UPDATE STATUS =================
// draft <-> published — poore product pe apply hota hai
exports.updateProductStatus = asyncWrapper(async (req, res, next) => {
  const { status } = req.body;

  if (!["draft", "published"].includes(status)) {
    return res.status(400).json({ status: "Fail", message: "Status must be 'draft' or 'published'" });
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  if (!product) {
    return res.status(404).json({ status: "Fail", message: "Product not found" });
  }

  res.status(200).json({
    success: true,
    message: status === "published" ? "Product published — now visible on website" : "Product moved to draft — hidden from website",
    data: product
  });
});

// ================= UPDATE STOCK =================
exports.updateSizeStock = asyncWrapper(async (req, res, next) => {
  const stock = req.body.stock;

  if (stock === undefined || stock === null) {
    return res.status(400).json({ status: "Fail", message: "stock value is required" });
  }

  if (Number(stock) < 0) {
    return res.status(400).json({ status: "Fail", message: "stock cannot be negative" });
  }

  const product = await Product.findOneAndUpdate(
    {
      _id: req.params.id,
      "variants._id": req.params.variantId,
      "variants.sizes._id": req.params.sizeId
    },
    {
      $set: { "variants.$[v].sizes.$[s].stock": Number(stock) }
    },
    {
      arrayFilters: [
        { "v._id": req.params.variantId },
        { "s._id": req.params.sizeId }
      ],
      new: true
    }
  );

  if (!product) {
    return res.status(404).json({ status: "Fail", message: "Product, variant or size not found" });
  }

  res.status(200).json({
    success: true,
    message: "Stock updated successfully",
    data: product
  });
});

// ================= DELETE =================
// Poora product delete — sab variants, sizes, colors ek saath
exports.deleteProduct = asyncWrapper(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return res.status(404).json({ status: "Fail", message: "Product not found" });
  }

  res.status(200).json({
    success: true,
    message: "Product and all its variants deleted successfully"
  });
});