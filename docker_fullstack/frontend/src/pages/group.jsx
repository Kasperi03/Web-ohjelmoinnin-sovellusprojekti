import "./styles/group.css";
import Carousel from "../components/carousel";
import MovieInfoBar from "../components/movieInfoBar";
import { useEffect, useState } from "react";
import { getPendingMembers, approveMember, rejectMember } from "../api/groupMemberHandler";
import { useParams } from "react-router-dom";

export default function GroupPage() {
  const { groupId } = useParams(); // <-- capture ID from /group/:groupId
  console.log("Group ID:", groupId);

  // Dummy data for the info bar
  const totalMovies = 12;
  const avgRating = 4.1;
  const topGenre = "Action";

  // Pending members
  const [pending, setPending] = useState([]);

  // Load pending members on mount
  useEffect(() => {
    loadPending();
  }, []);
console.log("Group ID:", groupId); 
  const loadPending = async () => {
    try {
      const list = await getPendingMembers(groupId);
      setPending(list);
    } catch (err) {
      console.error("Failed to load pending members:", err);
    }
  };

  const handleApprove = async (memberId) => {
    try {
      await approveMember(groupId, memberId);
      loadPending(); // refresh list
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (memberId) => {
    try {
      await rejectMember(groupId, memberId);
      loadPending(); // refresh list
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="group-container">
      <h1>Group Page</h1>
      <p>This is where you can view and manage a specific group.</p>

      {/* ----------------------- */}
      {/* 🧑‍🤝‍🧑 PENDING MEMBERS UI */}
      {/* ----------------------- */}
      <div className="pending-members-section">
        <h2>Pending Member Requests</h2>

        {pending.length === 0 && (
          <p>No pending requests.</p>
        )}

        {pending.map((member) => (
          <div key={member.id} className="pending-member-row">
            <span>{member.username || member.email}</span>

            <button className="approve-btn" onClick={() => handleApprove(member.id)}>
              Approve
            </button>

            <button className="reject-btn" onClick={() => handleReject(member.id)}>
              Reject
            </button>
          </div>
        ))}
      </div>

      {/* ----------------------- */}
      {/* EXISTING GROUP CONTENT  */}
      {/* ----------------------- */}

      <MovieInfoBar totalMovies={totalMovies} avgRating={avgRating} topGenre={topGenre} />

      <div className="carousel-container">
        <Carousel title="Group member's favorites" />
      </div>
    </div>
  );
}

