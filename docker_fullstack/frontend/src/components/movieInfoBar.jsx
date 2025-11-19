import React from "react";
import "./styles/movieInfoBar.css";

export default function MovieInfoBar() {
  const movieAmount = 24;
  const avgRating = 4.2;
  const topGenre = "Action";

  return (
    <div className="info-bar-container">
      <div className="info-bar">
        <div className="info-item">
          <div className="info-label">Movies</div>
          <div className="info-value">{movieAmount}</div>
        </div>
        <div className="info-item">
          <div className="info-label">Avg Rating</div>
          <div className="info-value">{avgRating} ★</div>
        </div>
        <div className="info-item">
          <div className="info-label">Top Genre</div>
          <div className="info-value">{topGenre}</div>
        </div>
      </div>
    </div>
  );
}
