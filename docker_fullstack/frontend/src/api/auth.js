import api from "./client";

export function createAccount(data) {
  return api.post("/login/signup", data);
}

export function signIn(data) {
  return api.post("/login/signin", data);
}
