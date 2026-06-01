
const Order        = require("../models/Order");
const Product      = require("../models/Product");
const asyncWrapper = require("../utilities/asyncWrapper");


// ================= CREATE ORDER =================
exports.createOrder = asyncWrapper(async (req, res) => {

    const { items, shippingAddress, emailOffers, paymentMethod, cardDetails } = req.body;

    if (!items || items.length === 0) {
        return res.status(400).json({ status: "Fail", message: "Order must contain at least one item" });
    }

    if (!shippingAddress) {
        return res.status(400).json({ status: "Fail", message: "Shipping address is required" });
    }

    if (!paymentMethod) {
        return res.status(400).json({ status: "Fail", message: "Payment method is required" });
    }

    if (paymentMethod === "credit_card") {
        if (!cardDetails || !cardDetails.cardNumber || !cardDetails.expiryDate || !cardDetails.cvc || !cardDetails.nameOnCard) {
            return res.status(400).json({ status: "Fail", message: "Credit card details are required" });
        }

        const cardNum = cardDetails.cardNumber.replace(/\s/g, "");
        if (cardNum.length !== 16) {
            return res.status(400).json({ status: "Fail", message: "Card number must be 16 digits" });
        }

        if (cardDetails.cvc.length !== 3) {
            return res.status(400).json({ status: "Fail", message: "CVC must be 3 digits" });
        }
    }

    // ── Stock check & calculate total ────────────────────────────────────────
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
        const product = await Product.findById(item.productId);

        if (!product) {
            return res.status(404).json({ status: "Fail", message: `Product not found: ${item.productId}` });
        }

        if (product.status !== "published") {
            return res.status(400).json({ status: "Fail", message: `Product is not available: ${product.name}` });
        }

        const variant = product.variants.id(item.variantId);
        if (!variant) {
            return res.status(404).json({ status: "Fail", message: `Variant not found for product: ${product.name}` });
        }

        const sizeObj = variant.sizes.find(s => s.size === item.size);
        if (!sizeObj) {
            return res.status(404).json({ status: "Fail", message: `Size ${item.size} is not available` });
        }

        if (sizeObj.stock < item.quantity) {
            return res.status(400).json({
                status:  "Fail",
                message: `${product.name} - ${variant.colorName} - Size ${item.size} only has ${sizeObj.stock} items in stock`
            });
        }

        // Reduce stock
        sizeObj.stock -= item.quantity;
        await product.save();

        totalAmount += product.price * item.quantity;

        orderItems.push({
            product:     product._id,
            productName: product.name,
            colorName:   variant.colorName,
            hexCode:     variant.hexCode,
            size:        item.size,
            quantity:    item.quantity,
            price:       product.price,
            image:       variant.images[0] || ""
        });
    }

    // ── Save only last 4 digits of card ──────────────────────────────────────
    let savedCardDetails = {};
    if (paymentMethod === "credit_card" && cardDetails) {
        const cardNum = cardDetails.cardNumber.replace(/\s/g, "");
        savedCardDetails = {
            lastFourDigits: cardNum.slice(-4),
            expiryDate:     cardDetails.expiryDate,
            nameOnCard:     cardDetails.nameOnCard
        };
    }

    const order = await Order.create({
        customer:        req.user._id,
        items:           orderItems,
        shippingAddress,
        emailOffers:     emailOffers || false,
        paymentMethod,
        cardDetails:     savedCardDetails,
        status:          "processing",
        totalAmount
    });

    res.status(201).json({
        status:  "Success",
        message: "Order placed successfully",
        data:    order
    });
});


// ================= GET ALL ORDERS (Admin) =================
exports.getAllOrders = asyncWrapper(async (req, res) => {

    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const orders = await Order.find(filter)
        .populate("customer", "firstName lastName email")
        .sort({ createdAt: -1 });

    const formattedOrders = orders.map(order => ({
        orderId:       order._id,
        date:          order.createdAt,
        customerName:  order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : "N/A",
        customerEmail: order.customer?.email,
        status:        order.status,
        totalAmount:   order.totalAmount,
        paymentMethod: order.paymentMethod,
        itemsCount:    order.items.length
    }));

    res.json({
        status: "Success",
        count:  orders.length,
        data:   formattedOrders
    });
});


// ================= GET SINGLE ORDER DETAIL (Admin) =================
exports.getSingleOrder = asyncWrapper(async (req, res) => {

    const order = await Order.findById(req.params.id)
        .populate("customer", "firstName lastName email phone");

    if (!order) {
        return res.status(404).json({ status: "Fail", message: "Order not found" });
    }

    res.json({
        status: "Success",
        data: {
            orderId:       order._id,
            date:          order.createdAt,
            status:        order.status,
            totalAmount:   order.totalAmount,
            paymentMethod: order.paymentMethod,
            emailOffers:   order.emailOffers,

            customer: {
                id:    order.customer?._id,
                name:  order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : "N/A",
                email: order.customer?.email,
                phone: order.customer?.phone
            },

            shippingAddress: order.shippingAddress,

            cardDetails: order.paymentMethod === "credit_card"
                ? {
                    lastFourDigits: order.cardDetails.lastFourDigits,
                    expiryDate:     order.cardDetails.expiryDate,
                    nameOnCard:     order.cardDetails.nameOnCard
                }
                : null,

            items: order.items.map(item => ({
                productId:   item.product,
                productName: item.productName,
                colorName:   item.colorName,
                hexCode:     item.hexCode,
                size:        item.size,
                quantity:    item.quantity,
                price:       item.price,
                subtotal:    item.price * item.quantity,
                image:       item.image
            }))
        }
    });
});


// ================= UPDATE ORDER STATUS (Admin) =================
exports.updateOrderStatus = asyncWrapper(async (req, res) => {

    const { status } = req.body;

    const validStatuses = ["processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ status: "Fail", message: "Status must be: processing, shipped, delivered or cancelled" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
        return res.status(404).json({ status: "Fail", message: "Order not found" });
    }

    if (order.status === "delivered") {
        return res.status(400).json({ status: "Fail", message: "Status of a delivered order cannot be changed" });
    }

    // Restore stock if order is cancelled
    if (status === "cancelled" && order.status !== "cancelled") {
        for (const item of order.items) {
            const product = await Product.findById(item.product);
            if (product) {
                for (const variant of product.variants) {
                    for (const sizeObj of variant.sizes) {
                        if (variant.colorName === item.colorName && sizeObj.size === item.size) {
                            sizeObj.stock += item.quantity;
                        }
                    }
                }
                await product.save();
            }
        }
    }

    order.status = status;
    await order.save();

    res.json({
        status:  "Success",
        message: `Order status updated to "${status}"`,
        data: {
            orderId: order._id,
            status:  order.status
        }
    });
});


// // ================= GET MY ORDERS (Customer) =================
// exports.getMyOrders = asyncWrapper(async (req, res) => {

//     const orders = await Order.find({ customer: req.user._id })
//         .sort({ createdAt: -1 });

//     res.json({
//         status: "Success",
//         count:  orders.length,
//         data:   orders
//     });
// });





// 1. THIS GETS THE LIST OF ORDERS
exports.getMyOrders = asyncWrapper(async (req, res) => {
    const orders = await Order.find({ customer: req.user._id }).sort({ createdAt: -1 });
    const formattedOrders = orders.map(order => ({
        orderId: order._id,
        date: order.createdAt,
        status: order.status,
        totalAmount: order.totalAmount,
        paymentMethod: order.paymentMethod,
        itemsCount: order.items.length,
        items: order.items.map(item => ({
            productId: item.product,
            productName: item.productName,
            colorName: item.colorName,
            size: item.size,
            quantity: item.quantity,
            price: item.price,
            image: item.image
        }))
    }));
    res.json({ status: "Success", count: formattedOrders.length, data: formattedOrders });
});

// 2. THIS GETS THE SINGLE ORDER DETAILS
exports.getMySingleOrder = asyncWrapper(async (req, res) => {
    const order = await Order.findOne({ _id: req.params.id, customer: req.user._id });
    if (!order) return res.status(404).json({ status: "Fail", message: "Order not found" });

    res.json({ 
        status: "Success", 
        data: {
            orderId: order._id,
            date: order.createdAt,
            status: order.status,
            totalAmount: order.totalAmount,
            paymentMethod: order.paymentMethod,
            shippingAddress: order.shippingAddress,
            items: order.items.map(item => ({
                productId: item.product,
                productName: item.productName,
                colorName: item.colorName,
                size: item.size,
                quantity: item.quantity,
                price: item.price,
                subtotal: item.price * item.quantity,
                image: item.image
            }))
        } 
    });
});