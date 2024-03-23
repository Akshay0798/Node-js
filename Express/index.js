const express = require("express");

const app = express();
// GET method route

app.get("/", (req, res) => {
  res.send("Hello from HOMEPAGE");
});

app.get("/about", (req, res) => { 
  res.send(
    `I am in about section and my name is ${req.query.name} and my age is ${req.query.age}`
  );
});

app.listen(1000, () => console.log("Server started"));
