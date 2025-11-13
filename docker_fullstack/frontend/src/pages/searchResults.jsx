import "./styles/searchResults.css";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { useGenres } from "../context/genreContext";
import { searchMovies, searchByGenre, searchPersonMovies } from "../api/searchHandler.js";

export default function SearchResults() {
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [type, setType] = useState("movie");
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const [movies, setMovies] = useState([]);
  const { genres } = useGenres();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setQuery(params.get("q") || "");
    setType(params.get("type") || "movie");
    setPage(1);
  }, [location.search]);

  useEffect(() => {
    if (!query) return;

    async function fetchData() {
      let data;

      if (type === "movie") {
        data = await searchMovies(query, page);

      } else if (type === "genre") {
        const genre = genres.find(
          (g) => g.name.toLowerCase() === query.toLowerCase()
        );
        if (!genre) {
          setMovies([]);
          return;
        }
        data = await searchByGenre(genre.id, page);

      } else if (type === "person") {
        data = await searchPersonMovies(query, page);
      }

      setMovies(data.results || []);
      setPageCount(data.total_pages || 1);
    }

    fetchData();
  }, [query, type, page, genres]);

  const handlePageClick = (event) => {
    setPage(event.selected + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div id="container">
      <h3>Results for “{query}” ({type})</h3>

      <ReactPaginate
        className="pagination"
        breakLabel="..."
        nextLabel="next >"
        previousLabel="< previous"
        onPageChange={handlePageClick}
        pageCount={pageCount}
        pageRangeDisplayed={5}
        forcePage={page - 1}
      />

      <div className="movie-grid">
        {movies.length === 0 && <p>No results found.</p>}
        {movies.map((movie) => (
          <Link to={`/movie/${movie.id}`} className="movie-card">

            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title}
              />
            ) : (
              <div className="no-poster">No Image</div>
            )}
            <h4>{movie.title}</h4>
          </Link>
        ))}
      </div>
    </div>
  );
}
