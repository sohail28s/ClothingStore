
// const express = require("express");
// const router = express.Router();

// const {
//     createOrder,
//     getAllOrders,
//     getSingleOrder,
//     updateOrderStatus,
//     getMyOrders
// } = require("../controllers/orderController");

// const protect = require("../middleware/authMiddleware");
// const adminOnly = require("../middleware/adminMiddleware");


// // CUSTOMER ROUTES
// router.post("/", protect, createOrder);   // order place karo
// router.get("/my-orders", protect, getMyOrders);   // apne orders dekho

// // ADMIN ROUTES
// router.get("/", protect, adminOnly, getAllOrders);      // sab orders
// router.get("/:id", protect, adminOnly, getSingleOrder);    // single order detail
// router.patch("/:id/status", protect, adminOnly, updateOrderStatus); // status update


// module.exports = router;









//my panga 









const express = require("express");
const router = express.Router();
const { 
    createOrder, 
    getAllOrders, 
    getSingleOrder, 
    updateOrderStatus, 
    getMyOrders,
    getMySingleOrder // <-- Added this
    
} = require("../controllers/orderController");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

// ================= CUSTOMER ROUTES =================
router.post("/", protect, createOrder); 
router.get("/my-orders", protect, getMyOrders); // Get list of user's orders
router.get("/my-orders/:id", protect, getMySingleOrder); // Get specific order details

// ================= ADMIN ROUTES =================
router.get("/", protect, adminOnly, getAllOrders); 
router.get("/:id", protect, adminOnly, getSingleOrder); 
router.patch("/:id/status", protect, adminOnly, updateOrderStatus); 

module.exports = router;