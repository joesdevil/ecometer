const express = require("express");
const {
  createBilan,
  updateAndCalculateBilan,
  getBilan,
  getAllBilans,
  deleteBilan,
} = require("../controllers/bilan");
const mongoose = require("mongoose");

const router = express.Router();

// post requests

router.post("/calculateBilan", updateAndCalculateBilan);
router.post("/create-bilan", createBilan);

// get requests

router.get("/:clientId/:year", getBilan);
router.get("/all", getAllBilans);

// delete requests

router.delete("/delete/:clientId/:year", deleteBilan);

module.exports = router;
