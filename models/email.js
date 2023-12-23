const mongoose = require("mongoose");

const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  deleted: {
    type: Boolean,
    defau:false
  },
  responded: {
    type: Boolean,
    defau:false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Contact = mongoose.model("ACADEMICQUERIESEMAIL", ContactSchema);

module.exports = Contact;
