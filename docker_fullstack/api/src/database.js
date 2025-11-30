import "dotenv/config";
import pkg from "pg";

const { Pool } = pkg;
const isTest = process.env.NODE_ENV === "test";

const pool = new Pool({
  host: isTest ? process.env.TEST_DB_HOST : process.env.DB_HOST,
  port: isTest ? process.env.TEST_DB_PORT : process.env.DB_PORT,
  user: isTest ? process.env.TEST_DB_USER : process.env.DB_USER,
  password: isTest ? process.env.TEST_DB_PASSWORD : process.env.DB_PASSWORD,
  database: isTest ? process.env.TEST_DB_NAME : process.env.DB_NAME,
});

export default pool;
