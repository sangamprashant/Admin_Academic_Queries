const mongoose = require("mongoose");

const CoursequestionPaperSchema = new mongoose.Schema(
  {
    counts: {
      type: [String],
      default: ["adadw"], // Initialize with "adadw" on the first visit
    },
  },
  { timestamps: true } // Add the timestamps option
);

const CourseQuestionPaper = mongoose.model(
  "ACADEMICQUERIESVISITOR",
  CoursequestionPaperSchema
);

module.exports = CourseQuestionPaper;
