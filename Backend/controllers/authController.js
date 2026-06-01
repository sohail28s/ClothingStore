
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const asyncWrapper = require("../utilities/asyncWrapper");
const generateToken = require("../utilities/generateToken");

// 🔐 SIGNUP
exports.signup = asyncWrapper(async (req, res, next) => {
    const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        isSubscribed
    } = req.body;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        isSubscribed
    });

    res.status(201).json({
        status: "Success",
        message: "User registered successfully",
        data: user
    });
});


// 🔐 LOGIN
exports.login = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
        status: "Success",
        token: generateToken(user._id),
        message: "User login successfuly",
        data: user
    });
});