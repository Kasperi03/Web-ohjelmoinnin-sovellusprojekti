const API_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkODgwODM0ZTY5MTQ2ZGUxMWRiNjRmZjRlNzM3M2M5NiIsIm5iZiI6MTc2Mjc3MTU2Ni4yODMsInN1YiI6IjY5MTFjMjZlMTY1NWYxNGRjN2NlOGViZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mHVdYjZ3oCpmXAU8YYvuMUlHNdru-J4S6H4K_fbb_Ro";

async function fetchFromTMDB(URL, pages = 2) {
  let allResults = [];
  for (let page = 1; page <= pages; page++) {
    const url = await fetch(`${URL}&page=${page}`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        accept: "application/json",
      },
    });
    if (!url.ok) {
      console.error("TMDB fetch failed", url.status);
      continue;
    }
    const data = await url.json();
    allResults = allResults.concat(data.results || []).map((movie) => ({
      id: movie.id,
      title: movie.title,
      poster_path: movie.poster_path,
      vote_average: movie.vote_average,
    }));
  }
  return allResults;
}

export async function getNowInTheaters() {
  const URL = `https://api.themoviedb.org/3/movie/now_playing?language=en-US`;
  return await fetchFromTMDB(URL, 2);
}
export async function getTrending() {
  const URL = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc'`;
  return await fetchFromTMDB(URL, 2);
}
