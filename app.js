const express = require("express");
const mongoose = require("mongoose");
require("dotenv/config");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");

const app = express();

app.use(bodyParser.json());

//Import routes
const incidentsRoute = require("./incidents");
// const IncidentModal = require("./modals/IncidentModal");

//Routes
app.use("/incidents", incidentsRoute);

//Connect to DB
mongoose
  .connect(process.env.DB_CONNECTION)
  .then(() => console.log("Connected to db"))
  .fetch((e) => console.log("Error while connecting to db: " + e));

const IncidentModel = mongoose.model("IncidentReport");

const url = ["https://polisen.se/api/events"];

let resultData;

url.map(async (url) => {
  try {
    console.log("Fetching data from Polisen API...");
    const response = await fetch(url);
    const json = await response.json();
    resultData = [...json];
    for (let i = 0; i < resultData.length; i++) {
      let incident = new IncidentModel({
        datetime: resultData[i].datetime,
        name: resultData[i].name,
        summary: resultData[i].summary,
        type: resultData[i].type,
        location: {
          name: resultData[i].location.name,
          gps: resultData[i].location.gps,
        },
      });

      IncidentModel.findOne({ datetime: incident.datetime }).then(
        (existingIncident) => {
          if (existingIncident) {
          } else {
            incident.save(() => {
              console.log("saved" + incident);
            });
          }
        }
      );
    }
  } catch (error) {
    console.log(error);
  }
});

const PORT = process.env.PORT || 3001; //heroku
app.listen(PORT);
