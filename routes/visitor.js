const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Visitor = mongoose.model("ACADEMICQUERIESVISITOR");

router.get("/api/count/visitors", async (req, res) => {
  try {
    const visitor = await Visitor.findOne({});
    if (visitor) {
      const countLength = visitor.count;
      res.status(200).json({ count: countLength });
    } else {
      res.status(404).json({ error: "Visitor count not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to get visitor count" });
  }
});

module.exports = router;
