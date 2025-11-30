// frontend/src/api/homeApi.js
// (or whatever this file was called originally)

// -----------------------------------------
// Fetch "Now Playing" movies (backend proxy)
// -----------------------------------------
export async function getNowInTheaters() {
  try {
    const res = await fetch(`/api/tmdb/now`);
    if (!res.ok) throw new Error("Failed to fetch now playing");
    return await res.json();
  } catch (err) {
    console.error("Frontend getNowInTheaters error:", err);
    return [];
  }
}

// -----------------------------------------
// Fetch Trending movies (backend proxy)
// -----------------------------------------
export async function getTrending() {
  try {
    const res = await fetch(`/api/tmdb/trending`);
    if (!res.ok) throw new Error("Failed to fetch trending");
    return await res.json();
  } catch (err) {
    console.error("Frontend getTrending error:", err);
    return [];
  }
}
