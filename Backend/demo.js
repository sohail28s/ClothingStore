config/db.js
const mongoose = require("mongoose");

const connectToDB = async() => {

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDb connected");
    } catch (error) {
        console.log(error);
    }

}

module.exports = connectToDB;

middleware/authMiddleware.js


const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncWrapper = require("./utilities/asyncWrapper");

const protect = async (req, res, next) => {

    let token;

    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {

        token = req.headers.authorization.split(" ")[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.id).select("-password");

            next();

        } catch (error) {
            return res.status(401).json({ message: "Not authorized" });
        }

    } else {
        return res.status(401).json({ message: "No token provided" });
    }
};

module.exports = protect;

errorHandlerMiddleware.js

const errorHandler = (err, req, res, next) => {
    console.log(err.stack)
    res.status(err.statusCode || 500).json({status: "Fail", message: err.message || "Internal Server Error"
    });
};

module.exports = errorHandler;

utilities/asyncWrapper.js

const asyncWrapper = (fn) => {
    return (req, res, next) => {
        fn(req, res, next).catch(next);
    }
}

module.exports = asyncWrapper;

generateToken.js

const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );
};

module.exports = generateToken;

responseHandler.js


const sendSuccess = ({res, data={}, message = "Success"} ) => {
    res.status(201).json({status: "Success", data: data,  message: message})
}

module.exports = sendSuccess;

index.js

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const errorHandler = require("./middleware/errorHandlerMiddleware");
const connectToDB = require("./config/db");

const app = express();

connectToDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log(`Server Running or PORT ${process.env.PORT}`);
})

