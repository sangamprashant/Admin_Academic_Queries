const mongoose = require("mongoose");

const CoursequestionPaperSchema = new mongoose.Schema(
  {
    subjectPath: { type: String, required: true },
    subjectName: { type: String, required: true },
    subjectImage: { type: String, required: true },
  },
  { timestamps: true } // Add the timestamps option
);

const SubjectName = mongoose.model(
  "ACADEMICQUERIESNAMESUBJECTNOTES",
  CoursequestionPaperSchema
);

module.exports = SubjectName;
