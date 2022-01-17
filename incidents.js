const express = require("express");
const router = express.Router();
const Incident = require("./modals/IncidentModel");
const mongoose = require("mongoose");

const IncidentModel = mongoose.model("IncidentReport");

router.get("/", (req, res) => {
  IncidentModel.find((err, incidents) => {
    if (!err) {
      res.json({
        data: incidents,
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
