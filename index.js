require("dotenv").config();
const app = require("./src/app");

// Export the app for serverless deployment
module.exports = app;
