import { createReview } from "../models/movie_reviews_model.js";
import { ensureMovieExists } from "../models/group_movie_model.js";

export async function submitReview(req, res, next) {
    try {
        const accountId = req.user?.account_id;
        const { movie_id, rating, review_text } = req.body;

        if (!accountId) {
            return res.status(401).json({ error: "Not authenticated" });
        }

        if (!movie_id || !rating || !review_text) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        const movieId = await ensureMovieExists(movie_id);

        const newReview = await createReview(
            accountId,   
            movieId,     
            rating,
            review_text
        );

        return res.status(201).json(newReview);

    } catch (err) {
        next(err);
    }
}