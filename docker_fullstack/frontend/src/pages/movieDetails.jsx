import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchMovieDetails } from "../api/movieDetailHandler.js";
import { addFavorite, deleteFavorite, getFavorites } from "../api/favorites.js";
import "./styles/movieDetails.css";

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  // Fetch movie details and check if it's in favorites
  useEffect(() => {
    fetchMovieDetails(id).then(setMovie);

    async function checkFavorite() {
      try {
        const data = await getFavorites();
        // Convert all IDs to numbers to match types
        const favIds = data.favorites.map((f) => Number(f));
        setIsFavorite(favIds.includes(Number(id)));
      } catch (err) {
        console.error("Failed to check favorite:", err);
      }
    }

    checkFavorite();
  }, [id]);

  if (!movie) return <p>Loading...</p>;

  // Find official YouTube trailer
  const trailer = movie.videos?.results?.find((v) => v.type === "Trailer" && v.site === "YouTube");

  // Toggle favorite status in the database and update button
  const toggleFavorite = async () => {
    try {
      if (isFavorite) {
        await deleteFavorite(id);
        setIsFavorite(false);
      } else {
        await addFavorite(id);
        setIsFavorite(true);
      }
    } catch (error) {
      if (error.message === "User not logged in") {
        alert("Please login first.");
      } else {
        console.error(error);
        alert(error.message);
      }
    }
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
        {/* Poster */}
        <img
          className="details-poster"
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
        />

        {/* Trailer */}
        {trailer && (
          <div className="details-trailer-box">
            <h2>Trailer</h2>
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title="Trailer"
              allowFullScreen
            />
          </div>
        )}
      </div>

      <div className="details-bottom">
        <h1>{movie.title}</h1>
        <p className="details-overview">{movie.overview}</p>

        {/* Action buttons */}
        <div className="movie-actions">
          <button className="fav-btn" onClick={toggleFavorite}>
            {isFavorite ? "💔 Unfavorite" : "❤️ Favorite"}
          </button>
          <button className="group-btn" onClick={handleAddToGroup}>
            ➕ Add to Group
          </button>
        </div>

        {/* Rating section */}
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

        {/* Review section */}
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
