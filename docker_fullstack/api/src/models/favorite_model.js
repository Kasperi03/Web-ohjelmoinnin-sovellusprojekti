import pool from "../database.js";

export async function addFavorite(accountId, tmdbId) {
  // Ensure movie exists in movies table
  const movieResult = await pool.query(
    `INSERT INTO movies (api_id)
     VALUES ($1)
     ON CONFLICT (api_id) DO UPDATE SET api_id = EXCLUDED.api_id
     RETURNING movie_id`,
    [tmdbId]
  );

  const movieId = movieResult.rows[0].movie_id;

  // Add to favorites
  const favResult = await pool.query(
    `INSERT INTO favorites (account_id, movie_id)
     VALUES ($1, $2)
     ON CONFLICT (account_id, movie_id) DO NOTHING
     RETURNING id`,
    [accountId, movieId]
  );

  return favResult.rows[0] || null; // null if already favorited
}

export async function getFavoritesByUser(accountId) {
  const result = await pool.query(
    `SELECT m.api_id
     FROM favorites f
     JOIN movies m ON f.movie_id = m.movie_id
     WHERE f.account_id = $1`,
    [accountId]
  );
  return result.rows.map((r) => r.api_id);
}

export async function deleteFavorite(accountId, tmdbId) {
  const result = await pool.query(
    `DELETE FROM favorites 
     WHERE account_id = $1 
     AND movie_id = (SELECT movie_id FROM movies WHERE api_id = $2)`,
    [accountId, tmdbId]
  );

  return result.rowCount > 0;
}
