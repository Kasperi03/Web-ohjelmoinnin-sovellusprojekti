const BASE_URL = "http://localhost:3001";

export async function deleteGroup(groupId) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/groups/${groupId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error("Failed to delete group");
  return res.json();
}

export async function updateGroup(groupId, newName) {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/groups/${groupId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ name: newName })
  });

  if (!res.ok) {
    const msg = await res.text();
    throw new Error(msg || "Failed to update group");
  }

  return res.json();
}
