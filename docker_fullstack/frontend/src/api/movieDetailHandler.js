export async function fetchMovieDetails(id) {
  try {
    const res = await fetch(`/api/tmdb/movie/${id}`);
    if (!res.ok) {
      throw new Error("Failed to fetch movie details");
    }

    return await res.json();
  } catch (err) {
    console.error("Frontend movie details error:", err);
    return null;
  }
}
