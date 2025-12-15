import pool from "../database.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const { sign } = jwt;

export async function createAccount(username, email, password) {
  const password_hash = await bcrypt.hash(password, 10);

  const result = await pool.query(
    "INSERT INTO account (username, email, password_hash) VALUES ($1, $2, $3) RETURNING account_id, username, email",
    [username, email, password_hash]
  );

  return result.rows[0];
}

export async function findUserByEmail(email) {
  const result = await pool.query(
    "SELECT account_id, username, email, password_hash FROM account WHERE email = $1",
    [email]
  );

  return result.rows[0] || null;
}

export async function checkPassword(email, plainPassword) {
  const user = await findUserByEmail(email);
  if (!user) {
    return null;
  }
  if (await bcrypt.compare(plainPassword, user.password_hash)) {
    return user;
  }
  return null;
}

export function createToken(user) {
  return sign(
    { account_id: user.account_id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

export async function deleteAccount(accountId) {
  await pool.query("BEGIN");

  try {
    const ownerGroups = await pool.query(
      `SELECT group_id
       FROM groups
       WHERE owner_id = $1`,
      [accountId]
    );

    for (const row of ownerGroups.rows) {
      const groupId = row.group_id;

      const members = await pool.query(
        `SELECT account_id
         FROM group_members
         WHERE group_id = $1
           AND status = 'accepted'
         ORDER BY id ASC`,
        [groupId]
      );

      if (members.rows.length <= 1) {
        await pool.query(
          `DELETE FROM groups WHERE group_id = $1`,
          [groupId]
        );
        continue;
      }

      const newOwner = members.rows.find(
        m => m.account_id !== accountId
      );

      if (newOwner) {
        await pool.query(
          `UPDATE groups
           SET owner_id = $1
           WHERE group_id = $2`,
          [newOwner.account_id, groupId]
        );
      } else {
        await pool.query(
          `DELETE FROM groups WHERE group_id = $1`,
          [groupId]
        );
      }
    }

    const result = await pool.query(
      `DELETE FROM account
       WHERE account_id = $1
       RETURNING account_id`,
      [accountId]
    );

    await pool.query("COMMIT");

    return result.rowCount > 0;
  } catch (err) {
    await pool.query("ROLLBACK");
    throw err;
  }
}


export async function getUserById(id) {
  const result = await pool.query(
    "SELECT account_id, username, email FROM account WHERE account_id = $1",
    [id]
  );
  return result.rows[0] || null;
}

export async function updateUsername(accountId, newUsername) {
  const result = await pool.query(
    "UPDATE account SET username = $1 WHERE account_id = $2 RETURNING account_id, username, email",
    [newUsername, accountId]
  );
  return result.rows[0] || null;
}

export async function updateEmail(accountId, newEmail) {
  const result = await pool.query(
    "UPDATE account SET email = $1 WHERE account_id = $2 RETURNING account_id, username, email",
    [newEmail, accountId]
  );
  return result.rows[0] || null;
}

export async function changePassword(accountId, currentPassword, newPassword) {
  const result = await pool.query(
    "SELECT password_hash FROM account WHERE account_id = $1",
    [accountId]
  );
  const user = result.rows[0];
  if (!user) return null;

  const ok = await bcrypt.compare(currentPassword, user.password_hash);
  if (!ok) return false;

  const newHash = await bcrypt.hash(newPassword, 10);
  await pool.query(
    "UPDATE account SET password_hash = $1 WHERE account_id = $2",
    [newHash, accountId]
  );
  return true;
}
