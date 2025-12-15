const express = require('express');
const connectDB = require('./config/database');
const restaurantRoute = require('./routes/restaurantRoute');
const reviewsRoute = require('./routes/reviewsRoute');
const authRoute = require('./routes/authRoute');
const cors = require('cors');
require('dotenv').config();


const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/restaurants", restaurantRoute);
app.use("/api/reviews", reviewsRoute);
connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
