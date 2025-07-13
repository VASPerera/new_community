const mongoose = require("mongoose");

const AgentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const AgentModel = mongoose.model("Agent", AgentSchema);

module.exports = AgentModel;
