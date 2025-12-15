import { useState } from "react";
import API from "../services/api";
import MapPicker from "../components/MapPicker";
import { useNavigate } from "react-router-dom";
import "../styles/add.css";

export default function AddRestaurant() {
  const [form, setForm] = useState({ image: '' });
  const [location, setLocation] = useState(null);
  const [selectedPos, setSelectedPos] = useState(null);
  const navigate = useNavigate();

  const submit = async () => {
    if (!form.name) return alert('Name required');
    if (!location) return alert('Please pick a location on the map');

    const payload = {
      name: form.name,
      cuisine: form.cuisine,
      address: form.address,
      image: form.image,
      latitude: location.lat,
      longitude: location.lng
    };

    try {
      await API.post("/restaurants", payload);
      navigate("/");
    } catch (err) {
      if (err.response && err.response.status === 401) {
        alert('Please login to add a restaurant');
        navigate('/login');
      } else {
        alert('Error adding restaurant');
      }
    }
  };

  // when location changes, try reverse-geocoding to fill address if empty
  const tryReverseGeocode = async (pos) => {
    if (!pos) return;
    if (form.address && form.address.trim().length > 3) return;
    try {
      const resp = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${pos.lat}&lon=${pos.lng}`);
      if (!resp.ok) return;
      const data = await resp.json();
      if (data && data.display_name) setForm(f => ({ ...f, address: data.display_name }));
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="add-page">
      <div className="add-card">
        <h2>Add Restaurant</h2>

        <input className="input" placeholder="Name" value={form.name || ''}
          onChange={e => setForm({ ...form, name: e.target.value })} />

        <input className="input" placeholder="Cuisine" value={form.cuisine || ''}
          onChange={e => setForm({ ...form, cuisine: e.target.value })} />

        <input className="input" placeholder="Address" value={form.address || ''}
          onChange={e => setForm({ ...form, address: e.target.value })} />

        <input className="input" placeholder="Image URL (optional)" value={form.image}
          onChange={e => setForm({ ...form, image: e.target.value })} />

        <p className="muted">Select location on map 👇</p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
          <button className="btn" onClick={() => {
            if (!navigator.geolocation) return alert('Geolocation not supported');
            navigator.geolocation.getCurrentPosition(pos => {
              const p = { lat: pos.coords.latitude, lng: pos.coords.longitude };
              setLocation(p);
              setSelectedPos(p);
              tryReverseGeocode(p);
            }, () => alert('Unable to get location'))
          }}>Use my current location</button>
          <button className="btn" onClick={() => { setSelectedPos(null); setLocation(null); }}>Clear</button>
          <div style={{ marginLeft: 8, alignSelf: 'center' }}>
            {location ? <small className="muted">{location.lat.toFixed(5)}, {location.lng.toFixed(5)}</small> : <small className="muted">No location selected</small>}
          </div>
        </div>

        <MapPicker selectedPos={selectedPos} setLocation={loc => { const p = { lat: loc.lat, lng: loc.lng }; setLocation(p); setSelectedPos(p); tryReverseGeocode(p); }} />

        <div style={{ marginTop: 12 }}>
          <button className="btn-primary" onClick={submit}>Save Restaurant</button>
        </div>
      </div>
    </div>
  );
}
