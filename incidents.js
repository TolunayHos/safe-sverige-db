const express = require("express");
const router = express.Router();
const Incident = require("./modals/IncidentModel");

router.get("/", (req, res) => {
  res.send("We are on incidents");
});

router.post("/", (req, res) => {
  const incident = new Incident({
    datetime: req.body.datetime,
    name: req.body.name,
    summary: req.body.summary,
    location: {
      name: req.body.location.name,
      gps: req.body.location.gps,
    },
  });
  incident.save().then((data) => {
    res.json(data);
  });
});

module.exports = router;
