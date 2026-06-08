const express = require("express");
const router = express.Router();
const { verifyJWT } = require("../middleware/auth.js");
const UserControllers = require("../controllers/UserControllers.js");

router.post("/createusers", UserControllers.createUser); 
router.post("/login", UserControllers.login); 
router.post("/logout", UserControllers.logout);
router.post("/updatepassword", verifyJWT, UserControllers.updatePassword); 
router.get("/getallusers", verifyJWT, UserControllers.getAllUsers); 


module.exports = router;
