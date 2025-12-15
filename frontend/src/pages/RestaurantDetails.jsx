import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import RatingStars from "../components/RatingStars";
import "../styles/details.css";

export default function RestaurantDetails() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [userName, setUserName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const fetchData = async () => {
    const res = await API.get(`/restaurants/${id}`);
    setData(res.data);
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const submitReview = async () => {
    if (!rating) return alert('Select rating');
    try {
      await API.post(`/reviews/${id}`, { rating, comment, userName });
      setComment("");
      setUserName("");
      setRating(5);
      fetchData();
    } catch (err) {
      if (err.response && err.response.status === 401) {
        alert('Please login to submit a review');
        window.location.href = '/login';
      } else {
        alert('Error submitting review');
      }
    }
  };

  if (!data) return null;

  return (
    <div className="details-page">
      <div className="details-card">
        <h2>{data.restaurant.name}</h2>
        {data.restaurant.image && (
          <img src={data.restaurant.image} alt="restaurant" className="details-image" />
        )}
        <p className="muted">{data.restaurant.address}</p>
        <p className="muted">Added by: {data.restaurant.createdBy ? data.restaurant.createdBy.name : 'Unknown'}</p>
        <p>⭐ {data.restaurant.avgRating || 0}</p>
      </div>

      <div className="reviews-section">
        <h3>Reviews</h3>
        {data.reviews.length === 0 && <p>No reviews yet — be the first!</p>}
        {data.reviews.map(r => (
          <div key={r._id} className="review-card">
            <div className="review-top">
              <strong>{r.userName || (r.user && r.user.name) || 'Anonymous'}</strong>
              <span className="review-rating">⭐ {r.rating}</span>
            </div>
            <p className="review-comment">{r.comment}</p>
          </div>
        ))}

        <h3>Add Review</h3>
        <input className="input" placeholder="Your name (optional)" value={userName}
          onChange={e => setUserName(e.target.value)} />

        <div style={{ margin: '8px 0' }}>
          <RatingStars value={rating} onChange={setRating} />
        </div>

        <textarea className="textarea" placeholder="Comment" value={comment}
          onChange={e => setComment(e.target.value)} />

        <button className="btn-primary" onClick={submitReview}>Submit Review</button>
      </div>
    </div>
  );
}
