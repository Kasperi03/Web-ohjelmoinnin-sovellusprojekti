import pool from "../database.js";

export async function getLayoutByGroup(groupId) {
    const result = await pool.query(
        `SELECT layout FROM groups WHERE group_id = $1`,
        [groupId]
    );
    return result.rows[0] ? result.rows[0].layout : null;
}

export async function saveLayoutForGroup(groupId, layoutArray) {
    const result = await pool.query(
        `UPDATE groups SET layout = $1 WHERE group_id = $2 RETURNING layout`,
        [JSON.stringify(layoutArray), groupId]
    );
    return result.rows[0]; 
}