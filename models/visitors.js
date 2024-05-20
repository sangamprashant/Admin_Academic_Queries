const mongoose = require("mongoose");

const CoursequestionPaperSchema = new mongoose.Schema(
  {
    count: Number,
  },
  { timestamps: true } // Add the timestamps option
);

const CourseQuestionPaper = mongoose.model(
  "ACADEMICQUERIESVISITOR",
  CoursequestionPaperSchema
);

module.exports = CourseQuestionPaper;
