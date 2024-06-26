const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const nodemailer = require("nodemailer");
const requiredLogin = require("../middleware/requiredLogin");
const Contact = mongoose.model("ACADEMICQUERIESEMAIL");

router.get("/api/get/contact",requiredLogin, (req, res) => {
  Contact.find({ responded: false })
    .then((contacts) => {
      res.status(200).json(contacts);
    })
    .catch((error) => {
      console.error("Failed to fetch contact details:", error);
      res.status(500).json({ error: "Failed to fetch contact details" });
    });
});

router.get("/api/get/contact/:id",requiredLogin, (req, res) => {
  const messageId = req.params.id;

  Contact.findById(messageId)
    .then((message) => {
      if (!message) {
        return res.status(404).json({ error: "Message not found" });
      }
      res.json(message);
    })
    .catch((error) => {
      console.error("Failed to fetch contact message:", error);
      res.status(500).json({ error: "Failed to fetch contact message" });
    });
});

router.post("/api/reply/:id",requiredLogin, (req, res) => {
  const { id } = req.params;
  const { response, subject } = req.body;

  Contact.findById(id)
    .then((contact) => {
      if (!contact) {
        return res.status(404).json({ error: "Contact not found" });
      }

      // Update the contact with the response and set responded to true
      contact.response = response;
      contact.responded = true;

      return contact.save();
    })
    .then((updatedContact) => {
      // Send email to the user
      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: process.env.EMAIL, // Replace with your own email address
          pass: process.env.EMAIL_PASSWORD, // Replace with your own email password
        },
      });

      const mailOptions = {
        from: `"AcademicQueries" <${process.env.EMAIL}>`, // Replace with your own name and email address
        to: updatedContact.email,
        subject: subject,
        text: response,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Failed to send email:", error);
          return res.status(500).json({ error: "Failed to send email" });
        }
        console.log("Email sent: %s", info.messageId);
        res.json(updatedContact);
      });
    })
    .catch((error) => {
      console.error("Failed to reply to contact:", error);
      res.status(500).json({ error: "Failed to reply to contact" });
    });
});

module.exports = router;
