import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="nav">
      <h2>FoodTrail</h2>
      <div>
        <Link to="/">Landing</Link>
        <Link to="/home">Home</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/add">Add Restaurant</Link>
      </div>
    </nav>
  );
}
