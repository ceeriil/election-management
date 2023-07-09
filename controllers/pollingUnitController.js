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

const pollingUnit_viewAll_get = async (req, res) => {
  try {
    const pollingUnits = await PollingUnit.find();

    res.render("pollingUnit/viewAllUnits", { pollingUnits });
  } catch (error) {
    res.render("error", { error: "Error retrieving polling units" });
  }
};

const pollingUnit_options_get = (req, res) => {
  res.render("pollingUnit/option");
};

// Exporting the pollingUnit controller functions
module.exports = {
  pollingUnit_login_get,
  pollingUnit_login_post,
  pollingUnit_results_get,
  pollingUnit_options_get,
  pollingUnit_viewAll_get,
};
