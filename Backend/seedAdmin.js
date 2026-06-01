const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

const User = require("./models/User");

dotenv.config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
    console.log("DB Connected");

    const hashedPassword = await bcrypt.hash("123456", 10);

    const adminExists = await User.findOne({ email: "admin@test.com" });

    if (adminExists) {
        console.log("Admin already exists");
        process.exit();
    }

    await User.create({
        firstName: "Admin",
        lastName: "User",
        email: "admin@gmail.com",
        password: hashedPassword,
        role: "admin"
    });

    console.log("Admin Created Successfully");
    process.exit();
});