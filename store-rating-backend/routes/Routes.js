const express = require("express");
const router = express.Router();

const userRoutes = require("./userRoutes");
const storeRoutes = require("./storeRoutes");
const ratingRoutes = require("./ratingRoutes");
const adminRoutes = require("./adminRoutes");

router.use("/", userRoutes);
router.use("/", storeRoutes);
router.use("/", ratingRoutes);
router.use("/", adminRoutes);

module.exports = router;
