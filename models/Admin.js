const mongoose = require("mongoose");

const UserquestionPaperSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
  verificationToken: { type: String, default: null },
});

const UserQuestionPaper = mongoose.model(
  "ACADEMICQUERIESUSERQUESTIONPAPER",
  UserquestionPaperSchema
);

module.exports = UserQuestionPaper;
