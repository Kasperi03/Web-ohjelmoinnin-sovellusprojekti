import "./styles/groupList.css";
import GroupListing from "../components/groupListing.jsx";
import CreateGroup from "../components/createGroup.jsx";
import { useState } from "react";

export default function GroupList() {
  const [groups, setGroups] = useState([
    {
      name: "Test Group",
      memberCount: 5,
    },
  ]);

  const [isCreating, setIsCreating] = useState(false);

  const handleCreateGroup = (groupName) => {
    const newGroup = { name: groupName, memberCount: 1 };
    setGroups([...groups, newGroup]);
    setIsCreating(false);
  };

  return (
    <div className="groupList-container">
      <h1>Groups Page</h1>
      <p>This is where you can view groups.</p>

      <button className="create-btn" onClick={() => setIsCreating(true)}>
        Create New Group
      </button>

      {groups.map((group, index) => (
        <GroupListing key={index} name={group.name} memberCount={group.memberCount} /> //Asettaa tiedot ryhmään
      ))}
      {isCreating && (
        <CreateGroup onCreate={handleCreateGroup} onClose={() => setIsCreating(false)} /> // tekee ryhmän ja postaa sen
      )}
    </div>
  );
}
