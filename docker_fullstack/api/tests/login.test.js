import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import request from "supertest";
import bcrypt from "bcrypt";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load test env first
dotenv.config({
  path: path.resolve(__dirname, "../../.env.test")
});

// Import after env loaded
const app = (await import("../src/index.js")).default;
const pool = (await import("../src/database.js")).default;

// ----------------------------------------------

const testUser = {
  email: "login_test@example.com",
  password: "TestPass123!"
};

beforeAll(async () => {
  await pool.query(`DELETE FROM account WHERE email = $1`, [testUser.email]);

  const hashed = await bcrypt.hash(testUser.password, 10);

  await pool.query(
    `INSERT INTO account (username, email, password_hash)
     VALUES ($1,$2,$3)`,
    ["LoginTestUser", testUser.email, hashed]
  );
});

afterAll(async () => {
  await pool.query(`DELETE FROM account WHERE email = $1`, [testUser.email]);
  await pool.end();
});

describe("LOGIN API Tests", () => {

  test("✔ Login succeeds with correct credentials", async () => {
    const res = await request(app).post("/login/signin").send(testUser);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("❌ Login fails with wrong password", async () => {
    const res = await request(app)
      .post("/login/signin")
      .send({ email: testUser.email, password: "wrongpass" });

    expect(res.status).toBe(400);
  });

  test("❌ Login fails when user does not exist", async () => {
    const res = await request(app)
      .post("/login/signin")
      .send({ email: "noone@none.com", password: "test" });

    expect(res.status).toBe(400);
  });
});
