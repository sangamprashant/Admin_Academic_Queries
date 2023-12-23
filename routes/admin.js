const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const UserQuestionPaper = require("../models/Admin");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

router.post("/api/signin", (req, res) => {
  const { email, password } = req.body;
  UserQuestionPaper.findOne({ email })
    .then((user) => {
      if (!user) {
        return res.status(400).json({ error: "Invalid email or password" });
      }

      bcrypt.compare(password, user.password, (error, isMatch) => {
        if (error) {
          console.log(error);
          return res.status(500).json({ error: "Server Error" });
        }

        if (!isMatch) {
          return res.status(400).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign(
          { userId: user._id, email: user.email },
          process.env.JWT_SECRET
        );

        const userDetails = {
          email: user.email,
          _id: user._id,
        };

        res.json({ message: "Sign-in successful", user: userDetails, token });
      });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: "Server Error" });
    });
});
// Endpoint to check email
router.post("/api/check/email", async (req, res) => {
  const { email } = req.body;
  const user = await UserQuestionPaper.findOne({ email: email });
  user.verificationToken = crypto.randomBytes(20).toString("hex");
  await user.save();
  await sendVerificationEmail(user.email, user.verificationToken);
  res.status(200).json({ message: "Verification email sent." });
});

const sendVerificationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "academicquries.me@gmail.com",
    to: email,
    subject: "Email Verification",
    html: `<p>Please click <a href="${process.env.DOMAIN}/api/verify/${token}">here</a> to verify your email.</p>`,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending verification email:", error);
        reject(error);
      } else {
        console.log("Verification email sent:", info.response);
        resolve(info);
      }
    });
  });
};

router.post("/api/verify/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await UserQuestionPaper.findOne({ verificationToken: token });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found for the provided token" });
    }

    // Hash the new password
  bcrypt.hash(password, 12, (error, hashedPassword) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ error: "Server Error" });
    }

    // Update the user's password
    UserQuestionPaper.findOneAndUpdate({ email }, { password: hashedPassword , verificationToken:null})
      .then((updatedUser) => {
        if (!updatedUser) {
          return res.status(400).json({ error: "User not found" });
        }
        res.json({ message: "Password reset successful" });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({ error: "Server Error" });
      });
  });
    res.status(200).json({ message: "Password updated secessfully", user });
  } catch (error) {
    console.error("Error during email verification:", error);
    res.status(500).json({ message: "Server error during email verification" });
  }
});

module.exports = router;
