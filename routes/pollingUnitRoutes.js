const express = require("express");
const router = express.Router();
const pollingUnitController = require("../controllers/pollingUnitController");

router.get("/login", pollingUnitController.pollingUnit_login_get);
router.post("/login", pollingUnitController.pollingUnit_login_post);
router.get("/option", pollingUnitController.pollingUnit_options_get);
router.get("/results", pollingUnitController.pollingUnit_results_get);
router.get("/viewAll", pollingUnitController.pollingUnit_viewAll_get);

module.exports = router;
