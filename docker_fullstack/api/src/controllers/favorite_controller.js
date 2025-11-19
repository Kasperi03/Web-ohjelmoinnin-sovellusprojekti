import { addFavorite, getFavoritesByUser } from "../models/favorite_model.js";

export async function postFavorite(req, res, next) {
  try {
    const { tmdb_id } = req.body;
    const accountId = req.user.id;

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
    const accountId = req.user.id;
    const favorites = await getFavoritesByUser(accountId);
    return res.json({ favorites });
  } catch (err) {
    next(err);
  }
}
