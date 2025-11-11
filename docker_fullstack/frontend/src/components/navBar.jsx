import "./styles/navBar.css";
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/">Home</Link>
        <Link to="/groupList">Groups</Link>
      </div>

      <div className="navbar-center">
        <input type="text" placeholder="Search..." className="search-input" />
      </div>

      <div className="navbar-right">
        <Link to="/favorites">Favorites</Link>
        <Link to="/signIn">Sign In</Link>
      </div>
    </nav>
  );
}
