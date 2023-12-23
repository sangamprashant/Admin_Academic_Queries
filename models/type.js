const mongoose = require("mongoose");

const TypequestionPaperSchema = new mongoose.Schema({
  valuePath: { type: String, required: true },
  valueName: { type: String, required: true },
});

const TypeQuestionPaper = mongoose.model(
  "ACADEMICQUERIESTYPEQUESTIONPAPER",
  TypequestionPaperSchema
);

module.exports = TypeQuestionPaper;
