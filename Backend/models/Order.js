
const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    productName: { type: String, required: true },
    colorName: { type: String, required: true },
    hexCode: { type: String },
    size: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    image: { type: String } 
});

const orderSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        items: [orderItemSchema],

        shippingAddress: {
            email: { type: String, required: true },
            firstName: { type: String, required: true },
            lastName: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true }
        },

        emailOffers: {
            type: Boolean,
            default: false   
        },

        paymentMethod: {
            type: String,
            enum: ["credit_card", "cash_on_delivery", "paypal"],
            required: true
        },
        cardDetails: {
            lastFourDigits: { type: String },  
            expiryDate: { type: String }, 
            nameOnCard: { type: String }
        },

        status: {
            type: String,
            enum: ["processing", "shipped", "delivered", "cancelled"],
            default: "processing"
        },

        totalAmount: {
            type: Number,
            required: true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);