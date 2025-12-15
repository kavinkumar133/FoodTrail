const express = require("express");
const {
  getRestaurants,
  getRestaurantById,
  addRestaurant,
  getNearbyRestaurants
  ,searchRestaurants
} = require("../controllers/restaurantController");

const protect = require("../middleware/auth");

const router = express.Router();

router.get("/", getRestaurants);
router.get("/search", searchRestaurants);
router.get("/nearby", getNearbyRestaurants);
router.get("/:id", getRestaurantById);
router.post("/", protect, addRestaurant);

module.exports = router;
