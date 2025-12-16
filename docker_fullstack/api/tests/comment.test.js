import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import request from "supertest";
import bcrypt from "bcrypt";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: path.resolve(__dirname, "../../.env.test")
});

const app = (await import("../src/index.js")).default;
const pool = (await import("../src/database.js")).default;

const testUser = {
  email: "review_browse_test@example.com",
  password: "BrowsePass123!"
};

const TEST_MOVIE_API_ID = 550;
let token;
let realMovieId;

beforeAll(async () => {
  await pool.query(`TRUNCATE reviews, movies, account CASCADE`);

  const hashed = await bcrypt.hash(testUser.password, 10);
  await pool.query(
    `INSERT INTO account (username, email, password_hash)
     VALUES ($1,$2,$3)`,
    ["BrowseTestUser", testUser.email, hashed]
  );

  const loginRes = await request(app)
    .post("/login/signin")
    .send(testUser);
  token = loginRes.body.token;

  const movieRes = await pool.query(
    `INSERT INTO movies (api_id) VALUES ($1) RETURNING movie_id`,
    [TEST_MOVIE_API_ID]
  );
  realMovieId = movieRes.rows[0].movie_id;

  await pool.query(
    `INSERT INTO reviews (account_id, movie_id, rating, review_text)
     VALUES (
       (SELECT account_id FROM account WHERE email = $1),
       $2,
       4,
       'Hyvä elokuva, toimii yhä.'
     )`,
    [testUser.email, realMovieId]
  );
});

afterAll(async () => {
  await pool.query(`TRUNCATE reviews, movies, account CASCADE`);
  await pool.end();
});

describe("REVIEW TESTS", () => {

  test("✔ User can browse reviews for a specific movie", async () => {
    const res = await request(app)
      .get(`/api/movie-reviews/${TEST_MOVIE_API_ID}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);

    const review = res.body.find(
      r => r.review_text === "Hyvä elokuva, toimii yhä."
    );

    expect(review).toBeDefined();
    expect(review.movie_id).toBe(realMovieId);
    expect(review.rating).toBe(4);
  });

  test("✔ User can delete their own review", async () => {
    const deleteRes = await request(app)
      .delete(`/api/movie-reviews/${TEST_MOVIE_API_ID}`)
      .set("Authorization", `Bearer ${token}`);

    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.message).toBe("Review deleted");

    const res = await request(app)
      .get(`/api/movie-reviews/${TEST_MOVIE_API_ID}`);

    const review = res.body.find(
      r => r.review_text === "Hyvä elokuva, toimii yhä."
    );

    expect(review).toBeUndefined();
  });

  test("❌ Browsing reviews for a non-existent movie returns empty array", async () => {
    const NON_EXISTENT_MOVIE_ID = 999999;

    const res = await request(app)
      .get(`/api/movie-reviews/${NON_EXISTENT_MOVIE_ID}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

});
