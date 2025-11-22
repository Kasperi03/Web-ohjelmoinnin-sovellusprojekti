import "./styles/group.css";
import Carousel from "../components/carousel";
import MovieInfoBar from "../components/movieInfoBar";
import { useEffect, useState } from "react";
import {
  getPendingMembers,
  approveMember,
  rejectMember,
  getGroupMembers,
  removeMember,
  leaveGroup
} from "../api/groupMemberHandler";
import { useParams, useNavigate } from "react-router-dom";
import { getCurrentUser } from "../api/currentUserHelper.js";
import { deleteGroup, updateGroup } from "../api/groupHandler.js";
import { getGroupLayout, saveGroupLayout } from "../api/groupLayoutHandler";

export default function GroupPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [pending, setPending] = useState([]);
  const [members, setMembers] = useState([]);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState("");

  // decode JWT
  const user = getCurrentUser();
  const userId = user?.account_id;

  // dynamic role checks
  const isOwner = members.some((m) => m.account_id === userId && m.is_owner);
  const isMember = members.some((m) => m.account_id === userId);

  const [isCustomizing, setIsCustomizing] = useState(false);
  const [layoutConfig, setLayoutConfig] = useState([
    "pending",
    "members",
    "stats"
  ]);

  // Load members + pending on mount
 useEffect(() => {
  loadMembers();
}, [groupId]);

useEffect(() => {
  if (isOwner) {
    loadPending();
  } else {
    setPending([]); // reset for non-owner
  }
}, [isOwner, groupId]);


  // Fetch accepted members
const loadMembers = async () => {
  try {
    const list = await getGroupMembers(groupId);
    setMembers(list);
  } catch (err) {
    console.error("Failed to load members:", err);
    alert("You are not a member of this group.");
    navigate("/groupList");
  }
};


  // Fetch pending requests
const loadPending = async () => {
  try {
    const list = await getPendingMembers(groupId);
    setPending(list);
  } catch (err) {
    console.error("Pending fetch error:", err);
    setPending([]); // silent fail, no alerts
  }
};


  // Delete group (owner only)
  const handleDeleteGroup = async () => {
    if (!window.confirm("Delete this group?")) return;

    try {
      await deleteGroup(groupId);
      navigate("/");
    } catch (err) {
      alert("Failed to delete group");
    }
  };

  // Rename group (owner only)
  const handleRenameGroup = async () => {
    if (!newName.trim()) return;

    try {
      await updateGroup(groupId, newName);
      setIsRenaming(false);
      window.location.reload();
    } catch (err) {
      alert("Rename failed");
    }
  };

  // A member leaves the group
  const handleLeave = async () => {
    if (!window.confirm("Leave this group?")) return;

    try {
      await leaveGroup(groupId);
      navigate("/");
    } catch (err) {
      alert("Could not leave group");
    }
  };

  // Approve/reject pending
  const handleApprove = async (memberId) => {
    await approveMember(groupId, memberId);
    loadPending();
    loadMembers();
  };

  const handleReject = async (memberId) => {
    await rejectMember(groupId, memberId);
    loadPending();
  };

  const handleRemove = async (memberId) => {
    await removeMember(groupId, memberId);
    loadMembers();
  };

const moveUp = (index) => {
  if (index === 0) return;
  setLayoutConfig((prev) => {
    const arr = [...prev];
    [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];
    return arr;
  });
};

const moveDown = (index) => {
  if (index === layoutConfig.length - 1) return;
  setLayoutConfig((prev) => {
    const arr = [...prev];
    [arr[index + 1], arr[index]] = [arr[index], arr[index + 1]];
    return arr;
  });
};

  return (
    <div className="group-container">
      <h1>Group Page</h1>

      {/* OWNER CONTROLS */}
      {isOwner && (
        <div className="group-owner-controls">

          {!isRenaming ? (
            <>
              <button onClick={() => setIsRenaming(true)}>Rename Group</button>
              <button onClick={handleDeleteGroup}>Delete Group</button>
              <button onClick={() => setIsCustomizing(true)}>Customize Page</button>
            </>
          ) : (
            <div className="rename-form">
              <input
                value={newName}
                placeholder="New group name"
                onChange={(e) => setNewName(e.target.value)}
              />
              <button onClick={handleRenameGroup}>Save</button>
              <button onClick={() => setIsRenaming(false)}>Cancel</button>
            </div>
          )}

        </div>
      )}

      {/* setIsCustomizer (OWNER ONLY) */}
      {isCustomizing && isOwner && (
        <div className="customize-layout">
          <h2>Customize Layout</h2>
          {layoutConfig.map((section, index) => (
            <div key={section} className="layout-item">
              <span>{section.charAt(0).toUpperCase() + section.slice(1)}</span>
              <button onClick={() => moveUp(index)}>up</button>
              <button onClick={() => moveDown(index)}>down</button>
            </div>
          ))}
          <button onClick={() => setIsCustomizing(false)}>Done</button>
        </div>
      )
      }

      {layoutConfig.map((section) => {
  if (section === "pending" && isOwner) {
    return (
      <div key="pending" className="pending-members-section">
        <h2>Pending Requests</h2>
        {pending.length === 0 && <p>No pending requests.</p>}
        {pending.map((member) => (
          <div key={member.id} className="pending-member-row">
            <span>{member.username}</span>
            <button onClick={() => handleApprove(member.id)}>Approve</button>
            <button onClick={() => handleReject(member.id)}>Reject</button>
          </div>
        ))}
      </div>
    );
  }

  if (section === "members") {
    return (
      <div key="members" className="members-section">
        <h2>Members</h2>
        {members.map((member) => (
          <div key={member.id} className="member-row">
            <span>
              {member.username}
              {member.is_owner && " 👑"}
            </span>

            {member.account_id === userId && !member.is_owner && (
              <button onClick={handleLeave}>Leave Group</button>
            )}

            {isOwner && !member.is_owner && member.account_id !== userId && (
              <button onClick={() => handleRemove(member.id)}>Remove</button>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (section === "stats") {
    return (
      <MovieInfoBar
        key="stats"
        totalMovies={12}
        avgRating={4.1}
        topGenre="Action"
      />
    );
  }
  return null;
})}

<div className="favorites-section">
  <Carousel title="Group member's favorites" />
</div>
  </div> );
}