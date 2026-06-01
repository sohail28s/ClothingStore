const Order = require("../models/Order");
const User = require("../models/User");
const Product = require("../models/Product");
const asyncWrapper = require("../utilities/asyncWrapper");


// ================= DASHBOARD STATS =================
// @route  GET /api/admin/dashboard/stats
// @access Private / Admin
exports.getDashboardStats = asyncWrapper(async (req, res) => {

    // Total revenue — sirf delivered orders count hongi
    const revenueResult = await Order.aggregate([
        { $match: { status: { $in: ["processing", "shipped", "delivered"] } } },
        { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    // Active orders — processing + shipped
    const activeOrders = await Order.countDocuments({
        status: { $in: ["processing", "shipped"] }
    });

    // Total customers
    const totalCustomers = await User.countDocuments({ role: "user" });

    // Total products
    const totalProducts = await Product.countDocuments();

    // Total orders
    const totalOrders = await Order.countDocuments();

    res.json({
        status: "Success",
        data: {
            totalRevenue,
            activeOrders,
            totalCustomers,
            totalProducts,
            totalOrders
        }
    });
});


// ================= CUSTOMER SUMMARY =================
// @route  GET /api/admin/dashboard/customers
// @access Private / Admin
// Query params: ?startDate=2024-01-01&endDate=2024-12-31
exports.getCustomerSummary = asyncWrapper(async (req, res) => {

    // Date filter build karo
    const dateFilter = {};
    if (req.query.startDate || req.query.endDate) {
        dateFilter.createdAt = {};
        if (req.query.startDate) {
            dateFilter.createdAt.$gte = new Date(req.query.startDate);
        }
        if (req.query.endDate) {
            // End date ko din ke end tak include karo
            const endDate = new Date(req.query.endDate);
            endDate.setHours(23, 59, 59, 999);
            dateFilter.createdAt.$lte = endDate;
        }
    }

    const customerSummary = await Order.aggregate([
        // Date filter apply karo
        { $match: { ...dateFilter, status: { $ne: "cancelled" } } },

        // Customer ke basis pr group karo
        {
            $group: {
                _id: "$customer",
                noOfOrders: { $sum: 1 },
                totalSpent: { $sum: "$totalAmount" }
            }
        },

        // Customer details lao
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "customerInfo"
            }
        },

        // Array se object banao
        { $unwind: "$customerInfo" },

        // Final shape
        {
            $project: {
                _id: 0,
                customerId: "$_id",
                customerName: {
                    $concat: ["$customerInfo.firstName", " ", "$customerInfo.lastName"]
                },
                email: "$customerInfo.email",
                noOfOrders: 1,
                totalSpent: 1
            }
        },

        // Most spent pehle
        { $sort: { totalSpent: -1 } }
    ]);

    res.json({
        status: "Success",
        count: customerSummary.length,
        data: customerSummary
    });
});


// ================= PRODUCT SALES REPORT =================
// @route  GET /api/admin/dashboard/product-sales
// @access Private / Admin
// Query params: ?startDate=2024-01-01&endDate=2024-12-31
exports.getProductSalesReport = asyncWrapper(async (req, res) => {

    // Date filter build karo
    const dateFilter = {};
    if (req.query.startDate || req.query.endDate) {
        dateFilter.createdAt = {};
        if (req.query.startDate) {
            dateFilter.createdAt.$gte = new Date(req.query.startDate);
        }
        if (req.query.endDate) {
            const endDate = new Date(req.query.endDate);
            endDate.setHours(23, 59, 59, 999);
            dateFilter.createdAt.$lte = endDate;
        }
    }

    const productSales = await Order.aggregate([
        // Date filter + cancelled orders exclude karo
        { $match: { ...dateFilter, status: { $ne: "cancelled" } } },

        // Items array ko flat karo
        { $unwind: "$items" },

        // Product ke basis pr group karo
        {
            $group: {
                _id: "$items.product",
                productName: { $first: "$items.productName" },
                unitsSold: { $sum: "$items.quantity" },
                revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
            }
        },

        // Final shape
        {
            $project: {
                _id: 0,
                productId: "$_id",
                productName: 1,
                unitsSold: 1,
                revenue: 1
            }
        },

        // Most revenue pehle
        { $sort: { revenue: -1 } }
    ]);

    res.json({
        status: "Success",
        count: productSales.length,
        data: productSales
    });
});