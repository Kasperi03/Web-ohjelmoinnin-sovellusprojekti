import { isMember, isOwner } from "../models/group_member_model.js";

export async function checkGroupMember(req, res, next) {
  try {
    const groupId = req.params.groupId || req.params.id;

    if (!groupId) {
      return res.status(400).json({ error: "Group ID missing" });
    }

    const userId = req.user.account_id;

    const owner = await isOwner(groupId, userId);
    const member = await isMember(groupId, userId);

    if (!owner && !member) {
      return res.status(403).json({ error: "You are not a member of this group" });
    }

    next();
  } catch (err) {
    next(err);
  }
}
