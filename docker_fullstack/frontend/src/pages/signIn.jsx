import { useState } from "react";
import { signIn } from "../api/auth";
import { Link } from "react-router-dom";
import "./styles/signIn.css";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

try {
      const result = await signIn({ email, password });

      localStorage.setItem("token", result.token);
      alert("Logged in!");
      navigate("/profile");
    } catch (err) {
      alert("Login failed: " + err.message);
    }
  }

  return (
    <div className="signIn-container">
      <div className="signIn-card">
        <h1 className="signIn-title">Sign in</h1>

        <form className="signIn-form" onSubmit={handleSubmit}>
          <label className="signIn-label">
            Email
            <input
              className="signIn-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </label>

          <label className="signIn-label">
            Password
            <input
              className="signIn-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </label>

          <button type="submit" className="signIn-button">
            Login
          </button>
        </form>

        <div className="signIn-footer">
          <span>Don&apos;t have an account?</span>
          <Link to="/createAccount" className="signIn-link">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
