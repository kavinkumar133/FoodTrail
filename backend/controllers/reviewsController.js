const Review = require("../models/ReviewsModel");
const Restaurant = require("../models/RestaurantModel");
const User = require("../models/UserModel");

// Add review (allows anonymous or logged users)
exports.addReview = async (req, res) => {
  try {
    const { rating, comment, userName } = req.body;
    const restaurantId = req.params.restaurantId;
    if (!rating || !restaurantId) return res.status(400).json({ message: 'Missing rating or restaurantId' });

    const reviewData = { rating, comment, restaurant: restaurantId };

    // If request is authenticated, attach user id and name
    if (req.user && req.user.id) {
      reviewData.user = req.user.id;
      // fetch user name
      const user = await User.findById(req.user.id);
      if (user) reviewData.userName = user.name;
    } else if (userName) {
      reviewData.userName = userName;
    }

    const review = await Review.create(reviewData);

    // Update average rating
    const reviews = await Review.find({ restaurant: restaurantId });
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Restaurant.findByIdAndUpdate(restaurantId, { avgRating: Number(avg.toFixed(1)) });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get reviews for restaurant
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ restaurant: req.params.restaurantId }).populate('user', 'name');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
