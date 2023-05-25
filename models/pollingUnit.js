// Importing mongoose
const mongoose = require("mongoose");
const { Schema } = mongoose;

// PollingUnit schema
const pollingUnitSchema = new Schema({
  id: {
    type: Number,
    unique: true,
  },
  name: String,
  state: String,
  totalVotes: Number,
});

// Exporting the model
module.exports = mongoose.model("PollingUnit", pollingUnitSchema);
