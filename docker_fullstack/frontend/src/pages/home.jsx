import "./styles/home.css";
import Carousel from "../components/carousel.jsx";
import { getNowInTheaters, getTrending } from "../api/tmbs.js";
import { useEffect, useState } from "react";

export default function Home() {
  const [NowInTheaters, setNowInTheaters] = useState([]); // update state variable name to NowInTheaters when getting value from API
  const [trending, setTrending] = useState([]); // update state variable name to trending when getting value from API

  useEffect(() => {
    async function fetchMovies() {
      const movies = await getNowInTheaters();
      const trendingMovies = await getTrending();
      setTrending(trendingMovies);
      setNowInTheaters(movies);
    }
    fetchMovies();
  }, []);
console.log("Trending:", trending);
console.log("Now in theaters:", NowInTheaters);
  return (
    <div className="home-container">
      <h1>Welcome to the Rotten Tiger</h1>

      <div className="carousel-container">
        <Carousel title="Trending" movies={trending} visibleSlides={4} />
        <Carousel title="Now in theaters" movies={NowInTheaters} visibleSlides={4} />
        
      </div>
    </div>
  );
}
