const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const nodemailer = require("nodemailer");
const QuestionPaper = mongoose.model("ACADEMICQUERIESQUESTIONPAPER");
const Projects = mongoose.model("ACADEMICQUERIESPROJECTS");
const ProjectLanguage = mongoose.model("ACADEMICQUERIESPROJECTLANGUAGE");
const requireLogin = require("../middleware/requiredLogin");

// Create a new project language
router.post("/api/project/languages", requireLogin, async (req, res) => {
  try {
    const { ProjectName } = req.body;
    const existingName = await ProjectLanguage.findOne({ ProjectName });
    if (existingName) {
      return res.status(400).json({ error: "Name already exists" });
    }
    const newProjectLanguage = new ProjectLanguage(req.body);
    const savedProjectLanguage = await newProjectLanguage.save();
    res
      .status(200)
      .json({ savedProjectLanguage, message: "Language added successfully." });
  } catch (error) {
    res.status(500).json({ error: "Error creating a new project language" });
  }
});

// Get a list of all project languages
router.get("/api/project/languages", async (req, res) => {
  try {
    const projectLanguages = await ProjectLanguage.find();
    res.json(projectLanguages);
  } catch (error) {
    res.status(500).json({ error: "Error getting project languages" });
  }
});

// Get a project languages
router.get("/api/project/:languages", async (req, res) => {
  try {
    const {languages} = req.params;
    const projectLanguages = await ProjectLanguage.findOne({ProjectName:languages});
    res.status(200).json(projectLanguages);
  } catch (error) {
    res.status(500).json({ error: "Error getting project languages" });
  }
});

// Delete a specific project language by ID
router.delete("/api/project/language/delete/by/admin/:id",requireLogin, async (req, res) => {
  try {
    const deletedProjectLanguage = await ProjectLanguage.findByIdAndRemove(
      req.params.id
    );
    res.json({deletedProjectLanguage,message:"Project language deleted successfully."});
  } catch (error) {
    res.status(500).json({ error: "Error deleting project language" });
  }
});

module.exports = router;
