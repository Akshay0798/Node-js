const express = require("express");
const fs = require("fs");
const users = require("./MOCK_DATA.json");
const app = express();
const PORT = 8000;

// Middleware - Plugin (plugin ne data uthaya which I write in "postman/POST/Body/x-www-form-urlencoded", javascript object create kiya and "req.body" ke ander dal diya)
app.use(express.urlencoded({ extended: false }));
// Date 23/03/2024 - Express Middleware
app.use((req, res, next) => {
  console.log("Hello from middleware 1");
  req.myUserName = 'ak.umredkar';
  //! return res.json({ message : "Hello from middleware 1" })
  next()
})
app.use((req, res, next) => {
  fs.appendFile('log.txt',`\n${Date.now()} : ${req.ip} | ${req.method} -> ${req.path}`,(err,data)=>{
    next()
  })
  //! console.log("Hello from middleware 2",req.myUserName);
})


// Routes
// Route to get a list of users in HTML format
app.get("/users", (req, res) => {
  const html = `<ul>${users.map((user) => `<li>${user.first_name}</li>`).join("")}</ul>`;
  return res.send(html);
});

// REST API
// Route to get all users in JSON format
app.get("/api/users", (req, res) => {
  //! console.log("I am in get route",req.myUserName)
  return res.json(users);
});

// Route to get, create, update, or delete a specific user

// Handling POST request to create a new user
app.post("/api/users", (req, res) => {
  // Logic to add a new user
  const body = req.body; // whatever data we send from frontend it will store in body
  //! console.log("Body",body); //it will show 'undefine' bcoz express dont know what kind of data it is and how to handle so for that we use middleware
  users.push({ ...body, id: users.length + 1 });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    return res.json({ status: "Success", id: users.length });
  });
});
app
  .route("/api/users/:id")
  .get((req, res) => {
    const userId = Number(req.params.id); // "req.params.id" is used to access route parameters in Express.js.
    const foundUser = users.find((user) => user.id === userId);
    return res.json(foundUser);
  })
  // Handling PATCH request to edit a user
  .patch((req, res) => {
    // Logic to edit user with id
    const userId = Number(req.params.id); // "req.params.id" is used to access route parameters in Express.js.
    const updatedUserData = req.body;
    const userIndex = users.findIndex((user) => user.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ status: "Error", message: "User not found" });
    }
    // Update user's data
    users[userIndex] = { ...users[userIndex], ...updatedUserData };
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
      return res.json({status: "Success",message: "User updated successfully"});
    });
  })
  // Handling DELETE request to delete a user
  .delete((req, res) => {
    // Logic to delete user with id
    const userId = Number(req.params.id);
    const userIndex = users.findIndex((user) => user.id === userId);
    if (userIndex === -1) {
      return res.status(404).json({ status: "Error", message: "User not found" });
    }
    // Remove user from the array
    users.splice(userIndex, 1);
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
      return res.json({status: "Success",message: "User deleted successfully"});
    });
  });

// Start the server
app.listen(PORT, () => console.log(`Server Started at PORT: ${PORT}`));

/* 
.patch:
"userIndex" : This user object represents the user whose data needs to be updated.
{ ...users[userIndex], ...updatedUserData }: This part creates a new object by merging 
the existing user data with the updatedUserData.

JSON.stringify() is a method in JavaScript used to convert a JavaScript object or value to a JSON string.
*/