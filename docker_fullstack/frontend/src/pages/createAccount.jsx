import { useState } from "react";
import { Link } from "react-router-dom";
import "./styles/createAccount.css";

export default function CreateAccount() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
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

        <div className="createAccount-footer">
          <span>Already have an account?</span>
          <Link to="/signIn" className="createAccount-link">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
