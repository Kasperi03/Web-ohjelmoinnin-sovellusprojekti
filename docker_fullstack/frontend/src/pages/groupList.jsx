import "./styles/groupList.css";
import GroupListing from "../components/groupListing.jsx";
import CreateGroup from "../components/createGroup.jsx";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCurrentUser } from "../api/currentUserHelper.js";

export default function GroupList() {
  const [groups, setGroups] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const user = getCurrentUser();
  const isLoggedIn = !!user;


  // Load groups from backend
useEffect(() => {
  async function fetchGroups() {
    try {
      // 1. Fetch basic group info
      const res = await fetch("http://localhost:3001/groups");
      const groupsData = await res.json();

      // 2. Fetch member counts for each group
      const groupsWithCounts = await Promise.all(
        groupsData.map(async (group) => {
          try {
            const countRes = await fetch(
              `http://localhost:3001/groups/${group.group_id}/member-count`
            );
            const countData = await countRes.json();

            return {
              ...group,
              memberCount: countData.count,
            };
          } catch (err) {
            console.error(
              `Failed to fetch member count for group ${group.group_id}`,
              err
            );
            return {
              ...group,
              memberCount: 0, // fallback so UI doesn't break
            };
          }
        })
      );

      // 3. Save the final result into state
      setGroups(groupsWithCounts);

    } catch (err) {
      console.error("Failed to load groups:", err);
    }
  }

  fetchGroups();
}, []);


  const handleCreateGroup = async (groupName) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:3001/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`},
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

      {isLoggedIn && (
  <>
    <button className="group-btn">
      <Link to="/my-groups">My Groups</Link>
    </button>

    <button className="group-btn" onClick={() => setIsCreating(true)}>
      Create New Group
    </button>
  </>
)}

      {groups.map((group) => (
        <GroupListing
          key={group.group_id}
          groupId={group.group_id}
          name={group.name}
          memberCount={group.memberCount}
        />
      ))}

      {isCreating && (
        <CreateGroup onCreate={handleCreateGroup} onClose={() => setIsCreating(false)} />
      )}
    </div>
  );
}
