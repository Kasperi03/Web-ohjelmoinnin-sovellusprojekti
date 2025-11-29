import {
  getUserById,
  updateEmail as updateEmailDB,
  updateUsername as updateUsernameDB,
  changePassword as changePasswordDB,
  checkPassword,
} from "../models/login_model.js";

function isValidEmail(email) {
  return typeof email === "string" && email.includes("@");
}

function isStrongPassword(password) {
  return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
}

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

    if (!newEmail || !password) {
      return res
        .status(400)
        .json({ error: "New email and password are required" });
    }

    if (!isValidEmail(newEmail)) {
      return res
        .status(400)
        .json({ error: "Email must contain '@'." });
    }

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

    const currentUser = await getUserById(req.user.account_id);
    if (!currentUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const valid = await checkPassword(currentUser.email, password);
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

    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Old password and new password are required" });
    }

    if (!isStrongPassword(newPassword)) {
      return res.status(400).json({
        error:
          "Password must be at least 8 characters long and include one uppercase letter and one number.",
      });
    }

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

export async function getUserPublicById(req, res, next) {
  try {
    const userId = req.params.userId;
    const user = await getUserById(userId);
    res.json(user);
  } catch (err) {
    next(err);
  }
}