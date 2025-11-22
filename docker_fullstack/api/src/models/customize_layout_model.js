/*import pool from "../database.js";

export async function getLayoutByGroup(groupId) {
    const result = await pool.query(
        `SELECT layout FROM customize_layouts WHERE group_id = $1`, [groupId]
    );
    return result.rows[0] ? result.rows[0].layout : null;
}

export async function saveLayoutForGroup(groupId, layoutArray) {
    const result = await pool.query(
        `INSERT INTO customize_layouts (group_id, layout) VALUES ($1, $2) ON CONFLICT (group_id) DO UPDATE SET layout = EXCLUDED.layout RETURNING layout`, [groupId, layoutArray]
    );
    return result.rows[0];
}*/