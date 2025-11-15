import pool from "../database.js";

export async function createAccount(email, password) {
  const password_hash = password; 
  const result = await pool.query(
    "INSERT INTO account (email, password_hash) VALUES ($1, $2) RETURNING account_id, email",
    [email, password_hash]
  );
  return result.rows[0];
}

export async function findUserByEmail(email) {
  const result = await pool.query(
    "SELECT account_id, email, password_hash FROM account WHERE email = $1",
    [email]
  );
  return result.rows[0];
}

export async function checkPassword(email, plainPassword) {
  const user = await findUserByEmail(email);
  if (!user) {
    return null;
  }
  if (plainPassword === user.password_hash){
    return user;
  }
  return null;
}
