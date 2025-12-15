const Restaurant = require("../models/RestaurantModel");
const Review = require("../models/ReviewsModel");

// Haversine distance calculation
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Get all restaurants
exports.getRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.json(restaurants);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single restaurant with its reviews
exports.getRestaurantById = async (req, res) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate('createdBy', 'name');
    if (!restaurant) return res.status(404).json({ message: 'Not found' });

    const reviews = await Review.find({ restaurant: req.params.id }).populate('user', 'name');
    res.json({ restaurant, reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a restaurant
exports.addRestaurant = async (req, res) => {
  try {
    const { name, cuisine, address, latitude, longitude, image } = req.body;
    if (!name || !latitude || !longitude) return res.status(400).json({ message: 'Missing required fields' });

    const data = { name, cuisine, address, latitude, longitude, image };
    if (req.user && req.user.id) data.createdBy = req.user.id;

    const rest = await Restaurant.create(data);
    res.status(201).json(rest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Nearby restaurants API
exports.getNearbyRestaurants = async (req, res) => {
  try {
    const { lat, lng, radius = 5 } = req.query; // radius in KM
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    const restaurants = await Restaurant.find();

    const nearby = restaurants.filter(r => {
      if (typeof r.latitude !== 'number' || typeof r.longitude !== 'number') return false;
      const dist = getDistance(latNum, lngNum, r.latitude, r.longitude);
      return dist <= parseFloat(radius);
    });

    res.json(nearby);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search restaurants by name, cuisine or address
exports.searchRestaurants = async (req, res) => {
  try {
    const q = req.query.q || '';
    if (!q) {
      const restaurants = await Restaurant.find();
      return res.json(restaurants);
    }
    // Prefer text search for better relevance
    // Pagination
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '20', 10);
    const skip = (page - 1) * limit;

    // Prefer text search for better relevance — but fall back to regex if text search fails
    let restaurants = [];
    let total = 0;
    try {
      restaurants = await Restaurant.find({ $text: { $search: q } }, { score: { $meta: "textScore" } })
        .sort({ score: { $meta: "textScore" } })
        .skip(skip)
        .limit(limit);

      try {
        total = await Restaurant.countDocuments({ $text: { $search: q } });
      } catch (e) {
        total = restaurants.length;
      }
    } catch (textErr) {
      // text search not available (no index) or failed — fallback to regex
      const regex = new RegExp(q, 'i');
      const orQuery = { $or: [{ name: regex }, { cuisine: regex }, { address: regex }] };
      restaurants = await Restaurant.find(orQuery).skip(skip).limit(limit);
      total = await Restaurant.countDocuments(orQuery);
    }

    res.json({ results: restaurants, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
