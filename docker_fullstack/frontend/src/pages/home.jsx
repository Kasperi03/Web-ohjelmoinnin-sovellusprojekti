import "./styles/home.css";
import Carousel from "../components/carousel.jsx";

export default function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to the Fullstack Docker App</h1>
      <p>This is the home page of the application.</p>
      <Carousel title="Trending" />
      <Carousel title="Now in theaters" />
    </div>
  );
}
