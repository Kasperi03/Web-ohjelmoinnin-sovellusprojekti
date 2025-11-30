import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import request from "supertest";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1️⃣ Load test environment variables first
dotenv.config({
  path: path.resolve(__dirname, "../../.env.test")
});

// 2️⃣ Dynamic import AFTER dotenv
const app = (await import("../src/index.js")).default;
const pool = (await import("../src/database.js")).default;

// Helper to create unique email
function randomEmail() {
  return `test+${Math.floor(Math.random() * 999999)}@gmail.com`;
}

function randomUsername() {
  return `user_${Math.floor(Math.random() * 999999)}`;
}

describe("User Registration Feature", () => {
  const strongPassword = "Password1";

  describe("Invalid credentials", () => {

    test("Reject empty fields", async () => {
      const res = await request(app)
        .post("/login/signup")
        .send({ username: "", email: "", password: "" });

      expect(res.status).toBe(400);
    });

    test("Reject invalid email format", async () => {
      const res = await request(app)
        .post("/login/signup")
        .send({ username: randomUsername(), email: "bademail", password: strongPassword });

      expect(res.status).toBe(400);
    });

    test("Reject weak password", async () => {
      const res = await request(app)
        .post("/login/signup")
        .send({ username: randomUsername(), email: randomEmail(), password: "weak" });

      expect(res.status).toBe(400);
    });
  });

  describe("Valid registration", () => {
    test("Successfully registers user", async () => {
      const validEmail = randomEmail();

      const res = await request(app)
        .post("/login/signup")
        .send({
          username: "newuser",
          email: validEmail,
          password: strongPassword
        });

      if (res.status !== 201) console.error("Signup Error:", res.text);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("email", validEmail);
    });
  });
});
