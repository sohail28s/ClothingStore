require("dotenv").config();
const express = require("express");
const cors = require("cors");

const connectToDB = require("./config/db");
const errorHandler = require("./middleware/errorHandlerMiddleware");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes"); // 🔥 ADD THIS
const adminRoutes = require("./routes/adminRoutes")
const productRoutes = require("./routes/productRoutes")


const app = express();

// DB connect
connectToDB();

// Middlewares
// app.use(cors());


app.use(cors({
    origin: [
        'http://localhost:5173', // For local development testing
        'https://clothing-store-psi-one.vercel.app' // Your live storefront
    ],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static("uploads"))


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes); // 🔥 IMPORTANT
app.use("/api/admin", adminRoutes);
app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/admin/dashboard", require("./routes/dashboardRoutes"));

// Test route (optional but useful)
app.get("/", (req, res) => {
    res.send("API is running...");
});

// Error Handler (ALWAYS LAST)
app.use(errorHandler);

// PORT fallback
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server Running on PORT ${PORT}`);
});