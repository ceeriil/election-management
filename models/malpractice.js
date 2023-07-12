// Importing mongoose
const mongoose = require("mongoose");
const { Schema } = mongoose;

// PollingUnit schema
const MalpracticeSchema = new Schema({
  id: {
    type: String,
    unique: true,
  },
  name: String,
  state: String,
  localGovernmentArea: String,
  malpractices: [String],
});

// Exporting the model
module.exports = mongoose.model("malpractice", MalpracticeSchema);
