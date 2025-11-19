const API_URL = "http://localhost:3001/api/favorites";

export async function addFavorite(tmdbId) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("User not logged in");
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ tmdb_id: tmdbId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to add favorite");
  }

  return await response.json();
}

export async function getFavorites() {
  const token = localStorage.getItem("token");

  // Return object matching backend structure to prevent crashes if not logged in
  if (!token) return { favorites: [] };

  const response = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch favorites");
  }

  return await response.json();
}
