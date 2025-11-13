// group_member_model.js
import pool from "../database.js";

// User requests to join a group
export async function requestJoin(groupId, accountId) {
  const result = await pool.query(
    `INSERT INTO group_members (group_id, account_id, status)
     VALUES ($1, $2, 'pending')
     ON CONFLICT (group_id, account_id) DO UPDATE 
        SET status = 'pending'
     RETURNING *`,
    [groupId, accountId]
  );
  return result.rows[0];
}

// Owner accepts request
export async function acceptMember(id) {
  const result = await pool.query(
    `UPDATE group_members
     SET status = 'accepted'
     WHERE id = $1
     RETURNING *`,
    [id]
  );
  return result.rows[0];
}

// Owner rejects request
export async function rejectMember(id) {
  const result = await pool.query(
    `UPDATE group_members
     SET status = 'rejected'
     WHERE id = $1
     RETURNING *`,
    [id]
  );
  return result.rows[0];
}

// Remove member (owner force-removal)
export async function removeMember(id) {
  const result = await pool.query(
    `DELETE FROM group_members
     WHERE id = $1
     RETURNING *`,
    [id]
  );
  return result.rows[0];
}

// List accepted members
export async function getAcceptedMembers(groupId) {
  const result = await pool.query(
    `SELECT gm.*, a.username
     FROM group_members gm
     JOIN account a ON a.account_id = gm.account_id
     WHERE gm.group_id = $1 AND gm.status = 'accepted'`,
    [groupId]
  );
  return result.rows;
}

// List pending join requests
export async function getPendingMembers(groupId) {
  const result = await pool.query(
    `SELECT gm.*, a.username
     FROM group_members gm
     JOIN account a ON a.account_id = gm.account_id
     WHERE gm.group_id = $1 AND gm.status = 'pending'`,
    [groupId]
  );
  return result.rows;
}

// Look up one membership row
export async function getMemberById(id) {
  const result = await pool.query(
    `SELECT * FROM group_members WHERE id = $1`,
    [id]
  );
  return result.rows[0];
}
