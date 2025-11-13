import "./styles/groupListing.css";
import { Link } from "react-router-dom";

export default function GroupListing({ name, memberCount }) {
  return (
    <Link to={`/group/${name}`} className="group-link">
      <div className="group-block">
        <h2 className="group-name">{name}</h2>
        <span className="member-count">{memberCount}</span>
        <button
          className="join-button"
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          Join
        </button>
      </div>
    </Link>
  );
}
