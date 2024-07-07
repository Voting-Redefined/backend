const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema({
  dc_id: {
    required: true,
    type: String,
  },
  name: {
    required: true,
    type: String,
  },
  student_id: {
    required: true,
    type: String,
  },
  role: {
    required: true,
    type: String,
  },
  vote: {
    required: true,
    type: Boolean,
  },
});

module.exports = mongoose.model("user", dataSchema);
