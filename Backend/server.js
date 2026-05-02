require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const projectRoutes = require("./routes/project");
const taskRoutes = require("./routes/task");

// Middleware
const auth = require("./middleware/auth");
const role = require("./middleware/role");

const app = express();

// =======================
// 🔹 Middleware
// =======================
app.use(cors());
app.use(express.json());

// Debug (optional)
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "Loaded" : "Missing");

// =======================
// 🔹 Routes
// =======================
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

// =======================
// 🔹 Protected Routes
// =======================
app.get("/api/protected", auth, (req, res) => {
  res.json({
    msg: "Protected route accessed",
    user: req.user,
  });
});

app.get("/api/admin", auth, role("Admin"), (req, res) => {
  res.json({
    msg: "Welcome Admin",
    user: req.user,
  });
});

// =======================
// 🔹 Test Routes
// =======================
app.get("/test", (req, res) => {
  res.send("TEST WORKING");
});

app.get("/", (req, res) => {
  res.send("API is running...");
});

// =======================
// 🔹 MongoDB Connection
// =======================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");

    // Start server ONLY after DB connects
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB Error:", err.message);
    process.exit(1); // stop app if DB fails
  });