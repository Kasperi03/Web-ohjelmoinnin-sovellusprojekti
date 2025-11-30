import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import request from "supertest";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../../.env.test"),
});

const app = (await import("../src/index.js")).default;
const pool = (await import("../src/database.js")).default;


function uniqueEmail() {
  return `signup_${Date.now()}_${Math.floor(Math.random() * 9999)}@test.com`;
}

let testEmail = uniqueEmail();

const testUser = {
  username: "SignupUser",
  email: testEmail,
  password: "SignupPass123!"
};

beforeAll(async () => {
  await pool.query(`DELETE FROM account WHERE email = $1`, [testUser.email]);
});

afterAll(async () => {
  await pool.query(`DELETE FROM account WHERE email = $1`, [testUser.email]);
  await pool.end();
});



describe("SIGNUP API Tests", () => {

  test("Signup succeeds with valid data", async () => {
    const res = await request(app)
      .post("/login/signup")
      .send(testUser);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("account_id");
    expect(res.body.username).toBe(testUser.username);
  });

  test("Signup fails with missing fields", async () => {
    const res = await request(app)
      .post("/login/signup")
      .send({
        username: "",
        email: "",
        password: ""
      });

    expect(res.status).toBe(400);
  });

  test("Signup fails with invalid email", async () => {
    const res = await request(app)
      .post("/login/signup")
      .send({
        username: "abc",
        email: "notanemail",
        password: "SignupPass123!"
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/email/i);
  });

  test("Signup fails with weak password", async () => {
    const res = await request(app)
      .post("/login/signup")
      .send({
        username: "abc",
        email: uniqueEmail(),
        password: "weak"
      });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/password/i);
  });

  test("Signup fails if email already exists", async () => {
    const res = await request(app)
      .post("/login/signup")
      .send(testUser);

    expect([400, 409, 500]).toContain(res.status);
  });
});
