const express = require("express");
const router = express.Router();
const pollingAgentController = require("../controllers/pollingAgentController");
const auth = require("../middlewares/auth");

router.get("/login", pollingAgentController.pollingAgent_login_get);
router.post("/login", pollingAgentController.pollingAgent_login_post);
router.get("/viewall", pollingAgentController.pollingAgent_viewAll_get);
router.get("/view/:id", pollingAgentController.pollingAgent_view_get);
router.get("/edit/:id", pollingAgentController.pollingAgent_edit_get);
router.post("/edit/:id", pollingAgentController.pollingAgent_edit_post);
router.get("/delete/:id", pollingAgentController.pollingAgent_delete_get);
router.get("/option", pollingAgentController.pollingAgent_option_get);
router.post("/add", pollingAgentController.pollingAgent_add_post);
router.get("/add", pollingAgentController.pollingAgent_add_get);
router.get(
  "/reportmalpractice",
  pollingAgentController.pollingAgent_report_get
);
router.get(
  "/malpractices",
  pollingAgentController.pollingAgent_getmalpractices
);
router.post(
  "/reportmalpractice",
  pollingAgentController.pollingAgent_addmalpractice_post
);
module.exports = router;
