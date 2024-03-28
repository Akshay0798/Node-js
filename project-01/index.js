// Import required modules
const express = require("express");
const fs = require("fs");
const mongoose = require("mongoose");
// const users = require("./MOCK_DATA.json"); //comment bcoz i need user list from Databae
const { timeStamp } = require("console");
const app = express();
const PORT = 9000;

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/youtube-app-1") // "Facebook-app-1" DataBase Name
  .then(() => console.log("MongoDB connected")) // Returns promises
  .catch((err) => console.log("Mongo Error", err));

// Define Schema
const userSchema = new mongoose.Schema(
  {
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
  },
  { timestamps: true }
);
//creating a Model
//By using User i will use Mongo
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
// app.get("/users", (req, res) => {
//   const html = `<ul>${users
//     .map((user) => `<li>${user.first_name}</li>`)
//     .join("")}</ul>`;
//   return res.send(html);
// });

//* HTML format route for user list from MongoDB Database
app.get("/users", async (req, res) => {
  const allDBUsers = await User.find({});
  const html = `<ul>
  ${allDBUsers
    .map((user) => `<li>${user.firstName} - ${user.email}</li>`)
    .join("")}
  </ul>`;
  return res.send(html);
});

// JSON format route for all users
// app.get("/api/users", (req, res) => {
//   //always add X to custom header
//   res.setHeader("X-MyName", "Akshay Umredkar"); //custon header
//   console.log(req.headers);
//   return res.json(users);
// });

//* JSON format route for all users from MongoDB DataBase
app.get("/api/users", async (req, res) => {
  const allDBUsers = await User.find({});
  return res.json(allDBUsers);
});

// CRUD Operations for a specific user

// Create a new user
app.post("/api/users", async (req, res) => {
  const body = req.body;
  if (
    !body ||
    !body.first_name ||
    !body.last_name ||
    !body.email ||
    !body.gender ||
    !body.job_title
  ) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Create user in MongoDB
  try {
    const result = await User.create({
      firstName: body.first_name,
      lastName: body.last_name,
      email: body.email,
      gender: body.gender,
      jobTitle: body.job_title,
    });
    console.log("Result", result);
    return res.status(201).json({ message: "Success" });
  } catch (error) {
    console.error("Error creating user:", error);
    return res.status(500).json({ message: "Internal server error." });
  }

  // const newUser = { ...body, id: users.length + 1 };
  // users.push(newUser);

  // fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
  //   if (err) {
  //     console.error("Error writing to file:", err);
  //     return res.status(500).json({ message: "Internal server error." });
  //   }
  //   return res.status(201).json({ status: "Success", id: newUser.id });
  // });
});

// Get, update, or delete a specific user
/*app
  .route("/api/users/:id")
  .get((req, res) => {
    const userId = Number(req.params.id);
    const foundUser = users.find((user) => user.id === userId);
    if (!foundUser) {
      return res
        .status(404)
        .json({ status: "Error", message: "User not found" });
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
*/

// Get, update, or delete a specific user From MongoDB DataBase
app
  .route("/api/users/:id")
  .get(async (req, res) => {
    const userId = await User.findById(req.params.id);
    if (!userId) {
      return res
        .status(404)
        .json({ status: "Error", message: "User not found" });
    }
    return res.json(userId);
  })
  .patch(async(req, res) => {
    const userId = req.params.id;
    const updatedUserData = req.body;

    // Update user in the MongoDB database
    await User.findByIdAndUpdate(userId, updatedUserData, { new: true }).then(
      (updatedUser) => {
        // Check if user was found and updated
        if (!updatedUser) {
          return res
            .status(404)
            .json({ status: "Error", message: "User not found" });
        }

        return res.status(200).json({
          status: "Success",
          message: "User updated successfully",
          user: updatedUser,
        });
      }
    );
  })
  // .patch(async (req, res) => {
  //   const userId = req.params.id;
  //   const newFirstName = "MyHotu"; // Hardcoded new first name value
  //   // Update user's first name in the MongoDB database
  //   await User.findByIdAndUpdate(
  //     userId,
  //     { firstName: newFirstName },
  //     { new: true }
  //   ).then((updatedUser) => {
  //     if (!updatedUser) {
  //       return res
  //         .status(404)
  //         .json({ status: "Error", message: "User not found" });
  //     }
  //     return res.status(200).json({
  //       status: "Success",
  //       message: "User updated successfully",
  //       user: updatedUser,
  //     });
  //   });
  // })
  .delete(async (req, res) => {
    const userId = req.params.id;
    await User.findByIdAndDelete(userId).then((deletedUser) => {
      // Check if user was found and deleted
      if (!deletedUser) {
        return res
          .status(404)
          .json({ status: "Error", message: "User not found" });
      }

      return res.status(200).json({
        status: "Success",
        message: "User deleted successfully",
        user: deletedUser,
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
