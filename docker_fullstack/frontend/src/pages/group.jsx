import "./styles/group.css";
import Carousel from "../components/carousel";
import MovieInfoBar from "../components/movieInfoBar";
import { fetchMovieDetails } from "../api/movieDetailHandler.js";
import { useEffect, useState,useMemo } from "react";
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
  const [movies, setMovies] = useState([]);
  const [layoutConfig, setLayoutConfig] = useState([]);
  const [isCustomizing, setIsCustomizing] = useState(false);


useEffect(() => {
  async function fetchLayout() {
    try {
      const data = await getGroupLayout(groupId);
      const layoutArray = Array.isArray(data) ? data : data.layout;
      setLayoutConfig(layoutArray || ["pending", "members", "stats"]);
      console.log("Fetched layout:", layoutArray);
    } catch (err) {
      console.error("Failed to fetch layout", err);
      setLayoutConfig(["pending", "members", "stats"]);
    }
  }

  fetchLayout();
}, [groupId]);

const handleCancelCustomize = async () => {
  try {
    const data = await getGroupLayout(groupId);
      const layoutArray = Array.isArray(data) ? data : data.layout;
      setLayoutConfig(layoutArray || ["pending", "members", "stats"]);
  } catch (err) {
    console.error("Failed to fetch layout on cancel", err);
    setLayoutConfig(["pending", "members", "stats"]);
  } finally {
    setIsCustomizing(false);
  }
};

useEffect(() => {
  async function loadMovies() {
    try {
      const res = await fetch(
        `http://localhost:3001/group-movies/${groupId}/movies`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      const ids = await res.json();

      // ❗ If user is not authorized or not a member → backend returns an object, NOT an array
      if (!Array.isArray(ids)) {
        console.warn("User cannot view movies:", ids);
        return; // <-- prevents ids.map crash
      }

      // Fetch TMDB details for each movie
      const movies = await Promise.all(
        ids.map((entry) => fetchMovieDetails(entry.api_id))
      );

      setMovies(movies);
    } catch (err) {
      console.error("Failed to load group movies:", err);
    }
  }

  loadMovies();
}, [groupId]);


  // decode JWT
  const user = getCurrentUser();
  const userId = user?.account_id;

  // dynamic role checks
  const isOwner = members.some((m) => m.account_id === userId && m.is_owner);
  const isMember = members.some((m) => m.account_id === userId);

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

const { totalMovies, avgRating, topGenre } = useMemo(() => {
  if (!movies.length) {
    return { totalMovies: 0, avgRating: 0, topGenre: "N/A" };
  }

  const totalMovies = movies.length;

  const avgRating =
    movies.reduce(
      (sum, m) => sum + (typeof m.vote_average === "number" ? m.vote_average : 0),
      0
    ) / totalMovies;

  let topGenre = "N/A";
  const genreCount = new Map();

  for (const m of movies) {
    if (Array.isArray(m.genres)) {
      m.genres.forEach((g) => {
        genreCount.set(g.name, (genreCount.get(g.name) || 0) + 1);
      });
    }
  }

  if (genreCount.size) {
    const [bestGenre] = [...genreCount.entries()].sort((a, b) => b[1] - a[1])[0];
    topGenre = bestGenre;
  }

  return {
    totalMovies,
    avgRating,
    topGenre,
  };
}, [movies]);

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

  {/* OWNER / MEMBERS SECTION (TOP) */}
  <div className="section-box">
    {/* Owner controls, pending, members */}
    {isOwner && (
      <>
        {/* Owner Controls */}
        <div className="group-owner-controls">
          {!isRenaming ? (
            <>
              <button onClick={() => setIsRenaming(true)}>Rename Group</button>
              <button onClick={handleDeleteGroup}>Delete Group</button>
              <button onClick={() => setIsCustomizing(true)}>Customize Layout</button>
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
      </>
    )}

{isCustomizing && isOwner && (
  <div className="customize-layout">
    <h2>Customize Layout</h2>
    {layoutConfig.map((section, index) => (
      <div key={section} className="layout-item">
        <span>{section.charAt(0).toUpperCase() + section.slice(1)}</span>
        <button onClick={() => moveUp(index)}>↑</button>
        <button onClick={() => moveDown(index)}>↓</button>
      </div>
    ))}
    <button
      onClick={async () => {
        try {
          console.log("About to save layoutConfig:", layoutConfig);
          await saveGroupLayout(groupId, layoutConfig);
          setIsCustomizing(false);
          alert("Layout saved!");
        } catch (err) {
          console.error(err);
          alert("Failed to save");
        }
      }}
    >
      Done
    </button>
    <button onClick={handleCancelCustomize}>Cancel</button>
  </div>
)}

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
        totalMovies={totalMovies}
        avgRating={avgRating}
        topGenre={topGenre}
      />
);
}

  return null;
})}

  {/* CAROUSEL (BOTTOM) */}
  <div className="section-box carousel-box">
  <Carousel title="Group Movies" movies={movies} />
</div>
</div>
</div>
  );
}