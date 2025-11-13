// group_member_router.js
import { Router } from "express";

import {joinGroup,approveMemberRequest,rejectMemberRequest,removeGroupMember,getGroupMembers,getPendingRequests} from "../controllers/group_member_controller.js";

const GroupMemberRouter = Router();

// User requests to join a group
GroupMemberRouter.post("/:groupId/join", joinGroup);

// Get accepted members of the group
GroupMemberRouter.get("/:groupId/members", getGroupMembers);

// Get pending join requests (owner only)
GroupMemberRouter.get("/:groupId/pending", getPendingRequests);

// Owner approves a join request
GroupMemberRouter.put("/approve/:id", approveMemberRequest);

// Owner rejects a join request
GroupMemberRouter.put("/reject/:id", rejectMemberRequest);

// Owner removes an accepted member
GroupMemberRouter.delete("/remove/:id", removeGroupMember);

export default GroupMemberRouter;
