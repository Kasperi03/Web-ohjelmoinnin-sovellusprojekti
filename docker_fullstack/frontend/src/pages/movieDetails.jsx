import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchMovieDetails } from "../api/movieDetailHandler.js";
import "./styles/movieDetails.css";

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState("");

  useEffect(() => {
    fetchMovieDetails(id).then(setMovie);
  }, [id]);

  if (!movie) return <p>Loading...</p>;

  // Find official YouTube trailer
  const trailer = movie.videos?.results?.find((v) => v.type === "Trailer" && v.site === "YouTube");

  const handleFavorite = () => {
    alert("Added to favorites (hook this to backend later)");
  };

  const handleAddToGroup = () => {
    alert("Add to group clicked");
  };

  const submitReview = () => {
    alert(`Review submitted!\nRating: ${userRating}\nText: ${reviewText}`);
    setUserRating(0);
    setReviewText("");
  };

  return (
    <div className="movie-details">
      <div className="movie-top-row">
        {/* POSTER */}
        <img
          className="details-poster"
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
        />

        {/* TRAILER */}
        {trailer && (
          <div className="details-trailer-box">
            <h2>Trailer</h2>
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title="Trailer"
              allowFullScreen
            ></iframe>
          </div>
        )}
      </div>

      {/* DESCRIPTION + ACTIONS BELOW */}
      <div className="details-bottom">
        <h1>{movie.title}</h1>
        <p className="details-overview">{movie.overview}</p>

        {/* Buttons */}
        <div className="movie-actions">
          <button className="fav-btn" onClick={handleFavorite}>
            ❤️ Favorite
          </button>
          <button className="group-btn" onClick={handleAddToGroup}>
            ➕ Add to Group
          </button>
        </div>

        {/* Rating */}
        <div className="rating-section">
          <h3>Your Rating</h3>
          <div className="stars">
            {[1, 2, 3, 4, 5].map((n) => (
              <span
                key={n}
                className={n <= userRating ? "star filled" : "star"}
                onClick={() => setUserRating(n)}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {/* Review */}
        <div className="review-section">
          <h3>Your Review</h3>
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Write your thoughts..."
          />
          <button className="submit-review" onClick={submitReview}>
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
}
