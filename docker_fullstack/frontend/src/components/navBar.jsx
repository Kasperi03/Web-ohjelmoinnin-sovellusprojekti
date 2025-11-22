import "./styles/navBar.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import logo from "../img/logo.png";
import { getCurrentUser } from "../api/currentUserHelper";


export default function Navbar() {
  const [term, setTerm] = useState("");
  const [type, setType] = useState("movie");
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();
  

  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (term.trim()) {
      navigate(`/search?q=${encodeURIComponent(term.trim())}&type=${type}`);
      setTerm("");
    }
  };

  const handleProfileClick = () => {
    setShowMenu(false);
    navigate("/profile");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setShowMenu(false);
    navigate("/");
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
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="select"
          >
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
        {isLoggedIn && <Link to="/favorites">Favorites</Link>}


        {isLoggedIn ? (
          <div className="navbar-profile">
            <button
              type="button"
              className="profile-button"
              onClick={() => setShowMenu((prev) => !prev)}
            >
              Profile ▾
            </button>

            {showMenu && (
              <div className="profile-menu">
                <button type="button" onClick={handleProfileClick}>
                  Profile
                </button>
                <button type="button" onClick={handleLogout}>
                  Log out
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/signIn">Sign In</Link>
        )}
      </div>
    </nav>
  );
}
