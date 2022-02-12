const express = require("express");
const mongoose = require("mongoose");
require("dotenv/config");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const Agenda = require("agenda");

const app = express();

app.use(bodyParser.json());

//Import routes
const incidentsRoute = require("./incidents");
// const IncidentModal = require("./modals/IncidentModal");

var cors = require("cors");
app.use(
  cors({
    credentials: true,
    optionSuccessStatus: 200,
  })
);

//Routes
app.use("/incidents", incidentsRoute);

//Connect to DB
mongoose
  .connect(process.env.DB_CONNECTION)
  .then(() => console.log("Connected to db"))
  .catch((e) => console.log("Error while connecting to db: " + e));

const IncidentModel = mongoose.model("IncidentReport");

const url = ["https://polisen.se/api/events"];

let resultData;

const agenda = new Agenda({
  db: { address: process.env.DB_CONNECTION },
  processEvery: "30 seconds",
  lockLimit: 1,
  defaultConcurrency: 1,
});

agenda.define(
  "fetch data from Polisen API and store to db",
  { priority: "high", concurrency: 1 },
  async (job) =>
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
    })
);

(async function () {
  const fetchAndUpdate = agenda.create(
    "fetch data from Polisen API and store to db"
  );
  await agenda.start();

  await fetchAndUpdate.repeatEvery("0 19 * * *").save();
})();

const PORT = process.env.PORT || 3001; //heroku
app.listen(PORT);
