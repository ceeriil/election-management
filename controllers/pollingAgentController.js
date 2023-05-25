// Importing the PollingUnit model
const PollingUnit = require("../models/pollingUnit");

const pollingAgent_login_get = (req, res) => {
  res.render("pollingAgent/pollingAgentLogin");
};

const pollingAgent_login_post = (req, res) => {
  // ******** Polling Agent Login Password **********
  if (req.body.password == "pswd") {
    res.redirect("/pollingAgent/option");
  } else {
    res.render("pollingAgent/pollingAgentLogin", {
      error: "Please Enter Correct Password",
    });
  }
};

const pollingAgent_viewAll_get = async (req, res) => {
  const allPollingUnits = await PollingUnit.find();
  res.render("pollingAgent/viewAll", { pollingUnits: allPollingUnits });
};

const pollingAgent_edit_get = async (req, res) => {
  const pollingUnit = await PollingUnit.findById(req.params.id);
  res.render("pollingAgent/edit", { pollingUnit: pollingUnit });
};

const pollingAgent_edit_post = async (req, res) => {
  await PollingUnit.findByIdAndUpdate(req.params.id, req.body);
  res.redirect("/pollingAgent/viewAll");
};

const pollingAgent_delete_get = async (req, res) => {
  await PollingUnit.findByIdAndDelete(req.params.id);
  res.redirect("/pollingAgent/viewAll");
};

const pollingAgent_option_get = (req, res) => {
  res.render("pollingAgent/option");
};

const pollingAgent_add_get = (req, res) => {
  res.render("pollingAgent/addPollingUnit");
};

const pollingAgent_add_post = async (req, res) => {
  const { id, name, state, totalVotes } = req.body;
  const newPollingUnit = new PollingUnit({
    id: id,
    name: name,
    state: state,
    totalVotes: totalVotes,
  });

  try {
    await newPollingUnit.save();
    res.redirect("/pollingAgent/add");
  } catch (error) {
    res.send("Error: " + error);
  }
};

// Exporting Polling Agent controller functions
module.exports = {
  pollingAgent_login_get,
  pollingAgent_login_post,
  pollingAgent_viewAll_get,
  pollingAgent_edit_get,
  pollingAgent_edit_post,
  pollingAgent_delete_get,
  pollingAgent_add_post,
  pollingAgent_add_get,
  pollingAgent_option_get,
};
