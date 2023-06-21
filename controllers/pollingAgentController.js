const jwt = require("jsonwebtoken");
const PollingAgent = require("../models/pollingAgent");
const PollingUnit = require("../models/pollingUnit");
const multer = require("multer");

// Set up multer storage configuration
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = file.originalname.split(".").pop();
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + fileExtension);
  },
});

const upload = multer({ storage: storage });


// const fileFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image/")) {
//     cb(null, true);
//   } else {
//     cb(new Error("File type not supported"), false);
//   }
// };

// const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
// }).single("voteImage");


const pollingAgent_login_get = (req, res) => {
  res.render("pollingAgent/pollingAgentLogin");
};

const pollingAgent_login_post = async (req, res) => {
  const pollingAgent = await PollingAgent.findOne({
    username: req.body.username,
  });

  if (!pollingAgent) {
    res.render("pollingAgent/pollingAgentLogin", {
      error: "Invalid username and password",
    });
    return;
  }

  const { id, username } = pollingAgent;
  const valid = await pollingAgent.comparePassword(req.body.password);
  if (valid) {
    const token = jwt.sign({ id, username }, process.env.SECRET);
    res.redirect("/pollingAgent/option");
    return;
  }
  res.render("pollingAgent/pollingAgentLogin", {
    error: "Invalid username and password",
  });
  return;
};

const pollingAgent_viewAll_get = async (req, res) => {
  const allPollingUnits = await PollingUnit.find();

  const parties = [
    { name: "APC", },
    { name: "PDP", },
    { name: "LP", },
    { name: "APGA", },
    { name: "ADC", },
  ];

  const selectedPollingUnitId = req.params.id;
  const selectedUnit = allPollingUnits.find(unit => unit.id === selectedPollingUnitId);
  res.render("pollingAgent/viewAll", { pollingUnits: allPollingUnits, parties: parties, selectedUnit: selectedUnit });
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
  const parties = [
    { name: "APC", id: 'num1' },
    { name: "PDP", id: 'num2' },
    { name: "LP", id: 'num3' },
    { name: "APGA", id: 'num4' },
    { name: "ADC", id: 'num5' },
  ];

  const { num1, num2, num3, num4, num5 } = req.body;
  const sum = parseInt(num1) + parseInt(num2) + parseInt(num3) + parseInt(num4) + parseInt(num5);

  res.render("pollingAgent/addPollingUnit", { parties: parties, sum: sum });
};

const pollingAgent_add_post = async (req, res) => {
  try {
    upload.single("voteImage")(req, res, async (error) => {
      if (error) {
        console.error("Error during file upload:", error);
        return res.status(500).send("Error during file upload: " + error.message);
      }

      const { id, name, state, localGovernmentArea, totalVotes, voteImage, ...parties } = req.body;
      console.log("Input values:", parties);
      if (!req.file) {
        return res.status(400).send("No file uploaded");
      }

      const filePath = req.file.path;
      const updatedFilePath = filePath.replace(/\\/g, '/');
      console.log(updatedFilePath);

      const newPollingUnit = new PollingUnit({
        id: id,
        name: name,
        state: state,
        totalVotes: totalVotes,
        localGovernmentArea: localGovernmentArea,
        voteImage: updatedFilePath, // Store the file path in the voteImage field
        parties: {
          APC: Number(parties.APC),
          PDP: Number(parties.PDP),
          LP: Number(parties.LP),
          APGA: Number(parties.APGA),
          ADC: Number(parties.ADC),
        },
      });

      console.log("Polling Unit object:", newPollingUnit);
      console.log("Vote Image:", newPollingUnit.voteImage);

      await newPollingUnit.save();
      res.redirect("/pollingAgent/add");
    });
  } catch (error) {
    console.error("Error during file upload:", error);
    res.status(500).send("Error during file upload: " + error.message);
  }
};



const pollingAgent_report_get = (req, res) => {
  res.render("pollingAgent/reportMalpractice");
};

// Exporting Polling Agent controller functions
module.exports = {
  pollingAgent_login_get,
  pollingAgent_login_post,
  pollingAgent_viewAll_get,
  pollingAgent_add_post,
  pollingAgent_edit_get,
  pollingAgent_edit_post,
  pollingAgent_delete_get,
  pollingAgent_add_post,
  pollingAgent_add_get,
  pollingAgent_option_get,
  pollingAgent_report_get,
};
