import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useState, useRef } from "react";
import { showToast } from '../utils/toast';

function Recenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && Array.isArray(center)) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

export default function NearbyMap({ userLocation, restaurants }) {
  const center = userLocation || [13.08, 80.27];
  const [map, setMap] = useState(null);
  const locateMe = () => {
    if (!navigator.geolocation) return showToast('Geolocation not supported');
    navigator.geolocation.getCurrentPosition(
      pos => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        if (map) map.panTo([lat, lng], { animate: true, duration: 0.6 });
        showToast('Centered to your location');
      },
      () => showToast('Unable to get location')
    );
  };

  return (
    <div style={{ position: 'relative' }}>
      <MapContainer whenCreated={setMap} center={center} zoom={14} style={{ height: "350px", width: "100%" }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Recenter center={center} />

        <Marker position={center}>
          <Popup>You are here</Popup>
        </Marker>

        {restaurants.map(r => (
          <Marker key={r._id} position={[r.latitude, r.longitude]}>
            <Popup>
              <div style={{ minWidth: 140 }}>
                <b>{r.name}</b>
                <div className="muted">{r.cuisine}</div>
                <div style={{ marginTop: 8 }}>
                  <button className="btn" onClick={() => (window.location.href = `/restaurant/${r._id}`)}>View</button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <button className="locate-btn" onClick={locateMe} title="Locate me">📍</button>
    </div>
  );
}
