const mongoose = require("mongoose");

const questionPaperSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    course: {
      type: String,
      required: true,
    },
    pdfPath: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      default: null,
    },
    email: {
      type: String,
      default: null,
    },
    valid: {
      type: Boolean,
    },
  },
  { timestamps: true } // Add the timestamps option
);

const QuestionPaper = mongoose.model(
  "ACADEMICQUERIESQUESTIONPAPER",
  questionPaperSchema
);

module.exports = QuestionPaper;
