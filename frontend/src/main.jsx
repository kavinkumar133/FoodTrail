import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "leaflet/dist/leaflet.css";
import "../utils/fixLeafletIcon.js";
import "./index.css";
import "./styles/components.css";

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
