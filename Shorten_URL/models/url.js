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
  { timestamps: true }
);

//creating a Model
//By using URL i will use Mongo
const URL = mongoose.model("url", urlSchema);
module.exports = URL;
