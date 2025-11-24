const BASE_URL = "http://localhost:3001";

export async function getGroupLayout(groupId) {
  console.log("GET layout for group:", groupId);
  try {
    const res = await fetch(`${BASE_URL}/customize/${groupId}/layout`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    console.log("GET response status:", res.status);

    const text = await res.text();
    console.log("GET raw response text:", text);

    const data = JSON.parse(text);
    console.log("GET parsed data:", data);

    if (!res.ok) throw new Error(`Failed to fetch layout: ${res.status}`);
    return data;
  } catch (err) {
    console.error("Error in getGroupLayout:", err);
    throw err;
  }
}

export async function saveGroupLayout(groupId, layoutArray) {
  try {
    console.log("PUT layout for group:", groupId, "Layout array:", layoutArray);

    const res = await fetch(`${BASE_URL}/customize/${groupId}/layout`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ layout: layoutArray })
    });

    console.log("Response status:", res.status);
    const text = await res.text();
    console.log("Raw response text:", text);

    if (!res.ok) {
      throw new Error("Failed to save layout: " + text);
    }

    const json = JSON.parse(text);
    console.log("Parsed JSON response:", json);
    return json;
  } catch (err) {
    console.error("Error in saveGroupLayout:", err);
    throw err;
  }
}

