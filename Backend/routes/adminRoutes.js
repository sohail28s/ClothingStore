const express = require("express");
const router = express.Router();

// Controllers
const { adminLogin } = require("../controllers/adminController");

const {
    createCustomer,
    getAllCustomers,
    updateCustomer,
    toggleCustomerStatus
} = require("../controllers/adminUserController");

// Middleware
const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");


// ==============================
// 🔐 ADMIN AUTH
// ==============================
router.post("/login", adminLogin);


// ==============================
// 👤 CUSTOMER MANAGEMENT (ADMIN)
// ==============================

// ➕ CREATE CUSTOMER
router.post("/customer", protect, adminOnly, createCustomer);

// 👁️ GET ALL CUSTOMERS
router.get("/customers", protect, adminOnly, getAllCustomers);

router.get("/customers/:id", protect, adminOnly, getAllCustomers);

// ✏️ UPDATE CUSTOMER (INFO + ADDRESS)
router.put("/customer/:id", protect, adminOnly, updateCustomer);

// 🔥 TOGGLE STATUS (ACTIVE / INACTIVE)
router.patch("/customer/:id/status", protect, adminOnly, toggleCustomerStatus);


module.exports = router;