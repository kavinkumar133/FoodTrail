import React from "react";

const Footer = () => {
  return (
    <footer style={{ textAlign: "center", padding: "1rem", background: "#f8f9fa" }}>
      <p>&copy; {new Date().getFullYear()} FoodTrail. All rights reserved.</p>
    </footer>
  );
};

export default Footer;