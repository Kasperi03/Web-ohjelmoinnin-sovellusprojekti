import { useState } from "react";

export function useAcceptedGroups() {
  const [acceptedGroups, setAcceptedGroups] = useState([]);

  const fetchAcceptedGroups = async () => {
    try {
      const res = await fetch("http://localhost:3001/groups/me/full", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      const data = await res.json();

      console.log("Groups returned from API:", data);

      const accepted = data.filter((g) => g.status === "accepted");

      setAcceptedGroups(accepted);
      return accepted;

    } catch (err) {
      console.error("Failed to load accepted groups:", err);
      throw err;
    }
  };

  return { acceptedGroups, fetchAcceptedGroups };
}
