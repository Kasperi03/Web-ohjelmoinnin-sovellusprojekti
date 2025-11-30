
// Shared TMDB request headers
const TMDB_HEADERS = {
  Authorization: `Bearer ${process.env.API_KEY}`,
  "Content-Type": "application/json",
};


// -----------------------------
//  Search Movies
// -----------------------------
export const searchMoviesService = async (query, page = 1) => {
  const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(
    query
  )}&include_adult=false&language=en-US&page=${page}`;

  try {
    const response = await fetch(url, { headers: TMDB_HEADERS });
    if (!response.ok)
      throw new Error(`TMDB search failed: ${response.status}`);
      
    return await response.json();
  } catch (error) {
    console.error("TMDB searchMoviesService error:", error);
    throw error;
  }
};

// -----------------------------
//  Search By Genre
// -----------------------------
export const searchByGenreService = async (genreId, page = 1) => {
  const url = `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&language=en-US&page=${page}`;

  try {
    const response = await fetch(url, { headers: TMDB_HEADERS });
    if (!response.ok)
      throw new Error(`TMDB genre fetch failed: ${response.status}`);

    return await response.json();
  } catch (error) {
    console.error("TMDB searchByGenreService error:", error);
    throw error;
  }
};

// -----------------------------
//  Search Person Movies
// -----------------------------
export const searchPersonMoviesService = async (query, page = 1) => {
  try {
    // Step 1: Search person
    const personUrl = `https://api.themoviedb.org/3/search/person?query=${encodeURIComponent(
      query
    )}&language=en-US`;

    const personRes = await fetch(personUrl, { headers: TMDB_HEADERS });
    if (!personRes.ok)
      throw new Error(`TMDB person search failed: ${personRes.status}`);

    const personData = await personRes.json();
    const person = personData.results?.[0];

    if (!person) {
      return { results: [], total_pages: 1 };
    }

    // Step 2: Get movie credits
    const creditsUrl = `https://api.themoviedb.org/3/person/${person.id}/movie_credits`;
    const creditsRes = await fetch(creditsUrl, { headers: TMDB_HEADERS });

    if (!creditsRes.ok)
      throw new Error(`TMDB credits fetch failed: ${creditsRes.status}`);

    const credits = await creditsRes.json();

    const filmography = credits.cast.map((m) => ({
      id: m.id,
      title: m.title || m.name,
      poster_path: m.poster_path,
    }));

    // Pagination
    const itemsPerPage = 20;
    const start = (page - 1) * itemsPerPage;

    return {
      results: filmography.slice(start, start + itemsPerPage),
      total_pages: Math.ceil(filmography.length / itemsPerPage),
    };
  } catch (error) {
    console.error("TMDB searchPersonMoviesService error:", error);
    throw error;
  }
};


export const movieDetailsService = async (id) => {
  const url = `https://api.themoviedb.org/3/movie/${id}?append_to_response=credits,videos`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.API_KEY}`,
      Accept: "application/json"
    }
  });

  const text = await res.text();
  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("🔥 movieDetailsService parse error:", text);
    throw err;
  }
};

export const fetchFromTMDB = async (urlBase, pages = 2) => {
  let results = [];

  for (let page = 1; page <= pages; page++) {
    const url = `${urlBase}&page=${page}`;
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
        Accept: "application/json",
      },
    });

    const text = await res.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("TMDB RAW ERROR:", text);
      continue;
    }

    if (!data.results) continue;

    results = results.concat(
      data.results.map((movie) => ({
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        vote_average: movie.vote_average,
      }))
    );
  }

  return results;
};

export const nowPlayingService = async () => {
  const URL = `https://api.themoviedb.org/3/movie/now_playing?language=en-US`;
  return await fetchFromTMDB(URL, 2);
};

export const trendingService = async () => {
  const URL = `https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&sort_by=popularity.desc`;
  return await fetchFromTMDB(URL, 2);
};
