const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ⚠️ IMPORTANT: filename must be lowercase -> user.js
const User = require("../models/user");


// =======================
// 🔹 SIGNUP (Register)
// =======================
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // ✅ Validation
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // ✅ Check existing user
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Create user
    user = new User({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    await user.save();

    // ✅ Generate token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      msg: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// =======================
// 🔹 LOGIN
// =======================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Validation
    if (!email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // ✅ Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // ✅ Generate token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      msg: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;