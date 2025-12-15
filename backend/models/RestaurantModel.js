const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String },
  cuisine: { type: String },
  image: { type: String },
  avgRating: { type: Number, default: 0 },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now }
});

// Create a text index for search (name, cuisine, address)
restaurantSchema.index({ name: 'text', cuisine: 'text', address: 'text' });

module.exports = mongoose.model('Restaurant', restaurantSchema);