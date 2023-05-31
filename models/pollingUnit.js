// Importing mongoose
const mongoose = require("mongoose");
const { Schema } = mongoose;

// PollingUnit schema
const pollingUnitSchema = new Schema({
  id: {
    type: String,
    unique: true,
  },
  name: String,
  state: String,
  localGovernmentArea: String,
  totalVotes: Number,
  parties: {
    APC: {
      type: Number,
      default: 0,
    },
    PDP: {
      type: Number,
      default: 0,
    },
    LP: {
      type: Number,
      default: 0,
    },
    APGA: {
      type: Number,
      default: 0,
    },
    ADC: {
      type: Number,
      default: 0,
    },
  },
});

// Exporting the model
module.exports = mongoose.model("PollingUnit", pollingUnitSchema);
