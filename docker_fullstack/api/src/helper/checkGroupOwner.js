import { isOwner } from "../models/group_member_model.js";

export async function checkGroupOwner(req, res, next) {

  try {
    const groupId = req.params.groupId || req.params.id;
    const userId = req.user.account_id;

    const owner = await isOwner(groupId, userId);

    if (!owner) {
      return res.status(403).json({ error: "Only the owner can perform this action" });
    }

    next();
  } catch (err) {
    next(err);
  }
}
