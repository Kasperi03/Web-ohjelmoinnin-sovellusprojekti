// group_member_controller.js
import {
  requestJoin,
  acceptMember,
  rejectMember,
  removeMember,
  getAcceptedMembers,
  getPendingMembers,
  getMemberById
} from "../models/group_member_model.js";

import { getOne as getGroupById } from "../models/group_model.js";

// User requests to join a group
export async function joinGroup(req, res, next) {
  try {
    const groupId = req.params.groupId;
    const accountId = req.user.account_id;

    const group = await getGroupById(groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });

    if (group.owner_id === accountId)
      return res.status(400).json({ error: "Owner is already a member" });

    const response = await requestJoin(groupId, accountId);
    res.json(response);

  } catch (err) {
    next(err);
  }
}

// Owner approves join request
export async function approveMemberRequest(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.account_id;

    const member = await getMemberById(id);
    if (!member) return res.status(404).json({ error: "Member not found" });

    const group = await getGroupById(member.group_id);
    if (group.owner_id !== userId)
      return res.status(403).json({ error: "Not authorized" });

    const updated = await acceptMember(id);
    res.json(updated);

  } catch (err) {
    next(err);
  }
}

// Owner rejects join request
export async function rejectMemberRequest(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.account_id;

    const member = await getMemberById(id);
    if (!member) return res.status(404).json({ error: "Member not found" });

    const group = await getGroupById(member.group_id);
    if (group.owner_id !== userId)
      return res.status(403).json({ error: "Not authorized" });

    const updated = await rejectMember(id);
    res.json(updated);

  } catch (err) {
    next(err);
  }
}

// Owner removes an accepted member
export async function removeGroupMember(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.account_id;

    const member = await getMemberById(id);
    if (!member) return res.status(404).json({ error: "Member not found" });

    const group = await getGroupById(member.group_id);

    if (group.owner_id !== userId)
      return res.status(403).json({ error: "Not authorized" });

    if (member.account_id === userId)
      return res.status(400).json({ error: "Owner cannot remove themselves" });

    const removed = await removeMember(id);
    res.json({ message: "Member removed", removed });

  } catch (err) {
    next(err);
  }
}

// Get accepted members
export async function getGroupMembers(req, res, next) {
  try {
    const groupId = req.params.groupId;
    const members = await getAcceptedMembers(groupId);
    res.json(members);
  } catch (err) {
    next(err);
  }
}

// Get pending requests (owner only)
export async function getPendingRequests(req, res, next) {
  try {
    const groupId = req.params.groupId;
    const userId = req.user.account_id;

    const group = await getGroupById(groupId);
    if (!group) return res.status(404).json({ error: "Group not found" });

    if (group.owner_id !== userId)
      return res.status(403).json({ error: "Not authorized" });

    const pending = await getPendingMembers(groupId);
    res.json(pending);

  } catch (err) {
    next(err);
  }
}
