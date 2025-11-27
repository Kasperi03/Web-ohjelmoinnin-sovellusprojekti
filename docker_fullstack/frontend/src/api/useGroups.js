// useGroups.js
import { useState } from "react";

export function useGroups() {
  const [groups, setGroups] = useState([]);

  const fetchMyGroups = async () => {
    try {
      const res = await fetch("http://localhost:3001/groups/me/full", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      const data = await res.json();
      setGroups(data);
      return data;
    } catch (err) {
      console.error("Failed to load user groups:", err);
      throw err;
    }
  };

  return { groups, fetchMyGroups };
}
