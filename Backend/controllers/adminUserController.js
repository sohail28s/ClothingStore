
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const asyncWrapper = require("../utilities/asyncWrapper");


// ==============================
// ➕ CREATE CUSTOMER (POST)
// ==============================
exports.createCustomer = asyncWrapper(async (req, res) => {
    const {
        firstName,
        lastName,
        email,
        password,
        phone,
        address,
        city,
        postalCode,
        country
    } = req.body;

    const exists = await User.findOne({ email });

    if (exists) {
        return res.status(400).json({ message: "User already exists" });
    }

    if (!password) {
        return res.status(400).json({ message: "Password is required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
        phone,
        role: "user",
        status: true,

        addresses: address
            ? [{
                label: "Home",
                firstName,
                lastName,
                address,
                city,
                postalCode,
                country
            }]
            : []
    });

    res.json({
        status: "Success",
        message: "Customer created",
        data: user
    });
});


// ==============================
// 👁️ GET ALL CUSTOMERS (GET)
// ==============================
exports.getAllCustomers = asyncWrapper(async (req, res) => {
    const users = await User.find({ role: "user" });

    res.json({
        status: "Success",
        data: users
    });
});

// ============================== 
// 👁️ GET CUSTOMER BY ID (GET) 
// ============================== 
exports.getcustomerbyId = asyncWrapper(async (req, res) => { 
  const user = await User.findById(req.params.id); 
  
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  
  res.json({ status: "Success", data: user }); 
});


// ==============================
// ✏️ UPDATE CUSTOMER (PUT)
// ==============================
exports.updateCustomer = asyncWrapper(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // 👤 BASIC INFO
  user.firstName = req.body.firstName || user.firstName;
  user.lastName = req.body.lastName || user.lastName;
  user.email = req.body.email || user.email;
  user.phone = req.body.phone || user.phone;

  // 🔐 PASSWORD (optional)
  if (req.body.password) {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    user.password = hashedPassword;
  }

  // 🏠 ADDRESS SYSTEM (Bulletproof: Handles Arrays AND Flat Variables)
  
  // Scenario A: The frontend sends an Array of multiple addresses
  if (req.body.addresses && Array.isArray(req.body.addresses)) {
    user.addresses = req.body.addresses.map(addr => ({
      label: addr.label || "Home",
      firstName: addr.firstName || user.firstName,
      lastName: addr.lastName || user.lastName,
      address: addr.address,
      city: addr.city,
      postalCode: addr.postalCode,
      country: addr.country
    }));
    user.markModified('addresses'); // CRITICAL for Mongoose to save arrays
  } 
  
  // Scenario B: The frontend sends Flat Variables (Your Choice 1 Quick Fix)
  else if (req.body.address || req.body.city || req.body.country) {
    if (user.addresses.length === 0) {
      // Create new primary address
      user.addresses.push({
        label: "Home",
        firstName: user.firstName,
        lastName: user.lastName,
        address: req.body.address,
        city: req.body.city,
        postalCode: req.body.postalCode,
        country: req.body.country
      });
    } else {
      // Update existing primary address
      user.addresses[0].address = req.body.address || user.addresses[0].address;
      user.addresses[0].city = req.body.city || user.addresses[0].city;
      user.addresses[0].postalCode = req.body.postalCode || user.addresses[0].postalCode;
      user.addresses[0].country = req.body.country || user.addresses[0].country;
    }
    user.markModified('addresses'); // CRITICAL for Mongoose to save arrays
  }

  await user.save();
  
  res.json({ 
    status: "Success", 
    message: "Customer updated successfully", 
    data: user 
  });
});


// ==============================
// 🔥 TOGGLE STATUS (PATCH)
// ==============================
exports.toggleCustomerStatus = asyncWrapper(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    user.status = !user.status;

    await user.save();

    res.json({
        status: "Success",
        message: `Customer is now ${user.status ? "Active" : "Inactive"}`,
        data: user
    });
});