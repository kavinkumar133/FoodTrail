import { Link } from "react-router-dom";

export default function RestaurantCard({ restaurant }) {
  return (
    <div className="restaurant-card">
      <div className="restaurant-media">
        {restaurant.image ? (
          <img src={restaurant.image} alt={restaurant.name} />
        ) : (
          <div className="placeholder">No image</div>
        )}
      </div>

      <div className="restaurant-body">
        <h4>{restaurant.name}</h4>
        <p className="muted">{restaurant.cuisine} • {restaurant.address}</p>
        <div className="card-footer">
          <span className="rating">⭐ {restaurant.avgRating || 0}</span>
          <Link to={`/restaurant/${restaurant._id}`} className="details-link">Details</Link>
        </div>
      </div>
    </div>
  );
}
