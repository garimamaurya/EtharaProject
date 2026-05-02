const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const role = require("../middleware/role");
const Project = require("../models/Project");


// ✅ 1. CREATE PROJECT (Admin only)
router.post("/", auth, role("Admin"), async (req, res) => {
  try {
    const { name, description, members } = req.body;

    const project = new Project({
      name,
      description,
      members,
      createdBy: req.user.id
    });

    await project.save();
    res.json(project);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


// ✅ 2. GET ALL PROJECTS  👈 ADD HERE (below POST)
router.get("/", auth, async (req, res) => {
  try {
    const projects = await Project.find()
      .populate("createdBy", "name email")
      .populate("members", "name email");

    res.json(projects);

  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});


module.exports = router;