const mongoose = require("mongoose");

const questionPaperSchema = new mongoose.Schema(
  {
    u_name: {
      type: String,
      required: true,
    },
    u_email: {
      type: String,
      required: true,
    },
    s_name: {
      type: String,
      required: true,
    },
    s_topic: {
      type: String,
      required: true,
    },
    f_path: {
      type: String,
      required: true,
    },
    p_image: {
      type: String,
    },
    valid: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const SubjectNotes = mongoose.model(
  "ACADEMICQUERIESSUBJECTNOTES",
  questionPaperSchema
);

module.exports = SubjectNotes;
