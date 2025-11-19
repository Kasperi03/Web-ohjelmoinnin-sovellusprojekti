import {createAccount, createToken, findUserByEmail, checkPassword, deleteAccount } from "../models/login_model.js";

export async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await checkPassword(email, password);

    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = createToken(user);

    return res.status(200).json({
      message: 'Login successful',
      id: user.account_id,
      email: user.email,
      token
    });

  } catch (err) {
    next(err);
  }
}

export async function createUser(req, res, next) {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    const user = await createAccount(username, email, password);
    return res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}


export async function deleteUser(req, res, next) {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }
    const userId = req.user.id;
    const userEmail = req.user.email;

    const user = await findUserByEmail(userEmail);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (password !== user.password_hash) {
      return res.status(401).json({ error: "Invalid password" });
    }
    const success = await deleteAccount(userId);

    if (!success) {
      return res.status(500).json({ error: "Account deletion failed" });
    }

    return res.json({ message: "Account deleted successfully" });

  } catch (err) {
    next(err);
  }
}