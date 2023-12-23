const mongoose = require("mongoose");

const CoursequestionPaperSchema = new mongoose.Schema(
  {
    coursePath: { type: String, required: true },
    courseName: { type: String, required: true },
    courseImage: { type: String, required: true },
  },
  { timestamps: true } // Add the timestamps option
);

const CourseQuestionPaper = mongoose.model(
  "ACADEMICQUERIESCOURSEQUESTIONPAPER",
  CoursequestionPaperSchema
);

module.exports = CourseQuestionPaper;
