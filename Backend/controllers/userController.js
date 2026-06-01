const User = require("../models/User");
const asyncWrapper = require("../utilities/asyncWrapper");

// UPDATE PROFILE
exports.updateProfile = asyncWrapper(async (req, res) => {
    const { firstName, lastName, email, phone } = req.body;

    const user = await User.findById(req.user._id);

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.phone = phone || user.phone;

    await user.save();

    res.json({ status: "Success", data: user });
});


// ADD ADDRESS
exports.addAddress = asyncWrapper(async (req, res) => {
    const user = await User.findById(req.user._id);

    user.addresses.push(req.body);

    await user.save();

    res.status(201).json({
        status: "Success",
        data: user.addresses
    });
});


// GET ADDRESSES
exports.getAddresses = asyncWrapper(async (req, res) => {
    const user = await User.findById(req.user._id);

    res.json({
        status: "Success",
        data: user.addresses
    });
});

exports.getCustomer = asyncWrapper(async (req, res) => {
    const user = await User.findById(req.user._id);

    res.json({
        status: "Success",
        data: user
        
    });
});


// DELETE ADDRESS
exports.deleteAddress = asyncWrapper(async (req, res) => {
    const user = await User.findById(req.user._id);

    user.addresses = user.addresses.filter(
        (addr) => addr._id.toString() !== req.params.id
    );

    await user.save();

    res.json({ status: "Success" });
});









// 👇 PASTE THIS AT THE VERY BOTTOM OF userController.js 👇

// ================= GET WISHLIST =================
exports.getWishlist = asyncWrapper(async (req, res) => {
    // Populate replaces the product IDs with the full product details
    const user = await User.findById(req.user._id).populate("wishlist");
    
    if (!user) {
        return res.status(404).json({ status: "Fail", message: "User not found" });
    }

    res.json({ status: "Success", count: user.wishlist.length, data: user.wishlist });
});

// ================= TOGGLE WISHLIST =================
exports.toggleWishlist = asyncWrapper(async (req, res) => {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
        return res.status(404).json({ status: "Fail", message: "User not found" });
    }

    // Safely check if the product ID already exists in the array
    const isAlreadyAdded = user.wishlist.some(id => id.toString() === productId.toString());

    if (isAlreadyAdded) {
        // Product is there -> REMOVE IT
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $pull: { wishlist: productId } },
            { new: true }
        ).populate("wishlist");

        res.json({ status: "Success", message: "Product removed from wishlist", data: updatedUser.wishlist });
    } else {
        // Product is NOT there -> ADD IT
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $push: { wishlist: productId } },
            { new: true }
        ).populate("wishlist");

        res.json({ status: "Success", message: "Product added to wishlist", data: updatedUser.wishlist });
    }
});