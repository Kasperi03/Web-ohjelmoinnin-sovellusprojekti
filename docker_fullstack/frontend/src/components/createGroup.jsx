import "./styles/createGroup.css";
import { useState } from "react";

export default function CreateGroup({ onClose, onCreate }) {
  const [groupName, setGroupName] = useState("");

  const handleCreate = () => {
    if (groupName.trim() === "") return;
    onCreate(groupName);
    setGroupName("");
    onClose();
  };
  return (
    <div className="overlay">
      <div className="box">
        <h2>Create New Group</h2>
        <input
          className="input-field"
          type="text"
          placeholder="Group Name"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <div className="button-group">
          <button className="create-button" onClick={handleCreate}>
            Create
          </button>
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
