// Importing the PollingUnit model
const PollingUnit = require("../models/pollingUnit");
const { computePartyVotes } = require("./pollingAgentController");

const pollingUnit_login_get = (req, res) => {
  res.render("pollingUnit/login");
};

const pollingUnit_login_post = async (req, res) => {
  const unitId = req.body.id;
  const pollingUnit = await PollingUnit.findOne({ id: unitId });
  if (!pollingUnit) {
    res.render("pollingUnit/login", {
      error: "Login with correct ID",
    });
  }
  res.render("pollingUnit/view", { unit: pollingUnit });
};

const pollingUnit_results_get = async (req, res) => {
  try {
    const allPollingUnits = await PollingUnit.find();

    const { partyVotes, winners } = computePartyVotes(allPollingUnits);

    res.render("pollingUnit/result", { partyVotes, winners });
  } catch (error) {
    res.render("error", { error: "Error retrieving polling unit results" });
  }
};

// Exporting the pollingUnit controller functions
module.exports = {
  pollingUnit_login_get,
  pollingUnit_login_post,
  pollingUnit_results_get,
};
