const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    shortId: {
      type: String,
      required: true,
      unique: true,
    },
    redirectURL: {
      type: String,
      required: true,
    },
    visitHistory: [{ timestamps: { type: Number } }],
  },
  { timestamps: true } // The schema will automatically add 'createdAt' and 'updatedAt' fields to each document
);


// Create a model named "URL" using the schema
const URL = mongoose.model("url", urlSchema);
module.exports = URL;
