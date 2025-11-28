import { expect } from "chai";

describe("Testing login functionality", () => {
  it("should login to the backend", async () => {
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "vpekkala04@gmail.com",
        password: "admin",
      }),
    });
  });
});
