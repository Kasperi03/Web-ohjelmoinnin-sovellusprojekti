import "./styles/groupList.css";
import GroupListing from "../components/groupListing.jsx";

export default function GroupList() {
  return (
    <div className="groupList-container">
      <h1>Groups Page</h1>
      <p>This is where you can view groups.</p>

      <button className="create-btn">Create New Group</button>

      <GroupListing  name="test group" memberCount= "5"/>
    </div>
  );
}
