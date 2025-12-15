const express = require("express");
const { addReview, getReviews } = require("../controllers/reviewsController");
const protect = require("../middleware/auth");

const router = express.Router();

router.post('/:restaurantId', protect, addReview);
router.get('/:restaurantId', getReviews);

module.exports = router;
