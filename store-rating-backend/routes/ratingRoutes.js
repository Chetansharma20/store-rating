const express = require("express");
const router = express.Router();
const RatingControllers = require("../controllers/RatingControllers.js");

router.post("/createratings", RatingControllers.createOrUpdateRating); 

module.exports = router;
