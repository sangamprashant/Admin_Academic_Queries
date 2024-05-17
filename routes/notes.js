const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const requiredLogin = require("../middleware/requiredLogin");

// Import the SubjectNotes model
const SubjectNotes = mongoose.model("ACADEMICQUERIESSUBJECTNOTES");

// Route to get all notes where verified is false
router.get("/api/subject-notes/unverified", requiredLogin, async (req, res) => {
  try {
    const unverifiedNotes = await SubjectNotes.find({ valid: false });
    res.status(200).json(unverifiedNotes);
  } catch (error) {
    console.error("Failed to retrieve unverified subject notes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Route to get a subject by ID
router.get("/api/subjects-notes/:id", async (req, res) => {
  try {
    const subjectId = req.params.id;
    const subject = await SubjectNotes.findById(subjectId);
    if (!subject) {
      return res.status(404).json({ error: "Subject not found" });
    }
    res.status(200).json(subject);
  } catch (error) {
    console.error("Failed to retrieve subject by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Route to update subject notes by ID
router.post("/api/subject-notes/update/:id", async (req, res) => {
  try {
    const { s_name, s_topic, f_path, p_image, valid } = req.body;
    const { id } = req.params;
    const updatedSubjectNotes = await SubjectNotes.findByIdAndUpdate(
      id,
      { s_name, s_topic, f_path, p_image, valid },
      { new: true } // Set to true to return the updated document
    );
    if (!updatedSubjectNotes) {
      return res.status(404).json({ error: "Subject notes not found" });
    }
    res.status(200).json(updatedSubjectNotes);
  } catch (error) {
    console.error("Failed to update subject notes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Handle file upload endpoint by admin
router.post("/api/admin/upload/notes", requiredLogin, async (req, res) => {
  try {
    const { f_path, s_name, s_topic } = req.body;

    const subjectNotes = new SubjectNotes({
      f_path,
      s_name,
      s_topic,
      valid: true,
    });

    await subjectNotes.save();

    res.status(200).json({ message: "Notes uploaded successfully." });
  } catch (error) {
    console.error("Failed to process file upload:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// // Route to get subject notes by s_name where valid is true
// router.get("/api/subject-notes/:s_name", async (req, res) => {
//   try {
//     const s_name = req.params.s_name;

//     // Retrieve subject notes with the specified s_name and valid is true
//     const subjectNotes = await SubjectNotes.find({ s_name, valid: true });

//     // Respond with the subject notes
//     res.status(200).json(subjectNotes);
//   } catch (error) {
//     console.error("Failed to retrieve subject notes:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// });

module.exports = router;
