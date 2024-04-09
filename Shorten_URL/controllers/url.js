const shortid = require("shortid"); // Importing the shortid library for generating unique short IDs
const URL = require("../models/url.js"); // Importing the URL model

// Function to handle generating a new short URL
async function handleGenerateNewShortURL(req, res) {
  try {
    const body = req.body;

    // Check if URL is provided in the request body
    if (!body.url) return res.status(400).json({ error: "URL is required" });

    const shortID = shortid(); // Generate a new short ID using shortid library

    // Create a new URL entry in the database
    await URL.create({
      shortId: shortID,
      redirectURL: body.url,
      visitHistory: [], // Initialize visit history as an empty array
    });

    // Render the home page with the generated short ID
    return res.render("home", { id: shortID });
  } catch (error) {
    console.error("Error generating short URL:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

// Function to handle getting analytics for a short URL
async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });

  // Return analytics data including total clicks and visit history
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
};
