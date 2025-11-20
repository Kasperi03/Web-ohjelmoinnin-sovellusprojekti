import "./styles/groupListing.css";
import { Link } from "react-router-dom";
import { joinGroup } from "../api/groupMemberHandler";

export default function GroupListing({groupId, name, memberCount }) {
  return (
    <Link to={`/groups/${groupId}`} className="group-link">
      <div className="group-block">
        <h2 className="group-name">{name}</h2>
        <span className="member-count">{memberCount}</span>
        <button
          className="join-button"
onClick={(e) => {
  e.preventDefault();
  joinGroup(groupId); // ← call your join function
}}

        >
          Join
        </button>
      </div>
    </Link>
  );
}
