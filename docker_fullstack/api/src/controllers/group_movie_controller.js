import {
ensureMovieExists,
  addMovieToGroup,
  deleteMovieFromGroup,
  getMoviesInGroup
} from "../models/group_movie_model.js";

export const addMovie = async (req, res) => {
  try {
    const { groupId, movieId: apiId } = req.body; 
    // movieId from frontend is TMDB id, so call it apiId

    // 1. Ensure movie exists in DB, receive internal movie_id
    const movieId = await ensureMovieExists(apiId);

    // 2. Insert internal movie_id into group_movies
    const inserted = await addMovieToGroup(groupId, movieId);

    res.status(201).json(inserted);
  } catch (error) {
    console.error("Add movie error:", error);
    res.status(500).json({ error: "Failed to add movie to group" });
  }
};


export const removeMovie = async (req, res) => {
  try {
    const { groupId, movieId } = req.body;

    const deleted = await deleteMovieFromGroup(groupId, movieId);

    if (!deleted) {
      return res.status(404).json({ error: "Movie not found in group" });
    }

    res.json({ message: "Movie removed", deleted });
  } catch (error) {
    console.error("Remove movie error:", error);
    res.status(500).json({ error: "Failed to remove movie from group" });
  }
};

export const getMovies = async (req, res) => {
  try {
    const { groupId } = req.params;

    const movies = await getMoviesInGroup(groupId);

    res.json(movies);
  } catch (error) {
    console.error("Get movies error:", error);
    res.status(500).json({ error: "Failed to fetch movies for group" });
  }
};
