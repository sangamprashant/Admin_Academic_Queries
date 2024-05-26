const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const requireLogin = require("../middleware/requiredLogin");
const AppLink = require("../models/appLinks");

// Create a new app link
router.post("/api/app-links/create", requireLogin, async (req, res) => {
  const { Path, Image } = req.body;
  if (!Path || !Image) {
    return res.status(422).json({ error: "Please add all the fields" });
  }
  try {
    const newAppLink = new AppLink({ Path, Image });
    await newAppLink.save();
    res.status(201).json(newAppLink);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create app link" });
  }
});

// Get all app links
router.get("/api/app-links/get", requireLogin, async (req, res) => {
  try {
    const appLinks = await AppLink.find();
    res.status(200).json(appLinks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch app links" });
  }
});

// Delete an app link by ID
router.delete("/api/app-links/delete/:id", requireLogin, async (req, res) => {
  const { id } = req.params;
  try {
    const appLink = await AppLink.findByIdAndDelete(id);
    if (!appLink) {
      return res.status(404).json({ error: "App link not found" });
    }
    res.status(200).json({ message: "App link deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete app link" });
  }
});

module.exports = router;
