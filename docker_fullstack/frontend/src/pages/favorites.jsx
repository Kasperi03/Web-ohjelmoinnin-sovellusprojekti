import "./styles/favorites.css";
import Carousel from "../components/carousel";

export default function Favorites() {
  return (
    <div className="favorites-container">
      <h1>Favorites Page</h1>
      <p>This is where your favorite items will be displayed.</p>
      <Carousel title="Your favorite movies" />
    </div>
  );
}
