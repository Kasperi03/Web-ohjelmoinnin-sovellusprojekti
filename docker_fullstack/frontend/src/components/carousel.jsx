import { useState } from "react";
import "./styles/carousel.css";

export default function Carousel({ title = "", totalSlides = 12, visibleSlides = 4 }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + visibleSlides >= totalSlides ? 0 : prev + visibleSlides));
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev - visibleSlides < 0 ? totalSlides - visibleSlides : prev - visibleSlides
    );
  };

  // Generate all slides
  const slides = Array.from({ length: totalSlides }, (_, i) => i + 1);

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
            {slides.map((num) => (
              <div key={num} className="carousel-slide">
                {num}
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
