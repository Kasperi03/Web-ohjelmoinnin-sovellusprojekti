import dotenv from "dotenv";
import path from "path";
import request from "supertest";


const envPath = path.resolve(process.cwd(), "../.env");
dotenv.config({ path: envPath });

if (process.env.DATABASE_URL) {
  process.env.DATABASE_URL = process.env.DATABASE_URL.replace("@db", "@localhost");
}

const app = (await import("../src/index.js")).default;

// create random email that can be used for creating new account
function randomEmail() {
  return `testemail+${Math.floor(Math.random() * 100000)}@gmail.com`;
}





describe("User Registration Feature", () => {
  const strongPassword = "Password1"; 

  
  describe(" Tests to test invalid credentials", () => {
    
    it("should reject registration when fields are empty", async () => {
      const res = await request(app)
        .post("/login/signup")
        .send({
          username: "",
          email: "",
          password: ""
        });

      
      expect(res.status).toBe(400); 
    });

    it("should reject registration when email format is invalid", async () => {
      const res = await request(app)
        .post("/login/signup")
        .send({
          username: "testuser",
          email: "testemail", 
          password: strongPassword
        });

      
      expect(res.status).toBe(400);
    });

    it("should reject registration when password is too weak", async () => {
      const res = await request(app)
        .post("/login/signup")
        .send({
          username: "testuser",
          email: randomEmail(),
          password: "weak" 
        });

      
      expect(res.status).toBe(400);
    });
  });


  describe(" POSITIVE TESTS (Inputs that should succeed)", () => {

    it("should successfully register a user with valid credentials", async () => {
      const validEmail = randomEmail(); // save the newest randomEmail so can be used in login test
      

      const res = await request(app)
        .post("/login/signup")
        .send({
          username: "testuser",
          email: validEmail,
          password: strongPassword
        });

      
      if (res.status !== 201) console.error("Error:", res.text);
      
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("email", validEmail);
      
    });
  });

});