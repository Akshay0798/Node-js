const mongoose = require("mongoose"); // Importing Mongoose for MongoDB operations

// Async function to connect to MongoDB
async function connectToMongoDB(url) {
  // Connect to MongoDB using the provided URL as a Parameter
  return mongoose.connect(url); // This returns a promise representing the connection process
}

// Exporting the connectToMongoDB function for use in other parts of the application
module.exports = {
  connectToMongoDB,
};
