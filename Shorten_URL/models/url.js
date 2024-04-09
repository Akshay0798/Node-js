const mongoose = require("mongoose"); // Importing Mongoose for MongoDB operations

// Defining the schema for URL entries in the database
const urlSchema = new mongoose.Schema(
  {
    shortId: {
      type: String,
      required: true,
      unique: true, // Ensures each shortId is unique
    },
    redirectURL: {
      type: String,
      required: true, // URL to redirect to, must be provided
    },
    visitHistory: [{ timestamps: { type: Number } }], // Array to track visit history with timestamps
  },
  { timestamps: true } // Automatically add 'createdAt' and 'updatedAt' fields to each document
);

// Create a model named "URL" using the defined schema
const URL = mongoose.model("url", urlSchema);

module.exports = URL; // Export the URL model for use in other parts of the application
