// Importing the PollingUnit model
const PollingUnit = require("../models/pollingUnit");

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

// Exporting the pollingUnit controller functions
module.exports = {
  pollingUnit_login_get,
  pollingUnit_login_post,
};
