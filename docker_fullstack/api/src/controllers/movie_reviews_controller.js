import {
  createReview,
  getReviewsByMovie,
  deleteReview,
} from "../models/movie_reviews_model.js";

export async function submitReview(req, res, next) {
  try {
    const accountId = req.user.account_id;
    const { movie_id, rating, review_text } = req.body;

    if (!movie_id && movie_id !== 0) {
      return res.status(400).json({ error: "movie_id is required" });
    }
    if (rating == null) {
      return res.status(400).json({ error: "rating is required" });
    }

    const numericRating = Number(rating);
    if (Number.isNaN(numericRating) || numericRating < 0 || numericRating > 5) {
      return res.status(400).json({ error: "rating must be between 0 and 5" });
    }

    const review = await createReview(
      accountId,
      movie_id,
      numericRating,
      review_text || ""
    );

    return res.status(201).json(review);
  } catch (err) {
    next(err);
  }
}

export async function getMovieReviews(req, res, next) {
  try {
    const { movieId } = req.params;

    if (!movieId) {
      return res.status(400).json({ error: "movieId is required" });
    }

    const reviews = await getReviewsByMovie(movieId);
    return res.json(reviews);
  } catch (err) {
    next(err);
  }
}

export async function deleteMyReview(req, res, next) {
  try {
    const accountId = req.user.account_id;
    const { movieId } = req.params;

    if (!movieId) {
      return res.status(400).json({ error: "movieId is required" });
    }

    const deleted = await deleteReview(accountId, movieId);

    if (!deleted) {
      return res.status(404).json({ error: "Review not found" });
    }

    return res.json({ message: "Review deleted" });
  } catch (err) {
    next(err);
  }
}
