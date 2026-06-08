const express = require("express");
const router = express.Router();
const { verifyJWT, allowedRoles } = require("../middleware/auth.js");
const DashBoardController = require("../controllers/DashBoardController.js");

router.get("/admindashboard", verifyJWT, allowedRoles(['admin']), DashBoardController.adminDashboard);

module.exports = router;
