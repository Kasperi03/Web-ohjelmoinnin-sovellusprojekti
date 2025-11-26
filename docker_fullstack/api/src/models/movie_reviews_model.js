import pool from "../database.js";

export async function createReview(accountId, movieId, rating, reviewText) {
    const result = await pool.query(
        `INSERT INTO reviews (account_id, movie_id, rating, review_text)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [accountId, movieId, rating, reviewText]
    );

    return result.rows[0];
}