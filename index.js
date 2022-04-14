// Require express
const express = require("express");

// Assign to app
const app = express();

//  Http listener
const http = require("http");

// Process port
const port = process.env.port || 3000;

// Rqr file system module
const fs = require("fs");

// Rqr path
const path = require("path");

// Automate slash
const filePath = path.join(process.cwd(), "data/file.json");

const { json } = require("express/lib/response");
const res = require("express/lib/response");

// Parse incoming requests
app.use(express.json());

// Read the JSON file
const developersData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

// Get all developers
app.get("/api/v1/developers/", (req, res, next) => {
  console.log("Fetching all");
  res.status(200).json({
    result: Object.keys(developersData).length,
    status: "SUCCESS",
    data: {
      developersData,
    },
  });
});

// Fetch one developer
app.get("/api/v1/developers/:id", (req, res, next) => {
  const developer = developersData.filter((el) => el.id == req.params.id);
  console.log(`Developer: ${developer[0].name}`);
  res.status(200).json({
    Statu: "SUCCESS",
    data: {
      developer,
    },
    message: "Developer Found",
  });
});

// Delete developer
app.delete("/api/v1/developers/:id", (req, res, next) => {
  //Get developer by id
  let developer = developersData.filter((el) => el.id == req.params.id);

  if (!developer) {
    res.status(500).json({ status: "500", message: "Dev not found" });
  }

  // Delete the developer from the json and write it again
  developersData.splice(developersData.indexOf(developer[0]), 1);
  res.status(200).json({
    data: {
      developersData,
    },
    message: "Dev Deleted",
  });

  // Overwrite the JSON file with the updated one
  const newDevelopersData = JSON.stringify(developersData);
  fs.writeFileSync(filePath, newDevelopersData);
});

// Editing
app.patch("/api/v1/developers/:id", (req, res, next) => {
  const developer = developersData.filter((el) => el.id == req.params.id);
  const { name } = req.body;
  if (!name) {
    res
      .status(500)
      .json({ status: "Error", message: "Null value not allowed" });
  }

  const index = developersData.indexOf(developer[0]);
  developersData[index].name = name;
  // Overwrite file.json with the new data
  fs.writeFileSync(filePath, JSON.stringify(developersData));
  res.status(200).json({
    status: "SUCCESS",
    data: {
      developersData,
    },
  });
});

// Post api
app.post("/api/v1/developers/", (req, res, next) => {
  const newDeveloper = req.body;
  if (!newDeveloper)
    res.status(500).json({
      Status: "Error",
      message: "Null not allowed",
    });

  developersData.push(newDeveloper);
  // OverWrite
  fs.writeFileSync(filePath, JSON.stringify(developersData));
  res.status(200).json({
    status: "SUCCESS",
    message: "Newbie added",
    data: {
      developersData,
    },
  });
});

// Create listener - Option #1
app.listen(port, () => {
  console.log(`Listening in port ${port}...`);
});

// Create server - Option #2
// const server = http.createServer(app);
// server.listen(port, () => {
//   console.log(`Listening on port ${port}...`);
// });
