export async function getGroupLayout(groupId) {
  const res = await fetch(`/api/groups/${groupId}/layout`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    credentials: "include"
  });
  if (!res.ok) throw new Error("Failed to fetch layout");
  return res.json();
}

export async function saveGroupLayout(groupId, layoutArray) {
  const res = await fetch(`/api/groups/${groupId}/layout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ layout: layoutArray })
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error("Failed to save layout: " + txt);
  }
  return res.json();
}
