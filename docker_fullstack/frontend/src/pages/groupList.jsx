import "./styles/groupList.css";
import GroupListing from "../components/groupListing.jsx";
import CreateGroup from "../components/createGroup.jsx";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function GroupList() {
  const [groups, setGroups] = useState([]);
  const [isCreating, setIsCreating] = useState(false);

  // Load groups from backend
  useEffect(() => {
    async function fetchGroups() {
      try {
        const res = await fetch("http://localhost:3001/groups");
        const data = await res.json();
        setGroups(data);
      } catch (err) {
        console.error("Failed to load groups:", err);
      }
    }
    fetchGroups();
  }, []);

  const handleCreateGroup = async (groupName) => {
    try {
      const res = await fetch("http://localhost:3001/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: groupName }),
      });

      const newGroup = await res.json();
      setGroups((prev) => [...prev, newGroup]);
      setIsCreating(false);
    } catch (err) {
      console.error("Failed to create group:", err);
    }
  };

  return (
    <div className="groupList-container">
      <h1>Groups Page</h1>
      <p>This is where you can view groups.</p>

      <button>
        <Link to="/group">Group</Link>
      </button>
      <button className="create-btn" onClick={() => setIsCreating(true)}>
        Create New Group
      </button>

      {groups.map((group) => (
        <GroupListing
          key={group.group_id}
          name={group.name}
          memberCount={0} // You will update this later
        />
      ))}

      {isCreating && (
        <CreateGroup onCreate={handleCreateGroup} onClose={() => setIsCreating(false)} />
      )}
    </div>
  );
}
