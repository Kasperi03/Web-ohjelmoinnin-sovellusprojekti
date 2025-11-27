import { useState } from "react";
import "./styles/carousel.css";
import { useNavigate } from "react-router-dom";

export default function Carousel({ title = "", movies = [], visibleSlides = 4 }) {
  const navigate = useNavigate();
  const totalSlides = movies.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const imgUrl = "https://image.tmdb.org/t/p/w500";

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + visibleSlides >= totalSlides ? 0 : prev + visibleSlides));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev - visibleSlides < 0 ? totalSlides - visibleSlides : prev - visibleSlides
    );
  };

  const goToDetails = (id) => {
    navigate(`/groupList`); // <- replace with movie details route
    navigate(`/groupList`);
  };

  return (
    <div className="carousel-container">
      {title && (
        <h2 className="carousel-title">
          <span className="carousel-title-bar">{title}</span>
        </h2>
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
            }}
          >
            {movies.map((movie,index) => (
              <div
                key={`${movie.id}-${index}`}
                className="carousel-slide"
                onClick={() => navigate(`/movie/${movie.id}`)} // <-- clickable
                style={{ cursor: "pointer" }}
                
              >
                {movie.renderExtra}
                {movie.poster_path ? (
                  <img src={`${imgUrl}${movie.poster_path}`} alt={movie.title} />
                ) : (
                  <div className="no-poster">No Image</div>
                )}
                <div className="slide-overlay">
                  <div className="title-overlay"> {movie.title} </div>
                  <div className="rating"> rating: {movie.vote_average?.toFixed(1)}/10</div>
                </div>{" "}
                {/* Overlay that shows movie title and rating on hover */}
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