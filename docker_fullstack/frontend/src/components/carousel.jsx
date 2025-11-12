import { useState } from "react";
import "./styles/carousel.css";

export default function Carousel({ title = "", movies = [], visibleSlides = 4 }) {
  const totalSlides = movies.length;
  const [currentIndex, setCurrentIndex] = useState(0); // Track the current index and updates it with useState
  const imgUrl = "https://image.tmdb.org/t/p/w500"; // Base url for TMDB posters

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + visibleSlides >= totalSlides ? 0 : prev + visibleSlides));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev - visibleSlides < 0 ? totalSlides - visibleSlides : prev - visibleSlides
    );
  };

  return (
    <div className="carousel-container">
      {title && (
        <h2 className="carousel-title">
          <span className="carousel-title-bar">{title}</span>
        </h2> // title for the carousel + the lines for visual effect
      )}

      <div className="carousel">
        <button className="carousel-btn" onClick={prevSlide}>
          ‹
        </button>

        <div className="carousel-row-wrapper">
          <div
            className="carousel-row"
            style={{
              transform: `translateX(-${(currentIndex * 100) / visibleSlides}%)`,
              transition: "transform 0.5s ease",
            }} // slide animation for carousel for smoothness
          >
            {movies.map((movie) => (
              <div key={movie.id} className="carousel-slide">
                {movie.poster_path ? (
                  <img src={`${imgUrl}${movie.poster_path}`} alt={movie.title} /> //gets the poster image from tmdb
                ) : (
                  <div className="no-poster">No Image</div>
                )}
                <div className="slide-overlay">
                  <div className="title-overlay"> {movie.title} </div>
                  <div className="rating"> rating: {movie.vote_average?.toFixed(1)}/10</div>
                </div> {/* Overlay that shows movie title and rating on hover */}
              </div>
            ))}
          </div>
        </div>

        <button className="carousel-btn" onClick={nextSlide}>
          ›
        </button>
      </div>
    </div>
  );
}
