const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  description: {
    type: String,
    trim: true,
  },

  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
  },

  // ✅ Link task to logged-in user
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // 📅 Optional: due date
  dueDate: {
    type: Date,
  },

  // ⏱ Auto timestamp
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// export model
module.exports = mongoose.model("Task", taskSchema);