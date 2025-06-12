const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/auth.js");

const UserControllers = require("../controllers/UserControllers.js");
const StoreControllers = require("../controllers/StoreControllers.js");
const RatingControllers = require("../controllers/RatingControllers.js");
const DashBoardController = require("../controllers/DashBoardController.js");
const StoreOwnerControllers = require("../controllers/StoreOwnerControllers.js");

router.post("/createusers", UserControllers.createUser); 
router.post("/login", UserControllers.login); 
router.post("/updatepassword", authenticate, UserControllers.updatePassword); 
router.get("/getallusers",  UserControllers.getAllUsers); 
router.post("/getusersbyid",UserControllers.getUserById); 


router.post('/createstore',  StoreControllers.createStore); 
router.get('/getallstores',  StoreControllers.getAllStores); 
router.get('/getstorebyid',  StoreControllers.getStoreById); 


router.post("/createratings",  RatingControllers.createOrUpdateRating); 


router.post("/getratingsforstore",  StoreOwnerControllers.getRatingsForMyStore);
router.get('/stores-with-ratings', StoreOwnerControllers.getAllStoresWithRatings);


router.get("/admindashboard", authenticate, authorize('admin'), DashBoardController.adminDashboard);

module.exports = router;
