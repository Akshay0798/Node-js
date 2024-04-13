const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const { connectToMongoDB } = require("./connect");
const {restrictToLoggedinUserOnly,checkAuth} = require('./middleware/auth')
const staticRoute = require("./routes/staticRouter");
const urlRoute = require("./routes/url");
const userRoute = require("./routes/user");
const URL = require("./models/url")

const app = express();
const PORT = 9999;

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use("/",checkAuth, staticRoute);
app.use("/url",restrictToLoggedinUserOnly, urlRoute);
app.use("/user", userRoute);

app.listen(PORT, () => {
  console.log(`Server started at PORT : ${PORT}`);
  connectToMongoDB("mongodb://127.0.0.1:27017/short-url").then(() =>
    console.log("MongoDB Connected...")
  );
});
