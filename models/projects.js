const mongoose = require("mongoose");

const questionPaperSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      required: true,
    },
    report: {
      type: String,
    },
    ppt: {
      type: String,
    },
    images:[{ type: String }],
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
  { timestamps: true }
);

const Projects = mongoose.model(
  "ACADEMICQUERIESPROJECTS",
  questionPaperSchema
);

module.exports = Projects;
