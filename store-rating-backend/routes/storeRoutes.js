const express = require("express");
const router = express.Router();
const { verifyJWT } = require("../middleware/auth.js");
const StoreControllers = require("../controllers/StoreControllers.js");
const StoreOwnerControllers = require("../controllers/StoreOwnerControllers.js");

router.post('/createstore', verifyJWT, StoreControllers.createStore); 
router.post("/getratingsforstore", verifyJWT, StoreOwnerControllers.getRatingsForMyStore);
router.get('/stores-with-ratings', StoreOwnerControllers.getAllStoresWithRatings);



module.exports = router;
