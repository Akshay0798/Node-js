const http = require("http");
const fs = require("fs");
const url  = require("url")
//I create a web server
const myServer = http.createServer((req, res) => {
  if(req.url === "/favicon.ico") return res.end() //for avoid favicon
  const log = `${Date.now()}: ${req.url} New Request Received Now\n`;

  const myUrl = url.parse(req.url,true);
  console.log(myUrl)

  fs.appendFile("log.txt", log, (err, data) => {
    switch (myUrl.pathname) {
      case "/":
        res.end("hello ,This is Home Page");
        break;
      case "/about":
        const username = myUrl.query.myName; 
        res.end(`My name is ${username}`);
        break;
      default:
        res.end("404 Not Found");
    }
  });
});

myServer.listen(8000, () => console.log("Server Started"));
