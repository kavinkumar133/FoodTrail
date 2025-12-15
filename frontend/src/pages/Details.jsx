import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRestaurant, getReviews, addReview } from '../api';

export default function Details() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    getRestaurant(id).then(res => setRestaurant(res.data));
    getReviews(id).then(res => setReviews(res.data));
  }, [id]);

  const submitReview = async () => {
    await addReview({ restaurantId: id, rating, comment });
    setComment('');
    getReviews(id).then(res => setReviews(res.data));
  };

  if (!restaurant) return <p>Loading...</p>;

  return (
    <div>
      <h2>{restaurant.name}</h2>
      <p>{restaurant.address}</p>
      <p>Cuisine: {restaurant.cuisine}</p>
      <p>Average Rating: ⭐ {restaurant.avgRating.toFixed(1)}</p>

      <h3>Add Review</h3>
      <select value={rating} onChange={e => setRating(e.target.value)}>
        {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
      </select>
      <input value={comment} onChange={e => setComment(e.target.value)} placeholder="Comment" />
      <button onClick={submitReview}>Submit</button>

      <h3>Reviews</h3>
      <ul>
        {reviews.map(rv => (
          <li key={rv._id}>⭐ {rv.rating} — {rv.comment}</li>
        ))}
      </ul>
    </div>
  );
}