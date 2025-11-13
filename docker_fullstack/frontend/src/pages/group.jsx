import "./styles/group.css";
import Carousel from "../components/carousel";

export default function Group() {
  return (
    <div className="group-container">
      <h1>Group Page</h1>
      <p>This is where you can view and manage a specific group.</p>
      <div className="carousel-container">
        <Carousel title="Group member's favorites" />
      </div>
    </div>
  );
}
