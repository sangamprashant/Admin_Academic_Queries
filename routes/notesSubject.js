const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const SubjectName = mongoose.model("ACADEMICQUERIESNAMESUBJECTNOTES");
const requireLogin = require("../middleware/requiredLogin");

// Route to create a new subject name document
router.post("/api/create/subject-names", requireLogin, async (req, res) => {
  try {
    const { subjectPath, subjectName, subjectImage } = req.body;
    if (!subjectPath || !subjectName || !subjectImage) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const newSubjectName = new SubjectName({
      subjectPath,
      subjectName,
      subjectImage,
    });
    await newSubjectName.save();
    res.status(201).json({ message: "Subject name created successfully" });
  } catch (error) {
    console.error("Failed to create subject name:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Route to get all subject names
router.get("/api/get/subject/names", async (req, res) => {
  try {
    const allSubjects = await SubjectName.find();
    res.status(200).json(allSubjects);
  } catch (error) {
    console.error("Failed to retrieve subject names:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
