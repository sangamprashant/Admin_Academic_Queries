const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const TypeQuestionPaper = mongoose.model("ACADEMICQUERIESTYPEQUESTIONPAPER");
const requireLogin = require("../middleware/requiredLogin");

// Add a new type
router.post("/api/add/types", requireLogin, async (req, res) => {
  const { valuePath, valueName } = req.body;

  try {
    // Check if a type with the same valueName or valuePath already exists
    const existingType = await TypeQuestionPaper.findOne({
      $or: [{ valueName }, { valuePath }],
    });

    if (existingType) {
      return res.status(400).json({ error: "Type already exists." });
    }

    // Create a new TypeQuestionPaper document
    const typeQuestionPaper = new TypeQuestionPaper({
      valuePath,
      valueName,
    });

    // Save the document to MongoDB
    await typeQuestionPaper.save();

    res.status(200).json({ message: "Type created successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to create type", details: error });
  }
});

// Get all types
router.get("/api/get/types", (req, res) => {
  TypeQuestionPaper.find()
    .sort({ valueName: 1 })
    .then((types) => {
      res.status(200).json(types);
    })
    .catch((error) => {
      console.error("Failed to fetch types:", error);
      res.status(500).json({ error: "Failed to fetch types" });
    });
});
// DELETE a question paper by ID
router.delete("/api/type/delete/by/admin/:id", requireLogin, (req, res) => {
  const paperId = req.params.id;

  TypeQuestionPaper.findByIdAndDelete(paperId)
    .then(() => {
      res.status(200).json({ message: "College deleted successfully" });
    })
    .catch((error) => {
      console.error("Failed to delete College:", error);
      res.status(500).json({ error: "Failed to delete college" });
    });
});

module.exports = router;
