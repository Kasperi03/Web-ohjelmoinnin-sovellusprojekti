import "./styles/groupListing.css";

export default function GroupListing({ name, memberCount }) {
  return (
    <div className="group-block">
      <h2 className="group-name">{name}</h2>
      <span className="member-count">{memberCount}</span>
      <button>Join</button>
    </div>
  );
}
