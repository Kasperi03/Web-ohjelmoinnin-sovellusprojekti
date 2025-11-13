const API_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkODgwODM0ZTY5MTQ2ZGUxMWRiNjRmZjRlNzM3M2M5NiIsIm5iZiI6MTc2Mjc3MTU2Ni4yODMsInN1YiI6IjY5MTFjMjZlMTY1NWYxNGRjN2NlOGViZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mHVdYjZ3oCpmXAU8YYvuMUlHNdru-J4S6H4K_fbb_Ro";

export async function fetchMovieDetails(id) {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?append_to_response=credits,videos`,
      {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return await res.json();
  } catch (err) {
    console.error("Error fetching movie details:", err);
    return null;
  }
}
