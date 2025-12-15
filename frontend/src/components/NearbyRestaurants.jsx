import { useEffect, useState } from "react";
import API from "../services/api";
import NearbyMap from "../components/NearbyMap";

export default function NearbyRestaurants() {
  const [location, setLocation] = useState(null);
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(pos => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      setLocation([lat, lng]);

      API.get(`/restaurants/nearby?lat=${lat}&lng=${lng}&radius=5`)
        .then(res => setRestaurants(res.data));
    });
  }, []);

  if (!location) return <p>Fetching location...</p>;

  return (
    <div className="container">
      <h2>Nearby Restaurants 📍</h2>

      <NearbyMap
        userLocation={location}
        restaurants={restaurants}
      />

      {restaurants.map(r => (
        <div key={r._id} className="card">
          <h4>{r.name}</h4>
          <p>{r.cuisine}</p>
        </div>
      ))}
    </div>
  );
}
