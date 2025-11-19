import "./styles/navBar.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../img/logo.png";

export default function Navbar() {
  const [term, setTerm] = useState("");
  const navigate = useNavigate();
  const [type, setType] = useState("movie");

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form reload
    if (term.trim()) {
      navigate(`/search?q=${encodeURIComponent(term.trim())}&type=${type}`);
      setTerm(""); // optional: clear input after navigating
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="Tiger logo" className="tiger-logo" />
        <Link to="/">Home</Link>
        <Link to="/groupList">Groups</Link>
      </div>

      <div className="navbar-center">
        <form onSubmit={handleSubmit} className="form">
          <select value={type} onChange={(e) => setType(e.target.value)} className="select">
            <option value="movie">Title</option>
            <option value="person">Actor</option>
            <option value="genre">Genre</option>
          </select>

          <input
            className="search-input"
            type="text"
            placeholder={`Search by ${type}...`}
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
        </form>
      </div>

      <div className="navbar-right">
        <Link to="/favorites">Favorites</Link>
        <Link to="/signIn">Sign In</Link>
      </div>
    </nav>
  );
}
