import "./styles/searchResults.css";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { useGenres } from "../context/genreContext";

export default function SearchResults() {
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [movies, setMovies] = useState([]);
  const { genres } = useGenres();

  const API_TOKEN =
    "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkODgwODM0ZTY5MTQ2ZGUxMWRiNjRmZjRlNzM3M2M5NiIsIm5iZiI6MTc2Mjc3MTU2Ni4yODMsInN1YiI6IjY5MTFjMjZlMTY1NWYxNGRjN2NlOGViZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mHVdYjZ3oCpmXAU8YYvuMUlHNdru-J4S6H4K_fbb_Ro";

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get("q") || "";
    setQuery(q);
    setPage(1);
  }, [location.search]);

  useEffect(() => {
    if (!query) return;

    const params = new URLSearchParams(location.search);
    const type = params.get("type") || "movie";
    let url = "";

    if (type === "movie") {
      url = `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=en-US&page=${page}`;
    } else if (type === "genre") {
      const genre = genres.find(
        (g) => g.name.toLowerCase() === query.toLowerCase()
      );
      if (!genre) {
        setMovies([]);
        return;
      }
      url = `https://api.themoviedb.org/3/discover/movie?with_genres=${genre.id}&language=en-US&page=${page}`;
    } else if (type === "person") {
      fetch(`https://api.themoviedb.org/3/search/person?query=${query}&language=en-US`, {
        headers: {
          Authorization: `Bearer ${API_TOKEN}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((personData) => {
          const person = personData.results?.[0];
          if (!person) {
            setMovies([]);
            setPageCount(0);
            return;
          }
          return fetch(`https://api.themoviedb.org/3/person/${person.id}/movie_credits`, {
            headers: {
              Authorization: `Bearer ${API_TOKEN}`,
              "Content-Type": "application/json",
            },
          });
        })
        .then((res) => res?.json())
        .then((credits) => {
          if (!credits) return;
          const allMovies = credits.cast.map((m) => ({
            id: m.id,
            title: m.title || m.name,
            poster_path: m.poster_path,
          }));

          const itemsPerPage = 20;
          const start = (page - 1) * itemsPerPage;
          const pagedMovies = allMovies.slice(start, start + itemsPerPage);

          setMovies(pagedMovies);
          setPageCount(Math.ceil(allMovies.length / itemsPerPage));
        })
        .catch(console.error);
      return;
    }

    fetch(url, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setMovies(data.results || []);
        setPageCount(data.total_pages || 1);
      })
      .catch(console.error);
  }, [query, page, location.search, genres]);

  const handlePageClick = (event) => {
    setPage(event.selected + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const Movies = () => {
    if (!movies.length) return <p>No results found.</p>;
    return (
      <div className="movie-grid">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title}
              />
            ) : (
              <div className="no-poster">No Image</div>
            )}
            <h4>{movie.title}</h4>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div id="container">
      <h3>Results for “{query}”</h3>
      <ReactPaginate
        className="pagination"
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="< previous"
        renderOnZeroPageCount={null}
        forcePage={page - 1}
      />
      <Movies />
    </div>
  );
}
