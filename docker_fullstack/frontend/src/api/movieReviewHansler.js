const API_URL = "http://localhost:3001/api/movie-reviews";

function getToken() {
  return localStorage.getItem("token");
}

export async function submitMovieReview(movieId, rating, reviewText) {
  const token = getToken();
  if (!token) {
    throw new Error("User not logged in");
  }

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      movie_id: movieId,      
      rating: rating,
      review_text: reviewText,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error("SERVER RESPONDED WITH:", text);
    throw new Error("Backend error: " + text);
  }

  return await response.json();
}

export async function fetchMovieReviews(movieId) {
  const res = await fetch(`${API_URL}/${movieId}`);

  if (!res.ok) {
    const text = await res.text();
    console.error("Error fetching reviews:", text);
    throw new Error(text || "Failed to fetch reviews");
  }

  return res.json();
}

export async function deleteMovieReview(movieId) {
  const token = getToken();
  if (!token) {
    throw new Error("User not logged in");
  }

  const res = await fetch(`${API_URL}/${movieId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const text = await res.text();
  if (!res.ok) {
    console.error("Error deleting review:", text);
    throw new Error(text || "Failed to delete review");
  }

  return JSON.parse(text);
}
