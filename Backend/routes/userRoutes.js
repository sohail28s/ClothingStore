
// const express = require("express");
// const router = express.Router();

// const protect = require("../middleware/authMiddleware");
// const {
//     updateProfile,
//     addAddress,
//     getAddresses,
//     deleteAddress,
//     getCustomer
// } = require("../controllers/userController");

// router.put("/profile", protect, updateProfile);

// router.post("/address", protect, addAddress);
// router.get("/address", protect, getAddresses);
// router.get("/profile/:id", protect, getCustomer);
// router.delete("/address/:id", protect, deleteAddress);

// module.exports = router;








const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const {
    updateProfile,
    addAddress,
    getAddresses,
    deleteAddress,
    getCustomer,
    // 👇 IMPORTED WISHLIST CONTROLLERS 👇
    getWishlist,
    toggleWishlist
} = require("../controllers/userController");

// Profile & Address Routes
router.put("/profile", protect, updateProfile);
router.post("/address", protect, addAddress);
router.get("/address", protect, getAddresses);
router.get("/profile/:id", protect, getCustomer);
router.delete("/address/:id", protect, deleteAddress);

// 👇 ADDED WISHLIST ROUTES 👇
router.get("/wishlist", protect, getWishlist);
router.post("/wishlist/toggle", protect, toggleWishlist);

module.exports = router;