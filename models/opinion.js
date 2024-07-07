const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  candidateName: {
    required: true,
    type: String,
  },
  issue: {
    required: true,
    type: String,
  },
  statement: {
    required: true,
    type: String,
  },
});

module.exports = mongoose.model("opinion", dataSchema);
