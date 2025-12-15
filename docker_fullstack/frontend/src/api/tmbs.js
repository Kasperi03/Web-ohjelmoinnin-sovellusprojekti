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
