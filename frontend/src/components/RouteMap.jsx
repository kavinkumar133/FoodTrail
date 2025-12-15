import { MapContainer, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import { useEffect } from "react";

export default function RouteMap({ userLocation, restaurantLocation }) {

  useEffect(() => {
    const map = L.map("route-map").setView(userLocation, 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap"
    }).addTo(map);

    L.Routing.control({
      waypoints: [
        L.latLng(userLocation[0], userLocation[1]),
        L.latLng(restaurantLocation[0], restaurantLocation[1])
      ],
      routeWhileDragging: false,
      show: false,
      addWaypoints: false
    }).addTo(map);

    return () => map.remove();
  }, [userLocation, restaurantLocation]);

  return (
    <div
      id="route-map"
      style={{ height: "400px", width: "100%", marginTop: "15px" }}
    />
  );
}
