const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    label: String,
    firstName: String,
    lastName: String,
    address: String,
    city: String,
    postalCode: String,
    country: String
});

const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: String,
    phone: String,
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    status: {
        type: Boolean,
        default: true   // true = active, false = inactive
    },
    addresses: [addressSchema],
    // 👇 ADDED WISHLIST HERE 👇
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);