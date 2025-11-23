import {
  getUserById,
  updateEmail as updateEmailDB,
  updateUsername as updateUsernameDB,
  changePassword as changePasswordDB,
  checkPassword,
} from "../models/login_model.js";

export async function getMyProfile(req, res, next) {
  try {
    const user = await getUserById(req.user.account_id);
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function updateEmail(req, res, next) {
  try {
    const { newEmail, password } = req.body;

    const valid = await checkPassword(req.user.email, password);
    if (!valid) return res.status(401).json({ error: "Invalid password" });

    const updated = await updateEmailDB(req.user.account_id, newEmail);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function updateUsername(req, res, next) {
  try {
    const { newUsername, password } = req.body;

    const valid = await checkPassword(req.user.email, password);
    if (!valid) return res.status(401).json({ error: "Invalid password" });

    const updated = await updateUsernameDB(req.user.account_id, newUsername);
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function updatePassword(req, res, next) {
  try {
    const { oldPassword, newPassword } = req.body;

    const updated = await changePasswordDB(
      req.user.account_id,
      oldPassword,
      newPassword
    );
    if (!updated)
      return res.status(401).json({ error: "Old password incorrect" });

    res.json({ message: "Password updated" });
  } catch (err) {
    next(err);
  }
}
