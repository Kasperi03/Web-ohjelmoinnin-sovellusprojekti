// group_member_controller.js
import {
  requestJoin,
  acceptMember,
  rejectMember,
  removeMember,
  getAcceptedMembers,
  getPendingMembers,
  getMemberById,
  isMember,
  isOwner,
  getMemberRow,
  getMemberCount
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
    const userId = req.user.account_id;

    const owner = await isOwner(groupId, userId);
    const member = await isMember(groupId, userId);

    if (!owner && !member) {
      return res.status(403).json({ error: "You are not a member of this group" });
    }

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
// Leave a group (member removing THEMSELF)
export async function leaveGroup(req, res, next) {
    console.log("🔥 HIT leaveGroup ROUTE");
  console.log("PARAMS:", req.params);
  console.log("USER:", req.user);
  try {
    const groupId = req.params.groupId;
    const userId = req.user.account_id;
      console.log("GROUP ID:", groupId);
    console.log("USER ID:", userId);

    // Can't leave if you're not a member
    const membership = await getMemberRow(groupId, userId);
    console.log("MEMBERSHIP ROW:", membership);
    if (!membership) {
      return res.status(404).json({ error: "You are not a member of this group" });
    }

    // Owner cannot leave their own group
    const group = await getGroupById(groupId);
    console.log("GROUP ROW:", group);
    if (group.owner_id === userId) {
      return res.status(400).json({ error: "Owner cannot leave their own group" });
    }

    // Remove membership
    await removeMember(membership.id);

    res.json({ message: "You left the group" });
  } catch (err) {
    next(err);
  }
}


export async function getGroupMemberCount(req, res) {
  try {
    const groupId = req.params.groupId;

    const count = await getMemberCount(groupId);

    return res.status(200).json({ count });
  } catch (error) {
    console.error("Error getting member count:", error);
    return res.status(500).json({ error: "Failed to get member count" });
  }
}



export async function checkIfMember(req, res) {
  try {
    const groupId = req.params.groupId;
    const userId = req.user.account_id;

    // This gives you: id, group_id, account_id, status
    const membership = await getMemberRow(groupId, userId);

    if (!membership) {
      return res.json({
        status: null,
        isMember: false
      });
    }

    return res.json({
      status: membership.status,                 // "accepted", "pending", "rejected"
      isMember: membership.status === "accepted"
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to check membership" });
  }
}
