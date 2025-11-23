import React from "react";
import "./styles/movieInfoBar.css";

export default function MovieInfoBar({
  totalMovies = 0,
  avgRating = 0,
  topGenre = "N/A",
}) {
  return (
    <div className="info-bar-container">
      <div className="info-bar">
        <div className="info-item">
          <div className="info-label">Movies</div>
          <div className="info-value">{totalMovies}</div>
        </div>

        <div className="info-item">
          <div className="info-label">Avg Rating</div>
          <div className="info-value">
            {avgRating.toFixed ? avgRating.toFixed(1) : avgRating} ★
          </div>
        </div>

        <div className="info-item">
          <div className="info-label">Top Genre</div>
          <div className="info-value">{topGenre}</div>
        </div>
      </div>
    </div>
  );
}
