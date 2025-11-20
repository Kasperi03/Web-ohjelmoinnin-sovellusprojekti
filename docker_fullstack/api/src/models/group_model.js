import pool from "../database.js";

export const getAll = async () => {
  const result = await pool.query("SELECT * FROM groups");
  return result.rows;
};

export const getOne = async (id) => {
  const result = await pool.query(
    "SELECT * FROM groups WHERE group_id = $1",
    [id]
  );
  return result.rows[0];
};

export async function addOne(ownerId, name) {
  // create the group
  const result = await pool.query(
    `INSERT INTO groups (owner_id, name)
     VALUES ($1, $2)
     RETURNING *`,
    [ownerId, name]
  );

  const group = result.rows[0];
  const groupId = group.group_id;

  // insert the owner as an accepted member
  await pool.query(
    `INSERT INTO group_members (group_id, account_id, status)
     VALUES ($1, $2, 'accepted')`,
    [groupId, ownerId]
  );

  return group;
}


export const updateOne = async (id, name) => {
  const result = await pool.query(
    `UPDATE groups 
     SET name = $1 
     WHERE group_id = $2 
     RETURNING *`,
    [name, id]
  );
  return result.rows[0];
};

export const deleteOne = async (id) => {
  const result = await pool.query(
    "DELETE FROM groups WHERE group_id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};
