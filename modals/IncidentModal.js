const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const incidentSchema = mongoose.Schema({
  datetime: String,
  name: String,
  summary: String,
  type: String,
  location: {
    name: String,
    gps: String,
  },
});

module.exports = mongoose.model("IncidentReport", incidentSchema);
