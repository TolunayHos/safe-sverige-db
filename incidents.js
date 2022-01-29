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
  let incidentSum = new Map();
  let incidentsArr = findReportedBasedOnCity(incidents, city);

  incidentsArr.map((incident) => {
    const numberOfIncidents = incidentSum.get(incident.type);
    incidentSum.set(
      incident.type,
      numberOfIncidents === undefined ? 0 : numberOfIncidents + 1
    );
  });

  const sortedIncidents = [...incidentSum.entries()].sort(
    (a, b) => b[1] - a[1]
  );

  let mostFrequentIncidents = [];
  for (let i = 0; i < Math.min(sortedIncidents.length, 5); i++) {
    mostFrequentIncidents.push({
      incidentType: sortedIncidents[i][0],
      numberOfIncidents: sortedIncidents[i][1],
    });
  }
  return mostFrequentIncidents;
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
          incidentsPer: Math.trunc(
            findReportedBasedOnCity(incidents, "Stockholm").length / 23
          ),
        },
        blekinge: {
          lastReported: findLastReported(incidents, "Blekinge"),
          safetyIndex: 7,
          incidentSum: incidentSummary(incidents, "Blekinge"),
          incidentsPer: Math.trunc(
            findReportedBasedOnCity(incidents, "Blekinge").length / 1.6
          ),
        },
        dalarna: {
          lastReported: findLastReported(incidents, "Dalarna"),
          safetyIndex: 7,
          incidentsPer: Math.trunc(
            findReportedBasedOnCity(incidents, "Dalarna").length / 2.9
          ),
        },
        gävleborg: {
          lastReported: findLastReported(incidents, "Gävleborg"),
          safetyIndex: 7,
          incidentsPer: Math.trunc(
            findReportedBasedOnCity(incidents, "Gävleborg").length / 2.85
          ),
        },
        halland: {
          lastReported: findLastReported(incidents, "Halland"),
          safetyIndex: 7,
          incidentsPer: Math.trunc(
            findReportedBasedOnCity(incidents, "Halland").length / 3.3
          ),
        },
        jämtland: {
          lastReported: findLastReported(incidents, "Jämtland"),
          safetyIndex: 7,
          incidentsPer: Math.trunc(
            findReportedBasedOnCity(incidents, "Jämtland").length / 1.3
          ),
        },
        jönköping: {
          lastReported: findLastReported(incidents, "Jönköping"),
          safetyIndex: 7,
          incidentsPer: Math.trunc(
            findReportedBasedOnCity(incidents, "Jönköping").length / 0.93
          ),
        },
        kalmar: {
          lastReported: findLastReported(incidents, "Kalmar"),
          safetyIndex: 7,
          incidentsPer: Math.trunc(
            findReportedBasedOnCity(incidents, "Kalmar").length / 0.36
          ),
        },
        kronoberg: {
          lastReported: findLastReported(incidents, "Kronoberg"),
          safetyIndex: 7,
          incidentsPer: Math.trunc(
            findReportedBasedOnCity(incidents, "Kronoberg").length / 2
          ),
        },
        norrbotten: {
          lastReported: findLastReported(incidents, "Norrbotten"),
          safetyIndex: 7,
          incidentsPer: Math.trunc(
            findReportedBasedOnCity(incidents, "Norrbotten").length / 2.5
          ),
        },
        skåne: {
          lastReported: findLastReported(incidents, "Skåne"),
          safetyIndex: 7,
          incidentsPer: Math.trunc(
            findReportedBasedOnCity(incidents, "Skåne").length / 13
          ),
        },
        södermanland: {
          lastReported: findLastReported(incidents, "Södermanland"),
          safetyIndex: 7,
          incidentsPer: Math.trunc(
            findReportedBasedOnCity(incidents, "Södermanland").length / 2.9
          ),
        },
        uppsala: {
          lastReported: findLastReported(incidents, "Uppsala"),
          safetyIndex: 7,
          incidentsPer: Math.trunc(
            findReportedBasedOnCity(incidents, "Uppsala").length / 3.8
          ),
        },
        värmland: {
          lastReported: findLastReported(incidents, "Värmland"),
          safetyIndex: 7,
          incidentsPer: Math.trunc(
            findReportedBasedOnCity(incidents, "Värmland").length / 2.8
          ),
        },
        västerbotten: {
          lastReported: findLastReported(incidents, "Västerbotten"),
          safetyIndex: 7,
          incidentsPer: Math.trunc(
            findReportedBasedOnCity(incidents, "Västerbotten").length / 2.6
          ),
        },
        västernorrland: {
          lastReported: findLastReported(incidents, "Västernorrland"),
          safetyIndex: 7,
          incidentsPer: Math.trunc(
            findReportedBasedOnCity(incidents, "Västernorrland").length / 2.4
          ),
        },
        västmanland: {
          lastReported: findLastReported(incidents, "Västmanland"),
          safetyIndex: 7,
          incidentsPer: Math.trunc(
            findReportedBasedOnCity(incidents, "Västmanland").length / 2.7
          ),
        },
        västraGötaland: {
          lastReported: findLastReported(incidents, "Västra Götaland"),
          safetyIndex: 7,
          incidentsPer: Math.trunc(
            findReportedBasedOnCity(incidents, "Västra Götaland").length / 17
          ),
        },
        örebro: {
          lastReported: findLastReported(incidents, "Örebro"),
          safetyIndex: 7,
          incidentsPer: Math.trunc(
            findReportedBasedOnCity(incidents, "Örebro").length / 3
          ),
        },
        östergötland: {
          lastReported: findLastReported(incidents, "Östergötland"),
          safetyIndex: 7,
          incidentsPer: Math.trunc(
            findReportedBasedOnCity(incidents, "Östergötland").length / 4.5
          ),
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
