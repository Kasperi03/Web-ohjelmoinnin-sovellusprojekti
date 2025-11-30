import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import request from "supertest";
import bcrypt from "bcrypt";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1) Load .env.test first
dotenv.config({
  path: path.resolve(__dirname, "../../.env.test"),
});

// 2) Then dynamically import app and pool
const app = (await import("../src/index.js")).default;
const pool = (await import("../src/database.js")).default;

// Optional debug
console.log("TEST DB:", process.env.TEST_DB_HOST, process.env.TEST_DB_PORT);

// -------------------------------------------------------

console.log("TEST DB:", process.env.TEST_DB_HOST, process.env.TEST_DB_PORT);

const testUser = {
  email: "logout_test@example.com",
  password: "LogoutPass123!"
};

let token;

beforeAll(async () => {
  await pool.query(`DELETE FROM account WHERE email = $1`, [testUser.email]);

  const hashed = await bcrypt.hash(testUser.password, 10);

  await pool.query(
    `INSERT INTO account (username, email, password_hash)
     VALUES ($1,$2,$3)`,
    ["logoutUser", testUser.email, hashed]
  );

  const loginRes = await request(app)
    .post("/login/signin")
    .send(testUser);

  token = loginRes.body.token;
});

afterAll(async () => {
  await pool.query(`DELETE FROM account WHERE email = $1`, [testUser.email]);
  await pool.end();
});

describe("LOGOUT behavior tests (frontend-style)", () => {
  test("✔ Protected route works WITH token", async () => {
    const res = await request(app)
      .get("/profile")
      .set("Authorization", `Bearer ${token}`);

    expect([200, 201]).toContain(res.status);
  });

  test("❌ Protected route fails WITHOUT token", async () => {
    const res = await request(app).get("/profile");

    expect(res.status).toBe(401);
  });

  test("❌ Protected route fails WITH invalid token", async () => {
    const res = await request(app)
      .get("/profile")
      .set("Authorization", "Bearer faketoken");

    expect(res.status).toBe(401);
  });
});
