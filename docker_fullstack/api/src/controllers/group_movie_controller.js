import {
ensureMovieExists,
  addMovieToGroup,
  deleteMovieFromGroup,
  getMoviesInGroup
} from "../models/group_movie_model.js";

import { getOne as getGroupById } from "../models/group_model.js";


export const addMovie = async (req, res) => {
  try {
    const { groupId, apiId } = req.params;  // <-- Now coming from params NOT body

    // Convert API ID → internal DB movie_id
    const movieId = await ensureMovieExists(apiId);

    // Add to group_movies using internal movie_id
    const inserted = await addMovieToGroup(groupId, movieId);

    res.status(201).json(inserted);

  } catch (error) {
    console.error("Add movie error:", error);
    res.status(500).json({ error: "Failed to add movie to group" });
  }
};






export const removeMovie = async (req, res) => {
  try {
    const { groupId, movieId } = req.params;
    const accountId = req.user.account_id;

    // Check if group exists
    const group = await getGroupById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    // Only owner can remove movies
    if (group.owner_id !== accountId) {
      return res.status(403).json({ error: "Only the group owner can remove movies" });
    }

    const deleted = await deleteMovieFromGroup(groupId, movieId);

    if (!deleted) {
      return res.status(404).json({ error: "Movie not found in this group" });
    }

    return res.json({
      message: "Movie removed",
      removed: deleted
    });

  } catch (error) {
    console.error("Remove movie error:", error);
    return res.status(500).json({ error: "Failed to remove movie from group" });
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
