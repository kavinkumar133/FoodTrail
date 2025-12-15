import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function AddRestaurant() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const addRestaurant = async () => {
    await API.post("/restaurants", form);
    navigate("/home");
  };

  return (
    <div className="form">
      <h2>Add Restaurant</h2>
      <input placeholder="Name" onChange={e => setForm({...form,name:e.target.value})}/>
      <input placeholder="Location" onChange={e => setForm({...form,location:e.target.value})}/>
      <input placeholder="Cuisine" onChange={e => setForm({...form,cuisine:e.target.value})}/>
      <button onClick={addRestaurant}>Add</button>
    </div>
  );
}
