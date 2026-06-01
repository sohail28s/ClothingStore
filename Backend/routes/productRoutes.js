const express      = require("express");
const router       = express.Router();

const {
    createProduct,
    getProducts,
    getSingleProduct,
    updateProduct,
    updateProductStatus,
    updateSizeStock,
    deleteProduct
} = require("../controllers/productController");

const protect      = require("../middleware/authMiddleware");
const adminOnly    = require("../middleware/adminMiddleware");
const optionalAuth = require("../middleware/optionalAuth");
const upload       = require("../middleware/upload");


// CREATE — admin only
router.post("/", protect, adminOnly, upload.array("images", 3), createProduct);

// GET ALL — token optional
// no token    = sirf published (customers)
// admin token = sab products (draft + published)
router.get("/", optionalAuth, getProducts);

// GET ONE — public
router.get("/:id", getSingleProduct);

// UPDATE — admin only
router.put("/:id", protect, adminOnly, upload.array("images", 3), updateProduct);

// UPDATE STATUS (draft <-> published) — admin only
router.patch("/:id/status", protect, adminOnly, updateProductStatus);

// UPDATE STOCK — admin only
router.patch("/:id/variants/:variantId/sizes/:sizeId/stock", protect, adminOnly, updateSizeStock);

// DELETE — admin only
router.delete("/:id", protect, adminOnly, deleteProduct);


module.exports = router;