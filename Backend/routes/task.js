const express = require("express");
const router = express.Router();

const Task = require("../models/task");
const auth = require("../middleware/auth"); // 🔐 JWT middleware

// ✅ CREATE TASK (for logged-in user)
router.post("/", auth, async (req, res) => {
  try {
    const { title, description } = req.body;

    const newTask = new Task({
      title,
      description,
      user: req.user.id, // 🔥 important (link task to user)
    });

    const savedTask = await newTask.save();
    res.json(savedTask);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// ✅ GET ALL TASKS (only for that user)
router.get("/", auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// ✅ UPDATE TASK
router.put("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ msg: "Task not found" });

    // 🔒 ensure user owns this task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedTask);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// ✅ DELETE TASK
router.delete("/:id", auth, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ msg: "Task not found" });

    // 🔒 ensure user owns this task
    if (task.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await task.deleteOne();

    res.json({ msg: "Task deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;