import { addFavorite, getFavoritesByUser, deleteFavorite } from "../models/favorite_model.js";
export async function postFavorite(req, res, next) {
  try {
    const { tmdb_id } = req.body;
    console.log("decoded Token Data:", req.user);

    const accountId = req.user?.id || req.user?.account_id || req.user?.userId;

    if (!accountId) {
      console.error("ERROR: Could not find a user ID in the token!");
      return res.status(401).json({ error: "User not identified. Token missing ID." });
    }

    if (!tmdb_id) {
      return res.status(400).json({ error: "tmdb_id is required" });
    }

    const result = await addFavorite(accountId, tmdb_id);

    if (!result) {
      return res.json({ message: "Already in favorites" });
    }

    return res.status(201).json({ message: "Added to favorites" });
  } catch (err) {
    next(err);
  }
}

export async function getFavorites(req, res, next) {
  try {
    const accountId = req.user?.id || req.user?.account_id || req.user?.userId;

    if (!accountId) {
      return res.status(401).json({ error: "User not identified" });
    }

    const favorites = await getFavoritesByUser(accountId);

    return res.json({ favorites });
  } catch (err) {
    next(err);
  }
}

export async function removeFavorite(req, res, next) {
  try {
    const accountId = req.user?.id || req.user?.account_id || req.user?.userId;

    const { tmdbId } = req.params;

    if (!accountId) {
      return res.status(401).json({ error: "User not identified" });
    }

    if (!tmdbId) {
      return res.status(400).json({ error: "Movie ID is required" });
    }

    const success = await deleteFavorite(accountId, tmdbId);

    if (!success) {
      return res.status(404).json({ error: "Favorite not found" });
    }

    return res.status(200).json({ message: "Removed from favorites" });
  } catch (err) {
    next(err);
  }
}

export async function getFavoritesPublic(req, res, next) {
  try {
    const userId = req.params.userId;

    const favorites = await getFavoritesByUser(userId);

    res.json({ favorites });
  } catch (err) {
    next(err);
  }
}
