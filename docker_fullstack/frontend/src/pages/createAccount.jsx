import { useState } from "react";
import { createAccount } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";
import "./styles/createAccount.css";

function isValidEmail(email) {
  return typeof email === "string" && email.includes("@");
}

function isStrongPassword(password) {
  return /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
}

export default function CreateAccount() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!username.trim() || !email.trim() || !password.trim()) {
      alert("Please fill in all fields.");
      return;
    }

    if (!isValidEmail(email)) {
      alert("Email must contain '@'.");
      return;
    }

    if (!isStrongPassword(password)) {
      alert(
        "Password must be at least 8 characters long and include one uppercase letter and one number."
      );
      return;
    }

    try {
      await createAccount({ username, email, password });
      alert("Account created!");
      navigate("/signIn");
    } catch (err) {
      alert("Error creating account: " + err.message);
    }
  }

  return (
    <div className="createAccount-container">
      <div className="createAccount-card">
        <h1 className="createAccount-title">Create account</h1>

        <form className="createAccount-form" onSubmit={handleSubmit}>
          <label className="createAccount-label">
            Username
            <input
              className="createAccount-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
            />
          </label>

          <label className="createAccount-label">
            Email
            <input
              className="createAccount-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </label>

          <label className="createAccount-label">
            Password
            <input
              className="createAccount-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
            />
          </label>

          <button type="submit" className="createAccount-button">
            Create account
          </button>
        </form>
      </div>
    </div>
  );
}
