import "./styles/groupListing.css";
import { Link } from "react-router-dom";
import { joinGroup } from "../api/groupMemberHandler";
import { useEffect, useState } from "react";
import { getCurrentUser } from "../api/currentUserHelper.js";

export default function GroupListing({ groupId, name }) {
  const user = getCurrentUser();
  const isLoggedIn = !!user;

  const [memberCount, setMemberCount] = useState(0);
  const [isMember, setIsMember] = useState(false);
  const [status, setStatus] = useState(null);


  // Fetch member count for this group
  useEffect(() => {
    fetch(`http://localhost:3001/groups/${groupId}/member-count`)
      .then((res) => res.json())
      .then((data) => setMemberCount(data.count))
      .catch(() => setMemberCount(0));
  }, [groupId]);

  // Check if user is already a member
 useEffect(() => {
   if (!isLoggedIn) return;

   fetch(`http://localhost:3001/groups/${groupId}/is-member`, {
     headers: {
       Authorization: `Bearer ${localStorage.getItem("token")}`,
     },
   })
     .then((res) => res.json())
     .then((data) => {
         setIsMember(data.isMember);
+        setStatus(data.status);
     })
     .catch(() => {});
 }, [groupId, isLoggedIn]);


  return (
    <Link to={`/groups/${groupId}`} className="group-link">
      <div className="group-block">
        <h2 className="group-name">{name}</h2>

        {/* Always show */}
        <span className="member-count">members: {memberCount}</span>

        {/* Only logged-in AND not a member */}
        {isLoggedIn && status === null && (
          <button
  className="join-button"
  onClick={async (e) => {
    e.preventDefault();

    try {
      const res = await joinGroup(groupId);

      // Update UI immediately
      setStatus("pending");

    } catch (err) {
      console.error("Failed to join group:", err);
    }
  }}
>
  Join
</button>

        )}

        {isLoggedIn && status === "pending" && (
          <span className="pending-label">Pending...</span>
        )}

        {isLoggedIn && status === "accepted" && (
          <span className="joined-label">Joined ✓</span>
        )}

        {isLoggedIn && status === "rejected" && (
          <span className="rejected-label">Rejected ✗</span>
        )}

      </div>
    </Link>
  );
}
