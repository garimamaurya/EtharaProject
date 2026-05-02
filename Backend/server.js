console.log("🔥 THIS IS THE REAL SERVER FILE RUNNING");
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Debug
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "Loaded" : "Missing");

// Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const projectRoutes = require("./routes/project");
const taskRoutes = require("./routes/task");   

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);    

// Middleware imports
const auth = require("./middleware/auth");
const role = require("./middleware/role");

// ✅ Protected Route
app.get("/api/protected", auth, (req, res) => {
  console.log("✅ Protected route hit");
  res.json({
    msg: "Protected route accessed",
    user: req.user,
  });
});

// ✅ Admin Route
app.get("/api/admin", auth, role("Admin"), (req, res) => {
  res.json({
    msg: "Welcome Admin",
    user: req.user,
  });
});

// ✅ Test Route
app.get("/test", (req, res) => {
  console.log("✅ TEST HIT");
  res.send("TEST WORKING");
});

// Root route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Connect DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("DB Error:", err));

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});