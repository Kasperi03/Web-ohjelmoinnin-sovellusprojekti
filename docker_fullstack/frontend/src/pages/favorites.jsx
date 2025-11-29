import { useEffect, useState, useMemo } from "react";
import "./styles/favorites.css";
import Carousel from "../components/carousel.jsx";
import MovieInfoBar from "../components/movieInfoBar.jsx";
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

        const detailedMovies = await Promise.all(movieIds.map(async (id) => fetchMovieDetails(id)));

        setFavoriteMovies(detailedMovies);
      } catch (err) {
        console.error("Failed to load favorites", err);
      } finally {
        setLoading(false);
      }
    }

    fetchFavoritesData();
  }, []);

  const { totalMovies, avgRating, topGenre } = useMemo(() => {
    if (!favoriteMovies.length) {
      return { totalMovies: 0, avgRating: 0, topGenre: "N/A" };
    }

    const totalMovies = favoriteMovies.length;

    const avgRating =
      favoriteMovies.reduce(
        (sum, m) => sum + (typeof m.vote_average === "number" ? m.vote_average : 0),
        0
      ) / totalMovies;

    let topGenre = "N/A";
    const genreCount = new Map();

    for (const m of favoriteMovies) {
      if (Array.isArray(m.genres)) {
        m.genres.forEach((g) => {
          genreCount.set(g.name, (genreCount.get(g.name) || 0) + 1);
        });
      }
    }

    if (genreCount.size) {
      const [bestGenre] = [...genreCount.entries()].sort((a, b) => b[1] - a[1])[0];
      topGenre = bestGenre;
    }

    return {
      totalMovies,
      avgRating,
      topGenre,
    };
  }, [favoriteMovies]);

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
      <MovieInfoBar totalMovies={totalMovies} avgRating={avgRating} topGenre={topGenre} />

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
