import "./styles/favorites.css";
import Carousel from "../components/carousel";
import FavoriteInfo from "../components/movieInfoBar";

export default function Favorites() {

  
  return (
    <div className="favorites-container">
      <h1>Favorites Page</h1>
      <p>This is where your favorite items will be displayed.</p>

      <FavoriteInfo> </FavoriteInfo>

      <div className="carousel-container">
        <Carousel title="Your Favorites" />
      </div>
    </div>
  );
}
