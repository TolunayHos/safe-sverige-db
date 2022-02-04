const express = require("express");
const router = express.Router();
const Incident = require("./modals/IncidentModel");
const mongoose = require("mongoose");
const cities = require("./cities");

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
  return filterIncidentsBasedOnType(incidents)
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
      numberOfIncidents === undefined ? 1 : numberOfIncidents + 1
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

const mostReportingCities = (incidents, city) => {
  let incidentsPerCity = new Map();
  let incidentsArr = findReportedBasedOnCity(
    filterIncidentsBasedOnType(incidents),
    city
  );

  incidentsArr.map((incident) => {
    const numberOfIncidents = incidentsPerCity.get(incident.location.name);
    incidentsPerCity.set(
      incident.location.name,
      numberOfIncidents === undefined ? 1 : numberOfIncidents + 1
    );
  });

  const sortedIncidents = [...incidentsPerCity.entries()].sort(
    (a, b) => b[1] - a[1]
  );

  let mostFrequentCities = [];
  for (let i = 0; i < Math.min(sortedIncidents.length, 20); i++) {
    mostFrequentCities.push({
      city: sortedIncidents[i][0],
      numberOfIncidents: sortedIncidents[i][1],
    });
  }
  return mostFrequentCities;
};

router.get("/", (req, res) => {
  IncidentModel.find((err, incidents) => {
    if (!err) {
      res.json({
        incidents: filterIncidentsBasedOnType(incidents),

        citySummary: {
          stockholm: {
            topReportingCities: mostReportingCities(incidents, "Stockholm"),
            lastReported: findLastReported(incidents, "Stockholm"),
            safetyIndex: 7,
            incidentSum: incidentSummary(
              filterIncidentsBasedOnType(incidents),
              "Stockholm"
            ),
            incidentsPer: Math.trunc(
              findReportedBasedOnCity(incidents, "Stockholm").length / 23
            ),
          },
          blekinge: {
            topReportingCities: mostReportingCities(incidents, "Blekinge"),

            lastReported: findLastReported(incidents, "Blekinge"),
            safetyIndex: 7,
            incidentSum: incidentSummary(
              filterIncidentsBasedOnType(incidents),
              "Blekinge"
            ),
            incidentsPer: Math.trunc(
              findReportedBasedOnCity(incidents, "Blekinge").length / 1.6
            ),
          },
          dalarna: {
            topReportingCities: mostReportingCities(incidents, "Dalarna"),

            lastReported: findLastReported(incidents, "Dalarna"),
            safetyIndex: 7,
            incidentSum: incidentSummary(
              filterIncidentsBasedOnType(incidents),
              "Dalarna"
            ),
            incidentsPer: Math.trunc(
              findReportedBasedOnCity(incidents, "Dalarna").length / 2.9
            ),
          },
          gävleborg: {
            topReportingCities: mostReportingCities(incidents, "Gävleborg"),

            lastReported: findLastReported(incidents, "Gävleborg"),
            safetyIndex: 7,
            incidentSum: incidentSummary(
              filterIncidentsBasedOnType(incidents),
              "Gävleborg"
            ),

            incidentsPer: Math.trunc(
              findReportedBasedOnCity(incidents, "Gävleborg").length / 2.85
            ),
          },
          halland: {
            topReportingCities: mostReportingCities(incidents, "Halland"),

            lastReported: findLastReported(incidents, "Halland"),
            safetyIndex: 7,
            incidentSum: incidentSummary(
              filterIncidentsBasedOnType(incidents),
              "Halland"
            ),

            incidentsPer: Math.trunc(
              findReportedBasedOnCity(incidents, "Halland").length / 3.3
            ),
          },
          jämtland: {
            topReportingCities: mostReportingCities(incidents, "Jämtland"),

            lastReported: findLastReported(incidents, "Jämtland"),
            safetyIndex: 7,
            incidentSum: incidentSummary(
              filterIncidentsBasedOnType(incidents),
              "Jämtland"
            ),

            incidentsPer: Math.trunc(
              findReportedBasedOnCity(incidents, "Jämtland").length / 1.3
            ),
          },
          jönköping: {
            topReportingCities: mostReportingCities(incidents, "Jönköping"),

            lastReported: findLastReported(incidents, "Jönköping"),
            safetyIndex: 7,
            incidentSum: incidentSummary(
              filterIncidentsBasedOnType(incidents),
              "Jönköping"
            ),

            incidentsPer: Math.trunc(
              findReportedBasedOnCity(incidents, "Jönköping").length / 0.93
            ),
          },
          kalmar: {
            topReportingCities: mostReportingCities(incidents, "Kalmar"),

            lastReported: findLastReported(incidents, "Kalmar"),
            safetyIndex: 7,
            incidentSum: incidentSummary(
              filterIncidentsBasedOnType(incidents),
              "Kalmar"
            ),

            incidentsPer: Math.trunc(
              findReportedBasedOnCity(incidents, "Kalmar").length / 0.36
            ),
          },
          kronoberg: {
            topReportingCities: mostReportingCities(incidents, "Kronoberg"),

            lastReported: findLastReported(incidents, "Kronoberg"),
            safetyIndex: 7,
            incidentSum: incidentSummary(
              filterIncidentsBasedOnType(incidents),
              "Kronoberg"
            ),

            incidentsPer: Math.trunc(
              findReportedBasedOnCity(incidents, "Kronoberg").length / 2
            ),
          },
          norrbotten: {
            topReportingCities: mostReportingCities(incidents, "Norrbotten"),

            lastReported: findLastReported(incidents, "Norrbotten"),
            safetyIndex: 7,
            incidentSum: incidentSummary(
              filterIncidentsBasedOnType(incidents),
              "Norrbotten"
            ),

            incidentsPer: Math.trunc(
              findReportedBasedOnCity(incidents, "Norrbotten").length / 2.5
            ),
          },
          skåne: {
            topReportingCities: mostReportingCities(incidents, "Skåne"),

            lastReported: findLastReported(incidents, "Skåne"),
            safetyIndex: 7,
            incidentSum: incidentSummary(
              filterIncidentsBasedOnType(incidents),
              "Skåne"
            ),

            incidentsPer: Math.trunc(
              findReportedBasedOnCity(incidents, "Skåne").length / 13
            ),
          },
          södermanland: {
            topReportingCities: mostReportingCities(incidents, "Södermanland"),

            lastReported: findLastReported(incidents, "Södermanland"),
            safetyIndex: 7,
            incidentSum: incidentSummary(
              filterIncidentsBasedOnType(incidents),
              "Södermanland"
            ),

            incidentsPer: Math.trunc(
              findReportedBasedOnCity(incidents, "Södermanland").length / 2.9
            ),
          },
          uppsala: {
            topReportingCities: mostReportingCities(incidents, "Uppsala"),

            lastReported: findLastReported(incidents, "Uppsala"),
            safetyIndex: 7,
            incidentSum: incidentSummary(
              filterIncidentsBasedOnType(incidents),
              "Uppsala"
            ),

            incidentsPer: Math.trunc(
              findReportedBasedOnCity(incidents, "Uppsala").length / 3.8
            ),
          },
          värmland: {
            topReportingCities: mostReportingCities(incidents, "Värmland"),

            lastReported: findLastReported(incidents, "Värmland"),
            safetyIndex: 7,
            incidentSum: incidentSummary(
              filterIncidentsBasedOnType(incidents),
              "Värmland"
            ),

            incidentsPer: Math.trunc(
              findReportedBasedOnCity(incidents, "Värmland").length / 2.8
            ),
          },
          västerbotten: {
            topReportingCities: mostReportingCities(incidents, "Västerbotten"),

            lastReported: findLastReported(incidents, "Västerbotten"),
            safetyIndex: 7,
            incidentSum: incidentSummary(
              filterIncidentsBasedOnType(incidents),
              "Västerbotten"
            ),

            incidentsPer: Math.trunc(
              findReportedBasedOnCity(incidents, "Västerbotten").length / 2.6
            ),
          },
          västernorrland: {
            topReportingCities: mostReportingCities(
              incidents,
              "Västernorrland"
            ),

            lastReported: findLastReported(incidents, "Västernorrland"),
            safetyIndex: 7,
            incidentSum: incidentSummary(
              filterIncidentsBasedOnType(incidents),
              "Västernorrland"
            ),

            incidentsPer: Math.trunc(
              findReportedBasedOnCity(incidents, "Västernorrland").length / 2.4
            ),
          },
          västmanland: {
            topReportingCities: mostReportingCities(incidents, "Västmanland"),

            lastReported: findLastReported(incidents, "Västmanland"),
            safetyIndex: 7,
            incidentSum: incidentSummary(
              filterIncidentsBasedOnType(incidents),
              "Västmanland"
            ),

            incidentsPer: Math.trunc(
              findReportedBasedOnCity(incidents, "Västmanland").length / 2.7
            ),
          },
          västraGötaland: {
            topReportingCities: mostReportingCities(
              incidents,
              "Västra Götaland"
            ),

            lastReported: findLastReported(incidents, "Västra Götaland"),
            safetyIndex: 7,
            incidentSum: incidentSummary(
              filterIncidentsBasedOnType(incidents),
              "Västra Götaland"
            ),

            incidentsPer: Math.trunc(
              findReportedBasedOnCity(incidents, "Västra Götaland").length / 17
            ),
          },
          örebro: {
            topReportingCities: mostReportingCities(incidents, "Örebro"),

            lastReported: findLastReported(incidents, "Örebro"),
            safetyIndex: 7,
            incidentSum: incidentSummary(
              filterIncidentsBasedOnType(incidents),
              "Örebro"
            ),

            incidentsPer: Math.trunc(
              findReportedBasedOnCity(incidents, "Örebro").length / 3
            ),
          },
          östergötland: {
            topReportingCities: mostReportingCities(incidents, "Östergötland"),

            lastReported: findLastReported(incidents, "Östergötland"),
            safetyIndex: 7,
            incidentSum: incidentSummary(
              filterIncidentsBasedOnType(incidents),
              "Östergötland"
            ),

            incidentsPer: Math.trunc(
              findReportedBasedOnCity(incidents, "Östergötland").length / 4.5
            ),
          },
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
