// src/controllers/tmdbController.js
import { searchPersonMoviesService,searchByGenreService,searchMoviesService,movieDetailsService,nowPlayingService,trendingService } from "../services/tmdb_service.js";

export const searchMovies = async (req, res) => {
    console.log("🔥 Controller: searchMovies HIT");
  try {
    const { query, page = 1 } = req.query;
    const data = await searchMoviesService(query, page);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch movies" });
  }
};

export const searchByGenre = async (req, res) => {
  try {
    const { id, page = 1 } = req.query;
    const data = await searchByGenreService(id, page);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch genre movies" });
  }
};

export const searchPersonMovies = async (req, res) => {
  try {
    const { query, page = 1 } = req.query;
    const data = await searchPersonMoviesService(query, page);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch person movies" });
  }
};

export const getMovieDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await movieDetailsService(id);
    res.json(data);
  } catch (err) {
    console.error("🔥 movieDetails controller error:", err);
    res.status(500).json({ error: "Failed to fetch movie details" });
  }
};

export const getNowInTheaters = async (req, res) => {
  try {
    const data = await nowPlayingService();
    res.json(data);
  } catch (err) {
    console.error("nowPlaying controller error:", err);
    res.status(500).json({ error: "Failed to fetch now playing" });
  }
};

export const getTrending = async (req, res) => {
  try {
    const data = await trendingService();
    res.json(data);
  } catch (err) {
    console.error("trending controller error:", err);
    res.status(500).json({ error: "Failed to fetch trending" });
  }
};

