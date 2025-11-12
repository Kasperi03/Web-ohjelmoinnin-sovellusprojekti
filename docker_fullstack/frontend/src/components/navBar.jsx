import "./styles/navBar.css";
import { Link,useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [term, setTerm] = useState("")
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form reload
    if (term.trim()) {
      navigate(`/search?q=${encodeURIComponent(term.trim())}`);
      setTerm(""); // optional: clear input after navigating
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/">Home</Link>
        <Link to="/groupList">Groups</Link>
      </div>

       <div className="navbar-center">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Search..."
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
