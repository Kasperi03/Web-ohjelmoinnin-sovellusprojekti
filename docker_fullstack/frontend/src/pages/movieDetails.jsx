import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchMovieDetails } from "../api/movieDetailHandler.js";
import { addFavorite, deleteFavorite, getFavorites } from "../api/favorites.js";
import { getCurrentUser } from "../api/currentUserHelper.js";
import "./styles/movieDetails.css";
import {
  submitMovieReview,
  fetchMovieReviews,
  deleteMovieReview,
} from "../api/movieReviewHansler.js";

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [groups, setGroups] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const user = getCurrentUser(); 
  const userId = user?.account_id;

  useEffect(() => {
    fetchMovieDetails(id).then(setMovie);

    async function checkFavorite() {
      try {
        const data = await getFavorites();
        const favIds = data.favorites.map((f) => Number(f));
        setIsFavorite(favIds.includes(Number(id)));
      } catch (err) {
        console.error("Failed to check favorite:", err);
      }
    }

    checkFavorite();

    async function loadReviews() {
      try {
        const revs = await fetchMovieReviews(id);
        setReviews(revs);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      }
    }

    loadReviews();

    setUserRating(0);
    setReviewText("");
    setIsEditing(false);
  }, [id]);

  if (!movie) return <p>Loading...</p>;

  const trailer = movie.videos?.results?.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );

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

  const handleAddToGroup = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:3001/groups/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json(); 
      console.log("Fetched groups:", data); 

      setGroups(data);
      setShowDropdown(true);
    } catch (err) {
      console.error("Failed to load groups:", err);
    }
  };
  ;

  const addToGroup = async (groupId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/group-movies/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          movieId: Number(id), 
          groupId: Number(groupId), 
        }),
      });

      if (!res.ok) throw new Error("Failed");

      alert("Movie added to group!");
      setShowDropdown(false);
    } catch (err) {
      console.error(err);
      alert("Error adding to group");
    }
  };

  const submitReview = () => {
    submitMovieReview(id, userRating, reviewText)
      .then(async (data) => {
        console.log("Review submitted successfully:", data);

        const updated = await fetchMovieReviews(id);
        setReviews(updated);

        alert(`Review submitted!\nRating: ${userRating}\nText: ${reviewText}`);

        setUserRating(0);
        setReviewText("");
        setIsEditing(false);
      })
      .catch((error) => {
        console.error("Error submitting review:", error);
        alert("Failed to submit review: " + error.message);
      });
  };

  const handleDeleteReview = async () => {
    if (!user) return;

    if (!window.confirm("Delete your review?")) return;

    try {
      await deleteMovieReview(id);
      const updated = await fetchMovieReviews(id);
      setReviews(updated);
      setUserRating(0);
      setReviewText("");
      setIsEditing(false);
    } catch (err) {
      console.error("Error deleting review:", err);
      alert("Failed to delete review: " + err.message);
    }
  };

  const startEditReview = (review) => {
    setUserRating(review.rating);
    setReviewText(review.review_text || "");
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openGroupDropdown = async () => {
    try {
      const res = await fetch("http://localhost:3001/groups");
      const data = await res.json();
      setGroups(data);
      setShowDropdown(true);
    } catch (err) {
      console.error("Failed to load groups:", err);
    }
  };

  const myReview = reviews.find((r) => r.account_id === userId);

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

      {/* Movie Rating */}
        {movie.vote_average && (
         <div className="movie-rating">
         ⭐ {movie.vote_average.toFixed(1)} / 10
        </div>
        )}

          <p className="details-overview">{movie.overview}</p>


        {/* Action buttons (only when logged in) */}
        {user && (
          <div className="movie-actions">
            <button className="fav-btn" onClick={toggleFavorite}>
              {isFavorite ? "💔 Unfavorite" : "❤️ Favorite"}
            </button>

            <button className="group-btn" onClick={handleAddToGroup}>
              ➕ Add to Group
            </button>

            {showDropdown && (
              <select
                className="group-dropdown"
                defaultValue=""
                onChange={(e) => addToGroup(e.target.value)}
              >
                <option value="" disabled>
                  Select a group
                </option>

                {groups.map((g) => (
                  <option key={g.group_id} value={g.group_id}>
                    {g.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        {/* Rating section */}
        {user && (
          <div className="rating-section">
            <h3>{isEditing ? "Edit Your Rating" : "Your Rating"}</h3>
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
        )}

        {/* Review section */}
        {user && (
          <div className="review-section">
            <h3>{isEditing ? "Edit Your Review" : "Your Review"}</h3>
            <textarea
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Write your thoughts..."
            />
            <button className="submit-review" onClick={submitReview}>
              {isEditing ? "Save Changes" : "Submit Review"}
            </button>
          </div>
        )}

        {reviews.length > 0 && (
          <div className="reviews-list">
            <h3>User Reviews</h3>
            {reviews.map((r) => (
              <div key={r.review_id} className="review-item">
                <div className="review-header">
                  <strong>{r.account_id === userId ? "You" : r.username}</strong>
                  <span>
                    {"★".repeat(r.rating)}
                    {"☆".repeat(Math.max(0, 5 - r.rating))}
                  </span>
                  <span className="review-date">
                    {new Date(r.created_at).toLocaleDateString()}
                  </span>
                </div>
                {r.review_text && (
                  <p className="review-text">{r.review_text}</p>
                )}
                {userId === r.account_id && (
                  <div className="review-actions">
                    <button onClick={() => startEditReview(r)}>Edit</button>
                    <button onClick={handleDeleteReview}>Delete</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
