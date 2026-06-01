
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const asyncWrapper = require("../utilities/asyncWrapper");
const generateToken = require("../utilities/generateToken");

exports.adminLogin = asyncWrapper(async (req, res) => {
    const { email, password } = req.body;

    const admin = await User.findOne({ email });

    if (!admin || admin.role !== "admin") {
        return res.status(401).json({ message: "Not an admin" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
        status: "Success",
        token: generateToken(admin._id),
        message: "Admin login successfuly"
    });
});