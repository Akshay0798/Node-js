const express = require("express");
const path = require("path"); //built in
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const URL = require("./models/url");
const staticRoute = require("./routes/url");
const app = express(); // Create a application
const PORT = 8001;

connectToMongoDB("mongodb://127.0.0.1:27017/short-url").then(() =>
  console.log("MongoDB Connected...")
);

// set the view engine to ejs
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Middleware
app.use(express.json());
//its a form data and its express.json so need 1 more middleware
app.use(express.urlencoded({ extended: false }));

//EJS - Server side rendering with ejs
/*app.get("/test", async (req, res) => {
  const allUrls = await URL.find({}); //i will get all url
  return res.render("home",{
    urls:allUrls,
  });
  //! After Ejs we dont have to write this 
  return res.end(`
  <html>
  <head></head>
  <body>
  <ol>${allUrls.map((url) =>
        `<li>${url.shortId} - ${url.redirectURL} - ${url.visitHistory.length}</li>`).join('')}</ol>
  </body>
  </html>
  `);
});
*/

app.use("/url", urlRoute);

// creating router for ejs
app.use("/", staticRoute);

app.get("/url/:shortId", async (req, res) => {
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
