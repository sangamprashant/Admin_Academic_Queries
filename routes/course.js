const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const COURSE = mongoose.model("ACADEMICQUERIESCOURSEQUESTIONPAPER");
const requireLogin = require("../middleware/requiredLogin");

// Handle file upload endpoint
router.post("/api/add/course", requireLogin, async (req, res) => {
  const { courseName, coursePath, courseImage } = req.body;

  try {
    // Check if a course with the same courseName or coursePath already exists
    const existingCourse = await COURSE.findOne({
      $or: [{ courseName }, { coursePath }],
    });

    if (existingCourse) {
      return res.status(400).json({ error: "Course already exists." });
    }

    // Create a new Course document
    const course = new COURSE({
      courseImage,
      coursePath,
      courseName,
    });

    // Save the document to MongoDB
    await course.save();

    res.status(200).json({ message: "Course uploaded successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
});

// Get all course question papers
router.get("/api/get/course", (req, res) => {
  COURSE.find()
    .sort({ courseName: 1 })
    .then((courses) => {
      res.status(200).json(courses);
    })
    .catch((error) => {
      console.error("Failed to fetch courses:", error);
      res.status(500).json({ error: "Failed to fetch courses" });
    });
});
// DELETE a question paper by ID
router.delete("/api/course/delete/by/admin/:id", requireLogin, (req, res) => {
  const paperId = req.params.id;

  COURSE.findByIdAndDelete(paperId)
    .then(() => {
      res.status(200).json({ message: "Course deleted successfully" });
    })
    .catch((error) => {
      console.error("Failed to delete Course:", error);
      res.status(500).json({ error: "Failed to delete Course" });
    });
});
module.exports = router;
