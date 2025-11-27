import pool from "../database.js";

export const addMovieToGroup = async (groupId, movieId) => {
  const result = await pool.query(
    `INSERT INTO group_movies (group_id, movie_id)
     VALUES ($1, $2)
     RETURNING *`,
    [groupId, movieId]
  );
  return result.rows[0];
};

export const ensureMovieExists = async (apiId) => {
  const existing = await pool.query(
    `SELECT movie_id FROM movies WHERE api_id = $1`,
    [apiId]
  );

  if (existing.rows.length) return existing.rows[0].movie_id;

  const result = await pool.query(
    `INSERT INTO movies (api_id)
     VALUES ($1)
     RETURNING movie_id`,
    [apiId]
  );

  return result.rows[0].movie_id;
};


export const deleteMovieFromGroup = async (groupId, movieId) => {
  const result = await pool.query(
    `DELETE FROM group_movies
     WHERE group_id = $1 AND movie_id = $2
     RETURNING *`,
    [groupId, movieId]
  );
  return result.rows[0];
};

export const getMoviesInGroup = async (groupId) => {
  const result = await pool.query(
    `SELECT 
        m.movie_id AS id,      -- INTERNAL DB ID
        m.api_id               -- TMDB ID
     FROM group_movies gm
     JOIN movies m ON gm.movie_id = m.movie_id
     WHERE gm.group_id = $1`,
    [groupId]
  );

  return result.rows;
};

