const BASE_URL = "http://localhost:3001";

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

export async function removeMember(groupId, memberId) {
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

export async function getPendingMembers(groupId) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/groups/${groupId}/pending`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

   if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function getGroupMembers(groupId) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/groups/${groupId}/members`, {
    headers: { Authorization: `Bearer ${token}` }
  });

    if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `HTTP ${res.status}`);
    } 
  return res.json();
}

export async function leaveGroup(groupId) {
  const token = localStorage.getItem("token");

  const url = `${BASE_URL}/groups/${groupId}/leave`;
  console.log("LEAVE REQUEST URL:", url);

  const res = await fetch(url, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const text = await res.text();
  console.log("LEAVE STATUS:", res.status);
  console.log("LEAVE RESPONSE:", text);

  if (!res.ok) throw new Error(text || "Leave failed");

  return JSON.parse(text);
}

