import { useEffect, useState } from "react";
import "./styles/favorites.css";
import Carousel from "../components/carousel.jsx";
import FavoriteInfo from "../components/movieInfoBar.jsx";
import { getFavorites } from "../api/favorites.js";
import { fetchMovieDetails } from "../api/movieDetailHandler.js";

export default function Favorites() {
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFavoritesData() {
      try {
        setLoading(true);

        const data = await getFavorites();
        const movieIds = data.favorites || [];
        const detailedMovies = await Promise.all(
          movieIds.map(async (id) => {
            const movieData = await fetchMovieDetails(id);
            return movieData;
          })
        );

        setFavoriteMovies(detailedMovies);
      } catch (err) {
        console.error("Failed to load favorites", err);
      } finally {
        setLoading(false);
      }
    }

    fetchFavoritesData();
  }, []);

  if (loading) {
    return (
      <div className="favorites-container">
        <h1>Your Personal Collection</h1>
        <p>Loading your favorites...</p>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <FavoriteInfo count={favoriteMovies.length} />

      <div className="carousel-container">
        {favoriteMovies.length > 0 ? (
          <Carousel title="My Favorites" movies={favoriteMovies} visibleSlides={4} />
        ) : (
          <div className="no-favorites">
            <p>You haven't added any favorites yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
