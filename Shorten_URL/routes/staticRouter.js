const express = require("express"); // Importing Express framework
const URL = require("../models/url"); // Importing the URL model

const router = express.Router(); // Creating an Express router

// Route to handle GET requests to the root path "/"
router.get("/", async (req, res) => {
  // Retrieve all URLs from the database using the URL model
  const allUrls = await URL.find({});

  // Render the "home" view/template and pass the retrieved URLs as data
  return res.render("home", {
    urls: allUrls, // Pass allUrls data to the "urls" variable in the home template
  });
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.get("/login", (req, res) => {
  return res.render("login");
});

module.exports = router; // Export the router to be used by the main application
