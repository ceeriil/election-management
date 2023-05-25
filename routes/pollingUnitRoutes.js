const express = require("express");
const router = express.Router();
const pollingUnitController = require("../controllers/pollingUnitController");

router.get("/login", pollingUnitController.pollingUnit_login_get);
router.post("/login", pollingUnitController.pollingUnit_login_post);

module.exports = router;
