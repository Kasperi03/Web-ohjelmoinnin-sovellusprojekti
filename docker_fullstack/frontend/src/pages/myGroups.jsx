import { useEffect, useState } from "react";
import GroupListing from "../components/groupListing";
import { getCurrentUser } from "../api/currentUserHelper";
import { useGroups } from "../api/useGroups";

export default function MyGroups() {
  const { groups, fetchMyGroups } = useGroups();
  const user = getCurrentUser();
  const isLoggedIn = !!user;

  useEffect(() => {
    if (!isLoggedIn) return;
    fetchMyGroups();
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <h2>Please log in to view your groups.</h2>;
  }


  return (
    <div className="groupList-container">
      <h1>My Groups</h1>

      {groups.length === 0 && <p>You are not part of any groups yet.</p>}

      {groups.map(group => (
        <GroupListing
          key={group.group_id}
          groupId={group.group_id}
          name={group.name}
          memberCount={group.memberCount ?? 0}
        />
      ))}
    </div>
  );
}
