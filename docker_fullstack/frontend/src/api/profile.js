const BASE_URL = "http://localhost:3001";

function headers() {
  return {
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("token"),
  };
}

export function getMyProfile() {
  return fetch(BASE_URL + "/profile", {
    headers: headers(),
  }).then((r) => r.json());
}

export function changeEmail(newEmail, password) {
  return fetch(BASE_URL + "/profile/email", {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify({ newEmail, password }),
  }).then((r) => r.json());
}

export function changeUsername(newUsername, password) {
  return fetch(BASE_URL + "/profile/username", {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify({ newUsername, password }),
  }).then((r) => r.json());
}

export function changePassword(oldPassword, newPassword) {
  return fetch(BASE_URL + "/profile/password", {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify({ oldPassword, newPassword }),
  }).then((r) => r.json());
}
