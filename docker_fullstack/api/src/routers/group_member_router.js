// group_member_router.js
import { Router } from "express";
import { auth } from "../helper/auth.js";
import {joinGroup,approveMemberRequest,rejectMemberRequest,removeGroupMember,getGroupMembers,getPendingRequests,leaveGroup,getGroupMemberCount,checkIfMember} from "../controllers/group_member_controller.js";
import { checkGroupMember } from "../helper/checkGroupMember.js";
import { checkGroupOwner } from "../helper/checkGroupOwner.js";

const GroupMemberRouter = Router();

// User requests to join a group
GroupMemberRouter.get("/:groupId/member-count", getGroupMemberCount);
GroupMemberRouter.post("/:groupId/join",auth, joinGroup);
GroupMemberRouter.get("/:groupId/is-member", auth, checkIfMember);

// Member list
GroupMemberRouter.get("/:groupId/members",auth,checkGroupMember, getGroupMembers);

// Get pending join requests (owner only)
GroupMemberRouter.get("/:groupId/pending",auth,checkGroupOwner, getPendingRequests);

// Owner approves a join request
GroupMemberRouter.put("/:groupId/approve/:id",auth,checkGroupOwner, approveMemberRequest);

// Owner rejects a join request
GroupMemberRouter.put("/:groupId/reject/:id",auth,checkGroupOwner, rejectMemberRequest);

// Owner removes an accepted member
GroupMemberRouter.delete("/:groupId/remove/:id",auth,checkGroupOwner, removeGroupMember)

// User leaves group
GroupMemberRouter.delete("/:groupId/leave", auth, leaveGroup);


export default GroupMemberRouter;
