const mongoose = require("mongoose");

const CoursequestionPaperSchema = new mongoose.Schema(
  {
    ProjectName: { type: String, required: true },
    ProjectImage: { type: String, required: true },
  },
  { timestamps: true } // Add the timestamps option
);

const ProjectLanguage = mongoose.model(
  "ACADEMICQUERIESPROJECTLANGUAGE",
  CoursequestionPaperSchema
);

module.exports = ProjectLanguage;