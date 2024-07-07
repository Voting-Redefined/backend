const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  name: {
    required: true,
    type: String,
  },
  startDateTime: {
    required: true,
    type: Number,
  },
  endDateTime: {
    required: true,
    type: Number,
  },
  candidates: {
    required: true,
    type: [],
  },
  issues: {
    required: true,
    type: [],
  },
  votes: {
    required: false,
    type: [],
  },
});

module.exports = mongoose.model("event", dataSchema);
