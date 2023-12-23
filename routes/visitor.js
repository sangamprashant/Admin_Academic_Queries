const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Visitor = mongoose.model("ACADEMICQUERIESVISITOR");

// Route to get the visitor count
router.get("/api/count/visitors", async (req, res) => {
  try {
    const visitor = await Visitor.findOne({});
    if (visitor) {
      const countLength = visitor.counts.length;
      res.status(200).json({ count: countLength });
    } else {
      res.status(404).json({ error: "Visitor count not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to get visitor count" });
  }
});

// Route to increment the visitor count by one and save
router.post("/api/increment/visitors", async (req, res) => {
  try {
    const visitor = await Visitor.findOne({});
    if (visitor) {
      // Increment the count by one
      visitor.counts.push("Prashant");
      const updatedVisitor = await visitor.save();
      res.status(200).json({ count: updatedVisitor.counts.length });
    } else {
      // If visitor document does not exist, create a new one and initialize the count with "adadw"
      const newVisitor = new Visitor({ counts: ["Prashant"] });
      const savedVisitor = await newVisitor.save();
      res.status(200).json({ count: savedVisitor.counts.length });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update visitor count" });
  }
});

module.exports = router;
