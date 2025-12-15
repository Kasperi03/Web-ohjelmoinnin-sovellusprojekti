import { Router } from "express";
import { auth } from "../helper/auth.js";
import {joinGroup,approveMemberRequest,rejectMemberRequest,removeGroupMember,getGroupMembers,getPendingRequests,leaveGroup,getGroupMemberCount,checkIfMember} from "../controllers/group_member_controller.js";
import { checkGroupMember } from "../helper/checkGroupMember.js";
import { checkGroupOwner } from "../helper/checkGroupOwner.js";

const GroupMemberRouter = Router();

GroupMemberRouter.get("/:groupId/member-count", getGroupMemberCount);
GroupMemberRouter.post("/:groupId/join",auth, joinGroup);
GroupMemberRouter.get("/:groupId/is-member", auth, checkIfMember);

GroupMemberRouter.get("/:groupId/members",auth,checkGroupMember, getGroupMembers);

GroupMemberRouter.get("/:groupId/pending",auth,checkGroupOwner, getPendingRequests);

GroupMemberRouter.put("/:groupId/approve/:id",auth,checkGroupOwner, approveMemberRequest);

GroupMemberRouter.put("/:groupId/reject/:id",auth,checkGroupOwner, rejectMemberRequest);

GroupMemberRouter.delete("/:groupId/remove/:id",auth,checkGroupOwner, removeGroupMember)

GroupMemberRouter.delete("/:groupId/leave", auth, leaveGroup);


export default GroupMemberRouter;
