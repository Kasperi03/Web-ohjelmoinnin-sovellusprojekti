const API_URL = "http://localhost:3001/api/movie-reviews";
const TOKEN = localStorage.getItem("token");

export async function submitMovieReview(movieId, rating, reviewText) {

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
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
