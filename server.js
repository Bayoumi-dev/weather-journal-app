// Setup empty JS object to act as endpoint for all routes
projectData = {};

// Require Express to run server and routes
const express = require("express"),
  // Start up an instance of app
  app = express(),
  /* Dependencies */
  bodyParser = require("body-parser");

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require("cors");
app.use(cors());

// Initialize the main project folder
app.use(express.static("website"));

// Spin up the server
const port = 3000;
app.listen(port, () => console.log(`Running on localhost: ${port}`));

/**
 * GET route
 * Save data
 */
app.get("/all", (req, res) => res.send(projectData));

/**
 * POST route
 * Add data
 */
app.post("/addWeatherData", (req, res) => {
  projectData = req.body;
  res.send(projectData);
});
