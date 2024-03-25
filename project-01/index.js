// Import required modules
const express = require("express");
const fs = require("fs");
const mongoose = require("mongoose");
const users = require("./MOCK_DATA.json");
const app = express();
const PORT = 8000;

// Connect to MongoDB
mongoose
    .connect("mongodb://127.0.0.1:27017/youtube-app-1")
    .then(() => console.log("MongoDB connected")) // Returns promises
    .catch((err) => console.log("Mongo Error", err));

// Define Schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    jobTitle: {
        type: String,
    },
    gender: {
        type: String,
    },
});
const User = mongoose.model("user", userSchema);

// Middleware setup
app.use(express.urlencoded({ extended: false }));

// Middleware for logging
app.use((req, res, next) => {
    console.log("Hello from middleware 1");
    req.myUserName = "ak.umredkar";
    //* return res.json({ message : "Hello from middleware 1" })
    next();
});
app.use((req, res, next) => {
    fs.appendFile(
        "log.txt",
        `\n${Date.now()} : ${req.ip} | ${req.method} -> ${req.path}`,
        (err, data) => {
            next();
        }
    );
    //* console.log("Hello from middleware 2",req.myUserName);
});

// Define Routes

// HTML format route for user list
app.get("/users", (req, res) => {
    const html = `<ul>${users
        .map((user) => `<li>${user.first_name}</li>`)
        .join("")}</ul>`;
    return res.send(html);
});

// JSON format route for all users
app.get("/api/users", (req, res) => {
    res.setHeader("X-MyName", "Akshay Umredkar");
    console.log(req.headers);
    return res.json(users);
});

// CRUD Operations for a specific user

// Create a new user
app.post("/api/users", (req, res) => {
    const body = req.body;
    users.push({ ...body, id: users.length + 1 });
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
        return res.status(201).json({ status: "Success", id: users.length });
    });
});

// Get, update, or delete a specific user
app
    .route("/api/users/:id")
    .get((req, res) => {
        const userId = Number(req.params.id);
        const foundUser = users.find((user) => user.id === userId);
        if (!foundUser) {
            return res.status(404).json({ status: "Error", message: "User not found" });
        }
        return res.json(foundUser);
    })
    .patch((req, res) => {
        const userId = Number(req.params.id);
        const updatedUserData = req.body;
        const userIndex = users.findIndex((user) => user.id === userId);
        if (userIndex === -1) {
            return res
                .status(404)
                .json({ status: "Error", message: "User not found" });
        }
        users[userIndex] = { ...users[userIndex], ...updatedUserData };
        fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
            return res.status(200).json({
                status: "Success",
                message: "User updated successfully",
            });
        });
    })
    .delete((req, res) => {
        const userId = Number(req.params.id);
        const userIndex = users.findIndex((user) => user.id === userId);
        if (userIndex === -1) {
            return res
                .status(404)
                .json({ status: "Error", message: "User not found" });
        }
        users.splice(userIndex, 1);
        fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
            return res.status(200).json({
                status: "Success",
                message: "User deleted successfully",
            });
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
