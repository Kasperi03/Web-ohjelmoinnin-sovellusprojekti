import pool from "../database.js";
import { ensureMovieExists } from "./group_movie_model.js";

export async function createReview(accountId, apiId, rating, reviewText) {
  const movieId = await ensureMovieExists(apiId);

  const result = await pool.query(
    `INSERT INTO reviews (account_id, movie_id, rating, review_text)
     VALUES ($1, $2, $3, $4)
     ON CONFLICT (account_id, movie_id) DO UPDATE
       SET rating = EXCLUDED.rating,
           review_text = EXCLUDED.review_text,
           created_at = NOW()
     RETURNING *`,
    [accountId, movieId, rating, reviewText]
  );

  return result.rows[0];
}

export async function getReviewsByMovie(apiId) {
  const movieId = await ensureMovieExists(apiId);

  const result = await pool.query(
    `SELECT r.*, a.username
     FROM reviews r
     JOIN account a ON a.account_id = r.account_id
     WHERE r.movie_id = $1
     ORDER BY r.created_at DESC`,
    [movieId]
  );

  return result.rows;
}

export async function deleteReview(accountId, apiId) {
  const movieId = await ensureMovieExists(apiId);

  const result = await pool.query(
    `DELETE FROM reviews
     WHERE account_id = $1 AND movie_id = $2
     RETURNING *`,
    [accountId, movieId]
  );

  return result.rows[0] || null;
}
