const express = require("express");
const router = express.Router();

const Project = require("../models/project");
const auth = require("../middleware/auth");


// 🔹 GET all projects (only logged-in user's projects)
router.get("/", auth, async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🔹 CREATE new project
router.post("/", auth, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({ msg: "Title is required" });
    }

    const newProject = new Project({
      title,
      description,
      user: req.user.id,
    });

    const savedProject = await newProject.save();
    res.json(savedProject);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🔹 UPDATE project
router.put("/:id", auth, async (req, res) => {
  try {
    const { title, description } = req.body;

    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    // 🔒 Only owner can update
    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    project.title = title || project.title;
    project.description = description || project.description;

    await project.save();
    res.json(project);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🔹 DELETE project
router.delete("/:id", auth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ msg: "Project not found" });
    }

    // 🔒 Only owner can delete
    if (project.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Not authorized" });
    }

    await project.deleteOne();

    res.json({ msg: "Project deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;