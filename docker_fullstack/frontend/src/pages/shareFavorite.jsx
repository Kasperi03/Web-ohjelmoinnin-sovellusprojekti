import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import "./styles/favorites.css";
import Carousel from "../components/carousel.jsx";
import MovieInfoBar from "../components/movieInfoBar.jsx";
import { fetchMovieDetails } from "../api/movieDetailHandler.js";
import { getUserByIdPublic } from "../api/profile";
import { getFavoritesByUserId } from "../api/favorites.js";

export default function ShareFavorite() {
  const { id } = useParams();
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = await getUserByIdPublic(id);
        setUser(userData);
      } catch (err) {
        console.error("Failed to load user", err);
      }
    }
    fetchUser();
  }, [id]);

  useEffect(() => {
    async function fetchFavorites() {
      try {
        const data = await getFavoritesByUserId(id);
        const movieIds = data.favorites || [];

        const movies = await Promise.all(
          movieIds.map((movieId) => fetchMovieDetails(movieId))
        );

        setFavoriteMovies(movies);
      } catch (err) {
        console.error("Failed to load favorites", err);
      } finally {
        setLoading(false);
      }
    }

    fetchFavorites();
  }, [id]);

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
      const [best] = [...genreCount.entries()].sort((a, b) => b[1] - a[1])[0];
      topGenre = best;
    }

    return { totalMovies, avgRating, topGenre };
  }, [favoriteMovies]);

  if (loading || !user) {
    return (
      <div className="favorites-container">
        <h1>Loading...</h1>
        <p>Please wait</p>
      </div>
    );
  }

  return (
    <div className="favorites-container">

      <MovieInfoBar 
        totalMovies={totalMovies}
        avgRating={avgRating}
        topGenre={topGenre}
        username={user.username} 
      />

      <div className="carousel-container">
        {favoriteMovies.length > 0 ? (
          <Carousel
            title={`${user.username}'s Favorite Movies`}
            movies={favoriteMovies}
            visibleSlides={4}
          />
        ) : (
          <div className="no-favorites">
            <p>{user.username} has no favorite movies yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
