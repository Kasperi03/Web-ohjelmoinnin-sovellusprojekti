// frontend/src/api/groupMember.js

const BASE_URL = "http://localhost:3001";

// Join group
export async function joinGroup(groupId) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/groups/${groupId}/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Leave group (correct backend route)
export async function leaveGroup(groupId, memberId) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/groups/${groupId}/remove/${memberId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// Approve member
export async function approveMember(groupId, memberId) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/groups/${groupId}/approve/${memberId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error("Failed to approve member");
  return res.json();
}

// Reject member
export async function rejectMember(groupId, memberId) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/groups/${groupId}/reject/${memberId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error("Failed to reject member");
  return res.json();
}

// Get pending requests
export async function getPendingMembers(groupId) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/groups/${groupId}/pending`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error("Failed to fetch pending members");
  return res.json();
}
