const mongoose = require("mongoose");

const sizeSchema = new mongoose.Schema({
    size:  { type: String, required: true },
    stock: { type: Number, default: 0, min: 0 }
});

const variantSchema = new mongoose.Schema({
    colorName: { type: String, required: true },
    hexCode:   { type: String, required: true },
    images:    [String],
    sizes:     [sizeSchema]
});

const productSchema = new mongoose.Schema(
    {
        name: {
            type:     String,
            required: [true, "Product name is required"],
            trim:     true
        },
        description: { type: String, trim: true },
        material:    { type: String, trim: true },
        fit:         { type: String, trim: true },

        masterCategory: {
            type: String,
            enum: {
                values:  ["Men", "Women"],
                message: "masterCategory must be Men or Women"
            },
            required: [true, "masterCategory is required"]
        },

        productType: {
            type: String,
            enum: {
                values:  ["Shirts", "T-Shirts", "Pants", "Skirts"],
                message: "productType must be Shirts, T-Shirts, Pants or Skirts"
            },
            required: [true, "productType is required"]
        },

        price: {
            type:     Number,
            required: [true, "Price is required"],
            min:      [0, "Price cannot be negative"]
        },

        isOnSale: { type: Boolean, default: false },

        tags: {
            type:     [String],
            default:  [],
            validate: {
                validator: function (arr) { return arr.length <= 3; },
                message:   "Maximum 3 tags allowed"
            }
        },

        status: {
            type:    String,
            enum:    ["draft", "published"],
            default: "draft"
        },

        variants: [variantSchema]
    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);