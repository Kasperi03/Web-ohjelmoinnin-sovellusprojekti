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

  return (
    <div className="home-container">
      <h1>Welcome to the Fullstack Docker App</h1>
      <p>This is the home page of the application.</p>
      <Carousel title="Trending" movies={trending} visibleSlides={4} />
      <Carousel title="Now in theaters" movies={NowInTheaters} visibleSlides={4} />
    </div>
  );
}
