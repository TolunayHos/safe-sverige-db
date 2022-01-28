const express = require("express");
const router = express.Router();
const Incident = require("./modals/IncidentModel");
const mongoose = require("mongoose");
const cities = require("./clusters");

const IncidentModel = mongoose.model("IncidentReport");
const INCLUDED_TYPES = [
  "Misshandel",
  "Försvunnen person",
  "Mord/dråp, försök",
  "Olaga hot",
  "Bedrägeri",
  "Rattfylleri",
  "Inbrott",
  "Stöld",
  "Narkotikabrott",
  "Anträffad död",
  "Åldringsbrott",
  "Mord",
  "Skadegörelse",
  "Skottlossning",
  "Rån",
  "Våld",
  "Ofredande",
  "Vapenlagen",
  "Utlänningslagen",
];

const filterIncidentsBasedOnType = (incidents) => {
  return incidents.filter((incident) => {
    return INCLUDED_TYPES.some((type) => incident.type.includes(type));
  });
};

const findLastReported = (incidents, city) => {
  return incidents
    .filter((incident) => {
      return cities.get(city)?.some((c) => incident.location.name === c);
    })
    .slice(-5);
};

router.get("/", (req, res) => {
  IncidentModel.find((err, incidents) => {
    if (!err) {
      res.json({
        incidents: filterIncidentsBasedOnType(incidents),
        stockholm: {
          lastReported: findLastReported(incidents, "Stockholm"),
          safetyIndex: 7,
        },
        uppsala: {
          lastReported: findLastReported(incidents, "Uppsala"),
          safetyIndex: 7,
        },
      });
    } else {
      console.log("failed to retrieve");
      res.json({
        message: err.message,
        error: err,
      });
    }
  });
});

// router.post("/", (req, res) => {
//   const incident = new Incident({
//     datetime: req.body.datetime,
//     name: req.body.name,
//     summary: req.body.summary,
//     location: {
//       name: req.body.location.name,
//       gps: req.body.location.gps,
//     },
//   });
//   incident.save().then((data) => {
//     res.json(data);
//   });
// });

module.exports = router;
