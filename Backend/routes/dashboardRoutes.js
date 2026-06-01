const express = require("express");
const router = express.Router();

const {
    getDashboardStats,
    getCustomerSummary,
    getProductSalesReport
} = require("../controllers/dashboardController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");


router.get("/stats", protect, adminOnly, getDashboardStats);
router.get("/customers", protect, adminOnly, getCustomerSummary);
router.get("/product-sales", protect, adminOnly, getProductSalesReport);


module.exports = router;