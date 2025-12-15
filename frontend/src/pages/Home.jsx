import { useEffect, useState } from "react";
import API from "../services/api";
import { Link } from "react-router-dom";
import RestaurantCard from "../components/RestaurantCard";
import NearbyMap from "../components/NearbyMap";
import "../styles/home.css";

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [userLocation, setUserLocation] = useState([13.08, 80.27]);
  const [radius, setRadius] = useState(5);
  const [showAll, setShowAll] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserLocation([lat, lng]);
        // Fetch nearby or all restaurants depending on toggle
        if (search && search.trim().length) {
          API.get(`/restaurants/search?q=${encodeURIComponent(search)}&page=${page}&limit=20`).then(res => {
            const d = res.data;
            if (d.results) { setRestaurants(d.results); setPages(d.pages || 1); }
            else setRestaurants(d);
          });
        } else if (showAll) {
          API.get(`/restaurants`).then(res => setRestaurants(res.data));
        } else {
          API.get(`/restaurants/nearby?lat=${lat}&lng=${lng}&radius=${radius}`).then(res => setRestaurants(res.data));
        }
      },
      () => {
        API.get(`/restaurants`).then(res => setRestaurants(res.data));
      }
    );
  }, []);

  // Refetch when toggle or radius changes (if we have geolocation)
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      pos => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        if (search && search.trim().length) {
          API.get(`/restaurants/search?q=${encodeURIComponent(search)}&page=${page}&limit=20`).then(res => {
            const d = res.data;
            if (d.results) { setRestaurants(d.results); setPages(d.pages || 1); }
            else setRestaurants(d);
          });
        } else if (showAll) API.get(`/restaurants`).then(res => setRestaurants(res.data));
        else API.get(`/restaurants/nearby?lat=${lat}&lng=${lng}&radius=${radius}`).then(res => setRestaurants(res.data));
      },
      () => {
        if (search && search.trim().length) API.get(`/restaurants/search?q=${encodeURIComponent(search)}`).then(res => setRestaurants(res.data));
        else if (showAll) API.get(`/restaurants`).then(res => setRestaurants(res.data));
      }
    );
  }, [showAll, radius]);

  // handle search typing (simple debounce)
  useEffect(() => {
    const t = setTimeout(() => {
      if (!search || !search.trim()) return;
      setPage(1);
      API.get(`/restaurants/search?q=${encodeURIComponent(search)}&page=1&limit=20`).then(res => {
        const d = res.data;
        if (d.results) { setRestaurants(d.results); setPages(d.pages || 1); }
        else setRestaurants(d);
      });
    }, 400);
    return () => clearTimeout(t);
  }, [search]);

  // fetch when page changes (search mode)
  useEffect(() => {
    if (!search || !search.trim()) return;
    API.get(`/restaurants/search?q=${encodeURIComponent(search)}&page=${page}&limit=20`).then(res => {
      const d = res.data;
      if (d.results) { setRestaurants(d.results); setPages(d.pages || 1); }
      else setRestaurants(d);
    });
  }, [page]);

  return (
    <div className="home-page">
      <header className="home-header">
        <h1>FoodTrail</h1>
        <div className="home-controls">
          <input className="search-input" placeholder="Search restaurants, cuisine, address" value={search} onChange={e => setSearch(e.target.value)} />
          <label className="control-inline">
            <input type="checkbox" checked={showAll} onChange={e => setShowAll(e.target.checked)} />
            <span className="muted"> Show all</span>
          </label>
          <label className="control-inline">
            <span className="muted">Radius (km)</span>
            <input className="radius-input" type="number" min="1" max="50" value={radius} onChange={e => setRadius(e.target.value)} />
          </label>
          <Link to="/add"><button className="btn-primary">Add Restaurant</button></Link>
        </div>
      </header>

      <div style={{ marginTop: 12 }}>
        <NearbyMap userLocation={userLocation} restaurants={restaurants} />
      </div>

      <section className="restaurant-grid">
        {restaurants.map(r => (
          <RestaurantCard key={r._id} restaurant={r} />
        ))}
      </section>
      {search && search.trim().length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 12 }}>
          <button className="btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1}>Prev</button>
          <div style={{ alignSelf: 'center' }}><small className="muted">Page {page} / {pages}</small></div>
          <button className="btn" onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page >= pages}>Next</button>
        </div>
      )}
    </div>
  );
}
