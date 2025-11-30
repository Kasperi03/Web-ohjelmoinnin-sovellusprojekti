// FRONTEND VERSION — calls backend, not TMDB

export async function searchMovies(query, page = 1) {
  const res = await fetch(
    `/api/tmdb/search?query=${encodeURIComponent(query)}&page=${page}`
  );
  return res.json();
}

export async function searchByGenre(genreId, page = 1) {
  const res = await fetch(
    `/api/tmdb/genre?id=${genreId}&page=${page}`
  );
  return res.json();
}

export async function searchPersonMovies(query, page = 1) {
  const res = await fetch(
    `/api/tmdb/person?query=${encodeURIComponent(query)}&page=${page}`
  );
  return res.json();
}
