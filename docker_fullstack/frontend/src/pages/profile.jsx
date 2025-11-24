import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/profile.css";

import {
  getMyProfile,
  changeEmail,
  changeUsername,
  changePassword,
  deleteAccount,
} from "../api/profile";

export default function Profile() {
  const [showConfirm, setShowConfirm] = useState(false);

  const [profile, setProfile] = useState(null);

  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [showUsernamePopup, setShowUsernamePopup] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);

  const [usernameInput, setUsernameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordForUsername, setPasswordForUsername] = useState("");
  const [passwordForEmail, setPasswordForEmail] = useState("");
  const [oldPasswordInput, setOldPasswordInput] = useState("");
  const [newPasswordInput, setNewPasswordInput] = useState("");

  // yhteinen j/E popup
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getMyProfile();
        setProfile(data);
      } catch (err) {
        setMessage({ type: "error", text: "Failed to load profile." });
      }
    }
    loadProfile();
  }, []);

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
  };

  async function handleConfirmDelete() {
    setShowConfirm(false);

    try {
      const res = await deleteAccount();

      if (res.error) {
        setMessage({ type: "error", text: res.error });
        return;
      }

      localStorage.removeItem("token");

      setMessage({
        type: "success",
        text: "Account deleted successfully.",
      });

      setTimeout(() => {
        navigate("/");
      }, 10000);
    } catch (err) {
      setMessage({
        type: "error",
        text: "Failed to delete account.",
      });
    }
  }

  function openEmailPopup() {
    setEmailInput("");
    setPasswordForEmail("");
    setShowEmailPopup(true);
  }

  function openUsernamePopup() {
    setUsernameInput("");
    setPasswordForUsername("");
    setShowUsernamePopup(true);
  }

  function openPasswordPopup() {
    setOldPasswordInput("");
    setNewPasswordInput("");
    setShowPasswordPopup(true);
  }

  async function submitUsername() {
    if (!usernameInput.trim()) {
      setMessage({ type: "error", text: "Please enter a new username." });
      return;
    }
    if (!passwordForUsername) {
      setMessage({
        type: "error",
        text: "Please enter your current password.",
      });
      return;
    }

    try {
      const res = await changeUsername(
        usernameInput.trim(),
        passwordForUsername
      );

      if (res.error) {
        setMessage({ type: "error", text: res.error });
        return;
      }
      setProfile((prev) => (prev ? { ...prev, username: res.username } : res));

      setShowUsernamePopup(false);
      setMessage({
        type: "success",
        text: "Username updated successfully.",
      });
    } catch (err) {
      setMessage({ type: "error", text: "Failed to update username." });
    }
  }

  async function submitEmail() {
    if (!emailInput.trim()) {
      setMessage({ type: "error", text: "Please enter a new email." });
      return;
    }
    if (!passwordForEmail) {
      setMessage({
        type: "error",
        text: "Please enter your current password.",
      });
      return;
    }

    try {
      const res = await changeEmail(emailInput.trim(), passwordForEmail);

      if (res.error) {
        setMessage({ type: "error", text: res.error });
        return;
      }

      setProfile((prev) => (prev ? { ...prev, email: res.email } : res));

      setShowEmailPopup(false);
      setMessage({
        type: "success",
        text: "Email updated successfully.",
      });
    } catch (err) {
      setMessage({ type: "error", text: "Failed to update email." });
    }
  }

  async function submitPassword() {
    if (!oldPasswordInput || !newPasswordInput) {
      setMessage({
        type: "error",
        text: "Please fill in both password fields.",
      });
      return;
    }

    try {
      const res = await changePassword(oldPasswordInput, newPasswordInput);

      if (res.error) {
        setMessage({ type: "error", text: res.error });
        return;
      }

      setShowPasswordPopup(false);
      setMessage({
        type: "success",
        text: "Password updated successfully.",
      });
    } catch (err) {
      setMessage({ type: "error", text: "Failed to update password." });
    }
  }

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-avatar" />
        <h1 className="profile-title">Profile</h1>

        {/* username */}
        <div className="profile-field">
          <label className="profile-label">Username</label>
          <div className="profile-field-row">
            <input
              className="profile-input"
              type="text"
              value={profile?.username || ""}
              readOnly
            />
            <button
              className="profile-change-btn"
              type="button"
              onClick={openUsernamePopup}
            >
              Change
            </button>
          </div>
        </div>

        {/* email */}
        <div className="profile-field">
          <label className="profile-label">Email</label>
          <div className="profile-field-row">
            <input
              className="profile-input"
              type="email"
              value={profile?.email || ""}
              readOnly
            />
            <button
              className="profile-change-btn"
              type="button"
              onClick={openEmailPopup}
            >
              Change
            </button>
          </div>
        </div>

        {/* password */}
        <div className="profile-field">
          <label className="profile-label">Password</label>
          <div className="profile-field-row">
            <input
              className="profile-input"
              type="password"
              value="********"
              readOnly
            />
            <button
              className="profile-change-btn"
              type="button"
              onClick={openPasswordPopup}
            >
              Change
            </button>
          </div>
        </div>

        {/* delete */}
        <button
          className="profile-delete-btn"
          type="button"
          onClick={handleDeleteClick}
        >
          Delete account
        </button>
      </div>

      {/* delete varoitus popup */}
      {showConfirm && (
        <div className="profile-confirm-overlay">
          <div className="profile-confirm-dialog">
            <h2 className="profile-confirm-title">Delete account?</h2>
            <p className="profile-confirm-text">
              Are you sure you want to delete your account? After pressing 
              Delete account, you cannot restore it.
            </p>

            <div className="profile-confirm-actions">
              <button
                type="button"
                className="profile-cancel-btn"
                onClick={handleCancelDelete}
              >
                Cancel
              </button>

                <button
                  type="button"
                  className="profile-popup-delete-btn"
                  onClick={handleConfirmDelete}
                >
                  Delete account
                </button>
            </div>
          </div>
        </div>
      )}

      {/* username popup */}
      {showUsernamePopup && (
        <div className="profile-popup-container">
          <div className="profile-popup-card">
            <h2 className="profile-popup-title">Change Username</h2>
            <input
              className="profile-popup-input"
              placeholder="New username"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
            />
            <input
              className="profile-popup-input"
              type="password"
              placeholder="Current password"
              value={passwordForUsername}
              onChange={(e) => setPasswordForUsername(e.target.value)}
            />
            <div className="profile-popup-actions">
              <button
                type="button"
                className="profile-popup-cancel"
                onClick={() => setShowUsernamePopup(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="profile-popup-save"
                onClick={submitUsername}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* email popup */}
      {showEmailPopup && (
        <div className="profile-popup-container">
          <div className="profile-popup-card">
            <h2 className="profile-popup-title">Change Email</h2>
            <input
              className="profile-popup-input"
              type="email"
              placeholder="New email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
            />
            <input
              className="profile-popup-input"
              type="password"
              placeholder="Current password"
              value={passwordForEmail}
              onChange={(e) => setPasswordForEmail(e.target.value)}
            />
            <div className="profile-popup-actions">
              <button
                type="button"
                className="profile-popup-cancel"
                onClick={() => setShowEmailPopup(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="profile-popup-save"
                onClick={submitEmail}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* salasana popup */}
      {showPasswordPopup && (
        <div className="profile-popup-container">
          <div className="profile-popup-card">
            <h2 className="profile-popup-title">Change Password</h2>
            <input
              className="profile-popup-input"
              type="password"
              placeholder="Old password"
              value={oldPasswordInput}
              onChange={(e) => setOldPasswordInput(e.target.value)}
            />
            <input
              className="profile-popup-input"
              type="password"
              placeholder="New password"
              value={newPasswordInput}
              onChange={(e) => setNewPasswordInput(e.target.value)}
            />
            <div className="profile-popup-actions">
              <button
                type="button"
                className="profile-popup-cancel"
                onClick={() => setShowPasswordPopup(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="profile-popup-save"
                onClick={submitPassword}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* yleinen succes/error popup */}
      {message && (
        <div className="profile-popup-container">
          <div className="profile-popup-card">
            <h2 className="profile-popup-title">
              {message.type === "success" ? "Success" : "Error"}
            </h2>
            <p className="profile-confirm-text">{message.text}</p>
            <div
              className="profile-popup-actions"
              style={{ justifyContent: "center" }}
            >
              <button
                type="button"
                className="profile-popup-save"
                onClick={() => setMessage(null)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
