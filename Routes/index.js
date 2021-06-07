const express = require("express");
//const router = require("../controllers");

const router = express.Router();


//import the controller
const locationController = require("../controllers/location");
const mealTypeController = require("../controllers/mealtype");
const userController = require("../controllers/user");
const restaurantController = require("../controllers/restaurant");
const menuController = require("../controllers/menu");
const paymentController = require("../controllers/payment");
const orderController = require("../controllers/placeOrder");

// import the route

router.get("/getAllRestaurants", restaurantController.getAllRestaurant);
router.get("/getAllRestaurantById/:restaurantId", restaurantController.getAllRestaurantById);
router.get("/getAllRestaurantByCity/:city", restaurantController.getAllRestaurantByCity);
router.post("/filterRestaurant", restaurantController.filterRestaurant);

router.get("/getLocation", locationController.getLocation);


router.get("/getMealType", mealTypeController.getMealTypes);



router.post("/userSignUp", userController.singUp);
router.post("/logIn", userController.logIn);

router.get("/getMenuByRestaurantId/:restaurantId", menuController.getMenuForRestaurant);

router.post("/payment", paymentController.payment);
router.post("/paymentCallback", paymentController.paymentCallback);


router.post("/placeOrder",orderController.saveOrder);
router.get('/getOrder/:userId',orderController.getOrder);


module.exports = router;