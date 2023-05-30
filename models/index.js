const mongoose = require("mongoose");
mongoose.set("debug", true);
mongoose.Promise = global.Promise;
mongoose.connect(process.env.DATABASE, { useNewUrlParser: true });

module.exports.PollingUnit = require("./pollingUnit");
module.exports.Agent = require("./pollingAgent");
