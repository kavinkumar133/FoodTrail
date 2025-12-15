import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const register = async () => {
    try {
      const res = await API.post("/auth/register", form);
      if (res.data && res.data.token) {
        localStorage.setItem('token', res.data.token);
        try {
          const me = await API.get('/auth/me');
          localStorage.setItem('userName', me.data.user.name);
        } catch {}
        navigate('/');
      } else {
        navigate('/login');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="form">
      <h2>Register</h2>
      <input placeholder="Name"
        onChange={e => setForm({ ...form, name: e.target.value })} />
      <input placeholder="Email"
        onChange={e => setForm({ ...form, email: e.target.value })} />
      <input type="password" placeholder="Password"
        onChange={e => setForm({ ...form, password: e.target.value })} />
      <button onClick={register}>Register</button>
    </div>
  );
}
