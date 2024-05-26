const mongoose = require("mongoose");

const appLinkSchema = new mongoose.Schema(
  {
    Path: { type: String, required: true },
    Image: { type: String, required: true },
  },
  { timestamps: true }
);

const AppLink = mongoose.model("ACADEMICQUERIESAPPLINKS", appLinkSchema);

module.exports = AppLink;
