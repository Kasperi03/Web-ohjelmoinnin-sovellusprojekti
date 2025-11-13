
const API_TOKEN =
    "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkODgwODM0ZTY5MTQ2ZGUxMWRiNjRmZjRlNzM3M2M5NiIsIm5iZiI6MTc2Mjc3MTU2Ni4yODMsInN1YiI6IjY5MTFjMjZlMTY1NWYxNGRjN2NlOGViZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mHVdYjZ3oCpmXAU8YYvuMUlHNdru-J4S6H4K_fbb_Ro";

const headers = {
    Authorization: `Bearer ${API_TOKEN}`,
    "Content-Type": "application/json",
};

export async function searchMovies(query, page = 1) {
    const url = `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${page}`;

    const res = await fetch(url, { headers });
    return res.json();
}

export async function searchByGenre(genreId, page = 1) {
    const url = `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&language=en-US&page=${page}`;

    const res = await fetch(url, { headers });
    return res.json();
}

export async function searchPersonMovies(query, page) {
    // 1. Find actor
    const personRes = await fetch(
        `https://api.themoviedb.org/3/search/person?query=${query}&language=en-US`,
        { headers }
    );
    const personData = await personRes.json();

    const person = personData.results?.[0];
    if (!person) return { results: [], total_pages: 1 };

    // 2. Get filmography
    const creditsRes = await fetch(
        `https://api.themoviedb.org/3/person/${person.id}/movie_credits`,
        { headers }
    );
    const credits = await creditsRes.json();

const filmography = credits.cast.map((m) => ({
    id: m.id,
    title: m.title || m.name,
    poster_path: m.poster_path,
}));


const itemsPerPage = 20;
const start = (page - 1) * itemsPerPage;
const pagedMovies = filmography.slice(start, start + itemsPerPage);

return {
    results: pagedMovies,
    total_pages: Math.ceil(filmography.length / itemsPerPage),

}}
