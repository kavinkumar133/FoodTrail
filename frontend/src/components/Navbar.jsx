import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [userName, setUserName] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setUserName(localStorage.getItem('userName'));
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setUserName(null);
    navigate('/login');
  };

  return (
    <nav className="nav">
      <h2>FoodTrail</h2>
      <div>
        <Link to="/">Home</Link>
        <Link to="/add">Add Restaurant</Link>
        {!userName ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <span style={{ marginLeft: 12, marginRight: 12 }}>Hi, {userName}</span>
            <button className="btn" onClick={logout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
