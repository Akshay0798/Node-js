const express = require("express"); // Importing Express framework
const {
  handleGenerateNewShortURL,
  handleGetAnalytics,
} = require("../controllers/url"); // Importing controller functions

const router = express.Router(); // Creating an Express router

// POST route to handle generating a new short URL
router.post("/", handleGenerateNewShortURL);

// GET route to handle getting analytics for a short URL
router.get("/analytics/:shortId", handleGetAnalytics);

module.exports = router; // Exporting the router to be used by the main application
