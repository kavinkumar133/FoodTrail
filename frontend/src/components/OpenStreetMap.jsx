import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

export default function OpenStreetMap({ lat, lng, name }) {
  return (
    <MapContainer
      center={[lat, lng]}
      zoom={15}
      style={{ height: "300px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={[lat, lng]}>
        <Popup>{name}</Popup>
      </Marker>
    </MapContainer>
  );
}
