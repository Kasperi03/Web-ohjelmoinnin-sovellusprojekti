// group_member_router.js
import { Router } from "express";
import { auth } from "../helper/auth.js";
import {joinGroup,approveMemberRequest,rejectMemberRequest,removeGroupMember,getGroupMembers,getPendingRequests} from "../controllers/group_member_controller.js";

const GroupMemberRouter = Router();

// User requests to join a group
GroupMemberRouter.post("/:groupId/join",auth, joinGroup);

// Get accepted members of the group
GroupMemberRouter.get("/:groupId/members",auth, getGroupMembers);

// Get pending join requests (owner only)
GroupMemberRouter.get("/:groupId/pending",auth, getPendingRequests);

// Owner approves a join request
GroupMemberRouter.put("/:groupId/approve/:id",auth, approveMemberRequest);

// Owner rejects a join request
GroupMemberRouter.put("/:groupId/reject/:id",auth, rejectMemberRequest);

// Owner removes an accepted member
GroupMemberRouter.delete("/:groupId/remove/:id",auth, removeGroupMember);

export default GroupMemberRouter;
