const express = require("express");
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const URL = require("./models/url");
const app = express(); // Create a application
const PORT = 8001;

connectToMongoDB("mongodb://127.0.0.1:27017/short-url")
.then(() =>
  console.log("MongoDB Connected...")
);

// Middleware
app.use(express.json());

app.use("/url", urlRoute);

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamps: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server started at PORT : ${PORT}`));
