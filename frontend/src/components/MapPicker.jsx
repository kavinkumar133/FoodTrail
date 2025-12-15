import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { useState, useEffect } from "react";

function LocationMarker({ setLocation }) {
  const [pos, setPos] = useState(null);

  useMapEvents({
    click(e) {
      setPos(e.latlng);
      setLocation(e.latlng);
    }
  });

  return pos ? <Marker position={pos} /> : null;
}

function Recenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function MapPicker({ setLocation, selectedPos }) {
  const [center, setCenter] = useState([13.08, 80.27]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => setCenter([pos.coords.latitude, pos.coords.longitude]),
        () => {}
      );
    }
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <MapContainer center={center} zoom={12} style={{ height: 300 }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <Recenter center={selectedPos || center} />
        <LocationMarker setLocation={setLocation} />
        {selectedPos ? <Marker position={[selectedPos.lat, selectedPos.lng]} /> : null}
      </MapContainer>

      <button className="locate-btn" onClick={() => {
        if (!navigator.geolocation) return alert('Geolocation not supported');
        navigator.geolocation.getCurrentPosition(
          pos => {
            setCenter([pos.coords.latitude, pos.coords.longitude]);
            try {
              // animate pan if map available
              // use a small toast local to MapPicker by triggering a CSS change on the button
            } catch (e) {}
          },
          () => alert('Unable to get location')
        );
      }} title="Locate me">📍</button>
    </div>
  );
}
