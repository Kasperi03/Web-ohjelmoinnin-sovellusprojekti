import "./styles/group.css";
import Carousel from "../components/carousel";
import MovieInfoBar from "../components/movieInfoBar";

export default function GroupPage() {
  // Dummy data for the info bar
  const totalMovies = 12;
  const avgRating = 4.1;
  const topGenre = "Action";

  // Dummy group members
  const members = [];

  return (
    <div className="group-container">
      <h1>Group Page</h1>
      <p>This is where you can view and manage a specific group.</p>

      {/* Here member presentation */}

      
      <MovieInfoBar totalMovies={totalMovies} avgRating={avgRating} topGenre={topGenre} />

      <div className="carousel-container">
        <Carousel title="Group member's favorites" />
      </div>
    </div>
  );
}
