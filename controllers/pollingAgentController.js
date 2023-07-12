const jwt = require("jsonwebtoken");
const PollingAgent = require("../models/pollingAgent");
const PollingUnit = require("../models/pollingUnit");
const Malpractice = require("../models/malpractice");
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

const computePartyVotes = (pollingUnits) => {
  const partyVotes = {
    APC: 0,
    PDP: 0,
    LP: 0,
    APGA: 0,
    ADC: 0,
  };

  const winners = {
    APC: 0,
    PDP: 0,
    LP: 0,
    APGA: 0,
    ADC: 0,
  };

  pollingUnits.forEach((unit) => {
    partyVotes.APC += unit.parties.APC;
    partyVotes.PDP += unit.parties.PDP;
    partyVotes.LP += unit.parties.LP;
    partyVotes.APGA += unit.parties.APGA;
    partyVotes.ADC += unit.parties.ADC;

    const maxVotes = Math.max(
      unit.parties.APC,
      unit.parties.PDP,
      unit.parties.LP,
      unit.parties.APGA,
      unit.parties.ADC
    );

    if (unit.parties.APC === maxVotes) {
      winners.APC++;
    } else if (unit.parties.PDP === maxVotes) {
      winners.PDP++;
    } else if (unit.parties.LP === maxVotes) {
      winners.LP++;
    } else if (unit.parties.APGA === maxVotes) {
      winners.APGA++;
    } else if (unit.parties.ADC === maxVotes) {
      winners.ADC++;
    }
  });

  return { partyVotes, winners };
};

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
  try {
    const allPollingUnits = await PollingUnit.find();

    const { partyVotes, winners } = computePartyVotes(allPollingUnits);

    const parties = [
      { name: "APC" },
      { name: "PDP" },
      { name: "LP" },
      { name: "APGA" },
      { name: "ADC" },
    ];

    const selectedPollingUnitId = req.params.id;
    const selectedUnit = allPollingUnits.find(
      (unit) => unit.id === selectedPollingUnitId
    );

    res.render("pollingAgent/viewAll", {
      pollingUnits: allPollingUnits,
      parties: parties,
      selectedUnit: selectedUnit,
      partyVotes: partyVotes,
      winners: winners,
    });
  } catch (error) {
    res.render("error", { error: "Error retrieving polling units" });
  }
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
    { name: "APC", id: "num1" },
    { name: "PDP", id: "num2" },
    { name: "LP", id: "num3" },
    { name: "APGA", id: "num4" },
    { name: "ADC", id: "num5" },
  ];

  const states = [
    { name: "Abia" },
    { name: "Adamawa" },
    { name: "Akwa Ibom" },
    { name: "Anambra" },
    { name: "Bauchi" },
    { name: "Bayelsa" },
    { name: "Benue" },
    { name: "Borno" },
    { name: "Cross River" },
    { name: "Delta" },
    { name: "Ebonyi" },
    { name: "Edo" },
    { name: "Ekiti" },
    { name: "Enugu" },
    { name: "Gombe" },
    { name: "Imo" },
    { name: "Jigawa" },
    { name: "Kaduna" },
    { name: "Kano" },
    { name: "Katsina" },
    { name: "Kebbi" },
    { name: "Kogi" },
    { name: "Kwara" },
    { name: "Lagos" },
    { name: "Nasarawa" },
    { name: "Niger" },
    { name: "Ogun" },
    { name: "Ondo" },
    { name: "Osun" },
    { name: "Oyo" },
    { name: "Plateau" },
    { name: "Rivers" },
    { name: "Sokoto" },
    { name: "Taraba" },
    { name: "Yobe" },
    { name: "Zamfara" }
  ];

  const { num1, num2, num3, num4, num5 } = req.body;
  const sum =
    parseInt(num1) +
    parseInt(num2) +
    parseInt(num3) +
    parseInt(num4) +
    parseInt(num5);

  res.render("pollingAgent/addPollingUnit", { parties: parties, sum: sum, states: states });
};

const pollingAgent_add_post = async (req, res) => {
  try {
    upload.single("voteImage")(req, res, async (error) => {
      if (error) {
        console.error("Error during file upload:", error);
        return res
          .status(500)
          .send("Error during file upload: " + error.message);
      }

      const {
        id,
        name,
        state,
        localGovernmentArea,
        totalVotes,
        voteImage,
        isMalpractice,
        typeOfMalpractice,
        ...parties
      } = req.body;
      console.log("Input values:", parties);
      if (!req.file) {
        return res.status(400).send("No file uploaded");
      }

      const filePath = req.file.path;
      const updatedFilePath = filePath.replace(/\\/g, "/");
      console.log(updatedFilePath);

      const newPollingUnit = new PollingUnit({
        id: id,
        name: name,
        state: state,
        totalVotes: totalVotes,
        localGovernmentArea: localGovernmentArea,
        isMalpractice: isMalpractice,
        typeofMalpractice: typeOfMalpractice,
        voteImage: updatedFilePath, // Store the file path in the voteImage field
        parties: {
          APC: Number(parties.APC),
          PDP: Number(parties.PDP),
          LP: Number(parties.LP),
          APGA: Number(parties.APGA),
          ADC: Number(parties.ADC),
        },
      });
      newPollingUnit.voteImage = newPollingUnit.voteImage.replace('uploads', '');

      console.log("Polling Unit object:", newPollingUnit);
      console.log("Vote Image:", newPollingUnit.voteImage);

      await newPollingUnit.save();
      res.redirect("/pollingAgent/viewall");
    });
  } catch (error) {
    console.error("Error during file upload:", error);
    res.status(500).send("Error during file upload: " + error.message);
  }
};

const pollingAgent_addmalpractice_post = async (req, res) => {
  const { id, ...malpractices } = req.body;
  console.log("Input values:", id, malpractices);

  const newMalpractice = new Malpractice({
    id: id,
    malpractices: Object.keys(malpractices),
  });

  await newMalpractice.save();
  res.redirect("malpractices");
};

const pollingAgent_getmalpractices = async (req, res) => {
  try {
    const malpractices = await Malpractice.find();
    console.log(malpractices);
    res.render("malpracticeList", { malpractices });
  } catch (error) {
    console.error("Error fetching malpractices:", error);
    res.status(500).json({ error: "Failed to fetch malpractices" });
  }
};




const pollingAgent_view_get = async (req, res) => {
  try {
    const pollingUnitId = req.params.id;
    const pollingUnit = await PollingUnit.findById(pollingUnitId);

    if (!pollingUnit) {
      // Handle if polling unit is not found
      res.render("error", { error: "Polling Unit not found" });
      return;
    }

    // Find the party with the maximum votes
    const parties = Object.entries(pollingUnit.parties);
    const winner = parties.reduce((maxParty, currParty) => {
      if (currParty[1] > maxParty[1]) {
        return currParty;
      } else {
        return maxParty;
      }
    }, parties[0]);

    res.render("pollingAgent/pollingUnitDetails", {
      pollingUnit: pollingUnit,
      winner: winner[0],
    });
  } catch (error) {
    // Handle errors
    res.render("error", { error: "Error retrieving polling unit details" });
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
  pollingAgent_view_get,
  pollingAgent_addmalpractice_post,
  computePartyVotes,
  pollingAgent_getmalpractices
};
