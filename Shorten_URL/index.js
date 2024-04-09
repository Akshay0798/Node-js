const express = require("express"); // Importing Express framework
const path = require("path"); // Importing Node.js path module
const { connectToMongoDB } = require("./connect"); // Importing the MongoDB connection function
const urlRoute = require("./routes/url"); // Importing URL route handler
const URL = require("./models/url"); // Importing the URL model
const staticRoute = require("./routes/staticRouter"); // Importing static router
const app = express(); // Create an Express application
const PORT = 8001; // Define the port number

// Connect to MongoDB when the server starts
connectToMongoDB("mongodb://127.0.0.1:27017/short-url").then(() =>
  console.log("MongoDB Connected...")
);

/* 
// Define a route handler for GET requests to "/test"
app.get("/test", async (req, res) => {
  // Retrieve all URLs from the database
  const allUrls = await URL.find({}); // Get all URLs from the database

  // Render the "home" EJS template with data
  return res.render("home", {
    urls: allUrls, // Pass the retrieved URLs as data to the template
  });

  // The code below will not execute after rendering with EJS

  // Alternative HTML response if not using EJS rendering
  return res.end(`
    <html>
    <head></head>
    <body>
      <ol>
        ${allUrls.map((url) =>
          `<li>${url.shortId} - ${url.redirectURL} - ${url.visitHistory.length}</li>`
        ).join('')}
      </ol>
    </body>
    </html>
  `);
});

*/

// Set the view engine to EJS for server-side rendering
app.set("view engine", "ejs");
app.set("views", path.resolve("./views")); // Set the views directory path

// Middleware setup
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded bodies

// Routes setup
app.use("/url", urlRoute); // Mount the URL route handler at "/url"
app.use("/", staticRoute); // Mount the static router at "/"

// Route to handle redirecting to original URL based on short ID
app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  // Find the URL entry by short ID and update visit history with current timestamp
  const entry = await URL.findOneAndUpdate(
    { shortId },
    {
      $push: {
        visitHistory: {
          timestamps: Date.now(),
        },
      },
    }
  );
  // Redirect to the original URL associated with the short ID
  res.redirect(entry.redirectURL);
});

// Start the Express server and listen on the specified port
app.listen(PORT, () => console.log(`Server started at PORT : ${PORT}`));
