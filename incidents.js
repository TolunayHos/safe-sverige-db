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

const findReportedBasedOnCity = (incidents, city) => {
  return incidents.filter((incident) => {
    return cities.get(city)?.some((c) => incident.location.name === c);
  });
};

const incidentSummary = (incidents, city) => {
  let incidentsArr = findReportedBasedOnCity(incidents, city);
  let incidentRan = [];
  let incidentBedr = [];
  let incidentMord = [];
  let incidentNark = [];
  let incidentSkottlos = [];
  let incidentMissh = [];
  let incidentHot = [];
  let incidentStold = [];
  let incidentVald = [];
  let incidentOfre = [];

  for (let i = 0; i < incidentsArr.length; i++) {
    (incidentsArr[i].type === "Rån" && incidentRan.push(incidentsArr[i])) ||
      (incidentsArr[i].type === "Bedrägeri" &&
        incidentBedr.push(incidentsArr[i])) ||
      (incidentsArr[i].type === "Mord/dråp, försök" &&
        incidentMord.push(incidentsArr[i])) ||
      (incidentsArr[i].type === "Narkotikabrott" &&
        incidentNark.push(incidentsArr[i])) ||
      (incidentsArr[i].type === "Skottlossning" &&
        incidentSkottlos.push(incidentsArr[i]));
    (incidentsArr[i].type === "Misshandel" &&
      incidentMissh.push(incidentsArr[i])) ||
      (incidentsArr[i].type === "Olaga hot" &&
        incidentHot.push(incidentsArr[i])) ||
      (incidentsArr[i].type === "Stöld" &&
        incidentStold.push(incidentsArr[i])) ||
      (incidentsArr[i].type === "Våld" && incidentVald.push(incidentsArr[i])) ||
      (incidentsArr[i].type === "Ofredande" &&
        incidentOfre.push(incidentsArr[i]));
  }

  let incidentObj = {
    IncidentRobbery: incidentRan.length,
    IncidentFraud: incidentBedr.length,
    IncidentMurder: incidentMord.length,
    IncidentDrug: incidentNark.length,
    IncidentShooting: incidentSkottlos.length,
    IncidentAbuse: incidentMissh.length,
    IncidentThreat: incidentHot.length,
    IncidentTheft: incidentStold.length,
    IncidentViolence: incidentVald.length,
    IncidentMolestation: incidentOfre.length,
  };

  return incidentObj;
};

router.get("/", (req, res) => {
  IncidentModel.find((err, incidents) => {
    if (!err) {
      res.json({
        incidents: filterIncidentsBasedOnType(incidents),
        stockholm: {
          lastReported: findLastReported(incidents, "Stockholm"),
          safetyIndex: 7,
          incidentSum: incidentSummary(incidents, "Stockholm"),
        },
        blekinge: {
          lastReported: findLastReported(incidents, "Blekinge"),
          safetyIndex: 7,
          incidentSum: incidentSummary(incidents, "Blekinge"),
        },
        dalarna: {
          lastReported: findLastReported(incidents, "Dalarna"),
          safetyIndex: 7,
        },
        gävleborg: {
          lastReported: findLastReported(incidents, "Gävleborg"),
          safetyIndex: 7,
        },
        halland: {
          lastReported: findLastReported(incidents, "Halland"),
          safetyIndex: 7,
        },
        jämtland: {
          lastReported: findLastReported(incidents, "Jämtland"),
          safetyIndex: 7,
        },
        jönköping: {
          lastReported: findLastReported(incidents, "Jönköping"),
          safetyIndex: 7,
        },
        kalmar: {
          lastReported: findLastReported(incidents, "Kalmar"),
          safetyIndex: 7,
        },
        kronoberg: {
          lastReported: findLastReported(incidents, "Kronoberg"),
          safetyIndex: 7,
        },
        norrbotten: {
          lastReported: findLastReported(incidents, "Norrbotten"),
          safetyIndex: 7,
        },
        skåne: {
          lastReported: findLastReported(incidents, "Skåne"),
          safetyIndex: 7,
        },
        södermanland: {
          lastReported: findLastReported(incidents, "Södermanland"),
          safetyIndex: 7,
        },
        uppsala: {
          lastReported: findLastReported(incidents, "Uppsala"),
          safetyIndex: 7,
        },
        värmland: {
          lastReported: findLastReported(incidents, "Värmland"),
          safetyIndex: 7,
        },
        västerbotten: {
          lastReported: findLastReported(incidents, "Västerbotten"),
          safetyIndex: 7,
        },
        västernorrland: {
          lastReported: findLastReported(incidents, "Västernorrland"),
          safetyIndex: 7,
        },
        västmanland: {
          lastReported: findLastReported(incidents, "Västmanland"),
          safetyIndex: 7,
        },
        västraGötaland: {
          lastReported: findLastReported(incidents, "Västra Götaland"),
          safetyIndex: 7,
        },
        örebro: {
          lastReported: findLastReported(incidents, "Örebro"),
          safetyIndex: 7,
        },
        östergötland: {
          lastReported: findLastReported(incidents, "Östergötland"),
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
